import React from 'react';
import {
  ShieldIcon,
  LayoutDashboardIcon,
  VideoIcon,
  ScanFaceIcon,
  UserCheckIcon,
  MapPinIcon,
  BellIcon,
  DatabaseIcon,
  BarChartIcon,
  SettingsIcon,
  CloseIcon,
  ShieldAlertIcon
} from '../common/Icons';

export function Sidebar({ currentRoute, onNavigate, isMobileOpen, onCloseMobile, activeAlertsCount = 6, criminalMatchesCount = 17 }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboardIcon,
      badge: null
    },
    {
      id: 'cameras',
      label: 'Live Cameras',
      icon: VideoIcon,
      badge: '128'
    },
    {
      id: 'detections',
      label: 'Face Detection',
      icon: ScanFaceIcon,
      badge: 'LIVE'
    },
    {
      id: 'matches',
      label: 'Criminal Matches',
      icon: UserCheckIcon,
      badge: criminalMatchesCount,
      badgeColor: 'danger'
    },
    {
      id: 'locations',
      label: 'Camera Locations',
      icon: MapPinIcon,
      badge: null
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: BellIcon,
      badge: activeAlertsCount,
      badgeColor: 'warning'
    },
    {
      id: 'criminals',
      label: 'Criminal Database',
      icon: DatabaseIcon,
      badge: null
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChartIcon,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      badge: null
    }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <ShieldIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base leading-none">
                Police Vision
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                GJ-CID
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-1">
              Camera Intelligence System
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Surveillance Command
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.badgeColor === 'danger'
                      ? 'bg-rose-100 text-rose-700'
                      : item.badgeColor === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/60">
        <div className="p-3 rounded-lg border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-600">
              System Status
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
            <span className="text-emerald-600">●</span> All Systems Operational
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
            <span>Core v3.2.4</span>
            <span>Latency: 14ms</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-white shadow-xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
