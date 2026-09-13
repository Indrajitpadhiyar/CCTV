import React, { useState } from 'react';
import { ShieldAlertIcon, CheckCircleIcon, XCircleIcon, MapPinIcon, ClockIcon, VideoIcon, EyeIcon, RadioIcon } from './Icons';
import { Badge } from './Badge';

export function HumanVerificationCard({
  matches = [],
  uploadedPhoto,
  onVerify,
  onReject,
  onOpenLiveFeed
}) {
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(0);
  const [verificationVerdicts, setVerificationVerdicts] = useState({});

  if (!matches || matches.length === 0) return null;

  const currentMatch = matches[selectedMatchIndex] || matches[0];
  const isLastSpot = currentMatch.is_last_spot || selectedMatchIndex === 0;

  const handleAction = (type) => {
    setVerificationVerdicts((prev) => ({
      ...prev,
      [currentMatch.camera_id]: type
    }));
    if (type === 'confirmed' && onVerify) onVerify(currentMatch);
    if (type === 'rejected' && onReject) onReject(currentMatch);
  };

  const currentVerdict = verificationVerdicts[currentMatch.camera_id];

  return (
    <div className="bg-white rounded-xl border-2 border-rose-300 shadow-sm overflow-hidden animate-fade-in">
      {/* Top Alert Header Banner */}
      <div className="bg-rose-600 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/20">
            <ShieldAlertIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm uppercase tracking-wide">
                Target Person Spotted — Multiple Camera Matches
              </span>
              <span className="bg-white text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                {matches.length} SIGHTINGS DETECTED
              </span>
            </div>
            <p className="text-xs text-rose-100">
              Single uploaded subject identified across {matches.length} camera checkpoints in the CCTV access grid
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-rose-700/80 px-3 py-1 rounded-lg">
          <span>AI Match:</span>
          <span className="font-extrabold text-white text-sm">{currentMatch.confidence}%</span>
        </div>
      </div>

      {/* Multiple Matches Sighting Selector Tabs */}
      {matches.length > 1 && (
        <div className="bg-slate-100/80 border-b border-slate-200 px-5 py-2 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Select Sighting:
          </span>
          {matches.map((m, idx) => {
            const isSelected = idx === selectedMatchIndex;
            return (
              <button
                key={m.camera_id || idx}
                type="button"
                onClick={() => setSelectedMatchIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>#{idx + 1}: {m.camera_id}</span>
                <span className={`text-[10px] ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                  ({m.time})
                </span>
                {m.is_last_spot && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${isSelected ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700 font-bold'}`}>
                    LATEST
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Body */}
      <div className="p-5 space-y-5">
        {/* Key Spotting Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          {/* 1. Camera ID & Name */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Sighted Camera Node
            </span>
            <div className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1.5">
              <VideoIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{currentMatch.camera_id}</span>
              {currentMatch.camera_code && (
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1 py-0.2 rounded border border-blue-200">
                  {currentMatch.camera_code.toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-600 truncate block font-medium">
              {currentMatch.camera_name}
            </span>
          </div>

          {/* 2. Last Spot Location with Area Name */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isLastSpot ? 'Person Last Spot Location' : 'Camera Spot Location'}
            </span>
            <div className="font-bold text-rose-700 text-sm mt-0.5 flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{currentMatch.area}</span>
              {isLastSpot && (
                <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                  LAST SPOT
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-800 font-semibold block">
              {currentMatch.spot_location}
            </span>
            <span className="text-[10px] text-slate-500">
              {currentMatch.police_station}, {currentMatch.city}
            </span>
          </div>

          {/* 3. Camera Timestamp and Date */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Camera Timestamp & Date
            </span>
            <div className="font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{currentMatch.time}</span>
            </div>
            <span className="text-[11px] text-slate-600 font-medium block">
              {currentMatch.date}
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">
              {currentMatch.transit_note || 'Sequential CCTV Corroboration'}
            </span>
          </div>

          {/* 4. Verification Status */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Human Review Verdict
            </span>
            <div className="mt-1">
              {currentVerdict === 'confirmed' ? (
                <Badge variant="success" dot size="md">
                  VERIFIED BY OFFICER
                </Badge>
              ) : currentVerdict === 'rejected' ? (
                <Badge variant="neutral" size="md">
                  FALSE ALARM REJECTED
                </Badge>
              ) : (
                <Badge variant="danger" dot size="md">
                  AWAITING VERIFICATION
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Sighting #{selectedMatchIndex + 1} of {matches.length}
            </span>
          </div>
        </div>

        {/* Side-by-Side Visual Verification & Camera View */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Human Verification & Review: Uploaded Photo vs. {currentMatch.camera_id} View
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Confidence: {currentMatch.confidence}% • YuNet Landmark Crosshair
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Uploaded Reference Face Photo */}
            <div className="md:col-span-4 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Single Uploaded Photo Reference
              </span>
              <div className="w-40 h-44 rounded-lg overflow-hidden border-2 border-blue-400 bg-white shadow-2xs flex items-center justify-center relative">
                {uploadedPhoto ? (
                  <img
                    src={uploadedPhoto}
                    alt="Uploaded Reference"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">Reference Image</div>
                )}
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-mono px-1 py-0.2 rounded">
                  REFERENCE
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900 mt-2">Target Biometric Profile</span>
              <span className="text-[11px] text-slate-500">Source: User Uploaded Face</span>
            </div>

            {/* AI Correlation Meter */}
            <div className="md:col-span-2 flex flex-col items-center justify-center p-2 text-center space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Match Score
              </div>
              <div className="text-3xl font-extrabold text-rose-700 font-mono">
                {currentMatch.confidence}%
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-600 h-2 rounded-full"
                  style={{ width: `${currentMatch.confidence}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Sighting #{selectedMatchIndex + 1}
              </span>
            </div>

            {/* Camera View where Person was Seen */}
            <div className="md:col-span-6 bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center text-white">
              <div className="w-full flex items-center justify-between text-[10px] font-mono text-white/80 mb-2">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  CAMERA VIEW: {currentMatch.camera_id} ({currentMatch.camera_code || 'CAM'})
                </span>
                <span>4K STREAM • {currentMatch.time}</span>
              </div>

              {/* Annotated Frame */}
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-700 relative flex items-center justify-center">
                {currentMatch.annotated_snapshot ? (
                  <img
                    src={currentMatch.annotated_snapshot}
                    alt="Camera Sighting Frame"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">Loading Camera View...</div>
                )}
              </div>

              <div className="w-full mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[280px]">Spot: {currentMatch.spot_location}</span>
                <span className="font-mono text-white/90">{currentMatch.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Actions Toolbar */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <span>Reviewing Sighting {selectedMatchIndex + 1} of {matches.length} ({currentMatch.camera_id})</span>
            {currentMatch.hls_url && (
              <span className="ml-2 font-mono text-[10px] text-blue-600">
                • Feed: {currentMatch.camera_code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={() => onOpenLiveFeed && onOpenLiveFeed(currentMatch)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
            >
              <EyeIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Watch Live Feed</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('rejected')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <XCircleIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Flag False Alarm</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction('confirmed')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircleIcon className="w-3.5 h-3.5" />
              <span>Confirm Verification & Alert Intercept Patrol</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
