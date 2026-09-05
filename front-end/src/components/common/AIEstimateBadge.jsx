import React, { useState } from 'react';
import { AlertTriangle, Sparkles, HelpCircle, X, ShieldAlert } from 'lucide-react';

export const AIEstimateBadge = ({ 
  text = "AI Estimate — Requires Verification", 
  details = "Inferred from camera topology, intersection turn probability, and historical motion patterns. Must be independently verified by an investigating officer before taking procedural action.",
  confidence = null,
  size = "md" 
}) => {
  const [showModal, setShowModal] = useState(false);

  const sizeClasses = size === "sm" 
    ? "text-[11px] px-2 py-0.5" 
    : "text-xs px-2.5 py-1 font-medium";

  return (
    <>
      <span 
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-amber-50 text-amber-900 cursor-pointer shadow-xs hover:bg-amber-100/90 transition-colors ${sizeClasses}`}
        title="Click to view AI Explainability & Human Verification Safeguard notice"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span className="font-semibold tracking-wide">{text}</span>
        {confidence && (
          <span className="bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded-sm text-[10px] font-mono">
            {confidence}
          </span>
        )}
        <HelpCircle className="w-3 h-3 text-amber-600/80" />
      </span>

      {/* AI Explainability & Disclaimer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-amber-300 overflow-hidden animate-in fade-in duration-200">
            <div className="bg-amber-500 text-slate-900 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
                <ShieldAlert className="w-5 h-5 text-slate-950" />
                <span>MANDATORY AI SAFEGUARD NOTICE</span>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-950 hover:bg-amber-600/30 p-1 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5 text-slate-700 text-sm">
              <div className="flex items-start gap-3 bg-amber-50/70 p-3 rounded-lg border border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">Standard Operating Procedure (SOP) Compliance</p>
                  <p className="text-xs leading-relaxed text-slate-700">
                    This insight was produced by automated video analytics models. Under Gujarat Police IT Guidelines, AI outputs constitute investigative leads only and cannot be entered as verified evidence without human-in-the-loop validation.
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-1">Model Inference Rationale</p>
                <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-md border border-slate-200 font-mono leading-relaxed">
                  {details}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                Officer logged: <span className="font-mono font-medium text-slate-700">Inspector P. R. Jadeja (USER_104)</span> | Tamper-proof audit record logged.
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 bg-[#0B2545] text-white text-xs font-semibold rounded-md hover:bg-[#10305A] transition-colors"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
