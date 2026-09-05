import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FolderKanban, 
  CarFront, 
  SearchCode, 
  Siren, 
  Users, 
  ShieldCheck, 
  LayoutGrid, 
  LogOut, 
  Radio,
  FileCheck2,
  Lock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCase } from '../../context/CaseContext';

export const Sidebar = () => {
  const { t } = useLanguage();
  const { logout, officer } = useAuth();
  const { activeIncident, missingData, cases } = useCase();

  // Count unverified missing person candidates
  const unverifiedCount = Object.values(missingData || {}).reduce((acc, c) => {
    return acc + (c.candidates?.filter(cand => cand.status === 'AI_CANDIDATE').length || 0);
  }, 0);

  const navItems = [
    {
      path: "/",
      label: t('navOverview'),
      icon: FolderKanban,
      badge: cases.length,
      badgeColor: "bg-slate-700 text-slate-200"
    },
    {
      path: "/vehicle",
      label: t('navVehicle'),
      icon: CarFront,
      badge: "ANPR",
      badgeColor: "bg-[#10305A] text-[#C9A227] border border-[#C9A227]/40 font-mono"
    },
    {
      path: "/search",
      label: t('navNLSearch'),
      icon: SearchCode,
      badge: "AI",
      badgeColor: "bg-amber-900/80 text-amber-200 border border-amber-600/40 font-mono"
    },
    {
      path: "/emergency",
      label: t('navEmergency'),
      icon: Siren,
      badge: activeIncident?.status === 'DISPATCHED' ? "1 ACTIVE" : null,
      badgeColor: "bg-red-600 text-white animate-pulse"
    },
    {
      path: "/missing",
      label: t('navMissing'),
      icon: Users,
      badge: unverifiedCount > 0 ? `${unverifiedCount} REQ` : null,
      badgeColor: "bg-amber-600 text-white font-mono"
    },
    {
      path: "/privacy",
      label: t('navPrivacy'),
      icon: ShieldCheck,
      badge: "AUDIT",
      badgeColor: "bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono"
    },
    {
      path: "/live",
      label: t('navLiveMatrix'),
      icon: LayoutGrid,
      badge: "30 CAM",
      badgeColor: "bg-slate-800 text-slate-300 font-mono"
    }
  ];

  return (
    <aside className="w-64 bg-[#0B2545] border-r border-[#10305A] flex flex-col justify-between shrink-0 shadow-lg select-none">
      {/* Navigation Links */}
      <div className="py-4 space-y-1 px-3">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Intelligence Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#C9A227] text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:bg-[#10305A] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950' : 'text-[#C9A227]'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-semibold shrink-0 ${
                      isActive ? 'bg-slate-950 text-[#C9A227]' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Sidebar Footer: System Trust Posture & Sign Out */}
      <div className="p-3 border-t border-[#10305A] space-y-3 bg-[#07172B]">
        {/* Compliance Status Card */}
        <div className="bg-[#0B2545]/80 p-2.5 rounded-lg border border-slate-700/70 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1 font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chain of Custody</span>
            </span>
            <span className="font-mono text-emerald-400 text-[10px]">ACTIVE</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">
            SHA-256 Ledger • Zero-Trust Mode
          </p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-red-950 hover:border-red-500 border border-slate-700 text-slate-300 hover:text-red-200 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('navLogout')}</span>
        </button>
      </div>
    </aside>
  );
};
