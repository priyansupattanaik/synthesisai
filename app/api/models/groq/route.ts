import { NextRequest, NextResponse } from 'next/server';


const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface RequestBody {
  model: { modelId: string; temperature: number; maxTokens: number; id: string };
  messages: unknown[];
  stream?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = await request.json() as RequestBody;
    const { model, messages } = body;
    
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 }
      );
    }

    const startTime = Date.now();

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.modelId,
        messages,
        temperature: model.temperature,
        max_completion_tokens: model.maxTokens,
        top_p: 0.95,
        stream: false, // Non-streaming for deliberation
        stop: null,
      }),
    });

    const latency = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json();
      // Log full error server-side for debugging
      console.error(`[Groq API Error] Model: ${model.id}, Status: ${response.status}`, errorData);
      // Return sanitized error to client
      return NextResponse.json(
        { 
          error: 'Model temporarily unavailable',
          modelId: model.id,
          latency 
        },
        { status: 503 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;

    return NextResponse.json({
      content,
      latency,
      tokensUsed,
      modelId: model.id,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const maxDuration = 60;