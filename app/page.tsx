'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import SynapticStream from '@/components/SynapticStream';
import ChatInput from '@/components/ChatInput';
import SoundManager from '@/components/SoundManager';
import useOrganicSound from '@/hooks/useOrganicSound';
import { useCouncilStore } from '@/store/councilStore';
import { ShaderAnimation } from '@/components/ui/shader-lines';

export default function Home() {
  const { playConsensus } = useOrganicSound();
  const { deliberation, isLoading } = useCouncilStore();

  // Play consensus sound when deliberation completes
  useEffect(() => {
    if (deliberation && !isLoading && deliberation.status === 'complete') {
      playConsensus();
    }
  }, [deliberation, isLoading, playConsensus]);

  return (
    <main className="h-[100dvh] flex flex-col overflow-hidden relative">
      {/* Shader Background */}
      <ShaderAnimation />
      
      {/* Sound Manager (Background) */}
      <SoundManager />
      
      {/* Minimal Header */}
      <Header />

      {/* Main Content - Scrollable Chat Stream */}
      <div className="flex-1 flex flex-col pt-14 overflow-hidden relative z-10">
        <SynapticStream />
      </div>

      {/* Sticky Input Bar */}
      <ChatInput />
    </main>
  );
}