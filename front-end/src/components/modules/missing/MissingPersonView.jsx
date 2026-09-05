import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Clock, 
  Radio, 
  Share2, 
  AlertCircle,
  FileText,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { mockMissingPersons } from '../../../data/mockMissingPersons';
import { getCameraById } from '../../../data/mockCameras';
import { CandidateCard } from './CandidateCard';
import { VerificationPipeline } from './VerificationPipeline';
import { CameraFeedModal } from '../../common/CameraFeedModal';
import { StatusPill } from '../../common/StatusPill';
import { AIEstimateBadge } from '../../common/AIEstimateBadge';
import { useCase } from '../../../context/CaseContext';
import { useLanguage } from '../../../context/LanguageContext';

export const MissingPersonView = () => {
  const { missingData, handleVerifyCandidate, recordAuditLog, addToast } = useCase();
  const { t } = useLanguage();

  const [selectedCaseId, setSelectedCaseId] = useState("CASE #M102");
  const [selectedCameraForModal, setSelectedCameraForModal] = useState(null);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);

  // New Case Form State
  const [formData, setFormData] = useState({
    name: "Suresh R. Shah",
    age: 68,
    clothingTop: "White Kurta",
    clothingBottom: "Brown Dhoti",
    distinguishing: "Black frame glasses, steel walking cane",
    lastSeen: "Kalupur Station Concourse, 10:00 IST"
  });

  const currentCase = missingData[selectedCaseId] || mockMissingPersons["CASE #M102"];

  // Count candidates by status
  const pendingCount = currentCase.candidates.filter(c => c.status === 'AI_CANDIDATE').length;
  const confirmedCount = currentCase.candidates.filter(c => c.status === 'CONFIRMED').length;
  const rejectedCount = currentCase.candidates.filter(c => c.status === 'REJECTED').length;

  const handleBroadcastAlert = () => {
    recordAuditLog(
      "BROADCAST_MISSING_PERSON_ALERT",
      `Broadcasted confirmed sightings for ${currentCase.personName} to Ahmedabad PCR network`,
      currentCase.caseId
    );
    addToast(`Broadcasted Flash Alert to all Ahmedabad Sector Patrol Units`, "success");
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
            <Users className="w-6 h-6 text-[#0B2545]" />
            <span>{t('missingTitle')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('missingSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsNewCaseOpen(!isNewCaseOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B2545] hover:bg-[#10305A] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4 text-[#C9A227]" />
          <span>{isNewCaseOpen ? "Close Form" : t('newCaseBtn')}</span>
        </button>
      </div>

      {/* Case Creation Form Accordion */}
      {isNewCaseOpen && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-md p-6 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-[#0B2545] flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#C9A227]" />
              <span>Register New Missing / Vulnerable Person Case</span>
            </h3>
            <span className="font-mono text-xs text-slate-500">Auto-ID: CASE #M103</span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsNewCaseOpen(false); addToast("Missing Person dossier registered & AI scan initiated", "success"); }} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject Full Name *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" 
                required 
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Age *</label>
              <input 
                type="number" 
                value={formData.age} 
                onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" 
                required 
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Clothing Top (Color/Pattern) *</label>
              <input 
                type="text" 
                value={formData.clothingTop} 
                onChange={(e) => setFormData({ ...formData, clothingTop: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" 
                required 
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Clothing Bottom (Pants/Dhoti)</label>
              <input 
                type="text" 
                value={formData.clothingBottom} 
                onChange={(e) => setFormData({ ...formData, clothingBottom: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" 
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Distinguishing Items (Cane, Bag, Glasses)</label>
              <input 
                type="text" 
                value={formData.distinguishing} 
                onChange={(e) => setFormData({ ...formData, distinguishing: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" 
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Last Seen Location & Time</label>
              <input 
                type="text" 
                value={formData.lastSeen} 
                onChange={(e) => setFormData({ ...formData, lastSeen: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2" 
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setIsNewCaseOpen(false)} 
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-[#0B2545] hover:bg-[#10305A] text-white font-bold rounded-lg"
              >
                Start AI Camera Re-ID Scan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Layout: Person Dossier Summary + Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Person Dossier Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono font-bold text-xs text-[#0B2545]">{currentCase.caseId}</span>
                <h3 className="font-bold text-base text-slate-900">{currentCase.personName}</h3>
              </div>
              <StatusPill status={currentCase.status} size="sm" />
            </div>

            {/* Reference Photo */}
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img 
                src={currentCase.referencePhoto} 
                alt={currentCase.personName} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Physical Attributes */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Age / Gender:</span>
                  <span className="font-bold text-slate-900">{currentCase.age} Years • {currentCase.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Height:</span>
                  <span className="font-bold text-slate-900">{currentCase.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Seen Area:</span>
                  <span className="font-bold text-slate-900">{currentCase.lastSeenLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Reported:</span>
                  <span className="font-bold text-slate-900">{currentCase.lastSeenTime}</span>
                </div>
              </div>

              <div className="space-y-1 text-slate-700">
                <p className="font-bold text-[11px] text-slate-500 uppercase font-mono">Attire & Identifying Items</p>
                <p className="text-xs text-slate-800">
                  <strong>Top:</strong> {currentCase.clothingTop} • <strong>Bottom:</strong> {currentCase.clothingBottom}
                </p>
                <p className="text-[11px] text-slate-600 bg-amber-50 p-2 rounded border border-amber-200">
                  <strong>Key Markers:</strong> {currentCase.distinguishingItems}
                </p>
              </div>

              {currentCase.medicalNotes && (
                <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-[11px] text-red-900">
                  <strong>Vulnerability Alert:</strong> {currentCase.medicalNotes}
                </div>
              )}
            </div>

            {/* Broadcast Action */}
            <button
              onClick={handleBroadcastAlert}
              className="w-full py-2.5 bg-[#0B2545] hover:bg-[#10305A] text-white font-bold text-xs uppercase rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 text-[#C9A227]" />
              <span>Broadcast to Patrol Units</span>
            </button>
          </div>
        </div>

        {/* Right: Verification Pipeline & Candidate Sightings Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* Verification Pipeline Indicator */}
          <VerificationPipeline 
            pendingCount={pendingCount}
            confirmedCount={confirmedCount}
            rejectedCount={rejectedCount}
          />

          {/* Candidate Sightings Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              {t('candidateSightings')} ({currentCase.candidates.length} Scanned Sightings)
            </h3>
            <AIEstimateBadge 
              text="Human Decision Required" 
              details="AI candidate sightings are matched by visual feature vector cosine similarity. Every sighting requires manual human sign-off."
              size="sm"
            />
          </div>

          {/* Candidate Sightings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentCase.candidates.map((cand) => (
              <CandidateCard
                key={cand.id}
                candidate={cand}
                onConfirm={(id) => handleVerifyCandidate(currentCase.caseId, id, 'CONFIRMED')}
                onReject={(id, reason) => handleVerifyCandidate(currentCase.caseId, id, 'REJECTED', reason)}
                onInspect={handleInspect}
              />
            ))}
          </div>
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
