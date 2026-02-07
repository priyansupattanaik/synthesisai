'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!query.trim() || isLoading) return;
    onSubmit(query);
    setQuery('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className={cn(
        "relative group bg-neutral-900/80 backdrop-blur-xl border transition-all duration-300 rounded-xl overflow-hidden",
        isLoading ? "border-highlight/50 shadow-[0_0_30px_rgba(212,165,116,0.1)]" : "border-white/10 hover:border-white/20 hover:shadow-lg"
      )}>
        
        {/* Glowing Top Line */}
        <div className={cn(
            "absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-highlight to-transparent transition-all duration-500",
            isLoading ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
        )} />

        <div className="flex items-end p-2 md:p-4 gap-3">
          {/* Input Area */}
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Deliberation in progress..." : "Ask the council..."}
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-foreground placeholder-neutral-500 font-mono text-sm md:text-base resize-none focus:outline-none disabled:opacity-50 py-3 max-h-[120px]"
          />

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className={cn(
              "p-3 rounded-lg flex items-center justify-center transition-all duration-200",
              query.trim() && !isLoading 
                ? "bg-highlight text-black hover:bg-highlight/90 shadow-[0_0_15px_rgba(212,165,116,0.3)]" 
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <StopCircle className="w-5 h-5 animate-pulse text-highlight" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Footer / Status Bar */}
        <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", isLoading ? "bg-highlight animate-pulse" : "bg-green-500/50")} />
                <span>{isLoading ? "SYSTEM ACTIVE" : "SYSTEM READY"}</span>
            </div>
            <div className="flex items-center gap-2">
                 <span>ENTER to submit</span>
                 <span className="hidden md:inline"> | SHIFT+ENTER for new line</span>
            </div>
        </div>

        {/* Loading Progress Bar (Fake or Real) */}
        {isLoading && (
             <div className="absolute bottom-0 left-0 h-[2px] bg-highlight/30 w-full overflow-hidden">
                 <div className="h-full bg-highlight w-1/3 animate-[shimmer_2s_infinite_linear]" />
             </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}