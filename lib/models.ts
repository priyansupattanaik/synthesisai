export interface ModelConfig {
  id: string;
  provider: 'groq' | 'nvidia';
  displayName: string;
  modelId: string;
  contextWindow: number;
  temperature: number;
  maxTokens: number;
  specialty: 'reasoning' | 'fast' | 'multimodal' | 'long-context' | 'agentic' | 'coding';
  color: string;
  ringPosition: number;
  rateLimitRpm: number;
}

export const COUNCIL_MODELS: ModelConfig[] = [
  // GROQ MODELS (Positions 0-4)
  {
    id: 'groq-qwen3-32b',
    provider: 'groq',
    displayName: 'Qwen3 32B',
    modelId: 'qwen/qwen3-32b',
    contextWindow: 131072,
    temperature: 0.6,
    maxTokens: 4096,
    specialty: 'reasoning',
    color: '#ff6b35',
    ringPosition: 0,
    rateLimitRpm: 20,
  },
  {
    id: 'groq-llama-3.1-8b',
    provider: 'groq',
    displayName: 'Llama 3.1 8B',
    modelId: 'llama-3.1-8b-instant',
    contextWindow: 131072,
    temperature: 1.0,
    maxTokens: 1024,
    specialty: 'fast',
    color: '#00d4ff',
    ringPosition: 1,
    rateLimitRpm: 20,
  },
  {
    id: 'groq-llama-4-scout',
    provider: 'groq',
    displayName: 'Llama 4 Scout',
    modelId: 'meta-llama/llama-4-scout-17b-16e-instruct',
    contextWindow: 131072,
    temperature: 1.0,
    maxTokens: 1024,
    specialty: 'multimodal',
    color: '#9b59b6',
    ringPosition: 2,
    rateLimitRpm: 20,
  },
  {
    id: 'groq-kimi-k2',
    provider: 'groq',
    displayName: 'Kimi K2',
    modelId: 'moonshotai/kimi-k2-instruct-0905',
    contextWindow: 262144,
    temperature: 0.6,
    maxTokens: 4096,
    specialty: 'long-context',
    color: '#e74c3c',
    ringPosition: 3,
    rateLimitRpm: 10,
  },
  {
    id: 'groq-gpt-oss-120b',
    provider: 'groq',
    displayName: 'GPT-OSS 120B',
    modelId: 'openai/gpt-oss-120b',
    contextWindow: 131072,
    temperature: 1.0,
    maxTokens: 8192,
    specialty: 'reasoning',
    color: '#10a37f',
    ringPosition: 4,
    rateLimitRpm: 10,
  },
  // NVIDIA NIM MODELS (Positions 5-7)
  {
    id: 'nvidia-minimax-m2.1',
    provider: 'nvidia',
    displayName: 'MiniMax M2.1',
    modelId: 'minimaxai/minimax-m2.1',
    contextWindow: 205000,
    temperature: 1.0,
    maxTokens: 4096,
    specialty: 'agentic',
    color: '#ffd700',
    ringPosition: 5,
    rateLimitRpm: 40,
  },
  {
    id: 'nvidia-step-3.5-flash',
    provider: 'nvidia',
    displayName: 'Step 3.5 Flash',
    modelId: 'stepfun-ai/step-3.5-flash',
    contextWindow: 128000,
    temperature: 1.0,
    maxTokens: 16384,
    specialty: 'fast',
    color: '#2ecc71',
    ringPosition: 6,
    rateLimitRpm: 40,
  },
  {
    id: 'nvidia-devstral-2',
    provider: 'nvidia',
    displayName: 'Devstral 2 123B',
    modelId: 'mistralai/devstral-2-123b-instruct-2512',
    contextWindow: 262000,
    temperature: 0.15,
    maxTokens: 8192,
    specialty: 'coding',
    color: '#f39c12',
    ringPosition: 7,
    rateLimitRpm: 40,
  },
];

export const getModelById = (id: string): ModelConfig | undefined => {
  return COUNCIL_MODELS.find(m => m.id === id);
};

export const getModelsByProvider = (provider: 'groq' | 'nvidia') => {
  return COUNCIL_MODELS.filter(m => m.provider === provider);
};