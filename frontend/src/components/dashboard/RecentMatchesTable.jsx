import React from 'react';
import { FacePlaceholder } from '../common/FacePlaceholder';
import { Badge } from '../common/Badge';
import { EyeIcon, ShieldAlertIcon } from '../common/Icons';

export function RecentMatchesTable({ matches = [], onSelectMatch, onFilterChange }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      {/* Table Header Controls */}
      <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Recent Criminal Matches
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {matches.length} Detected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated facial recognition detections correlated with State Criminal Database
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <span className="font-semibold text-slate-700">Latest Sightings</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3">Match ID</th>
              <th scope="col" className="px-3 py-3">Detected Face</th>
              <th scope="col" className="px-4 py-3">Database Match</th>
              <th scope="col" className="px-4 py-3">AI Confidence</th>
              <th scope="col" className="px-4 py-3">Camera</th>
              <th scope="col" className="px-4 py-3">Location & Station</th>
              <th scope="col" className="px-4 py-3">Detected At</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matches.map((item) => {
              const isHigh = item.riskLevel === 'High Risk';
              return (
                <tr
                  key={item.matchId}
                  className="hover:bg-slate-50/80 transition group"
                >
                  {/* Match ID */}
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {isHigh && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 animate-pulse"></span>
                      )}
                      <span>{item.matchId}</span>
                    </div>
                  </td>

                  {/* Face Thumbnail / CCTV Frame */}
                  <td className="px-3 py-3">
                    <div className="w-14 h-10 rounded-md overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center relative shadow-2xs">
                      {item.annotatedSnapshot || item.annotated_snapshot ? (
                        <img
                          src={item.annotatedSnapshot || item.annotated_snapshot}
                          alt="CCTV Frame"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.snapshotUrl || `http://127.0.0.1:8000/api/camera/${item.cameraCode || 'cam01'}/snapshot`}
                          alt="Snapshot"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'http://127.0.0.1:8000/api/camera/cam01/snapshot';
                          }}
                        />
                      )}
                      <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono text-rose-400 px-1 py-0.2 rounded-tl">
                        {item.camera || 'CAM'}
                      </span>
                    </div>
                  </td>

                  {/* Database Match */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {item.criminalId}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">
                      {item.criminalName}
                    </div>
                  </td>

                  {/* AI Confidence */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            item.confidence >= 90 ? 'bg-rose-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {item.confidence}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Vector Similarity
                    </span>
                  </td>

                  {/* Camera */}
                  <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                    <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {item.camera}
                    </span>
                  </td>

                  {/* Location & Station */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-slate-900">
                      {item.policeStation}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.area}, {item.city}
                    </div>
                  </td>

                  {/* Detected At */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {item.detectedAt}
                    </div>
                    <div className="text-[10px] text-rose-600 font-semibold">
                      {item.detectedAgo}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isHigh ? (
                      <Badge variant="danger" dot size="sm">
                        {item.riskLevel}
                      </Badge>
                    ) : (
                      <Badge variant="warning" dot size="sm">
                        {item.riskLevel}
                      </Badge>
                    )}
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {item.status}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectMatch(item.matchId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs transition shadow-2xs group-hover:border-blue-300 group-hover:text-blue-700"
                    >
                      <EyeIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {matches.length === 0 && (
        <div className="p-12 text-center flex flex-col items-center justify-center text-xs space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <ShieldAlertIcon className="w-5 h-5 text-slate-400" />
          </div>
          <span className="font-bold text-slate-700 text-sm">No Active Criminal Matches</span>
          <p className="text-slate-400 max-w-md">
            Zero active alerts for the current filters. Upload a target photo in the "Find Person by Face" panel on the Dashboard to initiate surveillance scans across active CCTV cameras.
          </p>
        </div>
      )}
    </div>
  );
}
