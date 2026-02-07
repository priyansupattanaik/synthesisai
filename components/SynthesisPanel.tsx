"use client";

import React, { useState } from 'react';
import { DeliberationResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown, Copy, Check } from 'lucide-react';

interface SynthesisPanelProps {
  deliberation: DeliberationResult | null;
  isLoading?: boolean;
}

export function SynthesisPanel({ deliberation, isLoading }: SynthesisPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (deliberation?.finalSynthesis) {
      navigator.clipboard.writeText(deliberation.finalSynthesis);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!deliberation && !isLoading) {
    return (
        <div className="flex items-center justify-center h-full text-neutral-600 text-xs-meta font-mono p-8 border border-neutral-800 bg-neutral-900/20">
            AWAITING SYNTHESIS...
        </div>
    );
  }

  return (
    <div className={cn("flex flex-col bg-surface border-l border-neutral-800 h-full transition-all duration-300", isCollapsed ? "h-12 overflow-hidden" : "")}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-surface sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase text-neutral-400 font-bold tracking-wider">
                CHAIRMAN: {deliberation?.chairman?.displayName || 'PENDING...'}
            </span>
            {isLoading && <span className="animate-pulse text-highlight">_</span>}
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={handleCopy} 
                disabled={!deliberation?.finalSynthesis}
                className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white flex items-center gap-1 px-2 py-1 hover:bg-neutral-800 rounded-sm transition-colors disabled:opacity-50"
            >
                {isCopied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                {isCopied ? 'COPIED' : 'COPY'}
            </button>
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-neutral-800 rounded-sm transition-colors"
            >
                <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform duration-200", isCollapsed ? "" : "rotate-180")} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-surface custom-scrollbar">
         {isLoading ? (
             <div className="space-y-2 animate-pulse">
                 <div className="h-4 bg-neutral-800 w-3/4 rounded-sm" />
                 <div className="h-4 bg-neutral-800 w-full rounded-sm" />
                 <div className="h-4 bg-neutral-800 w-5/6 rounded-sm" />
             </div>
         ) : (
            <div className="prose prose-invert max-w-[65ch] text-base leading-relaxed text-text-primary font-sans-simulated">
                {deliberation?.finalSynthesis || (
                    <span className="text-neutral-500 italic">Synthesis pending...</span>
                )}
            </div>
         )}
      </div>
    </div>
  );
}