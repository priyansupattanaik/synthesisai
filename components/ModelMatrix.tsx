'use client';

import { motion } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { COUNCIL_MODELS } from '@/lib/models';
import Image from 'next/image';
import { MODEL_ICONS } from '@/components/icons';
import { Cpu } from 'lucide-react';

export default function ModelMatrix() {
  const { activeModelIds, toggleActiveModel } = useCouncilStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
      {COUNCIL_MODELS.map((model) => {
        const isActive = activeModelIds.includes(model.id);
        const ModelIcon = MODEL_ICONS[model.id];

        return (
          <motion.button
            key={model.id}
            onClick={() => toggleActiveModel(model.id)}
            className={`relative group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
              isActive 
                ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(0,150,255,0.1)]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection Indicator */}
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full transition-colors duration-300 ${
              isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-white/10'
            }`} />

            {/* Icon */}
            <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 ${
              isActive ? 'grayscale-0' : 'grayscale opacity-60'
            }`}>
               {ModelIcon ? (
                 <Image
                   src={ModelIcon}
                   alt={model.displayName}
                   fill
                   className="object-cover"
                 />
               ) : (
                 <Cpu className="w-6 h-6 text-white" />
               )}
            </div>

            {/* Info */}
            <div className="flex flex-col items-start text-left">
              <span className={`text-xs font-medium transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}>
                {model.displayName}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                {model.provider}
              </span>
            </div>
            
            {/* Active Glow Effect */}
            {isActive && (
              <motion.div
                layoutId="active-glow"
                className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/5 -z-10"
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
