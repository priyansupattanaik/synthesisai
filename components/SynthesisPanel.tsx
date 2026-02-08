'use client';

import React from 'react';
import { DeliberationResult } from '@/lib/types';
import { FaScroll, FaCrown } from 'react-icons/fa6';
import Loader from './Loader';

interface SynthesisPanelProps {
  deliberation: DeliberationResult | null;
  isLoading: boolean;
}

export function SynthesisPanel({ deliberation, isLoading }: SynthesisPanelProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-neutral-500 space-y-4">
        <Loader />
        <p className="font-mono text-xs tracking-widest uppercase text-amber animate-pulse">Synthesizing consensus...</p>
      </div>
    );
  }

  if (!deliberation || !deliberation.finalSynthesis) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30 border-l border-white/5 bg-black/20">
        <div className="w-20 h-20 border border-dashed border-white/20 rounded-full flex items-center justify-center mb-6">
            <FaScroll className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-mono mb-2">Awaiting Deliberation</h3>
        <p className="text-sm font-sans text-neutral-400 max-w-xs">
          Submit a query to convene the council. The elected Chairman will synthesize the final answer here.
        </p>
      </div>
    );
  }

  const { chairman, finalSynthesis, duration } = deliberation;

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm overflow-hidden border-l border-white/5">
      
      {/* Header: Chairman Info */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-neutral-900 to-black relative overflow-hidden">
         {/* Background Glow */}
         <div 
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none" 
            style={{ backgroundColor: chairman?.color || '#fff' }} 
         />

         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-500">
                    <FaCrown className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono text-yellow-500 uppercase tracking-widest">Elected Chairman</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1 font-sans-simulated tracking-tight">
                {chairman?.displayName || "Unknown Model"}
            </h2>
            
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 mt-2">
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Consensus Reached
                </span>
                <span>•</span>
                <span>{(duration / 1000).toFixed(2)}s Latency</span>
                <span>•</span>
                <span>Score: {chairman?.averageScore}/10</span>
            </div>
         </div>
      </div>

      {/* Content: The Synthesis */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div className="prose prose-invert prose-lg max-w-none">
            {/* We render the text with specific styles for readability */}
            <div className="text-neutral-200 font-sans-simulated leading-relaxed whitespace-pre-wrap">
                {finalSynthesis}
            </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-end opacity-50">
            <div className="font-mono text-[10px]">
                <p>SESSION ID: {deliberation.timestamp}</p>
                <p>VERIFIED BY SYNTHESIS PROTOCOL v2.0</p>
            </div>
            <div className="h-8 w-24 bg-current opacity-10" /> {/* Barcode placeholder */}
        </div>
      </div>
    </div>
  );
}