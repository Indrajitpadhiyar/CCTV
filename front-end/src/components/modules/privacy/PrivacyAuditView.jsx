import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sliders, 
  Clock, 
  Key, 
  FileCheck, 
  Scale, 
  Database, 
  CheckCircle2, 
  ShieldAlert,
  Server
} from 'lucide-react';
import { mockPrivacyControls } from '../../../data/mockAuditLogs';
import { AuditTable } from './AuditTable';
import { AccessRequestModal } from './AccessRequestModal';
import { useCase } from '../../../context/CaseContext';
import { useLanguage } from '../../../context/LanguageContext';

export const PrivacyAuditView = () => {
  const { 
    auditLogs, 
    accessRequests, 
    handleAccessRequestAction, 
    retentionDays, 
    setRetentionDays,
    recordAuditLog,
    addToast
  } = useCase();
  const { t } = useLanguage();

  const handleRetentionChange = (val) => {
    setRetentionDays(val);
    recordAuditLog("UPDATE_RETENTION_POLICY", `Updated automated data retention policy to ${val} days`, "SYSTEM_CONFIG");
    addToast(`Data Retention Policy set to ${val} days with automatic cryptographic purging`, "info");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B2545] tracking-wide uppercase flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <span>{t('privacyTitle')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('privacySubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>ZERO-TRUST ENFORCED</span>
        </div>
      </div>

      {/* Governance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Ledger Entries</p>
          <p className="text-2xl font-extrabold text-[#0B2545] font-mono">{auditLogs.length + 940}</p>
          <p className="text-[11px] text-emerald-700 font-medium">100% Cryptographically Hashed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Data Retention</p>
          <p className="text-2xl font-extrabold text-[#0B2545] font-mono">{retentionDays} {t('days')}</p>
          <p className="text-[11px] text-blue-700 font-medium">Auto-purge active daily 03:00 IST</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Access Requests</p>
          <p className="text-2xl font-extrabold text-amber-800 font-mono">
            {accessRequests.filter(r => r.status === 'PENDING').length} Pending
          </p>
          <p className="text-[11px] text-amber-700 font-medium">Requires DSP Authorization</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Compliance Tier</p>
          <p className="text-2xl font-extrabold text-emerald-700 font-mono">DPDP-2023</p>
          <p className="text-[11px] text-emerald-800 font-medium">Digital Data Protection Ready</p>
        </div>
      </div>

      {/* Privacy Controls Matrix & Retention Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Privacy Controls Settings Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0B2545]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                {t('privacyControls')}
              </h3>
            </div>
            <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              5 of 5 Enforced
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 font-mono text-[11px]">
                  <th className="p-2.5">Security Control</th>
                  <th className="p-2.5">Enforcement Status</th>
                  <th className="p-2.5">Authorization Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {mockPrivacyControls.map((ctrl) => (
                  <tr key={ctrl.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-2.5">
                      <p className="font-bold text-slate-900">{ctrl.control}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{ctrl.id}</p>
                    </td>
                    <td className="p-2.5">
                      <span className="bg-blue-50 text-blue-900 border border-blue-200 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                        {ctrl.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-600 text-[11px]">
                      {ctrl.requirement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Data Retention Slider Policy */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#C9A227]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  {t('retentionSlider')}
                </h3>
              </div>
              <span className="font-mono text-sm font-extrabold text-[#0B2545] bg-slate-100 px-2.5 py-1 rounded-lg">
                {retentionDays} Days
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Automated policy purges non-evidentiary optical CCTV frames older than threshold. Evidentiary clips linked to active FIR cases are cryptographically isolated in the judicial evidence vault.
            </p>

            {/* Slider */}
            <div className="space-y-2 pt-2">
              <input
                type="range"
                min="30"
                max="365"
                step="30"
                value={retentionDays}
                onChange={(e) => handleRetentionChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B2545]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>30 Days (Min)</span>
                <span>60 Days</span>
                <span>90 Days</span>
                <span>180 Days</span>
                <span>365 Days</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span>Next Purge Schedule:</span>
              <strong className="text-slate-900">Tomorrow, 03:00 IST</strong>
            </div>
            <div className="flex justify-between">
              <span>Estimated Storage Reclaimed:</span>
              <strong className="text-emerald-700">~14.2 TB / week</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Access Requests Queue */}
      <AccessRequestModal 
        requests={accessRequests}
        onAction={handleAccessRequestAction}
      />

      {/* Audit Log Table */}
      <AuditTable logs={auditLogs} />
    </div>
  );
};
