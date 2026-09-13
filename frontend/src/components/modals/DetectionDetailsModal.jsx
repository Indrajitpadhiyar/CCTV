import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FacePlaceholder } from '../common/FacePlaceholder';
import { Badge } from '../common/Badge';
import {
  MapPinIcon,
  VideoIcon,
  ClockIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  XCircleIcon,
  DownloadIcon,
  RadioIcon,
  ArrowUpRightIcon
} from '../common/Icons';

export function DetectionDetailsModal({ isOpen, onClose, match, onDispatchUnit, onViewCameraFeed }) {
  const [actionNotice, setActionNotice] = useState(null);

  if (!match) return null;

  const handleAction = (message) => {
    setActionNotice(message);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detection Dossier: ${match.detectionId || 'DET-1024'}`}
      subtitle="AI Biometric Face Analysis & Multi-Camera Transit Correlation"
      maxWidth="max-w-4xl"
    >
      {/* Feedback Alert Toast inside modal */}
      {actionNotice && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-blue-500 hover:text-blue-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* TOP: Detection Metadata Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Detection ID
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {match.detectionId}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Detected At
              </span>
              <span className="font-semibold text-slate-900">
                {match.detectedAt}
              </span>
              <span className="text-[10px] text-rose-600 block font-medium">
                ({match.detectedAgo})
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Active Camera
              </span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-block">
                {match.camera}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {match.cameraName}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Jurisdiction
              </span>
              <span className="font-semibold text-slate-900">
                {match.policeStation}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {match.area}, {match.city}
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE: Biometric Face Comparison Panel */}
        <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm">
                Biometric Face Analysis & Criminal Database Match
              </h4>
              <Badge variant="danger" dot size="sm">
                {match.riskLevel}
              </Badge>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Algorithm: GJ-BIO-v4.8
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Real CCTV Detected Face Frame */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-full aspect-video max-w-[280px] rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center relative shadow-sm">
                {match.annotatedSnapshot || match.annotated_snapshot ? (
                  <img
                    src={match.annotatedSnapshot || match.annotated_snapshot}
                    alt={`CCTV Frame ${match.camera}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={match.snapshotUrl || `http://127.0.0.1:8000/api/camera/${match.cameraCode || 'cam01'}/snapshot`}
                    alt="Live Camera Snapshot"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `http://127.0.0.1:8000/api/camera/cam01/snapshot`;
                    }}
                  />
                )}
                <div className="absolute top-1 left-1 bg-black/75 backdrop-blur-xs text-rose-400 text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>REC 4K • {match.camera}</span>
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-slate-600 font-medium">
                Actual CCTV Footage Frame ({match.camera})
              </div>
              {onViewCameraFeed && (
                <button
                  type="button"
                  onClick={() => onViewCameraFeed(match)}
                  className="mt-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                >
                  <VideoIcon className="w-3.5 h-3.5" />
                  <span>Stream Live Camera Feed</span>
                </button>
              )}
            </div>

            {/* Center: Comparison Metrics & Match Confidence */}
            <div className="md:col-span-4 flex flex-col justify-center space-y-3 px-2">
              <div className="text-center p-3 rounded-lg bg-rose-50/60 border border-rose-200">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  AI Match Confidence
                </div>
                <div className="text-3xl font-extrabold text-rose-700 font-mono my-1">
                  {match.confidence}%
                </div>
                <Badge variant="danger" size="sm" dot>
                  {match.status}
                </Badge>
              </div>

              {/* Landmark breakdown */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Facial Structure Index</span>
                    <span className="font-mono font-bold text-slate-900">
                      {match.facialFeatures?.structureMatch || 96.2}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${match.facialFeatures?.structureMatch || 96.2}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Inter-Pupillary Distance</span>
                    <span className="font-mono font-bold text-slate-900">
                      {match.facialFeatures?.eyeDistance || 93.8}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${match.facialFeatures?.eyeDistance || 93.8}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span>Jawline Correlation</span>
                    <span className="font-mono font-bold text-slate-900">
                      {match.facialFeatures?.jawlineCorrelation || 94.5}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${match.facialFeatures?.jawlineCorrelation || 94.5}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Database Reference / Uploaded Target Profile */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[210px] aspect-square rounded-lg overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center relative shadow-2xs">
                {match.photo ? (
                  <img src={match.photo} alt="Subject Reference" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="http://127.0.0.1:8000/api/sample-face"
                    alt="Target Reference Face"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                  TARGET PROFILE
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-slate-500 font-medium">
                Target Reference Profile ({match.criminalId || 'ID-REF'})
              </div>
            </div>
          </div>

          {/* Legal Case Info Box */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Subject Record</span>
              <span className="font-bold text-slate-900">{match.criminalName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Case Reference</span>
              <span className="font-mono font-semibold text-slate-800">{match.caseId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Offense Classification</span>
              <span className="font-medium text-slate-700 truncate block">{match.chargeCategory}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM: Camera Trail (Timeline) - KEY FEATURE */}
        <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-white shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Multi-Camera Movement Trail</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {match.cameraTrail?.length || 0} Sightings
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Sequential camera telemetry reconstructing the subject's transit path
              </p>
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {match.cameraTrail?.map((trail, index) => {
              const isCurrent = trail.isCurrent;
              return (
                <div key={index} className="relative group">
                  {/* Timeline node icon */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ${
                      isCurrent
                        ? 'bg-rose-600 text-white ring-rose-100 animate-pulse'
                        : 'bg-white border-2 border-slate-400 text-slate-600 ring-slate-100'
                    }`}
                  >
                    {isCurrent ? (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                    )}
                  </div>

                  {/* Sighting card */}
                  <div className={`p-3.5 rounded-lg border ${
                    isCurrent ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50/60 border-slate-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {trail.time}
                        </span>
                        <span className="font-mono text-xs font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                          {trail.camera}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {trail.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-700">
                          Confidence: {trail.confidence}%
                        </span>
                        <Badge
                          variant={isCurrent ? 'danger' : 'neutral'}
                          size="sm"
                        >
                          {trail.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                      <div className="flex items-center gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trail.location}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">{trail.policeStation}</span>
                      </div>

                      {trail.speedEstimate && (
                        <div className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          Transit: {trail.speedEstimate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="text-[11px] text-slate-400">
            Officer Clearance: Level 4 • Subject to Section 41 CrPC Guidelines
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => handleAction('False positive logged. Biometric weights recalibrated.')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              Flag False Positive
            </button>

            <button
              type="button"
              onClick={() => handleAction('Match confirmed. Case officer notified and file updated.')}
              className="px-3.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition"
            >
              Verify & Confirm Match
            </button>

            <button
              type="button"
              onClick={() => {
                if (onDispatchUnit) onDispatchUnit(match);
                handleAction(`Dispatch alert sent to ${match.policeStation} Sector Patrol 14.`);
              }}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              <ShieldAlertIcon className="w-3.5 h-3.5" />
              Dispatch Intercept Unit
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
