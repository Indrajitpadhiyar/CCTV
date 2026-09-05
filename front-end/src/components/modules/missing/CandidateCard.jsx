import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, Sparkles, Clock, Camera, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AIEstimateBadge } from '../../common/AIEstimateBadge';
import { VerifiedBadge } from '../../common/VerifiedBadge';

export const CandidateCard = ({ candidate, onConfirm, onReject, onInspect }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const isPending = candidate.status === 'AI_CANDIDATE';
  const isConfirmed = candidate.status === 'CONFIRMED';
  const isRejected = candidate.status === 'REJECTED';

  return (
    <div className={`bg-white rounded-xl border transition-all overflow-hidden flex flex-col justify-between ${
      isConfirmed ? 'border-2 border-emerald-600 bg-emerald-50/10 shadow-xs' :
      isRejected ? 'border-slate-300 opacity-60 bg-slate-50' :
      'border-amber-300 shadow-xs hover:shadow-md'
    }`}>
      <div className="p-4 space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono font-bold text-xs text-[#0B2545]">{candidate.id}</span>
          
          {isPending && (
            <AIEstimateBadge 
              text="AI Candidate — Unverified" 
              confidence={`${candidate.confidence}%`}
              size="sm"
            />
          )}

          {isConfirmed && (
            <VerifiedBadge text="Confirmed Sighting" size="sm" officer={candidate.verifiedBy} />
          )}

          {isRejected && (
            <span className="bg-slate-200 text-slate-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm">
              REJECTED (FALSE POSITIVE)
            </span>
          )}
        </div>

        {/* Thumbnail Crop & Inspect */}
        <div 
          onClick={() => onInspect && onInspect(candidate.cameraId)}
          className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-200 cursor-pointer group"
        >
          <img 
            src={candidate.boundingCrop || candidate.thumbnail} 
            alt={candidate.cameraName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
          />
          <div className="absolute inset-0 cctv-scanline opacity-30"></div>
          <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#C9A227]" />
            <span>Inspect Stream</span>
          </div>
        </div>

        {/* Camera & Sighting Metadata */}
        <div className="space-y-1.5 text-xs">
          <p className="font-bold text-slate-900 line-clamp-1">{candidate.cameraName}</p>
          
          <div className="bg-slate-50 p-2 rounded-lg font-mono text-[11px] text-slate-600 space-y-0.5 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Node:</span>
              <span className="font-semibold text-slate-800">{candidate.cameraId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time:</span>
              <span className="font-semibold text-slate-800">{candidate.timestamp}</span>
            </div>
          </div>

          {/* AI Extracted Attributes */}
          {candidate.aiFeatures && (
            <div className="text-[10px] font-mono space-y-1 text-slate-600 pt-1">
              <div>• Top: <strong className="text-slate-800">{candidate.aiFeatures.clothingMatch}</strong></div>
              <div>• Accessories: <strong className="text-slate-800">{candidate.aiFeatures.accessoryMatch}</strong></div>
              <div>• Gait / Posture: <strong className="text-slate-800">{candidate.aiFeatures.postureMatch}</strong></div>
            </div>
          )}

          {/* Verification Notes */}
          {candidate.verificationNote && (
            <div className="p-2 rounded bg-slate-100 text-[10px] text-slate-700 italic border border-slate-200">
              "{candidate.verificationNote}" — {candidate.verifiedBy} ({candidate.verifiedAt})
            </div>
          )}
        </div>
      </div>

      {/* Human-in-the-Loop Verification Action Buttons */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2">
        {isPending ? (
          <>
            {!showRejectInput ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onConfirm(candidate.id)}
                  className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Match</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRejectInput(true)}
                  className="py-1.5 px-2 bg-slate-200 hover:bg-red-100 text-slate-700 hover:text-red-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Reason (e.g. Mismatched clothing)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-[11px] px-2 py-1 bg-white border border-slate-300 rounded focus:outline-hidden"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      onReject(candidate.id, rejectReason);
                      setShowRejectInput(false);
                    }}
                    className="flex-1 bg-red-700 text-white text-[10px] font-bold py-1 rounded"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => setShowRejectInput(false)}
                    className="px-2 bg-slate-200 text-slate-700 text-[10px] rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center font-mono text-[10px] text-slate-500 py-0.5">
            {isConfirmed ? "Confirmed as Evidentiary Sighting" : "Logged as False Positive"}
          </div>
        )}
      </div>
    </div>
  );
};
