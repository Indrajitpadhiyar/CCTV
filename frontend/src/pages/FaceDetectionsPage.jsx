import React, { useState } from 'react';
import { REALTIME_DETECTIONS } from '../data/mockData';
import { FacePlaceholder } from '../components/common/FacePlaceholder';
import { Badge } from '../components/common/Badge';
import { ScanFaceIcon, ShieldAlertIcon, EyeIcon, FilterIcon } from '../components/common/Icons';

export function FaceDetectionsPage({ onSelectMatch }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'matches' | 'clear'

  const filtered = REALTIME_DETECTIONS.filter((item) => {
    if (filterMode === 'matches') return item.dbMatch === 'Potential Match';
    if (filterMode === 'clear') return item.dbMatch === 'No Match';
    return true;
  });

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
              Real-time Ingestion
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous AI facial bounding box extraction and criminal vector indexing
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 font-medium transition ${
              filterMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Detections ({REALTIME_DETECTIONS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('matches')}
            className={`px-3 py-1.5 font-medium transition ${
              filterMode === 'matches' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Flagged Matches (3)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('clear')}
            className={`px-3 py-1.5 font-medium transition ${
              filterMode === 'clear' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Clear Records (5)
          </button>
        </div>
      </div>

      {/* Detections Cards Grid */}
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

                {/* Face Capture Visual with Biometric Box */}
                <div className="flex justify-center mb-3">
                  <FacePlaceholder
                    id={item.detectionId}
                    confidence={item.confidence}
                    variant="detected"
                    isMatch={isMatch}
                    className="w-full max-w-[170px]"
                  />
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
                    <span className="text-slate-400">Camera / Station:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[130px]" title={item.location}>
                      {item.camera}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Demographics:</span>
                    <span className="text-slate-700">
                      {item.gender}, {item.estimatedAge}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Head Pose:</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {item.headPose}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {isMatch ? (
                  <button
                    type="button"
                    onClick={() => onSelectMatch('MATCH-1024')}
                    className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShieldAlertIcon className="w-3.5 h-3.5" />
                    Inspect Match Dossier
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-50 text-slate-400 font-medium text-xs border border-slate-200 cursor-default text-center"
                  >
                    Clear • Logged to Audit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
