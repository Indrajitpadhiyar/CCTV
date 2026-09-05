import React, { useState } from 'react';
import { X, FolderPlus, Shield, Car, User, Siren, FileText } from 'lucide-react';
import { useCase } from '../../../context/CaseContext';
import { useAuth } from '../../../context/AuthContext';

export const NewCaseModal = ({ isOpen, onClose }) => {
  const { addNewCase } = useCase();
  const { officer } = useAuth();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("VEHICLE_INVESTIGATION");
  const [priority, setPriority] = useState("HIGH");
  const [firNumber, setFirNumber] = useState(`FIR-0${Math.floor(100 + Math.random() * 900)}/2026`);
  const [linkedVehicle, setLinkedVehicle] = useState("");
  const [summary, setSummary] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNewCase({
      title,
      type,
      priority,
      firNumber,
      linkedVehicle: linkedVehicle.toUpperCase().replace(/\s+/g, ''),
      summary
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden text-slate-800">
        <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <FolderPlus className="w-5 h-5 text-[#C9A227]" />
            <span>CREATE NEW CASE FILE (INVESTIGATION DOSSIER)</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Case / Incident Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hit-and-Run on Iskcon Flyover"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#0B2545]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Investigation Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#0B2545]"
              >
                <option value="VEHICLE_INVESTIGATION">Vehicle ANPR Tracking</option>
                <option value="MISSING_PERSON">Missing Person (Khoya-Paya)</option>
                <option value="EMERGENCY_CAD">Emergency CAD Response</option>
                <option value="GENERAL_FORENSIC">General CCTV Forensic</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#0B2545]"
              >
                <option value="CRITICAL">CRITICAL (Red 100)</option>
                <option value="HIGH">HIGH (Urgent)</option>
                <option value="MEDIUM">MEDIUM (Standard)</option>
                <option value="LOW">LOW (Routine)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                FIR Reference Number
              </label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono text-slate-900 focus:outline-hidden focus:border-[#0B2545]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Target Vehicle Plate (Optional)
              </label>
              <input
                type="text"
                value={linkedVehicle}
                onChange={(e) => setLinkedVehicle(e.target.value)}
                placeholder="e.g. GJ01XX1234"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono uppercase text-slate-900 focus:outline-hidden focus:border-[#0B2545]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Case Brief / Preliminary Notes
            </label>
            <textarea
              rows="3"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter incident location, suspect description, or initial patrol report summary..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-[#0B2545]"
            ></textarea>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono">
            Investigating Officer: <span className="font-bold text-slate-800">{officer?.name}</span> ({officer?.id}) | {officer?.station}
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0B2545] hover:bg-[#10305A] text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <FolderPlus className="w-4 h-4 text-[#C9A227]" />
              <span>Initialize Case Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
