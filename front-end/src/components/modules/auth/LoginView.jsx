import React, { useState } from 'react';
import { Shield, Lock, User, Building2, KeyRound, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';

export const LoginView = () => {
  const { login } = useAuth();
  const { t, lang, setLang } = useLanguage();
  
  const [officerId, setOfficerId] = useState("USER_104");
  const [password, setPassword] = useState("••••••••");
  const [station, setStation] = useState("SG Highway Command HQ, Ahmedabad");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!officerId.trim()) {
      setError("Please enter Officer Identification Number");
      return;
    }

    login({
      id: officerId,
      name: officerId === "USER_104" ? "Insp. P. R. Jadeja" : `Officer ${officerId}`,
      rank: "Police Inspector (SIT Surveillance Lead)",
      badgeNumber: "GP-AHM-104",
      station: station,
      district: "Ahmedabad City Police"
    });
  };

  const handleQuickLogin = (id, name, st) => {
    login({
      id,
      name,
      rank: "Police Inspector (SIT Surveillance Lead)",
      badgeNumber: `GP-${id}`,
      station: st,
      district: "Ahmedabad City Police"
    });
  };

  return (
    <div className="min-h-screen bg-[#07172B] flex flex-col justify-between text-slate-100 selection:bg-[#C9A227] selection:text-slate-950 font-sans">
      {/* Top Government Banner */}
      <div className="bg-[#0B2545] border-b border-[#10305A] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#10305A] border border-[#C9A227] flex items-center justify-center text-[#C9A227]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider text-white uppercase block">
              GUJARAT POLICE DEPARTMENT
            </span>
            <span className="text-[10px] text-slate-300">
              Government of Gujarat • Command, Control & Investigation Network
            </span>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded font-medium transition-colors ${lang === 'en' ? 'bg-[#C9A227] text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang('gu')}
            className={`px-2 py-1 rounded font-medium transition-colors ${lang === 'gu' ? 'bg-[#C9A227] text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            ગુજરાતી
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2 py-1 rounded font-medium transition-colors ${lang === 'hi' ? 'bg-[#C9A227] text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#0B2545] border border-slate-700/80 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#10305A] border-2 border-[#C9A227] flex items-center justify-center text-[#C9A227] shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold tracking-wide text-white uppercase pt-2">
              DRISHTI PORTAL LOGIN
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Smart Surveillance & Forensic CCTV Intelligence Platform
            </p>
          </div>

          {error && (
            <div className="bg-red-950/80 border border-red-500/80 text-red-200 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Officer Identification (UID / Badge ID)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="w-full bg-[#07172B] border border-slate-600 rounded-lg pl-9 pr-3 py-2.5 text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-[#C9A227]"
                  placeholder="e.g. USER_104"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Station / Control Room Jurisdiction
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="w-full bg-[#07172B] border border-slate-600 rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-hidden focus:border-[#C9A227]"
                >
                  <option value="SG Highway Command HQ, Ahmedabad">SG Highway Command HQ, Ahmedabad</option>
                  <option value="Navrangpura Police Station">Navrangpura Police Station</option>
                  <option value="Surat City Commissionerate Control Room">Surat City Commissionerate Control Room</option>
                  <option value="Vadodara SIT Hub & CAD Cell">Vadodara SIT Hub & CAD Cell</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Secure Authentication Token / Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#07172B] border border-slate-600 rounded-lg pl-9 pr-3 py-2.5 text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-[#C9A227]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm tracking-wide uppercase mt-2"
            >
              <span>Authenticate & Enter Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-2 border-t border-slate-700/80 space-y-2">
            <p className="text-[10px] text-slate-400 font-mono text-center uppercase tracking-wider">
              Hackathon Quick Access Profiles
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("USER_104", "Insp. P. R. Jadeja", "SG Highway Command HQ, Ahmedabad")}
                className="p-2 bg-[#10305A] hover:bg-[#163f75] border border-slate-600 rounded text-left transition-colors"
              >
                <p className="font-bold text-slate-100 text-[11px]">USER_104 (Lead SIT)</p>
                <p className="text-[10px] text-slate-400">Ahmedabad City HQ</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("USER_208", "Insp. K. S. Zala", "Navrangpura Police Station")}
                className="p-2 bg-[#10305A] hover:bg-[#163f75] border border-slate-600 rounded text-left transition-colors"
              >
                <p className="font-bold text-slate-100 text-[11px]">USER_208 (Investigator)</p>
                <p className="text-[10px] text-slate-400">Navrangpura Division</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legal & Security Notice */}
      <div className="bg-[#050f1c] border-t border-slate-800 px-6 py-3 text-center text-[11px] text-slate-400 space-y-0.5">
        <p>RESTRICTED AUTHORIZED LAW ENFORCEMENT ACCESS ONLY • GUJARAT POLICE CYBER WING</p>
        <p className="text-[10px] text-slate-400">All surveillance telemetry and audit queries are cryptographically logged under Section 69B IT Act.</p>
      </div>
    </div>
  );
};
