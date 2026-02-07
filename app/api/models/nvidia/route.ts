import { NextRequest, NextResponse } from 'next/server';


const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

interface RequestBody {
  model: { modelId: string; temperature: number; maxTokens: number; id: string };
  messages: unknown[];
}

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = await request.json() as RequestBody;
    const { model, messages } = body;
    
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NVIDIA_API_KEY not configured' },
        { status: 500 }
      );
    }

    const startTime = Date.now();

    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: model.modelId,
        messages,
        temperature: model.temperature,
        max_tokens: model.maxTokens,
        top_p: model.modelId.includes('devstral') ? 0.95 : 0.9,
        stream: false,
        seed: 42,
      }),
    });

    const latency = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: `NVIDIA API error: ${errorData.error?.message || response.statusText}`,
          modelId: model.id,
          latency 
        },
        { status: response.status }
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
    console.error('NVIDIA API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const maxDuration = 90; // NVIDIA can be slower for large models