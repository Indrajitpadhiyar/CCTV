import React, { useState } from 'react';
import { 
  CarFront, 
  Search, 
  Printer, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { mockVehicles } from '../../../data/mockVehicles';
import { getCameraById } from '../../../data/mockCameras';
import { SequenceTimeline } from './SequenceTimeline';
import { PredictiveCard } from './PredictiveCard';
import { MapVisualizer } from '../../common/MapVisualizer';
import { CaseReportModal } from '../../common/CaseReportModal';
import { CameraFeedModal } from '../../common/CameraFeedModal';
import { useCase } from '../../../context/CaseContext';
import { useLanguage } from '../../../context/LanguageContext';

export const VehicleInvestigationView = () => {
  const { activeCase, recordAuditLog, addToast } = useCase();
  const { t } = useLanguage();

  const [searchPlate, setSearchPlate] = useState("GJ01XX1234");
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("14:00");
  const [selectedPlate, setSelectedPlate] = useState("GJ01XX1234");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedCameraForModal, setSelectedCameraForModal] = useState(null);

  const vehicleData = mockVehicles[selectedPlate] || mockVehicles["GJ01XX1234"];

  const handleSearch = (e) => {
    e?.preventDefault();
    const cleanPlate = searchPlate.trim().toUpperCase().replace(/\s+/g, '');
    if (mockVehicles[cleanPlate]) {
      setSelectedPlate(cleanPlate);
      recordAuditLog("VEHICLE_TRAJECTORY_SEARCH", `Executed ANPR trajectory query for plate: ${cleanPlate}`, activeCase?.id);
      addToast(`Reconstructed 5-camera trajectory for ${cleanPlate}`, "success");
    } else {
      setSelectedPlate("GJ01XX1234");
      recordAuditLog("VEHICLE_TRAJECTORY_SEARCH", `Query plate not in demo index, defaulted to GJ01XX1234`, activeCase?.id);
      addToast(`Sample route loaded for ${cleanPlate || 'GJ01XX1234'}`, "info");
    }
  };

  const handleInspectCamera = (camId) => {
    const cam = getCameraById(camId);
    setSelectedCameraForModal(cam);
    recordAuditLog("INSPECT_CAMERA_FEED", `Opened live optical diagnostics for node ${camId}`, activeCase?.id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B2545] tracking-wide uppercase flex items-center gap-2">
            <CarFront className="w-6 h-6 text-[#0B2545]" />
            <span>{t('vehicleTitle')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('vehicleSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B2545] hover:bg-[#10305A] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
        >
          <FileText className="w-4 h-4 text-[#C9A227]" />
          <span>{t('exportDossier')}</span>
        </button>
      </div>

      {/* Query Search Card & Presets */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Plate Input */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Vehicle Registration Number (ANPR)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
                placeholder="e.g. GJ01XX1234"
                className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#0B2545] rounded-lg px-3 py-2.5 font-mono text-sm font-bold text-slate-900 uppercase tracking-wider focus:outline-hidden"
              />
            </div>
          </div>

          {/* Time Window Inputs */}
          <div className="md:col-span-4 grid grid-cols-2 gap-2 space-y-1 md:space-y-0">
            <div>
              <label className="block text-xs font-bold text-slate-700 font-mono">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-800 focus:outline-hidden focus:border-[#0B2545]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 font-mono">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-800 focus:outline-hidden focus:border-[#0B2545]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-[#0B2545] hover:bg-[#10305A] text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
            >
              <Search className="w-4 h-4 text-[#C9A227]" />
              <span>{t('searchVehicle')}</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Preset Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs border-t border-slate-100">
          <span className="text-slate-500 font-mono text-[11px]">DEMO VEHICLE DOSSIERS:</span>
          {Object.keys(mockVehicles).map((plateKey) => {
            const v = mockVehicles[plateKey];
            return (
              <button
                key={plateKey}
                type="button"
                onClick={() => {
                  setSearchPlate(plateKey);
                  setSelectedPlate(plateKey);
                }}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors flex items-center gap-1.5 ${
                  selectedPlate === plateKey
                    ? 'bg-[#0B2545] text-[#C9A227] font-bold border border-[#C9A227]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{plateKey}</span>
                <span className="text-[10px] opacity-75">({v.vehicleType})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trajectory Sequence Strip */}
      <SequenceTimeline 
        sequence={vehicleData.sequence} 
        onInspectCamera={handleInspectCamera}
      />

      {/* Map & Predictive Routing Visualizer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0B2545]" />
            <span>GIS Route Reconstruction & Next-Camera Trajectory Vector</span>
          </h3>
          <span className="text-slate-500 font-mono text-[11px]">
            Target: <strong className="text-slate-900">{vehicleData.makeModel}</strong> ({vehicleData.plate})
          </span>
        </div>

        <MapVisualizer
          sequence={vehicleData.sequence}
          prediction={vehicleData.prediction}
          height="460px"
          onSelectCamera={handleInspectCamera}
        />
      </div>

      {/* Predictive Summary & Next Camera Card */}
      <PredictiveCard vehicleData={vehicleData} />

      {/* Modals */}
      <CaseReportModal
        vehicleData={vehicleData}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <CameraFeedModal
        camera={selectedCameraForModal}
        isOpen={!!selectedCameraForModal}
        onClose={() => setSelectedCameraForModal(null)}
      />
    </div>
  );
};
