'use client';

import { motion } from 'framer-motion';
import { COUNCIL_MODELS } from '@/lib/models';

export function CouncilSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[600px] h-[600px]">
        {COUNCIL_MODELS.map((model, i) => {
          const angle = (i * 360) / COUNCIL_MODELS.length - 90;
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * 250;
          const y = Math.sin(radian) * 250;
          
          return (
            <motion.div
              key={model.id}
              className="absolute left-1/2 top-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5"
              style={{ x, y }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          );
        })}
        
        {/* Center pulse */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-cyan-500/30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/5 w-fit">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-cyan-400"
          animate={{
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}