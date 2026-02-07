'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { Send, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { APP_LOGO } from '@/components/icons';
import ErrorBoundary from '@/components/ErrorBoundary';
import CouncilRing from '@/components/CouncilRing';
import QueryCrystal from '@/components/QueryCrystal';
import SynthesisPanel from '@/components/SynthesisPanel';
import ModeSelector from '@/components/ModeSelector';
import ChronicleTimeline from '@/components/ChronicleTimeline';
import { CouncilSkeleton } from '@/components/LoadingStates';

function DelphiChamber() {
  const [query, setQuery] = useState('');
  const { 
    deliberation, 
    isLoading, 
    error, 
    selectedMode, 
    setMode, 
    startDeliberation, 
    reset 
  } = useCouncilStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    await startDeliberation(query);
  };

  return (
    <main className="min-h-screen bg-[#050508] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image 
              src={APP_LOGO} 
              alt="Synthesis Logo" 
              width={24} 
              height={24} 
              className="w-8 h-8 object-contain"
            />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SYNTHESIS</h1>
            <p className="text-xs text-gray-400">Delphi Chamber v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ModeSelector selected={selectedMode} onSelect={setMode} />
          {deliberation && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-cyan-500/30 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Council</span>
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
        
        {/* Query Input */}
        <AnimatePresence mode="wait">
          {!deliberation && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              className="w-full max-w-2xl mb-8"
            >
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative glass-panel rounded-2xl p-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pose your question to the council..."
                    className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-white placeholder-gray-500 text-lg"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </form>
              
              {selectedMode === 'auto' && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-gray-500 mt-4"
                >
                  Auto-mode uses fast path for simple queries, full council for complex ones
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Council Visualization */}
        <div className="relative w-full max-w-5xl aspect-square max-h-[700px]">
          <AnimatePresence mode="wait">
            {isLoading && !deliberation ? (
              <CouncilSkeleton />
            ) : (
              <>
                <CouncilRing />
                <QueryCrystal 
                  query={deliberation?.query || query} 
                  isActive={isLoading || !!deliberation} 
                />
              </>
            )}
          </AnimatePresence>
          
          <SynthesisPanel />
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm max-w-md text-center"
            >
              <p className="font-medium mb-1">Council Disruption</p>
              <p className="text-red-300/80 text-xs">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chronicle Timeline */}
      <ChronicleTimeline />
    </main>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <DelphiChamber />
    </ErrorBoundary>
  );
}