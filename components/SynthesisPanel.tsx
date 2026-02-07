'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { Crown, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function SynthesisPanel() {
  const { deliberation, isLoading } = useCouncilStore();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!deliberation && !isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-30"
      >
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b border-white/5 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-3">
              {deliberation?.chairman ? (
                <>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${deliberation.chairman.color}30` }}
                  >
                    <Crown className="w-4 h-4" style={{ color: deliberation.chairman.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Chairman {deliberation.chairman.displayName}
                    </p>
                    <p className="text-xs text-gray-400">
                      Score: {deliberation.chairman.averageScore}/10 • {deliberation.chairman.specialty}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-4 h-4" />
                  </motion.div>
                  <span className="text-sm">Deliberating...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {deliberation && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>{deliberation.responses.filter(r => !r.error).length}/8</span>
                  <span className="mx-1">•</span>
                  <Clock className="w-3 h-3" />
                  <span>{(deliberation.duration / 1000).toFixed(1)}s</span>
                </div>
              )}
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 max-h-64 overflow-y-auto">
                  {isLoading && !deliberation?.finalSynthesis ? (
                    <div className="space-y-2">
                      <motion.div
                        className="h-4 bg-white/5 rounded"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="h-4 bg-white/5 rounded w-3/4"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="h-4 bg-white/5 rounded w-1/2"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="prose prose-invert prose-sm max-w-none"
                    >
                      <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {deliberation?.finalSynthesis || 'Awaiting synthesis...'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer stats */}
          {deliberation && (
            <div className="px-4 py-2 bg-white/5 flex items-center justify-between text-[10px] text-gray-500">
              <span>Rotating Meritocracy System</span>
              <span>{new Date(deliberation.timestamp).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}