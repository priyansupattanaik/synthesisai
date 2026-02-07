'use client';

import { useCouncilStore } from '@/store/councilStore';
import { Header } from '@/components/Header';
import { QueryInput } from '@/components/QueryInput';
import { CouncilList } from '@/components/CouncilList';
import { SynthesisPanel } from '@/components/SynthesisPanel';
import { Chronicle } from '@/components/Chronicle';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useEffect, useState } from 'react';

function SynthesisApp() {
  const { 
    deliberation, 
    members, 
    isLoading, 
    error, 
    startDeliberation, 
    history,
    loadFromHistory
  } = useCouncilStore();

  const [mobileMode, setMobileMode] = useState<'deliberation' | 'synthesis'>('deliberation');

  const handleSubmit = async (query: string) => {
    await startDeliberation(query);
    setMobileMode('deliberation'); // Switch back to see cards
  };

  // Auto-switch to synthesis on mobile when complete
  useEffect(() => {
    if (deliberation?.status === 'complete' && !isLoading) {
        // Optional: Auto switch e.g. setMobileMode('synthesis');
    }
  }, [deliberation, isLoading]);

  return (
    <main className="fixed inset-0 bg-background text-foreground flex flex-col font-mono overflow-hidden">
      {/* Custom Grid / Scanlines Overlay (Optional aesthetic touch, kept minimal) */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-5" 
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
      />

      <Header 
        toggleMode={() => setMobileMode(prev => prev === 'deliberation' ? 'synthesis' : 'deliberation')}
        currentMode={mobileMode}
      />

      {/* Main Layout Grid */}
      <div className="flex-1 flex overflow-hidden relative pt-12">
        
        {/* COL 1: HISTORY (Desktop: Left 20% | Tablet: Left 30%? Mobile: Hidden) */}
        <div className="hidden md:flex flex-col w-[30%] lg:w-[20%] border-r border-neutral-800 h-full bg-background z-10 transition-all">
           <Chronicle 
             history={history}
             onSelect={(timestamp) => loadFromHistory(timestamp)}
           />
        </div>

        {/* COL 2: COUNCIL / MAIN (Desktop: 50% | Tablet: 70% | Mobile: 100%) */}
        <div className="flex-1 flex flex-col h-full relative min-w-0 z-10">
            
            {/* Mobile Switcher View */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Mobile: Show Council List OR Synthesis based on mode */}
                <div className={`flex-1 flex flex-col h-full w-full absolute inset-0 transition-transform duration-300 md:relative md:transform-none ${mobileMode === 'synthesis' ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                    
                    {/* Desktop/Tablet: Always show Council here */}
                    {/* Mobile: This is the 'deliberation' slide */}
                    
                    {/* Council List Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
                        {/* Mobile Synthesis Header (Sticky when ready) */}
                        {deliberation && (
                            <div className="md:hidden sticky top-0 z-20 bg-surface border-b border-neutral-800 p-2 flex justify-between items-center px-4 cursor-pointer" onClick={() => setMobileMode('synthesis')}>
                                <span className="text-xs-meta font-bold text-highlight">CHAIRMAN PENDING</span>
                                <span className="text-xs-meta text-neutral-400">TAP TO VIEW</span>
                            </div>
                        )}

                        <div className="p-4 md:p-0 h-full">
                           <CouncilList members={members} />
                           
                           {/* Empty State */}
                           {!deliberation && !isLoading && (
                               <div className="flex flex-col items-center justify-center p-8 md:p-20 text-center opacity-40 mt-10 md:mt-20">
                                   <div className="w-16 h-[1px] bg-white mb-4" />
                                   <p className="text-sm-body text-neutral-500 mb-2">No deliberations in session.</p>
                                   <p className="text-xs-meta text-neutral-600">Enter a query to convene the council.</p>
                               </div>
                           )}
                           
                           {/* Error State */}
                           {error && (
                               <div className="p-4 m-4 border border-error/50 bg-error/10 text-error text-sm-body font-mono">
                                   COUNCIL DISRUPTED: {error}
                               </div>
                           )}
                        </div>
                    </div>
                </div>

                {/* Mobile: Synthesis Slide */}
                <div className={`flex-1 flex flex-col h-full w-full absolute inset-0 transition-transform duration-300 md:hidden bg-background ${mobileMode === 'synthesis' ? 'translate-x-0' : 'translate-x-full'}`}>
                    <SynthesisPanel deliberation={deliberation} isLoading={isLoading} />
                </div>
            </div>

            {/* Input Area (Global for this column) */}
            <div className="z-30 w-full bg-background md:p-4 md:border-t md:border-neutral-800">
                <QueryInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Tablet: Synthesis Panel Fixed Bottom (Hidden on Desktop & Mobile) */}
            <div className="hidden md:flex lg:hidden h-[250px] border-t border-neutral-800 w-full relative z-20">
                 <SynthesisPanel deliberation={deliberation} isLoading={isLoading} />
            </div>
        </div>

        {/* COL 3: SYNTHESIS (Desktop: Right 30% | Tablet: Bottom | Mobile: Slide) */}
        <div className="hidden lg:flex w-[30%] border-l border-neutral-800 h-full z-10">
            <SynthesisPanel deliberation={deliberation} isLoading={isLoading} />
        </div>

      </div>
    </main>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <SynthesisApp />
    </ErrorBoundary>
  );
}