import React from 'react';
import { VideoIcon, ScanFaceIcon, ShieldAlertIcon, MaximizeIcon, RadioIcon } from '../common/Icons';
import { Badge } from '../common/Badge';

export function CameraCard({ camera, onViewCamera, onSelectMatch }) {
  const isMatch = camera.status === 'match';
  const isWarning = camera.status === 'warning';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group">
      {/* Video Stream Simulation Box */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden select-none">
        {/* Subtle camera lens glare & grid pattern */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Real Live Camera Feed Image / Snapshot */}
        <img
          src={camera.snapshot_url || (camera.code ? `http://127.0.0.1:8000/api/camera/${camera.code}/snapshot` : null)}
          alt={camera.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Animated CCTV feed scene graphic (Fallback placeholder) */}
        <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 320 180" preserveAspectRatio="none">
          {/* Horizon & road perspective */}
          <polygon points="0,180 140,80 180,80 320,180" fill="#1e293b" />
          <polygon points="140,80 180,80 170,40 150,40" fill="#0f172a" />
          <line x1="160" y1="80" x2="160" y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="8 6" />
          {/* Street light posts & buildings */}
          <rect x="20" y="30" width="40" height="90" fill="#1e293b" />
          <rect x="70" y="50" width="30" height="70" fill="#1e293b" />
          <rect x="230" y="40" width="35" height="80" fill="#1e293b" />
          <rect x="275" y="25" width="40" height="95" fill="#1e293b" />
        </svg>

        {/* CCTV OSD Overlay (Top) */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90 drop-shadow-xs">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-bold text-rose-400">REC</span>
            <span className="text-white/70">|</span>
            <span className="font-semibold text-white">{camera.id}</span>
          </div>

          <div className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-white/80">
            {camera.fps} FPS • {camera.resolution}
          </div>
        </div>

        {/* CCTV OSD Overlay (Bottom) */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/80 drop-shadow-xs">
          <div className="bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded truncate max-w-[180px]">
            {camera.name}
          </div>
          <div className="bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px]">
            22:26:48 IST
          </div>
        </div>

        {/* Expand / View Overlay button on hover */}
        <button
          type="button"
          onClick={() => onViewCamera(camera)}
          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-2xs"
        >
          <span className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
            <MaximizeIcon className="w-5 h-5" />
          </span>
          <span>Open Full Camera Feed</span>
        </button>
      </div>

      {/* Camera Details & Location Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: ID + Status */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                  {camera.id}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {camera.type}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 mt-0.5 line-clamp-1">
                {camera.name}
              </p>
            </div>

            {isMatch ? (
              <Badge variant="danger" dot size="sm">
                Criminal Match
              </Badge>
            ) : isWarning ? (
              <Badge variant="warning" dot size="sm">
                Warning
              </Badge>
            ) : (
              <Badge variant="success" dot size="sm">
                Live
              </Badge>
            )}
          </div>

          {/* Area & Police Station Metadata */}
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Jurisdiction:</span>
              <span className="font-medium text-slate-800">{camera.station}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Location:</span>
              <span className="font-medium text-slate-800">{camera.area}, {camera.city}</span>
            </div>
          </div>
        </div>

        {/* Footer Metrics & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Detected Faces
              </div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <ScanFaceIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>{camera.facesNow} Active</span>
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${
              isMatch ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Match Status
              </div>
              <div className={`text-sm font-bold flex items-center gap-1.5 mt-0.5 ${
                isMatch ? 'text-rose-700' : 'text-slate-600'
              }`}>
                {isMatch ? (
                  <>
                    <ShieldAlertIcon className="w-3.5 h-3.5 text-rose-600" />
                    <span>1 Potential</span>
                  </>
                ) : (
                  <span>Clear (0)</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewCamera(camera)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition text-center shadow-2xs"
            >
              View Camera
            </button>
            {isMatch && (
              <button
                type="button"
                onClick={() => onSelectMatch(camera.lastMatch || 'MATCH-1024')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition text-center shadow-xs"
              >
                Inspect Match
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
