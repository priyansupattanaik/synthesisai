import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DeliberationResult, CouncilMemberState } from '@/lib/types';
import { COUNCIL_MODELS } from '@/lib/models';

interface CouncilStore {
  deliberation: DeliberationResult | null;
  members: CouncilMemberState[];
  isLoading: boolean;
  error: string | null;
  selectedMode: 'fast' | 'full' | 'auto';
  history: DeliberationResult[];
  
  setMode: (mode: 'fast' | 'full' | 'auto') => void;
  startDeliberation: (query: string) => Promise<void>;
  reset: () => void;
  clearHistory: () => void;
  loadFromHistory: (timestamp: number) => void;
}

const createInitialMembers = (): CouncilMemberState[] => 
  COUNCIL_MODELS.map(model => ({
    modelId: model.id,
    status: 'idle',
    progress: 0,
  }));

export const useCouncilStore = create<CouncilStore>()(
  persist(
    (set, get) => ({
      deliberation: null,
      members: createInitialMembers(),
      isLoading: false,
      error: null,
      selectedMode: 'auto',
      history: [],
      
      setMode: (mode) => set({ selectedMode: mode }),
      
      startDeliberation: async (query: string) => {
        set({ 
          isLoading: true, 
          error: null, 
          members: createInitialMembers().map(m => ({ ...m, status: 'thinking' })),
          deliberation: null 
        });
        
        try {
          // Progress simulation for visual feedback
          const progressInterval = setInterval(() => {
            set(state => ({
              members: state.members.map(m => 
                m.status === 'thinking' 
                  ? { ...m, progress: Math.min(85, m.progress + Math.random() * 15) }
                  : m
              ),
            }));
          }, 600);

          const response = await fetch('/api/deliberation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, mode: get().selectedMode }),
          });

          clearInterval(progressInterval);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.details || 'Deliberation failed');
          }

          const data: DeliberationResult = await response.json();
          
          if (data.status === 'error') {
            throw new Error('Deliberation completed with errors');
          }

          // Update member states
          const updatedMembers: CouncilMemberState[] = get().members.map(member => {
            const modelResponse = data.responses.find(r => r.modelId === member.modelId);
            const isChairman = data.chairman?.modelId === member.modelId;
            
            if (modelResponse?.error) {
              return { 
                ...member, 
                status: 'error', 
                progress: 100, 
                error: modelResponse.error 
              };
            }
            
            return {
              ...member,
              status: isChairman ? 'chairman' : 'speaking',
              progress: 100,
              response: modelResponse?.content,
              confidence: modelResponse ? Math.min(100, Math.max(0, 100 - (modelResponse.latency / 100))) : undefined,
            };
          });

          set(state => ({ 
            deliberation: data, 
            members: updatedMembers,
            isLoading: false,
            history: [data, ...state.history].slice(0, 50) // Keep last 50
          }));

        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
            members: createInitialMembers(),
          });
        }
      },
      
      reset: () => set({ 
        deliberation: null, 
        members: createInitialMembers(),
        isLoading: false,
        error: null,
      }),
      
      clearHistory: () => set({ history: [] }),
      
      loadFromHistory: (timestamp: number) => {
        const entry = get().history.find(h => h.timestamp === timestamp);
        if (entry) {
          set({ deliberation: entry });
        }
      },
    }),
    {
      name: 'synthesis-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history, selectedMode: state.selectedMode }),
    }
  )
);