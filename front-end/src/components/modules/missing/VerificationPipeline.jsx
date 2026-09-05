import React from 'react';
import { Sparkles, UserCheck, CheckCircle2, XCircle, ChevronRight, ShieldCheck } from 'lucide-react';

export const VerificationPipeline = ({ pendingCount = 0, confirmedCount = 0, rejectedCount = 0 }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0B2545]" />
          <span>Human-in-the-Loop Sighting Verification Pipeline</span>
        </h3>
        <span className="font-mono text-[10px] text-slate-500">
          Total Screened: {pendingCount + confirmedCount + rejectedCount}
        </span>
      </div>

      {/* 3-Stage Progress Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Stage 1: AI Candidate (Amber) */}
        <div className="bg-amber-50/70 border border-amber-300 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-800 uppercase font-mono">Stage 1: AI Discovery</p>
              <p className="text-xs font-extrabold text-amber-950">Candidate Matches</p>
            </div>
          </div>
          <span className="text-base font-extrabold font-mono text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
            {pendingCount}
          </span>
        </div>

        {/* Stage 2: Confirmed Matches (Green) */}
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-800 uppercase font-mono">Stage 2: Verified</p>
              <p className="text-xs font-extrabold text-emerald-950">Confirmed Sightings</p>
            </div>
          </div>
          <span className="text-base font-extrabold font-mono text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
            {confirmedCount}
          </span>
        </div>

        {/* Stage 3: Rejected / False Positives (Slate) */}
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-600 uppercase font-mono">Stage 3: Screened Out</p>
              <p className="text-xs font-extrabold text-slate-800">False Positives</p>
            </div>
          </div>
          <span className="text-base font-extrabold font-mono text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
            {rejectedCount}
          </span>
        </div>
      </div>
    </div>
  );
};
