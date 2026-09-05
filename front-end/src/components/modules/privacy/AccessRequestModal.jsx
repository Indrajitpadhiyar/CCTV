import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Key } from 'lucide-react';
import { StatusPill } from '../../common/StatusPill';

export const AccessRequestModal = ({ requests = [], onAction }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-[#C9A227]" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Supervisory Permission Requests Queue
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Role-based token grants for high-sensitivity forensic queries & archival scans
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-900">{req.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-slate-900">{req.targetResource}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Requested by: <strong>{req.requestingOfficer}</strong> ({req.role}) • Case: {req.caseId}
                </p>
              </div>

              <StatusPill status={req.status} size="sm" />
            </div>

            <p className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">
              <strong className="text-slate-900">Justification:</strong> {req.justification}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-slate-400 font-mono">
                {req.requestedAt} • Approver: {req.approverRole}
              </span>

              {req.status === 'PENDING' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onAction(req.id, 'APPROVED')}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => onAction(req.id, 'DENIED')}
                    className="px-3 py-1 bg-slate-200 hover:bg-red-100 text-slate-700 hover:text-red-700 font-bold text-xs rounded transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Deny</span>
                  </button>
                </div>
              ) : (
                <span className="font-mono text-[11px] text-slate-500">
                  {req.status === 'APPROVED' ? 'Token Active' : 'Request Dismissed'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
