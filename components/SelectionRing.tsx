'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

interface SelectionRingProps {
  radius: number;
  onRotationChange: (degrees: number) => void;
}

export default function SelectionRing({ radius, onRotationChange }: SelectionRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // We use 0-360 for rotation
  const rotation = useMotionValue(0);

  // Handle the drag to rotate logic
  const handlePan = (_: unknown, info: { delta: { x: number; y: number } }) => {
    // Simple conversion: x movement = rotation degrees
    // In a real 3D interface this would use atan2, but for this 2D ring, 
    // dragging horizontal slides the ring (rotates it)
    const delta = info.delta.x * 0.5; // Sensitivity
    const current = rotation.get();
    const newRotation = current + delta;
    
    rotation.set(newRotation);
    onRotationChange(newRotation);
  };

  return (
    <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 5 }}
    >
        {/* The Interactive Ring Zone */}
        {/* This is an invisible hit area that becomes visible on hover/drag */}
        <motion.div
            ref={containerRef}
            className="rounded-full cursor-grab active:cursor-grabbing pointer-events-auto touch-none"
            style={{
                width: radius * 2.4, // Slightly larger than node circle
                height: radius * 2.4,
                border: '1px solid rgba(57, 255, 20, 0)', // Invisible by default
            }}
            animate={{
                borderColor: isHovered || isDragging ? 'rgba(57, 255, 20, 0.2)' : 'rgba(57, 255, 20, 0)',
                scale: isDragging ? 0.98 : 1,
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onPanStart={() => setIsDragging(true)}
            onPan={handlePan}
            onPanEnd={() => setIsDragging(false)}
        >
            {/* Visual Tick Marks for rotation reference */}
            <motion.div 
                className="w-full h-full rounded-full relative"
                style={{ rotate: rotation }}
            >
                {/* Generate 12 tick marks */}
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute top-0 left-1/2 w-[1px] h-[8px] -translate-x-1/2 bg-slime/30 origin-bottom"
                        style={{ 
                            transformOrigin: `50% ${radius * 1.2}px`,
                            transform: `rotate(${i * 30}deg)` 
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>

        {/* Helper Text (Only appears when hovering ring edge) */}
        {isHovered && !isDragging && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-[10%] text-[9px] font-mono text-slime/50 tracking-[0.2em] uppercase pointer-events-none"
            >
                Drag to Rotate Council
            </motion.div>
        )}
    </div>
  );
}