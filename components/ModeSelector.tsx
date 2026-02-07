'use client';

import { motion } from 'framer-motion';
import { Zap, Brain, Cpu } from 'lucide-react';

interface ModeSelectorProps {
  selected: 'fast' | 'full' | 'auto';
  onSelect: (mode: 'fast' | 'full' | 'auto') => void;
}

const modes = [
  { id: 'fast' as const, label: 'Fast', icon: Zap, desc: 'Single model' },
  { id: 'auto' as const, label: 'Auto', icon: Brain, desc: 'Smart select' },
  { id: 'full' as const, label: 'Full', icon: Cpu, desc: 'Full council' },
];

export default function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = selected === mode.id;
        
        return (
          <motion.button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="mode-highlight"
                className="absolute inset-0 bg-white/10 rounded-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10 font-medium">{mode.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}