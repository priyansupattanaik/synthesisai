'use client';

import React from 'react';
import { DeliberationResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import { History, Clock, PlayCircle } from 'lucide-react';

interface ChronicleProps {
  history: DeliberationResult[];
  onSelect: (timestamp: number) => void;
}

export function Chronicle({ history, onSelect }: ChronicleProps) {
  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border-r border-white/5">
      
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2 text-neutral-400">
             <History className="w-4 h-4" />
             <span className="text-xs font-mono font-bold tracking-widest uppercase">Chronicle</span>
         </div>
         <span className="text-[10px] font-mono text-neutral-600">
             {history.length} RECORDS
         </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {history.length === 0 ? (
            <div className="p-8 text-center text-neutral-600 text-xs font-mono italic">
                No session data found.
            </div>
        ) : (
            history.map((entry) => (
                <button
                  key={entry.timestamp}
                  onClick={() => onSelect(entry.timestamp)}
                  className="w-full group flex flex-col gap-2 p-3 rounded bg-neutral-900/50 hover:bg-neutral-800 transition-all border border-transparent hover:border-white/10 text-left"
                >
                   <div className="flex justify-between items-start w-full">
                       <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                           <Clock className="w-3 h-3" />
                           {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                       <span className={cn(
                           "text-[10px] font-bold px-1.5 py-0.5 rounded",
                           entry.status === 'error' ? "bg-red-900/30 text-red-500" : "bg-green-900/30 text-green-500"
                       )}>
                           {entry.status === 'error' ? 'FAIL' : 'OK'}
                       </span>
                   </div>
                   
                   <p className="text-sm text-neutral-300 font-sans-simulated line-clamp-2 leading-snug group-hover:text-white">
                       {entry.query}
                   </p>
                   
                   <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5 w-full">
                       <div className="flex items-center gap-2">
                            {entry.chairman && (
                                <span className="text-[10px] font-mono text-yellow-500/80">
                                    ♔ {entry.chairman.displayName}
                                </span>
                            )}
                       </div>
                       <PlayCircle className="w-4 h-4 text-neutral-600 group-hover:text-highlight transition-colors" />
                   </div>
                </button>
            ))
        )}
      </div>
    </div>
  );
}