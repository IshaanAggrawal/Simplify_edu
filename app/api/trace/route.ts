import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { aiClient, isAiEnabled, MODEL_NAME } from '../../../lib/ai/client';
import { CODE_TRACER_PROMPT } from '../../../lib/ai/prompts';
import { validateSteps } from '../../../lib/ai/validate-steps';
import { syncUser, checkDailyLimit, incrementUsage, saveVisualization } from '../../../lib/db/actions';

import linkedListReversalMock from '../../../data/patterns/linked-list-reversal.json';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    // ── Authenticate ────────────────────────────────────────
    if (!clerkId) {
      return NextResponse.json({ error: 'You must be signed in to run traces.' }, { status: 401 });
    }

    const { code, input, language } = await req.json();

    if (!code || !input) {
      return NextResponse.json({ error: 'Code and input are required' }, { status: 400 });
    }

    // ── Sync user + check daily limit ────────────────────────
    const localUser = await syncUser();
    if (!localUser) {
      return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    const { allowed, used, limit } = await checkDailyLimit(localUser.id, localUser.plan);
    if (!allowed) {
      return NextResponse.json({
        error: `Daily limit reached. Your ${localUser.plan} plan allows ${limit} AI traces per day. You've used ${used}/${limit} today. Upgrade to get more!`,
        limitReached: true,
        used,
        limit,
        plan: localUser.plan,
      }, { status: 429 });
    }

    // ── Run AI trace ─────────────────────────────────────────
    if (!isAiEnabled()) {
      console.warn('NVIDIA_API_KEY is not set. Returning mock data.');
      await new Promise(res => setTimeout(res, 2000));
      await incrementUsage(localUser.id);
      return NextResponse.json({ 
        steps: linkedListReversalMock.steps,
        usage: { used: used + 1, limit, plan: localUser.plan }
      });
    }

    const completion = await aiClient.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: CODE_TRACER_PROMPT },
        { role: 'user', content: `Language: ${language}\nInput: ${input}\n\nCode:\n${code}` }
      ],
      temperature: 0.1,
      max_tokens: 16384,
      ...({ extra_body: { chat_template_kwargs: { thinking: false } } } as any),
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    
    let parsedJson;
    try {
      let cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const startIdx = cleanText.indexOf('[');
      const endIdx = cleanText.lastIndexOf(']');
      if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
        cleanText = cleanText.substring(startIdx, endIdx + 1);
      }
      parsedJson = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI output as JSON:', responseText);
      return NextResponse.json({ error: 'AI returned invalid format.' }, { status: 500 });
    }

    const { isValid, sanitizedSteps, error } = validateSteps(parsedJson);
    if (!isValid) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // ── Record usage + save visualization ───────────────────
    await incrementUsage(localUser.id);
    
    // Save in background (don't await — don't block response)
    saveVisualization(localUser.id, code, language, input, sanitizedSteps).catch(console.error);

    return NextResponse.json({ 
      steps: sanitizedSteps,
      usage: { used: used + 1, limit, plan: localUser.plan }
    });

  } catch (error: any) {
    console.error('Trace API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while communicating with the AI engine.' }, 
      { status: 500 }
    );
  }
}
