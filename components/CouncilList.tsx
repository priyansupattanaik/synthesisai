"use client";

import React, { useState } from 'react';
import { CouncilMemberState } from '@/lib/types';
import { COUNCIL_MODELS } from '@/lib/models';
import { CouncilItem } from './CouncilItem';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface CouncilListProps {
  members: CouncilMemberState[];
}

export function CouncilList({ members }: CouncilListProps) {
  const [mobileSelectedMember, setMobileSelectedMember] = useState<string | null>(null);
  const [desktopExpandedMembers, setDesktopExpandedMembers] = useState<Set<string>>(new Set());

  const toggleDesktop = (id: string) => {
    const newSet = new Set(desktopExpandedMembers);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setDesktopExpandedMembers(newSet);
  };

  const getModelConfig = (id: string) => COUNCIL_MODELS.find(m => m.id === id)!;

  const activeMembers = members; // can filter if needed

  return (
    <>
      {/* Mobile Layout (Visible only on mobile/tablet) */}
      <div className="md:hidden w-full overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex gap-2 px-4 min-w-min">
          {activeMembers.map(member => (
            <CouncilItem
              key={member.modelId}
              member={member}
              config={getModelConfig(member.modelId)}
              layout="mobile"
              onClick={() => setMobileSelectedMember(member.modelId)}
            />
          ))}
        </div>
      </div>

      {/* Desktop Layout (Visible only on md+) */}
      <div className="hidden md:flex flex-col w-full h-full overflow-y-auto custom-scrollbar border-r border-neutral-800">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm p-4 border-b border-neutral-800 z-10 flex justify-between items-center">
             <h2 className="text-xs-meta font-bold uppercase text-neutral-400 tracking-wider">The Council</h2>
             <span className="text-xs-meta font-mono text-neutral-600">{activeMembers.filter(m => m.status !== 'idle').length}/{activeMembers.length} ACTIVE</span>
        </div>
        <div>
            {activeMembers.map(member => (
                <CouncilItem
                key={member.modelId}
                member={member}
                config={getModelConfig(member.modelId)}
                layout="desktop"
                isExpanded={desktopExpandedMembers.has(member.modelId)}
                onClick={() => toggleDesktop(member.modelId)}
                />
            ))}
        </div>
      </div>

      {/* Mobile Modal Overlay */}
      {mobileSelectedMember && (
        <div className="fixed inset-0 z-[100] md:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
             className="bg-surface w-full max-h-[80vh] border-t border-highlight overflow-y-auto animate-in slide-in-from-bottom duration-300"
             onClick={(e) => e.stopPropagation()}
          >
             <div className="sticky top-0 bg-surface border-b border-neutral-800 p-4 flex justify-between items-center">
                <span className="text-md-head font-mono font-bold text-highlight">
                    {getModelConfig(mobileSelectedMember).displayName}
                </span>
                <button 
                  onClick={() => setMobileSelectedMember(null)}
                  className="p-2 -mr-2 text-neutral-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="p-6 text-sm-body font-mono leading-relaxed whitespace-pre-wrap pb-20">
                {activeMembers.find(m => m.modelId === mobileSelectedMember)?.response || 
                 (activeMembers.find(m => m.modelId === mobileSelectedMember)?.status === 'thinking' ? 
                 <span className="animate-pulse">_Cursor blinking... thinking...</span> : 
                 <span className="text-neutral-600 italic">No response generated.</span>)}
             </div>
          </div>
          
          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setMobileSelectedMember(null)} />
        </div>
      )}
    </>
  );
}
