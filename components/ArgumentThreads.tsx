'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { COUNCIL_MODELS } from '@/lib/models';

interface ArgumentThreadsProps {
  rotation: number; // The current rotation of the council from CouncilRing
  radius: number;
}

export default function ArgumentThreads({ rotation, radius }: ArgumentThreadsProps) {
  const { deliberation, activeModelIds } = useCouncilStore();

  // 1. Calculate the exact position of every model based on current rotation
  const modelPositions = useMemo(() => {
    // We must match the CouncilRing logic: 
    // angle = (index * 360 / count) - 90 + rotation
    const activeModels = COUNCIL_MODELS; // We use all models for indexing, but filter for drawing
    
    return activeModels.reduce((acc, model, index) => {
      // Calculate base angle + current rotation
      const angle = ((index * 360) / activeModels.length - 90 + rotation) * (Math.PI / 180);
      acc[model.id] = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>);
  }, [rotation, radius]);

  if (!deliberation || !deliberation.reviews) return null;

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
      style={{ zIndex: 0 }}
    >
      <defs>
        {/* Organic Gradients for Threads */}
        <linearGradient id="grad-agreement" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#39ff14" stopOpacity="0" />
          <stop offset="50%" stopColor="#39ff14" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#39ff14" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="grad-conflict" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff006e" stopOpacity="0" />
          <stop offset="50%" stopColor="#ff006e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff006e" stopOpacity="0" />
        </linearGradient>
      </defs>

      {deliberation.reviews.map((review, i) => {
        // Skip if involved models are inactive
        if (!activeModelIds.includes(review.reviewerId) || !activeModelIds.includes(review.targetId)) {
          return null;
        }

        const start = modelPositions[review.reviewerId];
        const end = modelPositions[review.targetId];

        if (!start || !end) return null;

        // Score Logic: High (>7) = Green/Agreement, Low (<5) = Red/Conflict
        const isAgreement = review.score >= 7;
        const isConflict = review.score <= 5;
        
        // Filter: Only draw significant threads to prevent visual noise
        if (!isAgreement && !isConflict) return null;

        const strokeColor = isAgreement ? 'url(#grad-agreement)' : 'url(#grad-conflict)';
        const pulseColor = isAgreement ? '#39ff14' : '#ff006e';

        // --- ORGANIC CURVE CALCULATION ---
        // Instead of straight lines, we pull the curve towards the center (0,0)
        // This creates a "gravity" effect where thoughts pass through the Void
        const centerPull = 0.3; // How much the center attracts the line
        const controlX = (start.x + end.x) / 2 * centerPull;
        const controlY = (start.y + end.y) / 2 * centerPull;

        return (
          <g key={`${review.reviewerId}-${review.targetId}-${i}`} className="mix-blend-screen">
            {/* The Thread */}
            <motion.path
              d={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
            />

            {/* The Synaptic Pulse (Data Packet) */}
            <circle r="2" fill={pulseColor} filter="url(#glow-blur)">
                <animateMotion 
                    dur={`${3 + (i % 3) * 0.5}s`} // Deterministic for hydration safety
                    repeatCount="indefinite"
                    // Follow the same path
                    path={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}