import { NextResponse } from 'next/server';
import { aiClient, isAiEnabled, MODEL_NAME } from '../../../lib/ai/client';
import { CODE_TRACER_PROMPT } from '../../../lib/ai/prompts';
import { validateSteps } from '../../../lib/ai/validate-steps';

// Fallback mock data if API key is missing
import linkedListReversalMock from '../../../data/patterns/linked-list-reversal.json';

export async function POST(req: Request) {
  try {
    const { code, input, language } = await req.json();

    if (!code || !input) {
      return NextResponse.json({ error: 'Code and input are required' }, { status: 400 });
    }

    if (!isAiEnabled()) {
      console.warn('NVIDIA_API_KEY is not set. Returning mock data.');
      // Simulate API delay
      await new Promise(res => setTimeout(res, 2000));
      return NextResponse.json({ steps: linkedListReversalMock.steps });
    }

    const completion = await aiClient.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: CODE_TRACER_PROMPT },
        { role: 'user', content: `Language: ${language}\nInput: ${input}\n\nCode:\n${code}` }
      ],
      temperature: 0.1, // Low temp for deterministic structured output
      max_tokens: 16384,
      ...({ extra_body: { chat_template_kwargs: { thinking: false } } } as any),
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    
    // Parse the JSON securely by extracting only the array portion
    let parsedJson;
    try {
      let cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // If the model added conversational text, extract just the array
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

    // TODO: In Week 2, insert tracing usage into Neon DB here via Drizzle

    return NextResponse.json({ steps: sanitizedSteps });

  } catch (error: any) {
    console.error('Trace API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while communicating with the AI engine.' }, 
      { status: 500 }
    );
  }
}
