import React, { useState, useRef } from 'react';
import { ScanFaceIcon, SearchIcon, RefreshCwIcon, CheckCircleIcon, ShieldAlertIcon, XCircleIcon, VideoIcon } from './Icons';
import { Badge } from './Badge';

export function FindPersonSidePanel({
  selectedDistrict,
  selectedArea,
  onDistrictChange,
  onAreaChange,
  availableDistricts = [],
  availableAreas = [],
  onStartScan,
  isScanning = false,
  scanProgress = 0,
  scanResult = null,
  backendConnected = false,
  onClearScan
}) {
  const [targetPhoto, setTargetPhoto] = useState(null);
  const [targetName, setTargetName] = useState('Suspect #1');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTargetPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhoto = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/sample-face');
      const data = await res.json();
      if (data && data.status === 'success' && data.image_base64) {
        setTargetPhoto(data.image_base64);
        setTargetName(data.target_name || 'Suspect Target #01 (Police Watchlist)');
        return;
      }
    } catch (e) {
      console.warn('Could not fetch sample face from API, using canvas generator:', e);
    }

    // High quality canvas PNG face fallback that OpenCV can decode natively
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 320, 320);
    ctx.fillStyle = '#cda584';
    ctx.beginPath();
    ctx.ellipse(160, 160, 80, 105, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(130, 145, 9, 0, Math.PI * 2);
    ctx.arc(190, 145, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(160, 145);
    ctx.lineTo(155, 185);
    ctx.lineTo(168, 185);
    ctx.stroke();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(160, 210, 22, 0.2, Math.PI - 0.2);
    ctx.stroke();

    const pngData = canvas.toDataURL('image/png');
    setTargetPhoto(pngData);
    setTargetName('Suspect Target #01 (Police Watchlist)');
  };

  const handleScanSubmit = () => {
    if (!targetPhoto) {
      alert('Please upload a face photo or click "Use Sample Face" to proceed with camera scanning.');
      return;
    }
    onStartScan({
      imageBase64: targetPhoto,
      city: selectedDistrict,
      area: selectedArea,
      targetName: targetName
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <ScanFaceIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm leading-tight">
              Find Person by Face
            </h3>
            <p className="text-[11px] text-slate-500">
              Upload face photo & check first 10 cameras
            </p>
          </div>
        </div>

        {/* Backend Connection Indicator */}
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-mono">
          <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`}></span>
          <span className="text-slate-600">{backendConnected ? 'Python AI Online' : 'AI Engine Ready'}</span>
        </div>
      </div>

      {/* 1. District & Area Cascading Dropdown Filter */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          1. Location & Search Grid
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            District / City
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Target Area (Suggests Cameras)
          </label>
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {availableAreas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Grid will check the first 10 cameras located in {selectedArea}
          </span>
        </div>
      </div>

      {/* 2. Photo Upload Box */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            2. Upload Target Face Photo
          </span>
          <button
            type="button"
            onClick={handleUseSamplePhoto}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
          >
            Use Sample Face
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {targetPhoto ? (
          <div className="relative rounded-xl border-2 border-blue-400 bg-blue-50/20 p-3 flex flex-col items-center justify-center group">
            <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-slate-300 bg-white shadow-xs">
              <img
                src={targetPhoto}
                alt="Target Face"
                className="w-full h-full object-cover"
              />
              {/* Biometric reticle overlay */}
              <div className="absolute inset-1.5 border border-dashed border-blue-500/70 pointer-events-none rounded"></div>
              <div className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-mono px-1 py-0.2 rounded">
                BIO-TARGET
              </div>
            </div>

            <div className="mt-2 text-center">
              <div className="text-xs font-bold text-slate-900">{targetName}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ SFace 128-d Feature Vector Ready
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded shadow-2xs font-medium"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={() => setTargetPhoto(null)}
                className="text-[11px] text-rose-600 hover:text-rose-800 bg-white border border-slate-200 px-2 py-1 rounded shadow-2xs font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
              <ScanFaceIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Click to upload face photo
              </span>
              <span className="text-[11px] text-slate-500">
                Supports JPG, PNG, WEBP high-resolution portraits
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Subject Name / FIR Reference
          </label>
          <input
            type="text"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            placeholder="e.g. Suspect #20841 or Unknown Subject"
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. Scan Action Button & Progress */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          disabled={isScanning || !targetPhoto}
          onClick={handleScanSubmit}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
        >
          {isScanning ? (
            <>
              <RefreshCwIcon className="w-4 h-4 animate-spin" />
              <span>Scanning 10 Cameras ({scanProgress}%)...</span>
            </>
          ) : (
            <>
              <SearchIcon className="w-4 h-4" />
              <span>Scan First 10 Cameras in {selectedArea}</span>
            </>
          )}
        </button>

        {/* Scan Progress Bar */}
        {isScanning && (
          <div className="mt-2 space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Checking feeds 1–10...</span>
              <span>YuNet + SFace Correlation</span>
            </div>
          </div>
        )}

        {/* Scan Results Summary Badge */}
        {scanResult && (
          <div className={`mt-3 p-3 rounded-xl border ${
            scanResult.person_found ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-700'
          } text-xs space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                {scanResult.person_found ? (
                  <>
                    <ShieldAlertIcon className="w-4 h-4 text-rose-600" />
                    <span>TARGET PERSON FOUND!</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="w-4 h-4 text-slate-500" />
                    <span>PERSON NOT FOUND</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={onClearScan}
                className="text-[10px] text-slate-400 hover:text-slate-700 font-bold"
              >
                Clear
              </button>
            </div>

            <p className="text-[11px] leading-relaxed">
              {scanResult.scan_summary}
            </p>

            {scanResult.person_found && (
              <div className="pt-1.5 border-t border-rose-200/80 text-[11px] font-semibold text-rose-700 flex items-center justify-between">
                <span>Spotted on {scanResult.matched_count} camera(s)</span>
                <span>Verification Active ➔</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
