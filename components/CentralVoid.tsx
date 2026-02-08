'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { cn } from '@/lib/utils';
import { HiSparkles } from 'react-icons/hi2';
import Loader from './Loader';

export default function CentralVoid() {
  const { startDeliberation, isLoading, deliberation } = useCouncilStore();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus logic for the "invisible" field
  const handleVoidClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        startDeliberation(query);
        setQuery('');
      }
    }
  };

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
    >
      {/* The Hit Area - Click anywhere in center to type */}
      <div 
        onClick={handleVoidClick}
        className={cn(
            "w-[300px] h-[300px] rounded-full flex items-center justify-center cursor-text pointer-events-auto transition-all duration-700",
            isFocused ? "bg-slime/5" : "bg-transparent",
            isLoading && "pointer-events-none"
        )}
      >
        <div className="relative w-full max-w-[240px] text-center">
            
            {/* Input Layer */}
            <AnimatePresence mode="wait">
                {!deliberation && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                    >
                        <textarea
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Speak to the council..."
                            rows={1}
                            className="w-full bg-transparent text-off-white font-sans text-lg md:text-xl text-center placeholder:text-neutral-600 focus:outline-none resize-none overflow-hidden"
                            style={{ caretColor: '#39ff14' }}
                        />
                        {/* Visual Caret / Status */}
                        {isFocused && !query && (
                            <motion.div 
                                layoutId="cursor"
                                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-1 h-1 bg-slime rounded-full"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader />
                    <p className="text-xs font-mono text-amber tracking-widest uppercase animate-pulse">
                        Communing...
                    </p>
                </motion.div>
            )}

            {/* Synthesis Output Layer */}
            {deliberation && !isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="max-h-[60vh] overflow-y-auto custom-scrollbar text-left pointer-events-auto p-4"
                >
                    <div className="flex items-center gap-2 mb-4 justify-center opacity-50">
                        <HiSparkles className="w-4 h-4 text-amber" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber">
                            Synthesis Complete
                        </span>
                    </div>
                    
                    <div className="prose prose-invert prose-p:text-off-white prose-p:font-light prose-p:leading-relaxed text-center md:text-lg">
                         {/* Typewriter effect could be added here in Phase 5 polish */}
                         {deliberation.finalSynthesis}
                    </div>

                    <button 
                        onClick={() => useCouncilStore.getState().reset()}
                        className="mt-8 mx-auto block text-[10px] font-mono text-neutral-500 hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-white/20 pb-1"
                    >
                        Begin New Session
                    </button>
                </motion.div>
            )}
        </div>
      </div>
    </div>
  );
}