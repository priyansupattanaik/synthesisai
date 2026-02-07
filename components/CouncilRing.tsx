'use client';

import { motion } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { COUNCIL_MODELS } from '@/lib/models';
import ModelOrb from './ModelOrb';
import ArgumentThreads from './ArgumentThreads';

export default function CouncilRing() {
  const { members, deliberation, isLoading } = useCouncilStore();
  
  const radius = 280; // Distance from center


  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Outer Ring Glow */}
      <motion.div
        className="absolute rounded-full border border-white/5"
        style={{
          width: radius * 2 + 60,
          height: radius * 2 + 60,
        }}
        animate={{
          boxShadow: isLoading 
            ? ['0 0 20px rgba(0,212,255,0.1)', '0 0 40px rgba(0,212,255,0.2)', '0 0 20px rgba(0,212,255,0.1)']
            : '0 0 20px rgba(0,212,255,0.05)',
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Main Ring */}
      <div 
        className="absolute rounded-full border-2 border-white/10 bg-gradient-to-b from-white/5 to-transparent"
        style={{
          width: radius * 2,
          height: radius * 2,
        }}
      >
        {/* Ring Segments */}
        {COUNCIL_MODELS.map((model, index) => {
          const angle = (index * 360) / COUNCIL_MODELS.length - 90; // Start from top


          return (
            <ModelOrb
              key={model.id}
              model={model}
              member={members.find(m => m.modelId === model.id)}
              angle={angle}
              radius={radius}
              isChairman={deliberation?.chairman?.modelId === model.id}
            />
          );
        })}
      </div>

      {/* Argument Threads */}
      {deliberation && <ArgumentThreads />}
    </div>
  );
}