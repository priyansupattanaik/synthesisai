"use client";


import { CouncilMemberState } from '@/lib/types';
import { ModelConfig } from '@/lib/models';
import { cn } from '@/lib/utils';
import { HiChevronDown, HiExclamationCircle } from 'react-icons/hi2';
import HoloSwitch from './HoloSwitch';

interface CouncilItemProps {
  member: CouncilMemberState;
  config: ModelConfig;
  layout: 'mobile' | 'desktop';
  onClick: () => void;
  isExpanded?: boolean;
  isActive: boolean;
  onToggle: () => void;
}

const MODEL_COLOR_MAP: Record<string, string> = {
  'groq-deepseek-r1': 'bg-slime text-void',
  'groq-llama-3.1-8b': 'bg-cyan text-void',
  'groq-llama-4-scout': 'bg-amber text-void',
  'groq-kimi-k2': 'bg-rose text-off-white',
  'groq-gpt-oss-120b': 'bg-slime text-void',
  'nvidia-minimax-m2.1': 'bg-amethyst text-off-white',
  'nvidia-step-3.5-flash': 'bg-cyan text-void',
  'nvidia-devstral-2': 'bg-azure text-off-white',
};

const MODEL_ABBR_MAP: Record<string, string> = {
  'groq-deepseek-r1': 'DSK',
  'groq-llama-3.1-8b': 'L31',
  'groq-llama-4-scout': 'L32', // Updated to match Llama 3.2
  'groq-kimi-k2': 'MIX',      // Updated for Mixtral
  'groq-gpt-oss-120b': 'L33', // Updated for Llama 3.3
  'nvidia-minimax-m2.1': 'NEM', // Updated for Nemotron
  'nvidia-step-3.5-flash': 'L45', // Updated for Llama 405B
  'nvidia-devstral-2': 'CDS', // Updated for Codestral
};

export function CouncilItem({ member, config, layout, onClick, isExpanded, isActive, onToggle }: CouncilItemProps) {
  const colorClass = MODEL_COLOR_MAP[config.id] || 'bg-neutral-400 text-neutral-400';
  const abbr = MODEL_ABBR_MAP[config.id] || config.displayName.substring(0, 3).toUpperCase();
  
  // Mobile Card Layout
  if (layout === 'mobile') {
    return (
      <button 
        onClick={onClick}
        className={cn(
          "flex-shrink-0 w-[80px] h-[120px] bg-surface border border-neutral-800 flex flex-col items-center justify-between p-2 transition-all group relative overflow-hidden",
          isActive ? "hover:border-neutral-600 opacity-100" : "opacity-50 grayscale"
        )}
      >
        <div className="w-full flex justify-between items-start">
          <span className={cn("text-[10px] font-mono font-bold opacity-80", colorClass.split(' ')[1])}>
             {abbr}
          </span>
          {isActive && member.status === 'thinking' && (
             <span className="w-1.5 h-1.5 bg-current animate-pulse opacity-50 block" /> 
          )}
           {isActive && (member.status === 'speaking' || member.status === 'chairman') ? (
             <span className={cn("w-1.5 h-1.5 rounded-full", colorClass.split(' ')[0])} /> 
          ) : null}
        </div>

        {member.status === 'error' && isActive ? (
           <HiExclamationCircle className="w-4 h-4 text-error" />
        ) : (
            <div className="flex-1 w-full flex items-center justify-center">
                 <div className={cn("w-full h-[1px] opacity-20 group-hover:opacity-50 transition-opacity", colorClass.split(' ')[0])} />
            </div>
        )}

        <div className="w-full text-right">
             {isActive && member.confidence ? (
                 <span className="text-[10px] text-neutral-400 font-mono">
                    {member.confidence}%
                 </span>
             ) : (
                 <span className="text-[10px] text-neutral-600 font-mono">—</span>
             )}
        </div>
      </button>
    );
  }

  // Desktop Row Layout
  return (
    <div className={cn("w-full border-b border-neutral-800 transition-colors", !isActive && "bg-neutral-900/20")}>
      <div className="w-full h-20 flex items-center px-4 gap-4 group">
        
        {/* Toggle Switch */}
        <div className="scale-[0.55] -ml-4 flex-shrink-0 origin-center">
             <HoloSwitch checked={isActive} onChange={onToggle} />
        </div>

        {/* Content Click Area */}
        <button 
            onClick={onClick}
            className={cn("flex-1 flex items-center gap-4 h-full text-left", !isActive && "opacity-40 cursor-default")}
            disabled={!isActive}
        >
            {/* Left: Abbr & Indicator */}
            <div className={cn("w-8 h-8 flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold bg-opacity-10 rounded-sm", colorClass.split(' ')[0].replace('bg-', 'bg-opacity-10 bg-'), colorClass.split(' ')[1])}>
                {abbr}
            </div>

            {/* Center: Content Preview */}
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs-meta font-bold text-neutral-400 uppercase tracking-wider truncate">
                        {config.displayName}
                    </span>
                    {isActive && member.status === 'thinking' && <span className="text-highlight animate-pulse font-mono">_</span>}
                </div>
                <p className="text-sm-body text-neutral-400 truncate w-full font-mono opacity-80">
                    {isActive 
                        ? (member.status === 'thinking' ? 'Computing...' : (member.response || 'Pending...')) 
                        : 'Offline // Connection Terminated'}
                </p>
            </div>

            {/* Right: Score/Status */}
            <div className="flex items-center gap-4">
                {isActive && member.status === 'error' && <span className="text-error text-xs font-mono">ERR</span>}
                {isActive && member.confidence && (
                    <div className="flex flex-col items-end">
                        <span className="text-xs-meta text-neutral-400">SCORE</span>
                        <span className={cn("text-sm font-mono font-bold", colorClass.split(' ')[1])}>
                            {member.confidence}
                        </span>
                    </div>
                )}
                {isActive && (
                  <HiChevronDown className={cn("w-4 h-4 text-neutral-600 transition-transform duration-200", isExpanded ? "rotate-180" : "group-hover:text-neutral-400")} />
                )}
            </div>
        </button>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && isActive && member.response && (
          <div className="px-4 pb-6 pt-2 pl-[5rem]">
              <div className="prose prose-invert prose-sm max-w-none text-neutral-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {member.response}
              </div>
          </div>
      )}
    </div>
  );
}