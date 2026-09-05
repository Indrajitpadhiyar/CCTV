import React, { useState, useEffect } from 'react';
import { X, Camera, Maximize2, Shield, Eye, ZoomIn, ZoomOut, Move, Activity, Download, RefreshCw } from 'lucide-react';
import { AIEstimateBadge } from './AIEstimateBadge';

export const CameraFeedModal = ({ camera, isOpen, onClose }) => {
  const [liveTime, setLiveTime] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen || !camera) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-[#0B2545] border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full text-white overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-[#07172B] px-5 py-3 flex items-center justify-between border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              LIVE FEED
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-slate-100 flex items-center gap-2">
                <span className="font-mono text-[#C9A227]">{camera.id}</span>
                <span>—</span>
                <span>{camera.name}</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {camera.zone} | {camera.district}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas & OSD */}
        <div className="relative bg-black aspect-video w-full overflow-hidden flex items-center justify-center group">
          {/* Simulated Camera Feed Image */}
          <img 
            src={camera.snapshot || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"} 
            alt={camera.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          />

          {/* CCTV Scanline Effect */}
          <div className="absolute inset-0 cctv-scanline opacity-40 pointer-events-none"></div>

          {/* OSD (On-Screen Display) Top Left */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs px-3 py-1.5 rounded border border-slate-700 font-mono text-[11px] text-emerald-400 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{camera.id}</span>
              <span className="text-slate-400">|</span>
              <span>{camera.resolution || "4K UHD"}</span>
              <span className="text-slate-400">|</span>
              <span>{camera.fps || 30} FPS</span>
            </div>
            <div className="text-[10px] text-slate-300">
              PTS: {liveTime.toLocaleTimeString('en-GB')}.{Math.floor(liveTime.getMilliseconds() / 10)} IST
            </div>
          </div>

          {/* OSD Top Right: Gujarat Police Watermark */}
          <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs px-3 py-1 rounded border border-slate-700 font-mono text-[10px] text-[#C9A227] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>GUJARAT POLICE SURVEILLANCE MATRIX</span>
          </div>

          {/* Simulated ANPR Optical Bounding Boxes */}
          {showBoundingBoxes && (
            <>
              <div className="absolute top-1/3 left-1/4 w-36 h-28 border-2 border-emerald-400/90 bg-emerald-500/10 rounded-xs pointer-events-none">
                <div className="bg-emerald-600 text-white font-mono text-[9px] px-1 py-0.5 absolute -top-4 left-0">
                  CAR [98.4%] : GJ01XX1234
                </div>
              </div>
              <div className="absolute top-1/2 right-1/3 w-32 h-24 border-2 border-amber-400/80 bg-amber-500/10 rounded-xs pointer-events-none">
                <div className="bg-amber-600 text-white font-mono text-[9px] px-1 py-0.5 absolute -top-4 left-0">
                  SPEED: 64 km/h (ANPR)
                </div>
              </div>
            </>
          )}

          {/* PTZ and Zoom Floating Controls */}
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-semibold text-slate-300 w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-700 mx-1"></div>
            <button 
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors ${
                showBoundingBoxes ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>AI BBoxes</span>
            </button>
          </div>
        </div>

        {/* Bottom Inspection & Telemetry Panel */}
        <div className="p-4 bg-[#07172B] border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-300">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">Optical Telemetry & Diagnostics</span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-lg">
              {camera.description || "Active surveillance node with H.265 RTSP/HLS stream delivery to Command Center."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AIEstimateBadge 
              text="AI Optical Analysis" 
              details="Bounding box coordinates and ANPR OCR confidence derived via YOLOv8 & LPRNet edge models." 
              size="sm"
            />
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors text-xs"
            >
              Close Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
