import React, { useState } from 'react';
import { MapPinIcon, VideoIcon, ShieldAlertIcon, CheckCircleIcon, AlertTriangleIcon, ArrowUpRightIcon } from '../common/Icons';
import { Badge } from '../common/Badge';

export function CameraMapPanel({ onSelectMatch, onViewCamera }) {
  const [selectedMarker, setSelectedMarker] = useState({
    id: 'CAM-042',
    name: 'SG Highway - Sola Cross Roads',
    city: 'Ahmedabad',
    area: 'SG Highway',
    station: 'Sola Police Station',
    status: 'match',
    detectedAgo: '2 minutes ago',
    confidence: '94.8%',
    matchId: 'MATCH-1024',
    facesNow: 12,
    x: 58,
    y: 38
  });

  const [activeCityFilter, setActiveCityFilter] = useState('All');

  // Key map markers for Gujarat surveillance nodes
  const markers = [
    {
      id: 'CAM-042',
      name: 'SG Highway - Sola Cross Roads',
      city: 'Ahmedabad',
      area: 'SG Highway',
      station: 'Sola Police Station',
      status: 'match',
      detectedAgo: '2 mins ago',
      confidence: '94.8%',
      matchId: 'MATCH-1024',
      facesNow: 12,
      x: 58,
      y: 36
    },
    {
      id: 'CAM-038',
      name: 'SG Highway - Science City',
      city: 'Ahmedabad',
      area: 'SG Highway',
      station: 'Sola Police Station',
      status: 'online',
      detectedAgo: 'Clear',
      confidence: 'N/A',
      facesNow: 8,
      x: 56,
      y: 34
    },
    {
      id: 'CAM-021',
      name: 'Commerce Six Roads',
      city: 'Ahmedabad',
      area: 'Navrangpura',
      station: 'Navrangpura Police Station',
      status: 'online',
      detectedAgo: 'Clear',
      confidence: 'N/A',
      facesNow: 14,
      x: 60,
      y: 37
    },
    {
      id: 'CAM-095',
      name: 'Infocity Circle',
      city: 'Gandhinagar',
      area: 'Sector 11 (Infocity)',
      station: 'Infocity Police Station',
      status: 'online',
      detectedAgo: 'Clear',
      confidence: 'N/A',
      facesNow: 18,
      x: 61,
      y: 31
    },
    {
      id: 'CAM-072',
      name: 'Mini Bazar Diamond Flyover',
      city: 'Surat',
      area: 'Varachha',
      station: 'Varachha Police Station',
      status: 'match',
      detectedAgo: '31 mins ago',
      confidence: '92.4%',
      matchId: 'MATCH-1029',
      facesNow: 31,
      x: 63,
      y: 72
    },
    {
      id: 'CAM-067',
      name: 'Gujarat Gas Circle',
      city: 'Surat',
      area: 'Adajan',
      station: 'Adajan Police Station',
      status: 'online',
      detectedAgo: 'Clear',
      confidence: 'N/A',
      facesNow: 17,
      x: 61,
      y: 74
    },
    {
      id: 'CAM-088',
      name: 'Railway Station West Outgate',
      city: 'Vadodara',
      area: 'Alkapuri',
      station: 'Sayajigunj Police Station',
      status: 'online',
      detectedAgo: 'Clear',
      confidence: 'N/A',
      facesNow: 21,
      x: 72,
      y: 50
    },
    {
      id: 'CAM-096',
      name: 'Amit Nagar Circle',
      city: 'Vadodara',
      area: 'Karelibaug',
      station: 'Karelibaug Police Station',
      status: 'warning',
      detectedAgo: 'Frame drop',
      confidence: 'N/A',
      facesNow: 6,
      x: 74,
      y: 48
    },
    {
      id: 'CAM-104',
      name: 'Kotecha Chowk',
      city: 'Rajkot',
      area: 'Kalawad Road',
      station: 'Gandhigram Police Station',
      status: 'online',
      detectedAgo: 'Clear',
      confidence: 'N/A',
      facesNow: 16,
      x: 32,
      y: 48
    },
    {
      id: 'CAM-112',
      name: 'Bhaktinagar Circle',
      city: 'Rajkot',
      area: 'Bhaktinagar',
      station: 'Bhaktinagar Police Station',
      status: 'warning',
      detectedAgo: '1h ago',
      confidence: '88.1%',
      matchId: 'MATCH-1041',
      facesNow: 14,
      x: 34,
      y: 50
    },
    {
      id: 'CAM-130',
      name: 'Jewels Circle Waghawadi',
      city: 'Bhavnagar',
      area: 'Waghawadi Road',
      station: 'B Division Police Station',
      status: 'online',
      detectedAgo: 'Clear',
      confidence: 'N/A',
      facesNow: 15,
      x: 52,
      y: 60
    },
    {
      id: 'CAM-142',
      name: 'Bedi Gate Heritage Chowk',
      city: 'Jamnagar',
      area: 'Bedi Gate',
      station: 'A Division Police Station',
      status: 'online',
      detectedAgo: 'Clear',
      confidence: 'N/A',
      facesNow: 21,
      x: 20,
      y: 44
    }
  ];

  const filteredMarkers = activeCityFilter === 'All' 
    ? markers 
    : markers.filter(m => m.city === activeCityFilter);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      {/* Map Header Controls */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Gujarat State Police CCTV Geospatial Grid
            </h3>
            <span className="text-[11px] font-medium text-slate-500">
              ({filteredMarkers.length} Nodes Active)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time biometric match status across municipal corridors and expressways
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['All', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setActiveCityFilter(city)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                activeCityFilter === city
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas / Grid Visualization */}
      <div className="relative w-full h-[420px] bg-slate-100/70 overflow-hidden select-none">
        {/* Subtle GIS Map Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.15)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Stylized Gujarat Vector Boundary Shape */}
        <svg className="absolute inset-0 w-full h-full text-slate-300/70" viewBox="0 0 1000 600" preserveAspectRatio="none">
          {/* Stylized Gujarat outline polygons & gulf contours */}
          <path
            d="M 120 220 C 180 200, 240 180, 320 160 C 420 130, 520 140, 600 170 C 680 190, 750 250, 760 320 C 770 390, 720 480, 680 540 C 640 570, 580 550, 540 480 C 500 420, 480 380, 420 360 C 360 340, 280 370, 220 340 C 160 310, 110 260, 120 220 Z"
            fill="white"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          {/* Gulf of Kutch / Khambhat water indentations */}
          <path
            d="M 280 240 Q 380 260 340 310 Q 300 340 240 310 Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <path
            d="M 520 380 Q 560 410 540 470 Q 500 450 490 400 Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          {/* Major Police Corridor Highway Links (Golden Quadrilateral & Expressway) */}
          <path d="M 320 290 L 580 220 L 610 190" stroke="#93c5fd" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
          <path d="M 580 220 L 630 430 L 650 510" stroke="#93c5fd" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
          <path d="M 580 220 L 720 300 L 630 430" stroke="#93c5fd" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
        </svg>

        {/* City Cluster Hub Labels */}
        <div className="absolute top-[28%] left-[58%] text-[11px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none shadow-2xs">
          Ahmedabad Metro
        </div>
        <div className="absolute top-[22%] left-[61%] text-[10px] font-bold text-slate-600 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none shadow-2xs">
          Gandhinagar HQ
        </div>
        <div className="absolute top-[70%] left-[63%] text-[11px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none shadow-2xs">
          Surat City
        </div>
        <div className="absolute top-[48%] left-[71%] text-[11px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none shadow-2xs">
          Vadodara
        </div>
        <div className="absolute top-[46%] left-[30%] text-[11px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none shadow-2xs">
          Rajkot Range
        </div>

        {/* Interactive Camera Status Markers */}
        {filteredMarkers.map((marker) => {
          const isSelected = selectedMarker && selectedMarker.id === marker.id;
          const isDanger = marker.status === 'match';
          const isWarning = marker.status === 'warning';

          let pinBg = 'bg-emerald-500';
          let ringColor = 'ring-emerald-200';
          if (isDanger) {
            pinBg = 'bg-rose-600';
            ringColor = 'ring-rose-300 animate-bounce';
          } else if (isWarning) {
            pinBg = 'bg-amber-500';
            ringColor = 'ring-amber-200';
          }

          return (
            <div
              key={marker.id}
              onClick={() => setSelectedMarker(marker)}
              style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              {/* Radar wave for match */}
              {isDanger && (
                <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping"></span>
              )}

              {/* Pin Button */}
              <button
                type="button"
                className={`relative flex items-center justify-center w-7 h-7 rounded-full text-white shadow-md transition-transform hover:scale-125 ring-4 ${pinBg} ${ringColor} ${
                  isSelected ? 'scale-125 ring-8 ring-blue-400' : ''
                }`}
                title={`${marker.id}: ${marker.name}`}
              >
                {isDanger ? (
                  <ShieldAlertIcon className="w-4 h-4" />
                ) : (
                  <VideoIcon className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Mini Tooltip on Hover */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap pointer-events-none z-30">
                {marker.id} ({marker.city})
              </div>
            </div>
          );
        })}

        {/* Map Legend Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 shadow-md text-xs space-y-1.5 z-20">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Node Status Legend
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Online / Clear Surveillance</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Warning / Bandwidth Drop</span>
          </div>
          <div className="flex items-center gap-2 text-rose-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <span>Criminal Match Detected</span>
          </div>
        </div>

        {/* Selected Marker Information Panel (Bottom Right) */}
        {selectedMarker && (
          <div className="absolute bottom-3 right-3 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-20 transition-all">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2 mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedMarker.id}
                  </span>
                  {selectedMarker.status === 'match' ? (
                    <Badge variant="danger" size="sm" dot>
                      Criminal Match
                    </Badge>
                  ) : selectedMarker.status === 'warning' ? (
                    <Badge variant="warning" size="sm" dot>
                      Warning
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm" dot>
                      Online
                    </Badge>
                  )}
                </div>
                <div className="text-xs font-medium text-slate-700 mt-0.5">
                  {selectedMarker.name}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMarker(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">City / Area:</span>
                <span className="font-medium text-slate-800">
                  {selectedMarker.city} ({selectedMarker.area})
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Police Station:</span>
                <span className="font-medium text-slate-800">
                  {selectedMarker.station}
                </span>
              </div>

              {selectedMarker.status === 'match' && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Detected:</span>
                    <span className="font-semibold text-rose-700">
                      {selectedMarker.detectedAgo}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">AI Confidence:</span>
                    <span className="font-bold text-rose-700 font-mono">
                      {selectedMarker.confidence}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-slate-600">
                <span className="text-slate-400">Faces in FOV:</span>
                <span className="font-medium text-slate-800">
                  {selectedMarker.facesNow} persons
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
              {selectedMarker.status === 'match' ? (
                <button
                  type="button"
                  onClick={() => onSelectMatch(selectedMarker.matchId || 'MATCH-1024')}
                  className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShieldAlertIcon className="w-3.5 h-3.5" />
                  View Detection
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onViewCamera(selectedMarker)}
                  className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <VideoIcon className="w-3.5 h-3.5" />
                  View Live Feed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
