import { NextRequest, NextResponse } from 'next/server';
import { COUNCIL_MODELS } from '@/lib/models';
import { ModelResponse, PeerReview, DeliberationResult, ChairmanProfile } from '@/lib/types';

// In-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, number[]>();

function checkRateLimit(modelId: string, limit: number): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const key = modelId;
  
  const requests = rateLimitStore.get(key) || [];
  const recentRequests = requests.filter(t => now - t < windowMs);
  
  if (recentRequests.length >= limit) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitStore.set(key, recentRequests);
  return true;
}

async function callModel(model: typeof COUNCIL_MODELS[0], query: string, baseUrl: string): Promise<ModelResponse> {
  if (!checkRateLimit(model.id, model.rateLimitRpm)) {
    return {
      modelId: model.id,
      content: '',
      latency: 0,
      timestamp: Date.now(),
      error: 'Rate limit exceeded',
    };
  }

  const endpoint = model.provider === 'groq' ? '/api/models/groq' : '/api/models/nvidia';

  
  const url = `${baseUrl}${endpoint}`;
  console.log(`Calling model API: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a council member in an AI deliberation. Provide a clear, accurate, and well-reasoned answer. Be concise but thorough.' 
          },
          { role: 'user', content: query }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      modelId: model.id,
      content: data.content,
      latency: data.latency,
      tokensUsed: data.tokensUsed,
      timestamp: data.timestamp,
    };
  } catch (error) {
    return {
      modelId: model.id,
      content: '',
      latency: 0,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function generatePeerReview(
  reviewerModel: typeof COUNCIL_MODELS[0], 
  targetResponse: ModelResponse,
  query: string,
  baseUrl: string
): Promise<PeerReview | null> {
  const reviewPrompt = `You are evaluating a council member's response to the following query:

Query: "${query}"

Response to evaluate:
"""
${targetResponse.content}
"""

Rate this response 1-10 on:
- Accuracy (4 points)
- Completeness (3 points)  
- Reasoning quality (3 points)

Output format:
Score: [1-10]
Reasoning: [1-2 sentence justification]`;

  const endpoint = reviewerModel.provider === 'groq' ? '/api/models/groq' : '/api/models/nvidia';


  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: reviewerModel,
        messages: [{ role: 'user', content: reviewPrompt }],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.content;
    
    const scoreMatch = content.match(/Score:\s*(\d+)/i);
    const reasoningMatch = content.match(/Reasoning:\s*([\s\S]+)/i);
    
    return {
      reviewerId: reviewerModel.id,
      targetId: targetResponse.modelId,
      score: scoreMatch ? Math.min(10, Math.max(1, parseInt(scoreMatch[1]))) : 5,
      reasoning: reasoningMatch ? reasoningMatch[1].trim().slice(0, 200) : 'No reasoning provided',
    };
  } catch {
    return null;
  }
}

function selectChairman(reviews: PeerReview[], responses: ModelResponse[]): ChairmanProfile | null {
  const scores = new Map<string, number[]>();
  const latencies = new Map<string, number>();
  
  reviews.forEach(review => {
    if (!scores.has(review.targetId)) {
      scores.set(review.targetId, []);
    }
    scores.get(review.targetId)!.push(review.score);
  });
  
  responses.forEach(r => {
    if (!r.error && r.latency > 0) {
      latencies.set(r.modelId, r.latency);
    }
  });
  
  let bestChairman: { modelId: string; avgScore: number; latency: number } | null = null;
  
  for (const [modelId, scoreList] of scores) {
    const avg = scoreList.reduce((a, b) => a + b, 0) / scoreList.length;
    const latency = latencies.get(modelId) || Infinity;
    
    if (!bestChairman || avg > bestChairman.avgScore || (avg === bestChairman.avgScore && latency < bestChairman.latency)) {
      bestChairman = { modelId, avgScore: avg, latency };
    }
  }
  
  if (!bestChairman) return null;
  
  const model = COUNCIL_MODELS.find(m => m.id === bestChairman!.modelId)!;
  return {
    modelId: bestChairman.modelId,
    displayName: model.displayName,
    averageScore: Math.round(bestChairman.avgScore * 10) / 10,
    elevationLevel: Math.round(bestChairman.avgScore * 10),
    color: model.color,
    specialty: model.specialty,
  };
}

async function generateSynthesis(
  chairmanId: string, 
  query: string, 
  responses: ModelResponse[],
  reviews: PeerReview[],
  baseUrl: string
): Promise<string> {
  const chairmanModel = COUNCIL_MODELS.find(m => m.id === chairmanId)!;
  const validResponses = responses.filter(r => !r.error && r.content);
  
  const synthesisPrompt = `You are the Chairman of the AI Council. Your task is to synthesize the council's deliberation into a final, authoritative answer.

Query: "${query}"

Council Responses:
${validResponses.map(r => {
  const model = COUNCIL_MODELS.find(m => m.id === r.modelId)!;
  const avgScore = reviews
    .filter(rev => rev.targetId === r.modelId)
    .reduce((a, b) => a + b.score, 0) / reviews.filter(rev => rev.targetId === r.modelId).length || 0;
  return `[${model.displayName} | Score: ${avgScore.toFixed(1)}/10]: ${r.content.slice(0, 500)}`;
}).join('\n\n')}

Instructions:
1. Identify points of consensus among high-scoring responses
2. Resolve any contradictions with clear reasoning
3. Provide the definitive answer
4. Keep it comprehensive but concise (max 3 paragraphs)

Final Answer:`;

  const endpoint = chairmanModel.provider === 'groq' ? '/api/models/groq' : '/api/models/nvidia';


  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: chairmanModel,
      messages: [{ role: 'user', content: synthesisPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error('Synthesis generation failed');
  }

  const data = await response.json();
  return data.content;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  
  try {
    const { query, mode = 'full', activeModels } = await request.json();
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid query string is required' },
        { status: 400 }
      );
    }

    // Fast path for simple queries
    const isSimpleQuery = query.length < 60 && 
      !query.match(/(why|how|compare|analyze|explain|difference|best|worst|should|would|could)/i);
    
    if (mode === 'fast' || (mode === 'auto' && isSimpleQuery)) {
      const fastModel = COUNCIL_MODELS.find(m => m.id === 'groq-llama-3.1-8b')!;
      const response = await callModel(fastModel, query, baseUrl);
      
      const result: DeliberationResult = {
        query,
        responses: [response],
        reviews: [],
        chairman: null,
        finalSynthesis: response.error ? null : response.content,
        status: response.error ? 'error' : 'complete',
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      };
      
      return NextResponse.json(result);
    }

    // Full council deliberation
    // Phase 1: Parallel responses
    const activeCouncil = activeModels && activeModels.length > 0
      ? COUNCIL_MODELS.filter(m => activeModels.includes(m.id))
      : COUNCIL_MODELS;

    const responsePromises = activeCouncil.map(model => callModel(model, query, baseUrl));
    const responses = await Promise.all(responsePromises);
    
    const validResponses = responses.filter(r => !r.error);
    
    if (validResponses.length === 0) {
      console.error('All models failed to respond. Errors:', responses.map(r => `${r.modelId}: ${r.error}`));
      return NextResponse.json(
        { error: 'All models failed to respond. Check API keys.' },
        { status: 500 }
      );
    }

    // Phase 2: Peer reviews (each model reviews 3 others to save time)
    const reviewPromises: Promise<PeerReview | null>[] = [];
    
    for (const reviewer of activeCouncil) {
      const targets = validResponses
        .filter(r => r.modelId !== reviewer.id)
        .slice(0, 3); // Each model reviews 3 others
      
      for (const target of targets) {
        reviewPromises.push(generatePeerReview(reviewer, target, query, baseUrl));
      }
    }
    
    const reviews = (await Promise.all(reviewPromises)).filter((r): r is PeerReview => r !== null);
    
    // Phase 3: Select chairman
    const chairman = selectChairman(reviews, responses);
    
    if (!chairman) {
      console.error('Could not select chairman. Reviews count:', reviews.length);
      return NextResponse.json(
        { error: 'Could not select chairman from reviews' },
        { status: 500 }
      );
    }
    
    // Phase 4: Generate synthesis
    const synthesis = await generateSynthesis(chairman.modelId, query, responses, reviews, baseUrl);
    
    const result: DeliberationResult = {
      query,
      responses,
      reviews,
      chairman,
      finalSynthesis: synthesis,
      status: 'complete',
      duration: Date.now() - startTime,
      timestamp: Date.now(),
    };
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Deliberation error:', error);
    return NextResponse.json(
      { error: 'Deliberation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes for full deliberation