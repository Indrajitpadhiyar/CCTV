import React, { useState } from 'react';
import { FolderKanban, ChevronDown, Plus, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusPill } from '../common/StatusPill';

export const CaseBanner = ({ onOpenNewCase }) => {
  const { cases, activeCaseId, setActiveCaseId, activeCase } = useCase();
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
      {/* Active Case Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider font-mono">
          <FolderKanban className="w-4 h-4 text-[#0B2545]" />
          <span>{t('activeCase')}:</span>
        </div>

        {/* Case Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold text-[#0B2545] transition-colors"
          >
            <span>{activeCase?.id || t('noActiveCase')}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showDropdown && (
            <div className="absolute left-0 mt-1 w-96 bg-white border border-slate-300 rounded-lg shadow-2xl py-1 z-50 text-xs animate-in fade-in duration-150">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <span>Select Active Investigation Dossier</span>
                <span className="text-[#0B2545] font-mono">{cases.length} Total Cases</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCaseId(c.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${
                      activeCaseId === c.id ? 'bg-blue-50/70 border-l-4 border-l-[#0B2545]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono font-bold text-xs text-[#0B2545]">{c.id}</span>
                      <StatusPill status={c.status} size="sm" />
                    </div>
                    <p className="font-semibold text-slate-800 line-clamp-1">{c.title}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-mono">
                      <span>FIR: {c.firNumber}</span>
                      <span>•</span>
                      <span>{c.assignedOfficer}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Case Details Preview */}
        {activeCase && (
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-600 pl-3 border-l border-slate-300">
            <span className="font-medium text-slate-800 max-w-md truncate">{activeCase.title}</span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-slate-500 text-[11px]">{activeCase.firNumber}</span>
            <StatusPill status={activeCase.status} size="sm" />
          </div>
        )}
      </div>

      {/* Right: Quick Action to Create New Case File */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenNewCase}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2545] hover:bg-[#10305A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>New Case File</span>
        </button>
      </div>
    </div>
  );
};
