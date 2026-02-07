'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCouncilStore } from '@/store/councilStore';
import { useState, useEffect, useRef } from 'react';
import { 
  History, 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Clock,
  MessageSquare,
  Crown,
  GitBranch
} from 'lucide-react';
import { COUNCIL_MODELS } from '@/lib/models';

interface ChronicleEntry {
  timestamp: number;
  type: 'query' | 'response' | 'review' | 'chairman' | 'synthesis';
  modelId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  duration?: number;
}

export default function ChronicleTimeline() {
  const { deliberation } = useCouncilStore();
  const [isOpen, setIsOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [entries, setEntries] = useState<ChronicleEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Build chronicle from deliberation data
  useEffect(() => {
    if (!deliberation) {
      setEntries([]);
      return;
    }

    const newEntries: ChronicleEntry[] = [];
    const baseTime = deliberation.timestamp - deliberation.duration;

    // Query entry
    newEntries.push({
      timestamp: baseTime,
      type: 'query',
      data: { query: deliberation.query },
    });

    // Response entries
    deliberation.responses.forEach((resp, i) => {
      if (!resp.error) {
        newEntries.push({
          timestamp: baseTime + (i * 500), // Staggered
          type: 'response',
          modelId: resp.modelId,
          data: { latency: resp.latency, preview: resp.content.slice(0, 100) },
          duration: resp.latency,
        });
      }
    });

    // Review entries
    deliberation.reviews.forEach((review, i) => {
      newEntries.push({
        timestamp: baseTime + 2000 + (i * 200),
        type: 'review',
        modelId: review.reviewerId,
        data: { target: review.targetId, score: review.score },
      });
    });

    // Chairman selection
    if (deliberation.chairman) {
      newEntries.push({
        timestamp: baseTime + deliberation.duration * 0.7,
        type: 'chairman',
        modelId: deliberation.chairman.modelId,
        data: { score: deliberation.chairman.averageScore },
      });
    }

    // Synthesis
    if (deliberation.finalSynthesis) {
      newEntries.push({
        timestamp: baseTime + deliberation.duration * 0.9,
        type: 'synthesis',
        data: { length: deliberation.finalSynthesis.length },
        duration: deliberation.duration * 0.1,
      });
    }

    setEntries(newEntries.sort((a, b) => a.timestamp - b.timestamp));
  }, [deliberation]);

  // Playback simulation
  useEffect(() => {
    if (!isPlaying || entries.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + (100 * playbackSpeed);
        if (next >= (entries[entries.length - 1]?.timestamp || 0)) {
          setIsPlaying(false);
          return entries[entries.length - 1]?.timestamp || 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, entries, playbackSpeed]);

  const getEntryIcon = (type: ChronicleEntry['type']) => {
    switch (type) {
      case 'query': return MessageSquare;
      case 'response': return Clock;
      case 'review': return GitBranch;
      case 'chairman': return Crown;
      case 'synthesis': return MessageSquare;
      default: return Clock;
    }
  };

  const getEntryColor = (type: ChronicleEntry['type']) => {
    switch (type) {
      case 'query': return '#00d4ff';
      case 'response': return '#2ecc71';
      case 'review': return '#f39c12';
      case 'chairman': return '#ffd700';
      case 'synthesis': return '#9b59b6';
      default: return '#888';
    }
  };

  if (!deliberation) return null;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-6 top-24 z-40 p-3 rounded-full glass-panel border border-white/10 hover:border-cyan-500/50 transition-colors group"
      >
        <History className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
        <span className="absolute right-full mr-2 px-2 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chronicle
        </span>
      </motion.button>

      {/* Timeline Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 glass-panel border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Chronicle</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Playback Controls */}
            <div className="p-4 border-b border-white/5 space-y-3">
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => setCurrentTime(entries[0]?.timestamp || 0)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Play className="w-5 h-5 text-cyan-400 ml-0.5" />
                  )}
                </button>
                
                <button 
                  onClick={() => setCurrentTime(entries[entries.length - 1]?.timestamp || 0)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Control */}
              <div className="flex justify-center gap-2">
                {[0.5, 1, 2, 4].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      playbackSpeed === speed 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500"
                  style={{
                    width: entries.length > 1 
                      ? `${((currentTime - entries[0].timestamp) / (entries[entries.length - 1].timestamp - entries[0].timestamp)) * 100}%`
                      : '0%'
                  }}
                />
              </div>
            </div>

            {/* Timeline Entries */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {entries.map((entry, index) => {
                const Icon = getEntryIcon(entry.type);
                const color = getEntryColor(entry.type);
                const model = entry.modelId ? COUNCIL_MODELS.find(m => m.id === entry.modelId) : null;
                const isActive = currentTime >= entry.timestamp;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.4,
                      x: 0,
                      scale: isActive ? 1 : 0.98
                    }}
                    className="relative pl-6 pb-4 border-l-2 border-white/10 last:border-0"
                  >
                    {/* Dot */}
                    <div 
                      className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full border-2 border-[#0a0a0f]"
                      style={{ backgroundColor: color }}
                    />
                    
                    {/* Content */}
                    <div className="glass-panel rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3 h-3" style={{ color }} />
                        <span className="text-xs font-medium capitalize" style={{ color }}>
                          {entry.type}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(entry.timestamp).toLocaleTimeString([], { 
                            minute: '2-digit', 
                            second: '2-digit',
                            fractionalSecondDigits: 1 
                          })}
                        </span>
                      </div>
                      
                      {model && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: model.color }}
                          />
                          <span>{model.displayName}</span>
                        </div>
                      )}
                      
                      {entry.type === 'review' && (
                        <div className="text-xs text-gray-400">
                          Score: <span className="text-white font-medium">{entry.data.score}/10</span>
                        </div>
                      )}
                      
                      {entry.type === 'response' && (
                        <div className="text-xs text-gray-400 line-clamp-2">
                          {entry.data.preview}...
                        </div>
                      )}
                      
                      {entry.duration && (
                        <div className="text-[10px] text-gray-500">
                          Duration: {(entry.duration / 1000).toFixed(2)}s
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats Footer */}
            <div className="p-4 border-t border-white/5 text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Total Events:</span>
                <span className="text-white">{entries.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Deliberation Time:</span>
                <span className="text-white">{(deliberation.duration / 1000).toFixed(1)}s</span>
              </div>
              <div className="flex justify-between">
                <span>Models Consulted:</span>
                <span className="text-white">{deliberation.responses.filter(r => !r.error).length}/8</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}