import React, { useState } from 'react';
import { SettingsIcon, CheckCircleIcon, ShieldIcon } from '../components/common/Icons';

export function SettingsPage() {
  const [matchThreshold, setMatchThreshold] = useState(85);
  const [autoAlertDispatch, setAutoAlertDispatch] = useState(true);
  const [audioChime, setAudioChime] = useState(true);
  const [retentionDays, setRetentionDays] = useState('90');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            System Configuration & AI Surveillance Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gujarat CID Camera Intelligence Core settings and algorithmic sensitivity thresholds
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs self-start sm:self-auto"
        >
          Save Changes
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Surveillance parameters successfully committed to Gujarat Police Central Cluster.</span>
        </div>
      )}

      {/* Section 1: AI Biometric Detection Sensitivity */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
          Biometric Matching Engine Sensitivity
        </h3>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
            <span>Minimum Match Confidence Threshold for Red Alert</span>
            <span className="font-mono text-blue-600 font-bold">{matchThreshold}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Detections above this confidence will automatically trigger high-priority alerts and highlight in red on all officer command terminals.
          </p>
          <input
            type="range"
            min="60"
            max="98"
            value={matchThreshold}
            onChange={(e) => setMatchThreshold(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>60% (High Recall / Broad)</span>
            <span>85% (Recommended Balance)</span>
            <span>98% (High Precision Only)</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Automated Patrol Dispatch Notification
              </span>
              <span className="text-[11px] text-slate-500">
                Instantly forward potential matches above 90% to the jurisdictional Police Station duty officer
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoAlertDispatch}
              onChange={(e) => setAutoAlertDispatch(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Audio Tone On High-Risk Detection
              </span>
              <span className="text-[11px] text-slate-500">
                Play an audible command chime when a Non-Bailable Warrant fugitive is detected
              </span>
            </div>
            <input
              type="checkbox"
              checked={audioChime}
              onChange={(e) => setAudioChime(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Section 2: Data Retention & Compliance */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
          Data Retention & Legal Compliance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Surveillance Footage Retention Policy
            </label>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none"
            >
              <option value="30">30 Days (Standard Municipal)</option>
              <option value="60">60 Days (Highway Patrol)</option>
              <option value="90">90 Days (CID Recommended)</option>
              <option value="180">180 Days (High Security Zones)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Officer Audit Trail Logging Level
            </label>
            <select
              defaultValue="verbose"
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 outline-none"
            >
              <option value="verbose">Verbose (Every query & match view logged)</option>
              <option value="standard">Standard (Interventions & exports only)</option>
            </select>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <div className="font-semibold text-slate-800 mb-0.5">Assigned Monitoring Station:</div>
          Gujarat Police Command & Control Center, Sector 18, Gandhinagar. Current Session authenticated under Officer Badge GJ-POL-8842.
        </div>
      </div>
    </div>
  );
}
