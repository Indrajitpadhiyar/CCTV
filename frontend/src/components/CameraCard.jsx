import React from 'react';
import HLSPlayer from './HLSPlayer';
import { Radio, ShieldAlert, Settings, Info, MapPin, Eye } from 'lucide-react';

export default function CameraCard({ camera, userEmail, userPassword, onOpenModal }) {
  const cameraCode = (camera.camera_code || camera.id || 'cam01').toLowerCase();
  const cameraName = camera.name || `Camera ${cameraCode.toUpperCase()}`;
  const isOnline = camera.status !== 'offline';
  const hlsUrl = `https://cctv.corp8.cloud/${cameraCode}/index.m3u8`;

  return (
    <div className="flex flex-col bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group">
      {/* Card Header */}
      <div className="flex items-center justify-between p-3 bg-gray-900/80 border-b border-gray-800/80">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            {isOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            )}
          </span>
          <h3 className="font-semibold text-sm text-gray-200 truncate max-w-[180px]">
            {cameraName}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            {cameraCode.toUpperCase()}
          </span>
          <button
            onClick={() => onOpenModal(camera)}
            className="p-1 rounded text-gray-400 hover:text-cyan-300 hover:bg-gray-800 transition"
            title="Inspect Stream Endpoints"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live HLS Video Feed */}
      <div className="p-2 bg-black/40">
        <HLSPlayer
          streamUrl={hlsUrl}
          cameraCode={cameraCode}
          isOnline={isOnline}
        />
      </div>

      {/* Card Footer Details */}
      <div className="px-3 py-2 bg-gray-950/60 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-500" />
          <span>{camera.district || 'Zone-1'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">
            TCP/HLS
          </span>
          <button
            onClick={() => onOpenModal(camera)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-sans text-xs transition font-medium"
          >
            <Eye className="w-3.5 h-3.5" />
            Endpoints
          </button>
        </div>
      </div>
    </div>
  );
}
