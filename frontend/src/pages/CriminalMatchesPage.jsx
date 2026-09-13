import React, { useState } from 'react';
import { RecentMatchesTable } from '../components/dashboard/RecentMatchesTable';
import { Badge } from '../components/common/Badge';
import { ShieldAlertIcon, FilterIcon, DownloadIcon } from '../components/common/Icons';

export function CriminalMatchesPage({ matches, onSelectMatch }) {
  const [riskFilter, setRiskFilter] = useState('all');

  const filtered = matches.filter((m) => {
    if (riskFilter === 'high') return m.riskLevel === 'High Risk';
    if (riskFilter === 'medium') return m.riskLevel === 'Medium Risk';
    if (riskFilter === 'low') return m.riskLevel === 'Low Risk';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Overview Info Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <ShieldAlertIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Criminal Identification & Biometric Correlation Center
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated facial recognition alerts requiring police officer verification and ground team interception
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Level Filter Tabs */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setRiskFilter('all')}
              className={`px-3 py-1.5 font-medium transition ${
                riskFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              type="button"
              onClick={() => setRiskFilter('high')}
              className={`px-3 py-1.5 font-medium transition ${
                riskFilter === 'high' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              High Risk
            </button>
            <button
              type="button"
              onClick={() => setRiskFilter('medium')}
              className={`px-3 py-1.5 font-medium transition ${
                riskFilter === 'medium' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Medium Risk
            </button>
          </div>

          <button
            type="button"
            onClick={() => alert('Exporting Official Incident Report PDF...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
          >
            <DownloadIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Incident Log</span>
          </button>
        </div>
      </div>

      {/* Main Matches Table */}
      <RecentMatchesTable
        matches={filtered}
        onSelectMatch={onSelectMatch}
      />
    </div>
  );
}
