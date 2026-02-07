"use client";

import React, { useState, useRef, useEffect } from 'react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!query.trim() || isLoading) return;
    onSubmit(query);
    setQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    // Auto-expand logic
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-neutral-800 p-0 z-50">
      <div className="relative max-w-[1400px] mx-auto h-full w-full">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask the council..."
          className="w-full bg-transparent text-foreground text-sm-body p-4 pr-16 focus:outline-none resize-none h-14 min-h-[56px] placeholder:text-neutral-400 font-mono transition-colors border-none focus:bg-neutral-900/10"
          maxLength={500}
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <span className="text-xs-meta text-neutral-400 font-mono">
                {query.length}/500
            </span>
            
            {query.length > 0 && (
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="text-[11px] font-bold uppercase tracking-wider text-highlight hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  SEND
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
