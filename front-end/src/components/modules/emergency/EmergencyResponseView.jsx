import React, { useState } from 'react';
import { 
  Siren, 
  AlertTriangle, 
  Send, 
  Clock, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Eye, 
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';
import { mockActiveIncident, mockIncidentHistory } from '../../../data/mockIncidents';
import { getCameraById } from '../../../data/mockCameras';
import { ResourceCard } from './ResourceCard';
import { AIEstimateBadge } from '../../common/AIEstimateBadge';
import { StatusPill } from '../../common/StatusPill';
import { MapVisualizer } from '../../common/MapVisualizer';
import { CameraFeedModal } from '../../common/CameraFeedModal';
import { useCase } from '../../../context/CaseContext';
import { useLanguage } from '../../../context/LanguageContext';

export const EmergencyResponseView = () => {
  const { activeIncident, dispatchCADUnits, recordAuditLog, addToast } = useCase();
  const { t } = useLanguage();
  const [history, setHistory] = useState(mockIncidentHistory);
  const [selectedCameraForModal, setSelectedCameraForModal] = useState(null);

  const incident = activeIncident || mockActiveIncident;

  const handleSimulateNewAlert = () => {
    addToast("Simulating Incoming CAD Emergency Incident at CAM-42 (Pakwan Junction)", "error");
    recordAuditLog("SIMULATE_INCIDENT_ALERT", "Triggered test crash alert simulation on CAM-42", incident.caseId);
  };

  const handleInspect = (camId) => {
    setSelectedCameraForModal(getCameraById(camId));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B2545] tracking-wide uppercase flex items-center gap-2">
            <Siren className="w-6 h-6 text-red-600 animate-pulse" />
            <span>{t('emergencyTitle')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('emergencySubtitle')}
          </p>
        </div>

        <button
          onClick={handleSimulateNewAlert}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-slate-200 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
        >
          <Play className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>{t('triggerTestIncident')}</span>
        </button>
      </div>

      {/* Prominent Red Alert Banner: INCIDENT DETECTED */}
      <div className="bg-[#C0392B] rounded-2xl shadow-xl border-2 border-red-400 text-white p-6 space-y-4 relative overflow-hidden">
        {/* Background pulsing glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-red-400/20 blur-2xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white">
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-red-900 font-mono text-xs font-extrabold px-2 py-0.5 rounded-sm">
                  {incident.id}
                </span>
                <span className="font-extrabold text-sm tracking-wide uppercase">
                  {t('incidentDetected')}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white mt-0.5">
                {incident.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AIEstimateBadge 
              text="AI Incident Classification" 
              details="Detected via multi-frame optical flow acceleration vectors combined with acoustic collision resonance sensors."
              size="sm"
            />
            <button
              onClick={() => handleInspect(incident.cameraId)}
              className="px-3 py-1.5 bg-slate-950/80 hover:bg-slate-950 text-white font-mono text-xs rounded-lg border border-red-300 flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Inspect Feed ({incident.cameraId})</span>
            </button>
          </div>
        </div>

        {/* Location & Metadata Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-red-950/60 p-3.5 rounded-xl border border-red-400/40 text-xs font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-300 shrink-0" />
            <div>
              <span className="text-red-200 text-[10px] block">CRASH LOCATION:</span>
              <span className="font-bold text-white">{incident.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-300 shrink-0" />
            <div>
              <span className="text-red-200 text-[10px] block">DETECTED TIMESTAMP:</span>
              <span className="font-bold text-white">{incident.detectedAt} ({incident.detectedAgo})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-300 shrink-0" />
            <div>
              <span className="text-red-200 text-[10px] block">AI CONFIDENCE & SEVERITY:</span>
              <span className="font-bold text-white">{incident.aiConfidence} • HIGH SEVERITY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: CAD Resources & Recommended Response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommended Response & GIS Map */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Recommended Response Plan Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#C9A227]" />
                <h3 className="font-bold text-sm text-slate-900">
                  {t('recommendedResponse')}
                </h3>
              </div>
              <AIEstimateBadge 
                text="AI Dispatch Matrix" 
                details="Optimal units ranked using real-time GPS telemetry, traffic congestion indices, and vehicle equipment profiles."
                size="sm"
              />
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-blue-50/70 p-3.5 rounded-lg border border-blue-200 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-[#0B2545]">DISPATCH ASSIGNMENT:</span>
                  <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    EST. COMBINED ETA: ~4 MINS
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  Dispatch <strong>PCR Van #17 (Vastrapur Sector)</strong> for immediate scene cordoning + <strong>EMRI 108 Ambulance #09</strong> for medical triage.
                </p>
              </div>

              {/* Green Corridor Signal Override */}
              {incident.greenCorridor && (
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between gap-3 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span><strong>Green Corridor:</strong> {incident.greenCorridor.corridorName} (Signals CAM-14, CAM-42, CAM-08)</span>
                  </div>
                  <span className="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                    -{incident.greenCorridor.etaSavedSeconds}s Saved
                  </span>
                </div>
              )}
            </div>

            {/* Dispatch Action Button */}
            <div className="pt-2">
              <button
                onClick={() => dispatchCADUnits()}
                className="w-full py-3 bg-[#C0392B] hover:bg-[#a93226] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t('dispatchUnits')}</span>
              </button>
            </div>
          </div>

          {/* Incident Location Map */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0B2545]" />
              <span>Incident GIS & Emergency Ingress Corridor</span>
            </h3>
            <MapVisualizer
              incident={incident}
              center={[23.0354, 72.5105]}
              zoom={14}
              height="320px"
              onSelectCamera={handleInspect}
            />
          </div>
        </div>

        {/* Right Column: Nearby Resources Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              {t('nearbyResources')} ({incident.recommendedUnits?.length || 0})
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Live GPS Status</span>
          </div>

          <div className="space-y-3">
            {incident.recommendedUnits?.map((unit) => (
              <ResourceCard
                key={unit.unitId}
                unit={unit}
                onDispatch={() => dispatchCADUnits([unit.unitId])}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Historical Incident Activity Log Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            {t('incidentLog')}
          </h3>
          <span className="text-slate-500 font-mono text-[11px]">Past 24 Hours Feed</span>
        </div>

        <div className="divide-y divide-slate-100">
          {history.map((h) => (
            <div key={h.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="font-mono font-bold text-blue-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] mt-0.5">
                  {h.id}
                </span>
                <div>
                  <p className="font-bold text-slate-900">{h.title}</p>
                  <p className="text-slate-500 text-[11px] font-mono">{h.location} • {h.assignedTo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-600 text-[11px] italic max-w-xs truncate hidden sm:inline">
                  {h.resolution}
                </span>
                <StatusPill status={h.status} size="sm" />
                <span className="font-mono text-[10px] text-slate-400">{h.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <CameraFeedModal
        camera={selectedCameraForModal}
        isOpen={!!selectedCameraForModal}
        onClose={() => setSelectedCameraForModal(null)}
      />
    </div>
  );
};
