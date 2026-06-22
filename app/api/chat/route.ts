import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { aiClient, isAiEnabled, MODEL_NAME } from '../../../lib/ai/client';
import { syncUser, getChatContext, saveChatMessage, updateChatSummary } from '../../../lib/db/actions';

const SYSTEM_PROMPT = `You are AlgoViz AI, an expert software engineer and teacher.
You are helping a user understand their algorithm execution trace.
Keep your answers concise, educational, and focused on time/space complexity or code behavior.
If you need context outside the immediate messages, refer to the provided SUMMARY.`;

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'You must be signed in to chat.' }, { status: 401 });
    }

    const localUser = await syncUser();
    if (!localUser || localUser.plan === 'free') {
      return NextResponse.json({ error: 'AI Chat is a Pro feature.' }, { status: 403 });
    }

    const { message, sessionId, codeContext } = await req.json();
    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Message and sessionId are required.' }, { status: 400 });
    }

    // Save user's message
    await saveChatMessage(localUser.id, sessionId, 'user', message);

    // Fetch last 5 messages + summary
    const { recentMessages, summary } = await getChatContext(localUser.id, sessionId);

    if (!isAiEnabled()) {
      const mockReply = "This is a mock AI reply. Please configure NVIDIA_API_KEY to enable real AI.";
      await saveChatMessage(localUser.id, sessionId, 'assistant', mockReply);
      return NextResponse.json({ reply: mockReply });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (summary) {
      messages.push({ role: 'system', content: `PREVIOUS CHAT SUMMARY: ${summary}` });
    }

    if (codeContext) {
      messages.push({ role: 'system', content: `CURRENT CODE CONTEXT:\n${codeContext}` });
    }

    for (const msg of recentMessages) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Add current message (recentMessages already includes it since we just saved it, wait...
    // Let's verify if `getChatContext` returns the latest 5. Yes, it does. So the user's message is at the end.
    
    const completion = await aiClient.chat.completions.create({
      model: MODEL_NAME,
      messages: messages as any[],
      max_tokens: 1024,
      temperature: 0.7,
      ...({ extra_body: { chat_template_kwargs: { thinking: false } } } as any),
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not process that.';

    // Save assistant's reply
    await saveChatMessage(localUser.id, sessionId, 'assistant', reply);

    // If we have >= 5 messages, we should theoretically update the summary asynchronously.
    // For now, we will do a simple prompt to summarize if there are exactly 5 messages.
    if (recentMessages.length >= 5) {
      generateSummaryAsync(localUser.id, sessionId, summary, recentMessages).catch(console.error);
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function generateSummaryAsync(userId: number, sessionId: string, oldSummary: string | null, recent: any[]) {
  const prompt = `Summarize the following conversation in 2-3 sentences. Incorporate this previous summary if it exists: ${oldSummary || 'None'}\n\nConversation:\n${recent.map(m => `${m.role}: ${m.content}`).join('\n')}`;
  
  const completion = await aiClient.chat.completions.create({
    model: MODEL_NAME,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 250,
  });

  const newSummary = completion.choices[0]?.message?.content;
  if (newSummary) {
    await updateChatSummary(userId, sessionId, newSummary);
  }
}
