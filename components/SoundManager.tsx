'use client';

import { useEffect, useRef } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import useOrganicSound from '@/hooks/useOrganicSound';

export default function SoundManager() {
  const { deliberation, members, error } = useCouncilStore();
  const { playActivation, playConsensus, playError } = useOrganicSound();
  
  const prevStatusRef = useRef<string>('idle');
  const prevChairmanRef = useRef<string | null>(null);

  // Monitor Global Error
  useEffect(() => {
    if (error) playError();
  }, [error, playError]);

  // Monitor Deliberation Completion (Consensus)
  useEffect(() => {
    if (deliberation?.chairman && deliberation.chairman.modelId !== prevChairmanRef.current) {
        playConsensus();
        prevChairmanRef.current = deliberation.chairman.modelId;
    }
  }, [deliberation, playConsensus]);

  // Monitor Member Activity (Approximation for simplicity)
  // In a real app, you might subscribe to specific member state changes
  useEffect(() => {
     const isThinking = members.some(m => m.status === 'thinking');
     if (isThinking && prevStatusRef.current !== 'thinking') {
         playActivation(); // Start of thought
     }
     prevStatusRef.current = isThinking ? 'thinking' : 'idle';
  }, [members, playActivation]);

  return null; // Invisible component
}