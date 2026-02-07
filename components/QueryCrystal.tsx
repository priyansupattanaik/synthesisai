'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface QueryCrystalProps {
  query: string;
  isActive: boolean;
}

export default function QueryCrystal({ query, isActive }: QueryCrystalProps) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Outer Glow Rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.5, 0.8, 0.5] : 0.3,
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Main Crystal */}
      <motion.div
        className="relative w-32 h-32 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,100,255,0.1) 100%)',
          border: '2px solid rgba(0,212,255,0.5)',
          boxShadow: '0 0 40px rgba(0,212,255,0.3), inset 0 0 40px rgba(0,212,255,0.1)',
        }}
        animate={{
          boxShadow: isActive 
            ? [
                '0 0 40px rgba(0,212,255,0.3), inset 0 0 40px rgba(0,212,255,0.1)',
                '0 0 80px rgba(0,212,255,0.6), inset 0 0 60px rgba(0,212,255,0.2)',
                '0 0 40px rgba(0,212,255,0.3), inset 0 0 40px rgba(0,212,255,0.1)',
              ]
            : '0 0 40px rgba(0,212,255,0.3), inset 0 0 40px rgba(0,212,255,0.1)',
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Inner rotating core */}
        <motion.div
          className="absolute inset-4 rounded-full border border-cyan-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center p-4">
          {query ? (
            <motion.p 
              className="text-xs text-cyan-100 line-clamp-3 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={query}
            >
              {query}
            </motion.p>
          ) : (
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
          )}
        </div>

        {/* Floating particles */}
        {isActive && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 60,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Query label */}
      {query && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-cyan-400/60 whitespace-nowrap"
        >
          Council Query
        </motion.p>
      )}
    </motion.div>
  );
}