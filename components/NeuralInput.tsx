'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, X } from 'lucide-react';
import { useCouncilStore } from '@/store/councilStore';
import { COUNCIL_MODELS } from '@/lib/models';
import { MODEL_ICONS } from '@/components/icons';
import useOrganicSound from '@/hooks/useOrganicSound';
import Switch from './Switch';
import { cn } from '@/lib/utils';

export default function NeuralInput() {
  const { startDeliberation, isLoading, activeModelIds, toggleActiveModel } = useCouncilStore();
  const { playActivation } = useOrganicSound();
  
  const [query, setQuery] = useState('');
  const [showMatrix, setShowMatrix] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [query]);

  const handleSubmit = () => {
    if (!query.trim() || isLoading) return;
    playActivation();
    startDeliberation(query);
    setQuery('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleModelToggle = (modelId: string, checked: boolean) => {
    const isActive = activeModelIds.includes(modelId);
    const activeCount = activeModelIds.length;
    
    // Prevent disabling if would go below 2 active models
    if (isActive && !checked && activeCount <= 2) return;
    
    toggleActiveModel(modelId);
  };

  const activeCount = activeModelIds.length;

  return (
    <div className="sticky bottom-0 w-full z-50">
      {/* Synaptic Matrix Popover */}
      <AnimatePresence>
        {showMatrix && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-full left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[500px] mb-2 p-5 bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
          >
            {/* Matrix Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-slime" />
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Synaptic Matrix
                </span>
              </div>
              <button 
                onClick={() => setShowMatrix(false)}
                className="p-1 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status */}
            <div className="text-[10px] font-mono text-neutral-500 mb-4">
              {activeCount} / {COUNCIL_MODELS.length} NEURONS ACTIVE
            </div>

            {/* Model List with Neo Switches */}
            <div className="space-y-4">
              {COUNCIL_MODELS.map((model) => {
                const isActive = activeModelIds.includes(model.id);
                const canToggle = isActive ? activeCount > 2 : true;
                
                return (
                  <div
                    key={model.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border transition-all duration-200",
                      isActive 
                        ? "bg-[#111] border-white/20" 
                        : "bg-transparent border-white/5 opacity-60"
                    )}
                  >
                    {/* Model Icon */}
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full overflow-hidden border-2 transition-all flex-shrink-0",
                        isActive ? "shadow-lg" : "grayscale"
                      )}
                      style={{ 
                        borderColor: isActive ? model.color : '#333',
                        boxShadow: isActive ? `0 0 12px ${model.color}40` : 'none'
                      }}
                    >
                      {MODEL_ICONS[model.id] ? (
                        <Image 
                          src={MODEL_ICONS[model.id]} 
                          alt={model.displayName}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full"
                          style={{ backgroundColor: model.color }}
                        />
                      )}
                    </div>

                    {/* Model Info */}
                    <div className="flex-1 min-w-0">
                      <div 
                        className={cn(
                          "text-sm font-medium truncate",
                          isActive ? "text-white" : "text-neutral-500"
                        )}
                      >
                        {model.displayName}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-600 uppercase">
                        {model.specialty}
                      </div>
                    </div>

                    {/* Neo Switch Toggle */}
                    <div className={cn(!canToggle && "opacity-50 pointer-events-none")}>
                      <Switch 
                        id={`switch-${model.id}`}
                        checked={isActive}
                        onChange={(checked) => handleModelToggle(model.id, checked)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Minimum Warning */}
            {activeCount <= 2 && (
              <div className="mt-4 text-[10px] font-mono text-amber/70 text-center">
                ⚠ Minimum 2 neurons required for deliberation
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural Input Bar */}
      <div className="p-4 bg-[#030305]/80 backdrop-blur-md border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className={cn(
            "flex items-end gap-3 px-4 py-3 rounded-2xl",
            "bg-[#0a0a0c] border border-white/10",
            "focus-within:border-slime/30 focus-within:shadow-[0_0_20px_rgba(57,255,20,0.1)]",
            "transition-all duration-300"
          )}>
            {/* Cortex Toggle */}
            <button
              onClick={() => setShowMatrix(!showMatrix)}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                showMatrix 
                  ? "bg-slime/20 text-slime" 
                  : "text-neutral-500 hover:text-white hover:bg-white/5"
              )}
              title="Toggle Synaptic Matrix"
            >
              <Brain className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Neural synthesis in progress..." : "Ask the council..."}
              disabled={isLoading}
              rows={1}
              className={cn(
                "flex-1 bg-transparent text-off-white font-sans text-base resize-none",
                "placeholder:text-neutral-600 focus:outline-none",
                "disabled:opacity-50 max-h-[150px]"
              )}
              style={{ caretColor: '#39ff14' }}
            />

            {/* Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!query.trim() || isLoading}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                query.trim() && !isLoading
                  ? "bg-slime text-black hover:bg-slime/90 shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                  : "text-neutral-600 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between mt-2 px-2 text-[10px] font-mono text-neutral-600">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                isLoading 
                  ? "bg-amber animate-pulse" 
                  : "bg-slime shadow-[0_0_5px_#39ff14]"
              )} />
              <span>{isLoading ? "SYNTHESIZING" : "READY"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{activeCount} NEURONS</span>
              <span className="hidden md:inline">• ENTER to submit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
