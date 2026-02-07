
import DevstralIcon from './DevstralIcon.png';
import GptOssIcon from './GptOssIcon.png';
import KimiIcon from './KimiIcon.png';
import LlamaFastIcon from './LlamaFastIcon.png';
import LlamaScoutIcon from './LlamaScoutIcon.png';
import MinimaxIcon from './MinimaxIcon.png';
import QwenIcon from './QwenIcon.png';
import StepIcon from './StepIcon.png';
import SynthesisLogo from './SynthesisLogo.png';
import { StaticImageData } from 'next/image';

export { SynthesisLogo };

export const APP_LOGO = SynthesisLogo;

export const MODEL_ICONS: Record<string, StaticImageData> = {
  // Groq Models
  'groq-qwen3-32b': QwenIcon,
  'groq-llama-3.1-8b': LlamaFastIcon,
  'groq-llama-4-scout': LlamaScoutIcon,
  'groq-kimi-k2': KimiIcon,
  'groq-gpt-oss-120b': GptOssIcon,
  
  // NVIDIA NIM Models
  'nvidia-minimax-m2.1': MinimaxIcon,
  'nvidia-step-3.5-flash': StepIcon,
  'nvidia-devstral-2': DevstralIcon,
};
