'use client';

import { motion } from 'framer-motion';
import { COUNCIL_MODELS } from '@/lib/models';
import { CouncilMemberState } from '@/lib/types';
import { useState } from 'react';
import { Cpu, Crown } from 'lucide-react';
import Image from 'next/image';
import { MODEL_ICONS } from '@/components/icons';

interface ModelOrbProps {
  model: typeof COUNCIL_MODELS[0];
  member?: CouncilMemberState;
  angle: number;
  radius: number;
  isChairman: boolean;
}



export default function ModelOrb({ model, member, angle, radius, isChairman }: ModelOrbProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ModelIcon = MODEL_ICONS[model.id];
  
  // Calculate position on ring
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;
  
  const status = member?.status || 'idle';
  const progress = member?.progress || 0;
  
  return (
    <motion.div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        x: x,
        y: y,
        translateX: '-50%',
        translateY: '-50%',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isChairman ? 1.2 : 1,
        opacity: 1,
        y: isChairman ? y - 20 : y, // Elevate chairman
      }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: model.ringPosition * 0.1 
      }}
    >
      {/* Chairman Crown */}
      {isChairman && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: -35 }}
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Crown className="w-6 h-6 text-yellow-400" />
        </motion.div>
      )}

      {/* Orb Container */}
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ backgroundColor: model.color }}
          animate={{
            opacity: status === 'thinking' ? [0.3, 0.6, 0.3] : status === 'speaking' ? 0.8 : 0.2,
            scale: status === 'thinking' ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 2, repeat: status === 'thinking' ? Infinity : 0 }}
        />

        {/* Main Orb */}
        <motion.div
          className="relative w-16 h-16 rounded-full flex items-center justify-center border-2"
          style={{
            backgroundColor: `${model.color}20`,
            borderColor: isChairman ? '#ffd700' : status === 'error' ? '#ff3366' : model.color,
            boxShadow: isChairman 
              ? `0 0 30px #ffd700, 0 0 60px ${model.color}` 
              : `0 0 20px ${model.color}40`,
          }}
          animate={{
            boxShadow: status === 'thinking' 
              ? [`0 0 20px ${model.color}40`, `0 0 40px ${model.color}80`, `0 0 20px ${model.color}40`]
              : undefined,
          }}
        >
          {/* Progress Ring */}
          {status === 'thinking' && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke={model.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={188.5}
                animate={{ strokeDashoffset: 188.5 - (188.5 * progress) / 100 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          )}

          {/* Icon */}
          {/* Icon */}
          {ModelIcon ? (
            <div className="relative z-10 w-8 h-8 rounded-full overflow-hidden">
               <Image 
                 src={ModelIcon} 
                 alt={model.displayName}
                 fill
                 className="object-cover"
               />
            </div>
          ) : (
            <Cpu className="w-6 h-6 text-white relative z-10" />
          )}
          
          {/* Status Indicator */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0f]"
            style={{ backgroundColor: status === 'chairman' ? '#ffd700' : status === 'error' ? '#ff3366' : '#00ff88' }}
            animate={{ scale: status === 'speaking' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5, repeat: status === 'speaking' ? Infinity : 0 }}
          />
        </motion.div>

        {/* Label */}
        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isHovered || status !== 'idle' ? 1 : 0.7, y: 0 }}
        >
          <p className="text-xs font-medium text-white text-center">{model.displayName}</p>
          <p className="text-[10px] text-gray-400 text-center capitalize">{model.specialty}</p>
        </motion.div>
      </motion.div>

      {/* Expanded Info on Hover */}
      <AnimatePresence>
        {isHovered && member?.response && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-12 w-64 p-3 rounded-lg glass-panel z-50"
          >
            <p className="text-xs text-gray-300 line-clamp-4">{member.response.slice(0, 200)}...</p>
            {member.confidence && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${member.confidence}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{Math.round(member.confidence)}%</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Need AnimatePresence import
import { AnimatePresence } from 'framer-motion';