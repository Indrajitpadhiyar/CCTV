import React, { useState } from 'react';
import {
  SearchIcon,
  BellIcon,
  MenuIcon,
  ChevronDownIcon,
  ShieldIcon,
  CheckCircleIcon,
  AlertTriangleIcon
} from '../common/Icons';

export function Header({
  pageTitle = 'Dashboard',
  pageDescription = 'Real-time CCTV surveillance & biometric face recognition monitoring',
  onOpenMobileMenu,
  onOpenGlobalSearch,
  onOpenAlerts,
  activeAlerts = []
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Mobile hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            aria-label="Open mobile menu"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {pageTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Monitoring Active
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block mt-0.5">
              {pageDescription}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button / Trigger */}
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition text-left w-36 sm:w-64"
          >
            <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Search camera, criminal, FIR...</span>
            <kbd className="hidden lg:inline-block ml-auto text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              /
            </kbd>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotificationsMenu(!showNotificationsMenu);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition border border-transparent hover:border-slate-200"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs ring-2 ring-white">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900">
                    High Priority Alerts ({activeAlerts.length})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotificationsMenu(false);
                      if (onOpenAlerts) onOpenAlerts();
                    }}
                    className="text-[11px] font-medium text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {activeAlerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.alertId}
                      className="p-3 hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => {
                        setShowNotificationsMenu(false);
                        if (onOpenAlerts) onOpenAlerts();
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="p-1 rounded bg-rose-100 text-rose-700 mt-0.5">
                          <AlertTriangleIcon className="w-3.5 h-3.5" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-800">
                              {alert.type}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {alert.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate mt-0.5">
                            {alert.description}
                          </p>
                          <div className="text-[10px] text-blue-600 font-medium mt-1">
                            {alert.camera} • {alert.policeStation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Officer Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotificationsMenu(false);
              }}
              className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-slate-100 transition border border-transparent hover:border-slate-200 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100">
                RR
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-none">
                  Insp. R. Rathore
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  CID Crime Branch
                </div>
              </div>
              <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-semibold text-slate-900">
                    Inspector R. Rathore
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Badge ID: GJ-POL-8842
                  </div>
                  <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                    Authorized Clearance: Level 4
                  </div>
                </div>

                <div className="py-1">
                  <div className="px-4 py-1.5 text-slate-600 text-[11px] flex justify-between">
                    <span>Shift Status</span>
                    <span className="text-emerald-600 font-medium">On Duty (Night)</span>
                  </div>
                  <div className="px-4 py-1.5 text-slate-600 text-[11px] flex justify-between">
                    <span>Active Station</span>
                    <span className="font-medium text-slate-800">Gandhinagar HQ</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition text-xs"
                  >
                    Officer Profile & Credentials
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition text-xs"
                  >
                    Audit Activity Log
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 transition text-xs font-medium"
                  >
                    Secure Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
