import React, { useState, useEffect } from 'react';
import { Shield, Clock, Globe, User, Building2, Bell, AlertTriangle, ChevronDown, LogOut, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCase } from '../../context/CaseContext';

export const Header = () => {
  const { officer, switchStation, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { activeIncident } = useCase();
  const [time, setTime] = useState(new Date());
  const [showStationMenu, setShowStationMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Live IST Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stations = [
    { name: "SG Highway Command HQ, Ahmedabad", district: "Ahmedabad City Police" },
    { name: "Navrangpura Police Station", district: "Ahmedabad City Police" },
    { name: "Surat City Commissionerate Control Room", district: "Surat City Police" },
    { name: "Vadodara SIT Hub & CAD Cell", district: "Vadodara City Police" },
    { name: "Rajkot Central Surveillance Room", district: "Rajkot City Police" },
    { name: "Gandhinagar State Cyber Command HQ", district: "Gujarat State Police" }
  ];

  return (
    <header className="bg-[#0B2545] border-b border-[#10305A] text-white sticky top-0 z-40 shadow-md">
      {/* Topmost Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Gujarat Police Shield & Drishti Wordmark */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#10305A] border-2 border-[#C9A227] shadow-inner text-[#C9A227]">
            <Shield className="w-5 h-5 fill-[#C9A227]/20" />
            <div className="absolute -bottom-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wide text-white uppercase flex items-center gap-1.5">
                <span>{t('appTitle')}</span>
              </h1>
              <span className="bg-[#C9A227] text-slate-950 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                v2.4 SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              {t('appSubtitle')} <span className="text-slate-400">| {t('stateName')}</span>
            </p>
          </div>
        </div>

        {/* Center: Live Emergency Ticker */}
        {activeIncident && activeIncident.status === 'DISPATCHED' && (
          <div className="hidden lg:flex items-center gap-2 bg-red-950/80 border border-red-500/60 px-3 py-1 rounded-full text-xs font-mono text-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold text-white">CAD ALERT {activeIncident.id}:</span>
            <span>{activeIncident.location} — Units En Route</span>
          </div>
        )}

        {/* Right: Station, Language, Clock, Officer Profile */}
        <div className="flex items-center gap-3 text-xs">
          {/* Station / District Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStationMenu(!showStationMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-1.5 bg-[#10305A] hover:bg-[#163f75] px-2.5 py-1.5 rounded-md border border-slate-600/70 transition-colors text-slate-200 text-left"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C9A227]" />
              <div className="hidden xl:block">
                <p className="text-[10px] text-slate-400 font-mono uppercase">{officer?.district}</p>
                <p className="text-[11px] font-semibold text-slate-100 truncate max-w-[180px]">{officer?.station}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
            </button>

            {showStationMenu && (
              <div className="absolute right-0 mt-1 w-72 bg-[#07172B] border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C9A227] border-b border-slate-700">
                  Switch Surveillance Jurisdiction
                </div>
                {stations.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchStation(st.name, st.district);
                      setShowStationMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#10305A] transition-colors border-b border-slate-800 last:border-0 ${
                      officer?.station === st.name ? 'bg-[#10305A] text-[#C9A227]' : 'text-slate-200'
                    }`}
                  >
                    <p className="font-semibold">{st.name}</p>
                    <p className="text-[10px] text-slate-400">{st.district}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle (EN / ગુજરાતી / हिंदी) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowStationMenu(false);
              }}
              className="flex items-center gap-1.5 bg-[#10305A] hover:bg-[#163f75] px-2.5 py-1.5 rounded-md border border-slate-600/70 text-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-semibold text-xs">
                {lang === 'en' ? 'English' : lang === 'gu' ? 'ગુજરાતી' : 'हिंदी'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-[#07172B] border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => { setLang('en'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#10305A] transition-colors flex items-center justify-between ${lang === 'en' ? 'text-[#C9A227] font-bold' : 'text-slate-200'}`}
                >
                  <span>English</span>
                  {lang === 'en' && <span className="text-[10px]">●</span>}
                </button>
                <button
                  onClick={() => { setLang('gu'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#10305A] transition-colors flex items-center justify-between ${lang === 'gu' ? 'text-[#C9A227] font-bold' : 'text-slate-200'}`}
                >
                  <span>ગુજરાતી</span>
                  {lang === 'gu' && <span className="text-[10px]">●</span>}
                </button>
                <button
                  onClick={() => { setLang('hi'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#10305A] transition-colors flex items-center justify-between ${lang === 'hi' ? 'text-[#C9A227] font-bold' : 'text-slate-200'}`}
                >
                  <span>हिंदी</span>
                  {lang === 'hi' && <span className="text-[10px]">●</span>}
                </button>
              </div>
            )}
          </div>

          {/* Live Indian Standard Time Clock */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#07172B] px-3 py-1.5 rounded-md border border-slate-700/80 font-mono text-xs text-emerald-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {time.toLocaleTimeString('en-GB')} IST
            </span>
          </div>

          {/* Officer Profile Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <div className="w-7 h-7 rounded-full bg-[#C9A227] text-slate-950 font-bold flex items-center justify-center text-xs">
              {officer?.id?.slice(0, 2) || "GP"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-bold text-slate-100 text-xs leading-none">{officer?.name}</p>
              <p className="font-mono text-[10px] text-[#C9A227] mt-0.5">{officer?.id} | {officer?.badgeNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
