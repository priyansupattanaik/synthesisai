export interface ModelResponse {
  modelId: string;
  content: string;
  latency: number;
  tokensUsed?: number;
  timestamp: number;
  error?: string;
}

export interface PeerReview {
  reviewerId: string;
  targetId: string;
  score: number;
  reasoning: string;
}

export interface ChairmanProfile {
  modelId: string;
  displayName: string;
  averageScore: number;
  elevationLevel: number;
  color: string;
  specialty: string;
}

export interface DeliberationResult {
  query: string;
  responses: ModelResponse[];
  reviews: PeerReview[];
  chairman: ChairmanProfile | null;
  finalSynthesis: string | null;
  status: 'complete' | 'error';
  duration: number;
  timestamp: number;
}

export interface CouncilMemberState {
  modelId: string;
  status: 'idle' | 'thinking' | 'speaking' | 'reviewing' | 'chairman' | 'error';
  progress: number;
  response?: string;
  confidence?: number;
  error?: string;
}