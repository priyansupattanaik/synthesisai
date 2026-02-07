'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function useOrganicSound() {
  const audioContext = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize Audio Context on user interaction (handled by browser policy)
    const initAudio = () => {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGain.current = audioContext.current.createGain();
        masterGain.current.gain.value = 0.3; // Global volume
        masterGain.current.connect(audioContext.current.destination);
      }
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }
    };

    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    
    return () => {
       audioContext.current?.close();
    };
  }, []);

  // 1. Node Activation: Sine Wave Slide (440Hz -> 880Hz)
  const playActivation = useCallback(() => {
    if (!audioContext.current || !masterGain.current) return;
    const ctx = audioContext.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(masterGain.current);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  // 2. Chairman Election: Major Triad (A Major)
  const playConsensus = useCallback(() => {
    if (!audioContext.current || !masterGain.current) return;
    const ctx = audioContext.current;
    
    const freqs = [440, 554.37, 659.25]; // A4, C#5, E5
    
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle'; // Softer, fuller sound
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5); // Long sustain
      
      osc.connect(gain);
      gain.connect(masterGain.current!);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    });
  }, []);

  // 3. Error/Wilt: Square Wave Staccato
  const playError = useCallback(() => {
    if (!audioContext.current || !masterGain.current) return;
    const ctx = audioContext.current;
    
    const now = ctx.currentTime;
    [0, 0.15, 0.3].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now + delay);
        
        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);
        
        osc.connect(gain);
        gain.connect(masterGain.current!);
        
        osc.start(now + delay);
        osc.stop(now + delay + 0.1);
    });
  }, []);

  // 4. Thread Pulse: Filtered Noise (Airy swoosh)
  const playPulse = useCallback(() => {
    if (!audioContext.current || !masterGain.current) return;
    const ctx = audioContext.current;
    
    const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // White noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2); // Sweep up
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain.current);
    
    noise.start();
  }, []);

  return { playActivation, playConsensus, playError, playPulse };
}