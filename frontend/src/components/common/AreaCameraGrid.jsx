import React from 'react';
import { VideoIcon, ShieldAlertIcon, CheckCircleIcon, MapPinIcon, ClockIcon, MaximizeIcon } from './Icons';
import { Badge } from './Badge';

export function AreaCameraGrid({
  cameras = [],
  matchedCameras = [],
  filterOnlyMatches = false,
  onToggleFilterOnlyMatches,
  onViewCamera,
  onInspectMatch,
  selectedArea = 'SG Highway',
  selectedDistrict = 'Ahmedabad'
}) {
  const displayedCameras = filterOnlyMatches && matchedCameras.length > 0
    ? cameras.filter(cam => matchedCameras.some(m => m.camera_id === cam.id))
    : cameras;

  return (
    <div className="space-y-4">
      {/* Grid Controls & Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Camera Grid Structure: {selectedArea}, {selectedDistrict}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {displayedCameras.length} Surveillance Channels
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential perimeter and traffic cameras assigned to this jurisdiction
          </p>
        </div>

        {/* Filter Toggle: "Only show matched cameras" as requested by user */}
        {matchedCameras.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium pl-1">Display Mode:</span>
            <button
              type="button"
              onClick={() => onToggleFilterOnlyMatches(true)}
              className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                filterOnlyMatches
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              <ShieldAlertIcon className="w-3.5 h-3.5" />
              <span>Matched Cameras Only ({matchedCameras.length})</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleFilterOnlyMatches(false)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                !filterOnlyMatches
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              <span>All Area Cameras ({cameras.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Cameras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedCameras.map((cam) => {
          const matchData = matchedCameras.find((m) => m.camera_id === cam.id);
          const isMatched = Boolean(matchData);

          return (
            <div
              key={cam.id}
              className={`bg-white rounded-xl border overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                isMatched ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200'
              }`}
            >
              {/* Camera Video / Snapshot Viewport */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden select-none group">
                {isMatched && matchData?.annotated_snapshot ? (
                  <img
                    src={matchData.annotated_snapshot}
                    alt={cam.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <img
                      src={cam.snapshot_url || (cam.code ? `http://127.0.0.1:8000/api/camera/${cam.code}/snapshot` : null)}
                      alt={cam.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {/* Simulated CCTV feed view fallback */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 320 180" preserveAspectRatio="none">
                      <polygon points="0,180 140,80 180,80 320,180" fill="#1e293b" />
                      <line x1="160" y1="80" x2="160" y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="6 4" />
                      <rect x="25" y="35" width="40" height="90" fill="#1e293b" />
                      <rect x="250" y="35" width="45" height="90" fill="#1e293b" />
                    </svg>
                  </>
                )}

                {/* CCTV Top OSD */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90 drop-shadow-xs">
                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded">
                    <span className={`w-2 h-2 rounded-full ${isMatched ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
                    <span className="font-bold">{cam.id}</span>
                  </div>
                  <div className="bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px]">
                    30 FPS • 4K
                  </div>
                </div>

                {/* Match Banner Overlay on Image */}
                {isMatched && (
                  <div className="absolute bottom-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <ShieldAlertIcon className="w-3 h-3" />
                    <span>SPOTTED: {matchData.confidence}%</span>
                  </div>
                )}

                {/* Hover Click Action */}
                <button
                  type="button"
                  onClick={() => isMatched ? onInspectMatch(matchData) : onViewCamera(cam)}
                  className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-2xs"
                >
                  <MaximizeIcon className="w-4 h-4" />
                  <span>{isMatched ? 'Inspect Target Spotting' : 'Open Live Feed'}</span>
                </button>
              </div>

              {/* Camera Details & Spot Location */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-slate-900 text-xs leading-tight">
                      {cam.name}
                    </h4>
                    {isMatched ? (
                      <Badge variant="danger" dot size="sm">
                        Spotted
                      </Badge>
                    ) : (
                      <Badge variant="success" dot size="sm">
                        Online
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <div className="flex items-start gap-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-700 font-medium leading-tight">
                        {cam.spot}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Station: <span className="text-slate-600 font-medium">{cam.station || 'Local Beat'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                  {isMatched ? (
                    <button
                      type="button"
                      onClick={() => onInspectMatch(matchData)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition text-center shadow-2xs"
                    >
                      Verify Person Spotting
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onViewCamera(cam)}
                      className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition text-center shadow-2xs"
                    >
                      View Camera
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayedCameras.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
          No cameras found matching the selected filter.
        </div>
      )}
    </div>
  );
}
