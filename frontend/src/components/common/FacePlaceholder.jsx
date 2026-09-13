import React from 'react';

/**
 * Generic biometric face placeholder with police HUD scanning grid & landmark markers.
 * Complies with privacy & neutrality guidelines (no real or graphic photos).
 */
export function FacePlaceholder({
  id = 'ID-20841',
  confidence = 94.8,
  variant = 'detected', // 'detected' | 'database' | 'thumbnail' | 'feed'
  isMatch = true,
  className = ''
}) {
  const isDanger = isMatch && confidence >= 90;

  if (variant === 'thumbnail') {
    return (
      <div className={`relative w-10 h-10 rounded bg-slate-100 border ${isDanger ? 'border-rose-300' : 'border-slate-200'} overflow-hidden flex items-center justify-center shrink-0 ${className}`}>
        {/* Neutral silhouette */}
        <svg className="w-7 h-7 text-slate-400 mt-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        {/* Biometric corner ticks */}
        <div className={`absolute inset-0.5 border border-dashed ${isDanger ? 'border-rose-500/60' : 'border-blue-500/50'} pointer-events-none rounded-[2px]`}></div>
        {isMatch && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-rose-600 rounded-full ring-1 ring-white"></span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg border ${isDanger ? 'border-rose-300' : 'border-slate-300'} overflow-hidden flex flex-col items-center justify-center p-3 select-none ${className}`}>
      {/* Background scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>

      {/* Police HUD Overlay Box */}
      <div className={`relative w-full aspect-[4/5] max-w-[200px] flex items-center justify-center rounded border ${isDanger ? 'border-rose-400 bg-rose-500/5' : 'border-blue-400 bg-blue-500/5'} transition-all`}>
        {/* Bounding box brackets */}
        <div className={`absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 ${isDanger ? 'border-rose-600' : 'border-blue-600'}`}></div>
        <div className={`absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 ${isDanger ? 'border-rose-600' : 'border-blue-600'}`}></div>
        <div className={`absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 ${isDanger ? 'border-rose-600' : 'border-blue-600'}`}></div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 ${isDanger ? 'border-rose-600' : 'border-blue-600'}`}></div>

        {/* Biometric Landmark Mesh Overlay */}
        <svg className="w-24 h-28 text-slate-500 relative z-10 opacity-70" viewBox="0 0 100 120" fill="none">
          {/* Head Contour */}
          <path d="M25 45 C25 20, 75 20, 75 45 C75 75, 65 95, 50 98 C35 95, 25 75, 25 45 Z" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Eyebrows */}
          <line x1="33" y1="36" x2="45" y2="34" stroke="currentColor" strokeWidth="1.5" />
          <line x1="55" y1="34" x2="67" y2="36" stroke="currentColor" strokeWidth="1.5" />
          {/* Eyes with iris dots */}
          <circle cx="39" cy="42" r="4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="39" cy="42" r="1.5" fill="currentColor" />
          <circle cx="61" cy="42" r="4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="61" cy="42" r="1.5" fill="currentColor" />
          {/* Eye distance measurement line */}
          <line x1="39" y1="42" x2="61" y2="42" stroke={isDanger ? '#e11d48' : '#2563eb'} strokeWidth="1" strokeDasharray="2 1" />
          {/* Nose bridge & base */}
          <path d="M50 38 L48 56 L54 58 L50 62" stroke="currentColor" strokeWidth="1.2" />
          {/* Mouth line */}
          <path d="M40 74 Q50 78 60 74" stroke="currentColor" strokeWidth="1.5" />
          {/* Chin crosshair */}
          <line x1="47" y1="92" x2="53" y2="92" stroke="currentColor" strokeWidth="1.2" />
          <line x1="50" y1="89" x2="50" y2="95" stroke="currentColor" strokeWidth="1.2" />
          {/* Biometric nodes */}
          <circle cx="28" cy="48" r="1.5" fill={isDanger ? '#e11d48' : '#0284c7'} />
          <circle cx="72" cy="48" r="1.5" fill={isDanger ? '#e11d48' : '#0284c7'} />
          <circle cx="34" cy="65" r="1.5" fill={isDanger ? '#e11d48' : '#0284c7'} />
          <circle cx="66" cy="65" r="1.5" fill={isDanger ? '#e11d48' : '#0284c7'} />
          <circle cx="50" cy="48" r="1.5" fill={isDanger ? '#e11d48' : '#0284c7'} />
        </svg>

        {/* Live scanning horizontal bar */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse top-1/2 -translate-y-1/2 pointer-events-none opacity-60"></div>

        {/* Status Tag Overlay */}
        <div className="absolute top-1 left-1.5 flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isDanger ? 'bg-rose-600' : 'bg-blue-600'} animate-ping`}></span>
          <span className={`text-[9px] font-mono font-bold tracking-wider uppercase ${isDanger ? 'text-rose-700' : 'text-blue-700'}`}>
            {variant === 'database' ? 'RECORD' : 'AI DETECT'}
          </span>
        </div>

        {/* Biometric ID Badge */}
        <div className="absolute bottom-1 right-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-mono px-1 py-0.5 rounded">
          {id}
        </div>
      </div>

      {/* Label under placeholder */}
      <div className="mt-2 text-center w-full">
        <div className="text-xs font-semibold text-slate-800 tracking-tight">
          {variant === 'database' ? 'Biometric Reference Profile' : 'Detected Facial Signature'}
        </div>
        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
          {variant === 'database' ? 'Interpolated State Record' : `Confidence: ${confidence}%`}
        </div>
      </div>
    </div>
  );
}
