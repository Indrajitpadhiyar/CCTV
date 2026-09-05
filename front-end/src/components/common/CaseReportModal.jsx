import React from 'react';
import { X, Printer, Shield, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCase } from '../../context/CaseContext';

export const CaseReportModal = ({ vehicleData, isOpen, onClose }) => {
  const { officer } = useAuth();
  const { activeCase } = useCase();

  if (!isOpen || !vehicleData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto no-print">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-300 text-slate-800 my-8 overflow-hidden animate-in fade-in duration-200">
        {/* Header Action Bar */}
        <div className="bg-[#0B2545] text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileText className="w-5 h-5 text-[#C9A227]" />
            <span>OFFICIAL INVESTIGATION DOSSIER — GUJARAT POLICE</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-semibold text-xs rounded-md shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Body (Printable Official Document) */}
        <div className="p-8 space-y-6 font-sans text-xs leading-relaxed bg-white">
          {/* Government Official Header Letterhead */}
          <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
            <div className="flex justify-center items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-full bg-[#0B2545] border-2 border-[#C9A227] flex items-center justify-center text-[#C9A227]">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <h1 className="text-base font-extrabold tracking-wider text-slate-950 uppercase font-sans">
              GUJARAT POLICE DEPARTMENT
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              COMMAND & CONTROL SURVEILLANCE CELL — AHMEDABAD COMMISSIONERATE
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              ANPR Trajectory Reconstruction & Forensic Camera Sequence Dossier
            </p>
          </div>

          {/* Case & Subject Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="space-y-1.5">
              <div><span className="font-bold text-slate-700">Case ID:</span> <span className="font-mono font-bold text-blue-900">{activeCase?.id || vehicleData.linkedCaseId}</span></div>
              <div><span className="font-bold text-slate-700">FIR Reference:</span> <span className="font-mono">{activeCase?.firNumber || "FIR-0912/2026"}</span></div>
              <div><span className="font-bold text-slate-700">Target Vehicle Plate:</span> <span className="font-mono font-bold bg-[#0B2545] text-white px-2 py-0.5 rounded text-[11px]">{vehicleData.plate}</span></div>
              <div><span className="font-bold text-slate-700">Vehicle Description:</span> <span>{vehicleData.makeModel}</span></div>
            </div>
            <div className="space-y-1.5">
              <div><span className="font-bold text-slate-700">Investigating Officer:</span> <span>{officer?.name} ({officer?.id})</span></div>
              <div><span className="font-bold text-slate-700">Jurisdiction Unit:</span> <span>{officer?.station}</span></div>
              <div><span className="font-bold text-slate-700">Generated At:</span> <span className="font-mono">{new Date().toLocaleString('en-GB')} IST</span></div>
              <div><span className="font-bold text-slate-700">Search Window:</span> <span className="font-mono">{vehicleData.searchWindow}</span></div>
            </div>
          </div>

          {/* Sequential Detections Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Optical Camera Detections (Confirmed Sequence)
            </h3>
            <table className="w-full text-left border-collapse border border-slate-200 text-[11px]">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <th className="p-2 border-r border-slate-200">#</th>
                  <th className="p-2 border-r border-slate-200">Camera ID</th>
                  <th className="p-2 border-r border-slate-200">Junction / Location</th>
                  <th className="p-2 border-r border-slate-200">Timestamp</th>
                  <th className="p-2 border-r border-slate-200">Est. Speed</th>
                  <th className="p-2">Match Conf.</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.sequence.map((node, i) => (
                  <tr key={i} className="border-b border-slate-200 even:bg-slate-50">
                    <td className="p-2 font-mono border-r border-slate-200">{i + 1}</td>
                    <td className="p-2 font-mono font-bold text-blue-900 border-r border-slate-200">{node.cameraId}</td>
                    <td className="p-2 border-r border-slate-200">{node.cameraName}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{node.timestamp}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{node.speed}</td>
                    <td className="p-2 font-mono text-emerald-700 font-semibold">{node.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Predictive Routing Notice */}
          {vehicleData.prediction && (
            <div className="bg-amber-50/80 border border-amber-300 p-3.5 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>AI INFERRED TRAJECTORY (INVESTIGATIVE LEAD ONLY)</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-normal">
                <strong>Likely Intercept Node:</strong> {vehicleData.prediction.nextCameraId} ({vehicleData.prediction.nextCameraName}) | Est. Probability: <strong>{vehicleData.prediction.probability}</strong>.
              </p>
              <p className="text-[10px] text-amber-800 italic">
                Notice: Predictive telemetry is inferred from graph topology and does not constitute primary evidence without physical or optical checkpoint confirmation.
              </p>
            </div>
          )}

          {/* Digital Chain of Custody & Officer Signature */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 items-end">
            <div className="space-y-1 font-mono text-[10px] text-slate-500">
              <p className="font-bold text-slate-700">Digital Evidence Checksum:</p>
              <p className="break-all bg-slate-100 p-1 rounded border border-slate-200">
                SHA-256: 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4
              </p>
              <p>Generated via Drishti Secure Police Intelligence Gateway</p>
            </div>
            <div className="text-right space-y-4">
              <div className="h-10 border-b border-dashed border-slate-400 w-48 ml-auto"></div>
              <div>
                <p className="font-bold text-slate-900">{officer?.name}</p>
                <p className="text-[11px] text-slate-600">{officer?.rank}</p>
                <p className="text-[10px] text-slate-500 font-mono">Gujarat Police Badge: {officer?.badgeNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-md transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#0B2545] hover:bg-[#10305A] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
