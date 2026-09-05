import React from 'react';
import { SlidersHorizontal, CheckCircle2, Edit2, AlertCircle } from 'lucide-react';
import { AIEstimateBadge } from '../../common/AIEstimateBadge';

export const QueryPills = ({ parsedQuery, onUpdateField, onReRun }) => {
  if (!parsedQuery) return null;

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0B2545]" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Structured Forensic Filters (AI Parsed)
          </span>
        </div>

        <AIEstimateBadge 
          text="AI Parsed Query — Human-in-the-Loop" 
          details="Natural language query was converted into structured SQL/Vector embeddings. You may adjust any parameter chip directly before initiating the surveillance retrieval."
          size="sm"
        />
      </div>

      {/* Editable Filter Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Color */}
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Vehicle Color
          </label>
          <input 
            type="text"
            value={parsedQuery.color || ""}
            onChange={(e) => onUpdateField('color', e.target.value)}
            className="w-full font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 text-xs focus:outline-hidden focus:border-[#0B2545]"
          />
        </div>

        {/* Object Type */}
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Object Type
          </label>
          <input 
            type="text"
            value={parsedQuery.objectType || ""}
            onChange={(e) => onUpdateField('objectType', e.target.value)}
            className="w-full font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 text-xs focus:outline-hidden focus:border-[#0B2545]"
          />
        </div>

        {/* Location Corridor */}
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Corridor / Junction
          </label>
          <input 
            type="text"
            value={parsedQuery.location || ""}
            onChange={(e) => onUpdateField('location', e.target.value)}
            className="w-full font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 text-xs focus:outline-hidden focus:border-[#0B2545]"
          />
        </div>

        {/* Time Window */}
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Time Window
          </label>
          <input 
            type="text"
            value={parsedQuery.timeRange || ""}
            onChange={(e) => onUpdateField('timeRange', e.target.value)}
            className="w-full font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-[#0B2545]"
          />
        </div>
      </div>

      {/* Re-Run Button & Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
        <span>Click into any filter chip above to modify parameters prior to indexing search.</span>
        <button
          type="button"
          onClick={onReRun}
          className="px-3 py-1 bg-[#0B2545] hover:bg-[#10305A] text-white font-semibold rounded-md shadow-xs transition-colors"
        >
          Apply Structured Filters
        </button>
      </div>
    </div>
  );
};
