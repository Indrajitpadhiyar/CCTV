import React, { useState } from 'react';
import { Badge } from '../components/common/Badge';
import { ScanFaceIcon, ShieldAlertIcon, EyeIcon, VideoIcon } from '../components/common/Icons';

export function FaceDetectionsPage({ detections = [], onSelectMatch, onNavigate }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'matches' | 'clear'

  const filtered = detections.filter((item) => {
    if (filterMode === 'matches') return item.dbMatch === 'Potential Match';
    if (filterMode === 'clear') return item.dbMatch === 'No Match';
    return true;
  });

  const matchesCount = detections.filter((d) => d.dbMatch === 'Potential Match').length;
  const clearCount = detections.filter((d) => d.dbMatch !== 'Potential Match').length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Biometric Face Detection Stream
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live CCTV Detection
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous AI facial bounding box extraction and vector matching across surveillance cameras
          </p>
        </div>

        {/* Filter Tabs */}
        {detections.length > 0 && (
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 font-medium transition ${
                filterMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Detections ({detections.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('matches')}
              className={`px-3 py-1.5 font-medium transition ${
                filterMode === 'matches' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Matches ({matchesCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('clear')}
              className={`px-3 py-1.5 font-medium transition ${
                filterMode === 'clear' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Clear Records ({clearCount})
            </button>
          </div>
        )}
      </div>

      {/* Detections Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const isMatch = item.dbMatch === 'Potential Match';

            return (
              <div
                key={item.detectionId}
                className={`bg-white rounded-xl border ${
                  isMatch ? 'border-rose-300 bg-rose-50/10 shadow-xs' : 'border-slate-200'
                } p-4 transition hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  {/* Header: Detection ID + Timestamp */}
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 mb-3">
                    <span className="font-mono font-bold text-slate-900">
                      {item.detectionId}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {item.timestamp}
                    </span>
                  </div>

                  {/* Genuine CCTV Camera Footage Frame */}
                  <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center relative mb-3 shadow-2xs">
                    {item.annotatedSnapshot ? (
                      <img
                        src={item.annotatedSnapshot}
                        alt="CCTV Detection Frame"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.snapshotUrl || `http://127.0.0.1:8000/api/camera/${item.cameraCode || 'cam01'}/snapshot`}
                        alt="Camera Snapshot"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'http://127.0.0.1:8000/api/camera/cam01/snapshot';
                        }}
                      />
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/80 text-rose-400 text-[9px] font-mono px-1 py-0.5 rounded">
                      {item.camera}
                    </span>
                  </div>

                  {/* AI Extracted Attributes */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Database Status:</span>
                      {isMatch ? (
                        <Badge variant="danger" size="sm" dot>
                          Potential Match
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          No Match
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Confidence:</span>
                      <span className={`font-mono font-bold ${isMatch ? 'text-rose-700' : 'text-slate-700'}`}>
                        {item.confidence}%
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Camera / Location:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[130px]" title={item.location}>
                        {item.location || item.camera}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Demographics:</span>
                      <span className="text-slate-700">
                        {item.gender || 'Unknown'}, {item.estimatedAge || 'Adult'}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Station Beat:</span>
                      <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px]">
                        {item.policeStation || 'Surveillance'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.cameraCode?.toUpperCase() || item.camera}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectMatch && onSelectMatch(item.detectionId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    <EyeIcon className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <ScanFaceIcon className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No Face Detections Ingested Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Biometric facial detections appear here automatically as cameras process video frames. Upload a photo in the Find Person panel on the Dashboard to execute an instant multi-camera scan.
          </p>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
            >
              Open Dashboard & Search Face
            </button>
          )}
        </div>
      )}
    </div>
  );
}
