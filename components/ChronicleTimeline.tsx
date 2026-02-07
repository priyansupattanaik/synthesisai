'use client';

import React, { useRef, useState } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChronicleTimeline() {
  const { history, loadFromHistory } = useCouncilStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Handle Scrubbing (Click + Drag)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // Only if mouse is down
    handleInteraction(e.clientX);
  };

  const handleInteraction = (clientX: number) => {
    if (!containerRef.current || history.length === 0) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    
    // Find index based on percentage
    const index = Math.min(
        history.length - 1, 
        Math.floor(percent * history.length)
    );
    
    setHoveredIndex(index);
    // Note: We don't auto-load on scrub to avoid layout thrashing, 
    // but visual feedback is immediate.
  };

  const handleCommit = () => {
      if (hoveredIndex !== null && history[hoveredIndex]) {
          loadFromHistory(history[hoveredIndex].timestamp);
      }
  };

  return (
    <div 
        className="fixed bottom-0 left-0 right-0 h-[40px] hover:h-[80px] transition-all duration-300 bg-deep-space/80 backdrop-blur-md border-t border-white/5 z-50 flex flex-col justify-end group"
        onMouseLeave={() => setHoveredIndex(null)}
    >
      
      {/* Label / Scrubber Info */}
      <div className="absolute top-2 left-4 flex items-center gap-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest pointer-events-none">
        <span>Temporal Fingerprint</span>
        <AnimatePresence>
            {hoveredIndex !== null && history[hoveredIndex] && (
                <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-white"
                >
                    :: {new Date(history[hoveredIndex].timestamp).toLocaleTimeString()} :: {history[hoveredIndex].query.substring(0, 30)}...
                </motion.span>
            )}
        </AnimatePresence>
      </div>

      {/* The Timeline Container */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-end px-4 gap-[2px] cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => handleInteraction(e.clientX)}
        onMouseUp={handleCommit}
      >
         {history.map((entry, index) => {
             // Duration-based height removed (was unused)
             const color = entry.chairman?.color || '#333';
             const isHovered = hoveredIndex === index;
             
             return (
                 <motion.div
                    key={entry.timestamp}
                    className="flex-1 min-w-[2px] rounded-t-sm transition-colors duration-75 relative"
                    style={{ 
                        backgroundColor: isHovered ? '#fff' : color,
                        height: isHovered ? '60%' : '30%',
                        opacity: isHovered ? 1 : 0.6 
                    }}
                    animate={{ height: isHovered ? '70%' : '30%' }}
                 >
                    {/* Active Indicator Line */}
                    {isHovered && (
                        <div className="absolute bottom-0 left-1/2 w-[1px] h-[200px] bg-white/20 -translate-x-1/2 pointer-events-none" />
                    )}
                 </motion.div>
             );
         })}
         
         {history.length === 0 && (
             <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-neutral-700 opacity-50">
                 [NO TEMPORAL DATA RECORDED]
             </div>
         )}
      </div>
    </div>
  );
}