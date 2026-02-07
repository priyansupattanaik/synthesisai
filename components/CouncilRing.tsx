'use client';

import React, { useState } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { COUNCIL_MODELS } from '@/lib/models';
import ModelNode from './ModelNode';
import ArgumentThreads from './ArgumentThreads';
import SelectionRing from './SelectionRing';

export default function CouncilRing() {
  const { members, deliberation, activeModelIds, toggleActiveModel } = useCouncilStore();
  const [, setHoveredNode] = useState<string | null>(null);
  
  // --- ROTATION STATE ---
  // The user can rotate the whole council. This state drives the position calculations.
  const [rotation, setRotation] = useState(0);
  
  const radius = 280; // Distance from center

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      
      {/* 1. SELECTION & ROTATION LAYER */}
      <SelectionRing 
        radius={radius} 
        onRotationChange={setRotation} 
      />

      {/* 2. SYNAPTIC WEB (Threads) */}
      {/* Now receives the current rotation to draw lines to correct moving points */}
      <ArgumentThreads rotation={rotation} radius={radius} />

      {/* 3. NODE LAYER */}
      <div className="absolute inset-0 pointer-events-none">
        {COUNCIL_MODELS.map((model, index) => {
          // Calculate angle based on Index + Manual Rotation
          const baseAngle = (index * 360) / COUNCIL_MODELS.length - 90; 
          const currentAngle = baseAngle + rotation;

          const memberState = members.find(m => m.modelId === model.id);
          const isActive = activeModelIds.includes(model.id);

          return (
            <div key={model.id} className="pointer-events-auto">
                <ModelNode
                  model={model}
                  member={memberState}
                  angle={currentAngle}
                  radius={radius}
                  isActive={isActive}
                  isChairman={deliberation?.chairman?.modelId === model.id}
                  onClick={() => toggleActiveModel(model.id)}
                  onHover={(isHovering) => setHoveredNode(isHovering ? model.id : null)}
                />
            </div>
          );
        })}
      </div>

    </div>
  );
}