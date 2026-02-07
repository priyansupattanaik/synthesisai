'use client';

import { motion } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { COUNCIL_MODELS } from '@/lib/models';

export default function ArgumentThreads() {
  const { deliberation } = useCouncilStore();
  
  if (!deliberation) return null;

  // Calculate positions for threads
  const radius = 280;
  const getPosition = (index: number) => {
    const angle = (index * 360) / COUNCIL_MODELS.length - 90;
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  // Find agreements and disagreements based on review scores
  const threads: { from: number; to: number; type: 'agreement' | 'conflict'; strength: number }[] = [];
  
  deliberation.reviews.forEach(review => {
    const fromIndex = COUNCIL_MODELS.findIndex(m => m.id === review.reviewerId);
    const toIndex = COUNCIL_MODELS.findIndex(m => m.id === review.targetId);
    
    if (fromIndex !== -1 && toIndex !== -1) {
      const type = review.score >= 7 ? 'agreement' : review.score <= 4 ? 'conflict' : null;
      if (type) {
        threads.push({
          from: fromIndex,
          to: toIndex,
          type,
          strength: review.score / 10,
        });
      }
    }
  });

  // Limit threads to avoid clutter
  const visibleThreads = threads.slice(0, 12);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="agreement-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#00ff88" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="conflict-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff3366" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#ff3366" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff3366" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      
      {visibleThreads.map((thread, i) => {
        const from = getPosition(thread.from);
        const to = getPosition(thread.to);
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        
        // Curved path
        const controlX = midX * 0.3; // Curve toward center
        const controlY = midY * 0.3;
        
        const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
        
        return (
          <motion.path
            key={`${thread.from}-${thread.to}-${i}`}
            d={path}
            fill="none"
            stroke={thread.type === 'agreement' ? 'url(#agreement-gradient)' : 'url(#conflict-gradient)'}
            strokeWidth={2 * thread.strength}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
          />
        );
      })}
    </svg>
  );
}