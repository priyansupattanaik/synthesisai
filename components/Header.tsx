'use client';

import React from 'react';
import Image from 'next/image';
import { Github } from 'lucide-react';
import { SynthesisLogo } from './icons';
import { useCouncilStore } from '@/store/councilStore';
import { cn } from '@/lib/utils';

export function Header() {
  const { isLoading, activeModelIds } = useCouncilStore();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#030305]/90 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-6">
      
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black/50">
          <Image 
            src={SynthesisLogo} 
            alt="Synthesis AI Logo" 
            width={36} 
            height={36}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-widest text-white uppercase">
            Synthesis<span className="text-neutral-500">.AI</span>
          </h1>
          <span className="text-[9px] text-neutral-600 font-mono tracking-wider hidden md:block">
            NEURAL CHAT v3.0
          </span>
        </div>
      </div>

      {/* Center - Status */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full transition-all",
          isLoading 
            ? "bg-amber animate-pulse shadow-[0_0_5px_#ffbe0b]" 
            : "bg-slime shadow-[0_0_5px_#39ff14]"
        )} />
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
          {isLoading ? "DELIBERATING" : `${activeModelIds.length} NEURONS`}
        </span>
      </div>

      {/* Right - GitHub Link */}
      <div className="flex items-center gap-4">
        <a 
          href="https://github.com/priyansupattanaik/synthesisai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-neutral-500 hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
}

export default Header;