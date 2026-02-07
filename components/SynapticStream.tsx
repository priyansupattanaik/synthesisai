'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { DeliberationResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import Loader from './Loader';

interface ChatMessage {
  type: 'user' | 'council';
  content: string;
  timestamp: number;
}

export default function SynapticStream() {
  const { history, isLoading } = useCouncilStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Convert history to chat messages - Only show user query and final synthesis (no discussions)
  const messages: ChatMessage[] = history.flatMap((result: DeliberationResult) => [
    {
      type: 'user' as const,
      content: result.query,
      timestamp: result.timestamp,
    },
    {
      type: 'council' as const,
      content: result.finalSynthesis || 'Neural link unstable. Please retry.',
      timestamp: result.timestamp + result.duration,
    },
  ]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 py-6"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Empty State */}
        {messages.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-6">
              <div className="w-3 h-3 bg-slime rounded-full animate-pulse shadow-[0_0_15px_#39ff14]" />
            </div>
            <h2 className="text-xl font-space text-off-white mb-2">Neural Link Ready</h2>
            <p className="text-sm text-neutral-500 font-mono max-w-xs">
              The council awaits your query. Type below to initiate synthesis.
            </p>
          </motion.div>
        )}

        {/* Message Stream - Direct Answers Only */}
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <motion.div
              key={`${msg.timestamp}-${msg.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className={cn(
                "flex",
                msg.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.type === 'user' ? (
                /* User Message - Right aligned, minimal */
                <div className="max-w-[80%] md:max-w-[70%]">
                  <div className="px-4 py-3 bg-white/5 rounded-2xl rounded-br-sm border border-white/10">
                    <p className="text-off-white font-sans leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                  <span className="text-[10px] text-neutral-600 font-mono mt-1 block text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ) : (
                /* Council Response - Direct Answer in Cell Membrane Container */
                <div className="max-w-[90%] md:max-w-[80%]">
                  {/* Synthesis Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-slime shadow-[0_0_8px_#39ff14]" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slime">
                      Neural Synthesis
                    </span>
                  </div>
                  
                  {/* Cell Membrane Container */}
                  <div 
                    className={cn(
                      "px-5 py-4 rounded-2xl rounded-tl-sm",
                      "bg-[#0a0a0c] border border-[#333]",
                      "hover:border-[#444] hover:shadow-[0_0_20px_rgba(57,255,20,0.05)]",
                      "transition-all duration-300"
                    )}
                  >
                    <p className="text-neutral-200 font-sans leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  
                  <span className="text-[10px] text-neutral-600 font-mono mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading State - Thinking */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex flex-col items-center gap-3 px-6 py-4">
              <Loader />
              <span className="text-xs font-mono text-amber tracking-widest uppercase animate-pulse">
                Synthesizing Response...
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
