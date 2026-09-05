import React from 'react';
import { Camera, Clock, Gauge, Compass, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { VerifiedBadge } from '../../common/VerifiedBadge';

export const SequenceTimeline = ({ sequence = [], onInspectCamera }) => {
  if (!sequence || sequence.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-300">
        No sequential camera detections recorded for this search parameters.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#0B2545]" />
          <span>Topological Camera Detection Sequence ({sequence.length} Intersections)</span>
        </h3>
        <VerifiedBadge text="Human Verified Sightings" size="sm" />
      </div>

      {/* Sequence Horizontal Scroll Strip */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1">
        {sequence.map((node, index) => {
          const isLast = index === sequence.length - 1;

          return (
            <div key={node.cameraId} className="flex items-center shrink-0">
              {/* Camera Detection Card */}
              <div 
                className={`w-64 bg-white rounded-xl border p-3.5 shadow-xs flex flex-col justify-between space-y-3 transition-all ${
                  isLast ? 'border-2 border-emerald-600 bg-emerald-50/10 shadow-sm' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                {/* Node Top Header */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0B2545] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {node.step}
                    </span>
                    <span className="font-mono font-bold text-xs text-blue-950">
                      {node.cameraId}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-sm font-semibold">
                    {node.confidence}% Match
                  </span>
                </div>

                {/* Camera Thumbnail Preview */}
                <div 
                  onClick={() => onInspectCamera && onInspectCamera(node.cameraId)}
                  className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-200 group cursor-pointer"
                >
                  <img 
                    src={node.thumbnail} 
                    alt={node.cameraName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                  <div className="absolute inset-0 cctv-scanline opacity-30"></div>
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#C9A227]" />
                    <span>Inspect</span>
                  </div>
                </div>

                {/* Location & Metrics */}
                <div className="space-y-1.5 text-slate-700">
                  <p className="font-bold text-xs leading-tight line-clamp-1 text-slate-900" title={node.cameraName}>
                    {node.cameraName}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-slate-50 p-2 rounded-md border border-slate-100">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{node.timeRaw || node.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-900 font-bold">
                      <Gauge className="w-3 h-3 text-[#C9A227]" />
                      <span>{node.speed}</span>
                    </div>
                  </div>
                </div>

                {/* Note / Heading */}
                <div className="text-[10px] text-slate-500 font-mono line-clamp-1 border-t border-slate-100 pt-2 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{node.heading}</span>
                </div>
              </div>

              {/* Arrow Connector between nodes */}
              {!isLast && (
                <div className="px-2 flex items-center text-slate-400">
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
