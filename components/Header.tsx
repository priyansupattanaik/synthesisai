import React from 'react';

interface HeaderProps {
  toggleMode?: () => void;
  currentMode?: 'deliberation' | 'synthesis';
}

export function Header({ toggleMode, currentMode = 'deliberation' }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-background border-b border-neutral-800 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2">
        <h1 className="text-md-head font-bold tracking-[0.1em]">SYNTHESIS</h1>
      </div>
      
      <button 
        onClick={toggleMode}
        className="text-xs-meta uppercase tracking-wider text-neutral-400 hover:text-highlight transition-colors"
      >
        {currentMode === 'deliberation' ? 'VIEW SYNTHESIS' : 'VIEW COUNCIL'}
      </button>
    </header>
  );
}
