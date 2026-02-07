"use client";

import React from 'react';
import { DeliberationResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ChronicleProps {
  history: DeliberationResult[];
  onSelect: (timestamp: number) => void;
}

export function Chronicle({ history, onSelect }: ChronicleProps) {
  return (
    <div className="flex flex-col h-full bg-background border-r border-neutral-800">
      <div className="p-4 border-b border-neutral-800 sticky top-0 bg-background z-10">
        <h2 className="text-xs-meta font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Chronicle
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {history.length === 0 ? (
            <div className="p-8 text-center text-[11px] text-neutral-600 font-mono">
                NO RECORDED DELIBERATIONS
            </div>
        ) : (
            <div className="divide-y divide-neutral-800">
                {history.map((item) => (
                    <button
                        key={item.timestamp}
                        onClick={() => onSelect(item.timestamp)}
                        className="w-full text-left p-4 hover:bg-neutral-900 transition-colors group relative"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-mono text-neutral-500">
                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={cn("w-2 h-2 rounded-full", item.status === 'complete' ? "bg-neutral-700" : "bg-error")} />
                        </div>
                        <p className="text-sm-body text-neutral-300 font-mono line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            {item.query}
                        </p>
                        
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold uppercase bg-highlight text-black px-2 py-1">LOAD</span>
                        </div>
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
