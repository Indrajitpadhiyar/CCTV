import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Hash, CheckCircle, ExternalLink } from 'lucide-react';

export const AuditTable = ({ logs = [] }) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === "ALL" || log.action === filterAction;
    const matchesQuery = filterQuery === "" ||
      log.officerId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.query.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.caseId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.hash.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesAction && matchesQuery;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Immutable Chain-of-Custody Audit Ledger
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Every officer query is hashed with SHA-256 and appended to the constitutional compliance trail
            </p>
          </div>
        </div>

        {/* Search / Filter Inputs */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search officer, query or hash..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-800 font-mono focus:outline-hidden"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:outline-hidden"
          >
            <option value="ALL">All Actions</option>
            <option value="VEHICLE_TRAJECTORY_SEARCH">Vehicle Tracking</option>
            <option value="NATURAL_LANGUAGE_QUERY">NL Query</option>
            <option value="MISSING_PERSON_SIGHTING_CONFIRMED">Sighting Verified</option>
            <option value="EMERGENCY_UNIT_DISPATCH">CAD Dispatch</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 font-mono">
              <th className="p-2.5">Audit ID</th>
              <th className="p-2.5">Officer (UID)</th>
              <th className="p-2.5">Action Code</th>
              <th className="p-2.5">Query / Execution Details</th>
              <th className="p-2.5">Linked Case</th>
              <th className="p-2.5">Timestamp</th>
              <th className="p-2.5">SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors font-mono">
                <td className="p-2.5 font-bold text-blue-900">{log.id}</td>
                <td className="p-2.5 font-semibold text-slate-800 font-sans">{log.officerId}</td>
                <td className="p-2.5">
                  <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {log.action}
                  </span>
                </td>
                <td className="p-2.5 text-slate-700 font-sans max-w-xs truncate" title={log.query}>
                  {log.query}
                </td>
                <td className="p-2.5 font-bold text-[#0B2545]">{log.caseId}</td>
                <td className="p-2.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="p-2.5 font-mono text-[10px] text-emerald-800" title={log.hash}>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[90px]">{log.hash.slice(0, 10)}...</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
