import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { VideoIcon, ScanFaceIcon, ShieldAlertIcon, RadioIcon, RefreshCwIcon, MapPinIcon } from '../common/Icons';

export function CameraViewModal({ isOpen, onClose, camera, onSelectMatch }) {
  const [ptzPreset, setPtzPreset] = useState('Standard FOV');
  const [nightVision, setNightVision] = useState(false);

  if (!camera) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Live Stream Monitor: ${camera.id}`}
      subtitle={`${camera.name} • ${camera.station}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Large Video Stream Viewport */}
        <div className={`relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 ${
          nightVision ? 'filter brightness-110 contrast-125 sepia-10 hue-rotate-90' : ''
        }`}>
          {/* Subtle grid and surveillance lines */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          {/* Central Target Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-24 h-24 border border-white/60 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white/70 rounded-full"></div>
            </div>
            <div className="absolute w-36 h-px bg-white/40"></div>
            <div className="absolute h-36 w-px bg-white/40"></div>
          </div>

          {/* Neutral vector street background */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 480 270" preserveAspectRatio="none">
            <polygon points="0,270 210,120 270,120 480,270" fill="#1e293b" />
            <line x1="240" y1="120" x2="240" y2="270" stroke="#64748b" strokeWidth="2.5" strokeDasharray="10 8" />
            <rect x="30" y="50" width="60" height="130" fill="#0f172a" />
            <rect x="100" y="80" width="50" height="100" fill="#1e293b" />
            <rect x="340" y="60" width="60" height="120" fill="#0f172a" />
            <rect x="410" y="40" width="55" height="140" fill="#1e293b" />
          </svg>

          {/* Simulated detected face bounding boxes */}
          <div className="absolute top-[38%] left-[46%] w-12 h-14 border-2 border-emerald-400 bg-emerald-500/10 rounded-xs pointer-events-none">
            <span className="absolute -top-4 left-0 bg-emerald-600 text-white text-[9px] font-mono px-1 py-0.5 rounded-xs">
              Face #1 Clear
            </span>
          </div>

          {camera.status === 'match' && (
            <div className="absolute top-[32%] left-[24%] w-14 h-16 border-2 border-rose-500 bg-rose-500/20 rounded-xs pointer-events-none animate-pulse">
              <span className="absolute -top-5 left-0 bg-rose-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs">
                POTENTIAL MATCH 94.8%
              </span>
            </div>
          )}

          {/* Top OSD Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90 drop-shadow-md">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-bold text-rose-400">REC 4K</span>
              <span className="text-white/60">|</span>
              <span className="font-bold">{camera.id}</span>
              <span className="text-white/60">|</span>
              <span>{camera.station}</span>
            </div>

            <div className="bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded">
              FPS: {camera.fps} • BITRATE: 12.4 Mbps • LATENCY: 16ms
            </div>
          </div>

          {/* Bottom OSD Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90 drop-shadow-md">
            <div className="bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded">
              GEO: 23.0225° N, 72.5714° E • PRESET: {ptzPreset}
            </div>
            <div className="bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded">
              13-SEP-2026 22:26:48 IST
            </div>
          </div>
        </div>

        {/* PTZ & Stream Controls Toolbar */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">PTZ Presets:</span>
            {['Standard FOV', 'Traffic Intersection', 'Pedestrian Walkway', 'Zoom 4X'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPtzPreset(preset)}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  ptzPreset === preset
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNightVision(!nightVision)}
              className={`px-3 py-1 rounded-md font-semibold transition border ${
                nightVision
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {nightVision ? 'Night Vision [ON]' : 'Night Vision [OFF]'}
            </button>

            {camera.status === 'match' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectMatch(camera.lastMatch || 'MATCH-1024');
                }}
                className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs flex items-center gap-1.5"
              >
                <ShieldAlertIcon className="w-3.5 h-3.5" />
                View Match Dossier
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Faces In View</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">{camera.facesNow} persons</div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Hardware Profile</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">{camera.type}</div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Police Station</span>
            <div className="text-base font-bold text-slate-900 mt-0.5 truncate">{camera.station}</div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Network Uptime</span>
            <div className="text-base font-bold text-emerald-700 mt-0.5">99.98% (Online)</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
