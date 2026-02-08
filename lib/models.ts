import { StaticImageData } from 'next/image';
import { MODEL_ICONS } from '@/components/icons';

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
  // GROQ MODELS
  {
    id: 'groq-deepseek-r1',
    provider: 'groq',
    displayName: 'DeepSeek R1',
    modelId: 'deepseek-r1-distill-llama-70b',
    contextWindow: 128000,
    temperature: 0.6,
    maxTokens: 4096,
    specialty: 'reasoning',
    color: '#39ff14', // Slime (Reasoning)
    ringPosition: 0,
    rateLimitRpm: 30,
  },
  {
    id: 'groq-llama-3.1-8b',
    provider: 'groq',
    displayName: 'Llama 3.1 8B',
    modelId: 'llama-3.1-8b-instant', // Working ✓
    contextWindow: 128000,
    temperature: 1.0,
    maxTokens: 1024,
    specialty: 'fast',
    color: '#00f5d4', // Cyan (Fast)
    ringPosition: 1,
    rateLimitRpm: 30,
  },
  {
    id: 'groq-llama-4-scout',
    provider: 'groq',
    displayName: 'Llama 4 Scout',
    modelId: 'meta-llama/llama-4-scout-17b-16e-instruct', // Updated from deprecated llama-3.2-90b
    contextWindow: 128000,
    temperature: 1.0,
    maxTokens: 4096,
    specialty: 'multimodal',
    color: '#ffbe0b', // Amber (Multimodal)
    ringPosition: 2,
    rateLimitRpm: 30,
  },
  {
    id: 'groq-kimi-k2',
    provider: 'groq',
    displayName: 'Gemma 2 9B',
    modelId: 'gemma2-9b-it', // Updated from deprecated mixtral-8x7b
    contextWindow: 8192,
    temperature: 0.6,
    maxTokens: 4096,
    specialty: 'long-context',
    color: '#ff006e', // Rose (Long-context)
    ringPosition: 3,
    rateLimitRpm: 30,
  },
  {
    id: 'groq-gpt-oss-120b',
    provider: 'groq',
    displayName: 'Llama 3.3 70B',
    modelId: 'llama-3.3-70b-versatile', // Working ✓
    contextWindow: 128000,
    temperature: 1.0,
    maxTokens: 8192,
    specialty: 'reasoning',
    color: '#39ff14', // Slime (Reasoning)
    ringPosition: 4,
    rateLimitRpm: 30,
  },
  // NVIDIA NIM MODELS
  {
    id: 'nvidia-minimax-m2.1',
    provider: 'nvidia',
    displayName: 'Llama 3.1 70B',
    modelId: 'meta/llama-3.1-70b-instruct', // Updated from deprecated nemotron-4
    contextWindow: 128000,
    temperature: 0.7,
    maxTokens: 4096,
    specialty: 'agentic',
    color: '#8338ec', // Amethyst (Agentic)
    ringPosition: 5,
    rateLimitRpm: 40,
  },
  {
    id: 'nvidia-step-3.5-flash',
    provider: 'nvidia',
    displayName: 'Llama 3.1 405B',
    modelId: 'meta/llama-3.1-405b-instruct', // Working ✓
    contextWindow: 128000,
    temperature: 1.0,
    maxTokens: 4096,
    specialty: 'fast',
    color: '#00f5d4', // Cyan (Fast)
    ringPosition: 6,
    rateLimitRpm: 40,
  },
  {
    id: 'nvidia-devstral-2',
    provider: 'nvidia',
    displayName: 'Mistral 7B',
    modelId: 'mistralai/mistral-7b-instruct-v0.3', // Updated from deprecated codestral
    contextWindow: 32000,
    temperature: 0.15,
    maxTokens: 8192,
    specialty: 'coding',
    color: '#3a86ff', // Azure (Coding)
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

// Get icon for a model by its ID
export const getModelIcon = (id: string): StaticImageData | undefined => {
  return MODEL_ICONS[id];
};