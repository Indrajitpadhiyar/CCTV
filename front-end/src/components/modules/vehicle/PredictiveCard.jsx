import React from 'react';
import { Sparkles, MapPin, Radio, AlertTriangle, ShieldCheck, ArrowRight, Compass, Activity } from 'lucide-react';
import { AIEstimateBadge } from '../../common/AIEstimateBadge';
import { useCase } from '../../../context/CaseContext';

export const PredictiveCard = ({ vehicleData }) => {
  const { addToast, recordAuditLog } = useCase();

  if (!vehicleData) return null;

  const { lastSeenCamera, lastSeenTime, lastSeenLocation, prediction } = vehicleData;

  const handleAlertDownstream = () => {
    recordAuditLog(
      "DOWNSTREAM_CHECKPOINT_ALERT",
      `Dispatched predictive lead alert to ${prediction?.nextCameraId} (${prediction?.nextCameraName}) checkpoint team`,
      vehicleData.linkedCaseId
    );
    addToast(`Downstream Checkpoint Alert sent to ${prediction?.nextCameraName} Patrol Team`, "success");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Trajectory Summary & Predictive Next Camera
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Algorithmic junction flow probability based on historical traffic telemetry
            </p>
          </div>
        </div>

        <AIEstimateBadge 
          text="AI Estimate — Requires Verification" 
          confidence={prediction?.probability}
          details={prediction?.explanation || "Inferred from camera graph connectivity, corridor velocity and historic turn probabilities."}
        />
      </div>

      {/* Two Column Grid: Last Confirmed vs Likely Next */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Last Confirmed Sighting (Green) */}
        <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Last Confirmed Sighting</span>
            </span>
            <span className="font-mono bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">
              VERIFIED
            </span>
          </div>

          <div className="space-y-1">
            <div className="font-mono font-bold text-base text-slate-900 flex items-center gap-2">
              <span className="text-[#0B2545]">{lastSeenCamera}</span>
              <span className="text-slate-400">|</span>
              <span className="text-xs font-sans text-slate-700 font-normal">{lastSeenLocation}</span>
            </div>
            <div className="text-xs font-mono text-slate-600">
              Recorded at: <span className="font-bold text-slate-900">{lastSeenTime}</span>
            </div>
          </div>
        </div>

        {/* Right: Likely Next Camera (Amber) */}
        {prediction ? (
          <div className="bg-amber-50/60 rounded-lg p-4 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Likely Next Node (AI Predictive Intercept)</span>
              </span>
              <span className="font-mono bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded text-[10px] font-bold">
                {prediction.probability} CONFIDENCE
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-mono font-bold text-base text-amber-950 flex items-center gap-2">
                <span className="text-[#C9A227] bg-slate-900 px-2 py-0.5 rounded text-xs">{prediction.nextCameraId}</span>
                <span className="text-slate-400">|</span>
                <span className="text-xs font-sans text-slate-800 font-normal">{prediction.nextCameraName}</span>
              </div>
              <div className="text-xs font-mono text-slate-700">
                Est. Intercept Window: <span className="font-bold text-amber-900">{prediction.estimatedArrival}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center justify-center">
            No predictive projection available.
          </div>
        )}
      </div>

      {/* Model Rationale & Explainability Bar */}
      {prediction && (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 max-w-xl">
            <Activity className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600">
              <span className="font-bold text-slate-800 font-mono">Inference Vector: </span>
              {prediction.corridor} ({prediction.inferenceMethod}).
              <span className="text-slate-500 block italic mt-0.5">
                Investigative advisory only — does not establish legal presence without physical checkpoint confirmation.
              </span>
            </div>
          </div>

          <button
            onClick={handleAlertDownstream}
            className="px-3.5 py-1.5 bg-[#0B2545] hover:bg-[#10305A] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Radio className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Alert Downstream Patrol</span>
          </button>
        </div>
      )}
    </div>
  );
};
