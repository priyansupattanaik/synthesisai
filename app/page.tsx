'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import SynapticStream from '@/components/SynapticStream';
import NeuralInput from '@/components/NeuralInput';
import SoundManager from '@/components/SoundManager';
import useOrganicSound from '@/hooks/useOrganicSound';
import { useCouncilStore } from '@/store/councilStore';

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
    <main className="h-screen flex flex-col bg-[#030305] overflow-hidden">
      {/* Sound Manager (Background) */}
      <SoundManager />
      
      {/* Minimal Header */}
      <Header />

      {/* Main Content - Scrollable Chat Stream */}
      <div className="flex-1 flex flex-col pt-14 overflow-hidden">
        <SynapticStream />
      </div>

      {/* Sticky Input Bar */}
      <NeuralInput />
    </main>
  );
}