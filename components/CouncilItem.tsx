"use client";

import React from 'react';
import { CouncilMemberState } from '@/lib/types';
import { ModelConfig } from '@/lib/models';
import { cn } from '@/lib/utils';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface CouncilItemProps {
  member: CouncilMemberState;
  config: ModelConfig;
  layout: 'mobile' | 'desktop';
  onClick: () => void;
  isExpanded?: boolean;
}

const MODEL_COLOR_MAP: Record<string, string> = {
  'groq-qwen3-32b': 'bg-model-qwen text-model-qwen',
  'groq-llama-3.1-8b': 'bg-model-llama3 text-model-llama3',
  'groq-llama-4-scout': 'bg-model-llama4 text-model-llama4',
  'groq-kimi-k2': 'bg-model-kimi text-model-kimi',
  'groq-gpt-oss-120b': 'bg-model-gpt text-model-gpt',
  'nvidia-minimax-m2.1': 'bg-model-minimax text-model-minimax',
  'nvidia-step-3.5-flash': 'bg-model-step text-model-step',
  'nvidia-devstral-2': 'bg-model-devstral text-model-devstral',
};

const MODEL_ABBR_MAP: Record<string, string> = {
  'groq-qwen3-32b': 'QWN',
  'groq-llama-3.1-8b': 'L31',
  'groq-llama-4-scout': 'L4S',
  'groq-kimi-k2': 'KM2',
  'groq-gpt-oss-120b': 'GPT',
  'nvidia-minimax-m2.1': 'MMX',
  'nvidia-step-3.5-flash': 'STP',
  'nvidia-devstral-2': 'DVS',
};

export function CouncilItem({ member, config, layout, onClick, isExpanded }: CouncilItemProps) {
  const colorClass = MODEL_COLOR_MAP[config.id] || 'bg-neutral-400 text-neutral-400';
  const abbr = MODEL_ABBR_MAP[config.id] || config.displayName.substring(0, 3).toUpperCase();
  
  // Mobile Card Layout
  if (layout === 'mobile') {
    return (
      <button 
        onClick={onClick}
        className="flex-shrink-0 w-[80px] h-[120px] bg-surface border border-neutral-800 flex flex-col items-center justify-between p-2 hover:border-neutral-600 transition-colors group"
      >
        <div className="w-full flex justify-between items-start">
          <span className={cn("text-[10px] font-mono font-bold opacity-80", colorClass.split(' ')[1])}>
             {abbr}
          </span>
          {member.status === 'thinking' && (
             <span className="w-1.5 h-1.5 bg-current animate-pulse opacity-50 block" /> 
          )}
           {member.status === 'speaking' || member.status === 'chairman' ? (
             <span className={cn("w-1.5 h-1.5 rounded-full", colorClass.split(' ')[0])} /> 
          ) : null}
        </div>

        {member.status === 'error' ? (
           <AlertCircle className="w-4 h-4 text-error" />
        ) : (
            <div className="flex-1 w-full flex items-center justify-center">
                 {/* Visual filler or simplified wave could go here, but keeping it clean per spec */}
                 <div className={cn("w-full h-[1px] opacity-20 group-hover:opacity-50 transition-opacity", colorClass.split(' ')[0])} />
            </div>
        )}

        <div className="w-full text-right">
             {member.confidence ? (
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
    <div className="w-full border-b border-neutral-800">
      <button 
        onClick={onClick}
        className="w-full h-16 flex items-center hover:bg-neutral-800/30 transition-colors px-4 gap-4 group"
      >
        {/* Left: Abbr & Indicator */}
        <div className={cn("w-8 h-8 flex items-center justify-center font-mono text-xs font-bold bg-opacity-10 rounded-sm", colorClass.split(' ')[0].replace('bg-', 'bg-opacity-10 bg-'), colorClass.split(' ')[1])}>
            {abbr}
        </div>

        {/* Center: Content Preview */}
        <div className="flex-1 text-left overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs-meta font-bold text-neutral-400 uppercase tracking-wider">
                    {config.displayName}
                </span>
                {member.status === 'thinking' && <span className="text-highlight animate-pulse font-mono">_</span>}
            </div>
            <p className="text-sm-body text-neutral-400 truncate w-full font-mono opacity-80">
                {member.status === 'thinking' ? 'Computing...' : (member.response || 'Pending...')}
            </p>
        </div>

        {/* Right: Score/Status */}
        <div className="flex items-center gap-4">
             {member.status === 'error' && <span className="text-error text-xs font-mono">ERR</span>}
             {member.confidence && (
                 <div className="flex flex-col items-end">
                     <span className="text-xs-meta text-neutral-400">SCORE</span>
                     <span className={cn("text-sm font-mono font-bold", colorClass.split(' ')[1])}>
                        {member.confidence}
                     </span>
                 </div>
             )}
             <ChevronDown className={cn("w-4 h-4 text-neutral-600 transition-transform duration-200", isExpanded ? "rotate-180" : "group-hover:text-neutral-400")} />
        </div>
      </button>
      
      {/* Expanded Content */}
      {isExpanded && member.response && (
          <div className="px-4 pb-6 pt-2 pl-[5rem]">
              <div className="prose prose-invert prose-sm max-w-none text-neutral-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {member.response}
              </div>
          </div>
      )}
    </div>
  );
}
