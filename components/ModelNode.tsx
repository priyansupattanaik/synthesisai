'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CouncilMemberState } from '@/lib/types';
import { ModelConfig } from '@/lib/models';
import { MODEL_ICONS } from '@/components/icons';
import { cn } from '@/lib/utils';

interface ModelNodeProps {
  model: ModelConfig;
  member?: CouncilMemberState;
  angle: number;
  radius: number;
  isChairman?: boolean;
  isActive: boolean;
  onClick: () => void;
  onHover: (isHovering: boolean) => void;
}

export default function ModelNode({ 
  model, 
  member, 
  angle, 
  radius, 
  isChairman,
  isActive, 
  onClick,
  onHover
}: ModelNodeProps) {
  // Calculate position
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  const status = member?.status || 'idle';
  const isError = status === 'error';
  const isProcessing = status === 'thinking' || status === 'speaking';

  // --- ORGANIC SHAPE GENERATION ---
  // Each specialty gets a unique biological "fingerprint" path
  const nodeShape = useMemo(() => {
    switch (model.specialty) {
      case 'reasoning': // Crystalline/Angular
        return "M24 4 L44 14 L40 36 L24 44 L8 36 L4 14 Z"; 
      case 'fast': // Streamlined/Aerodynamic
        return "M24 2 C36 2 46 12 46 24 C46 42 24 46 24 46 C24 46 2 42 2 24 C2 12 12 2 24 2 Z";
      case 'multimodal': // Compound/Lobed
        return "M24 8 C30 8 34 12 34 16 C34 12 38 8 42 8 C45 8 47 11 47 14 C47 20 38 24 38 24 C38 24 46 30 46 36 C46 42 40 46 34 46 C30 46 28 44 26 42 C24 44 20 46 16 46 C8 46 4 40 4 34 C4 28 12 24 12 24 C12 24 4 18 4 12 C4 8 8 4 12 4 C16 4 20 8 20 12 C20 10 22 8 24 8 Z";
      case 'long-context': // Tendril/Starfish
        return "M24 0 L29 18 L48 18 L32 28 L38 48 L24 36 L10 48 L16 28 L0 18 L19 18 Z";
      case 'agentic': // Modular/Connected
        return "M12 12 H36 V36 H12 Z M24 2 L24 12 M24 36 L24 46 M2 24 L12 24 M36 24 L46 24";
      case 'coding': // Structured/Circuit
        return "M8 8 H40 V40 H8 Z M16 16 H32 V32 H16 Z";
      default: // Generic Blob
        return "M24 2 C36 2 46 12 46 24 C46 36 36 46 24 46 C12 46 2 36 2 24 C2 12 12 2 24 2 Z";
    }
  }, [model.specialty]);

  return (
    <motion.div
      className="absolute flex items-center justify-center cursor-node group"
      style={{ x, y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isChairman ? 1.3 : isActive ? 1 : 0.9, 
        opacity: isActive ? 1 : 0.4 
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* 1. ACTIVATION RING (The Halo) */}
      <motion.div
        className="absolute inset-[-12px] rounded-full opacity-0"
        animate={{ 
          opacity: isChairman ? 0.5 : (isProcessing ? 0.3 : 0),
          scale: isProcessing ? [1, 1.2, 1] : 1
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ 
          background: `radial-gradient(circle, ${model.color} 0%, transparent 70%)` 
        }}
      />

      {/* 2. THE SPORE SYSTEM (Data Ports) */}
      {/* Tiny particles that orbit the node when it's working */}
      {(isProcessing || isChairman) && (
        <div className="absolute inset-[-20px] pointer-events-none animate-spin [animation-duration:4s]">
           {[...Array(isChairman ? 6 : 3)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 rounded-full bg-white"
               style={{ 
                 top: 0, 
                 left: '50%', 
                 transformOrigin: '0 44px', // Orbit radius
                 transform: `rotate(${i * (360 / (isChairman ? 6 : 3))}deg)` 
               }}
               animate={{ opacity: [0.2, 1, 0.2] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
             />
           ))}
        </div>
      )}

      {/* 3. THE ORGANIC CORE (SVG) */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            {/* Filter definition for "Inner Structure" texture */}
            <defs>
                <filter id={`noise-${model.id}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.4" /> {/* Low opacity noise */}
                    </feComponentTransfer>
                    <feComposite operator="in" in2="SourceGraphic" />
                </filter>
                <filter id="glow-blur">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            {/* Main Cell Membrane */}
            <motion.path
                d={nodeShape}
                fill={isActive ? '#0a0b0f' : '#1a1b1f'} // Deep space or Ash
                stroke={isError ? '#ef4444' : model.color}
                strokeWidth={isChairman ? 2 : 1.5}
                filter={isActive ? `url(#noise-${model.id})` : undefined}
                // The "Breathing" animation
                animate={{ 
                    scale: isActive ? [1, 1.05, 1] : 1,
                    // Subtle noise morphing if we were using a more complex path setup, 
                    // for now simpler breathing scale is more performant
                }}
                transition={{ 
                    duration: isProcessing ? 0.5 : 4, // Fast jitter or slow breath
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </svg>

        {/* Chairman Badge (Organic) */}
        {isChairman && (
             <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-6 text-amber drop-shadow-[0_0_5px_rgba(255,190,11,0.5)]"
             >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
             </motion.div>
        )}

        {/* Model Icon Overlay */}
        {MODEL_ICONS[model.id] && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-black/60">
              <Image 
                src={MODEL_ICONS[model.id]} 
                alt={model.displayName}
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. HOVER LABEL (Floating) */}
      <div className={cn(
        "absolute top-full mt-4 transition-all duration-300 pointer-events-none z-50 flex flex-col items-center",
        "opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
      )}>
         <span className="text-[10px] font-mono tracking-widest uppercase bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 whitespace-nowrap text-off-white">
            {model.displayName}
         </span>
         
         {/* Status Text */}
         {isActive && (
             <span className="text-[9px] font-mono text-neutral-400 mt-1 uppercase">
                 {isError ? 'SIGNAL LOST' : status === 'idle' ? 'STANDBY' : status}
             </span>
         )}
      </div>
    </motion.div>
  );
}