import React, { useState, useMemo } from 'react';
import { SearchIcon, CloseIcon, VideoIcon, DatabaseIcon, ShieldAlertIcon, MapPinIcon, ScanFaceIcon } from '../common/Icons';
import { getAllCameras, CRIMINAL_DATABASE, RECENT_MATCHES } from '../../data/mockData';

export function GlobalSearchModal({ isOpen, onClose, onSelectCamera, onSelectMatch, onNavigate }) {
  const [query, setQuery] = useState('');

  const cameras = useMemo(() => getAllCameras(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const found = [];

    // Search Cameras
    cameras.forEach((cam) => {
      if (
        cam.id.toLowerCase().includes(q) ||
        cam.name.toLowerCase().includes(q) ||
        cam.station.toLowerCase().includes(q) ||
        cam.city.toLowerCase().includes(q) ||
        cam.area.toLowerCase().includes(q)
      ) {
        found.push({
          type: 'camera',
          id: cam.id,
          title: `${cam.id} - ${cam.name}`,
          subtitle: `${cam.station} • ${cam.area}, ${cam.city}`,
          raw: cam
        });
      }
    });

    // Search Criminal Records
    CRIMINAL_DATABASE.forEach((crim) => {
      if (
        crim.criminalId.toLowerCase().includes(q) ||
        crim.name.toLowerCase().includes(q) ||
        crim.alias.toLowerCase().includes(q) ||
        crim.caseId.toLowerCase().includes(q) ||
        crim.category.toLowerCase().includes(q)
      ) {
        found.push({
          type: 'criminal',
          id: crim.criminalId,
          title: `${crim.criminalId} (${crim.alias})`,
          subtitle: `${crim.category} • ${crim.caseId}`,
          raw: crim
        });
      }
    });

    // Search Matches / Detections
    RECENT_MATCHES.forEach((m) => {
      if (
        m.matchId.toLowerCase().includes(q) ||
        m.detectionId.toLowerCase().includes(q) ||
        m.camera.toLowerCase().includes(q) ||
        m.chargeCategory.toLowerCase().includes(q)
      ) {
        found.push({
          type: 'match',
          id: m.matchId,
          title: `${m.matchId} / ${m.detectionId} (Match: ${m.confidence}%)`,
          subtitle: `${m.camera} • ${m.policeStation}`,
          raw: m
        });
      }
    });

    return found.slice(0, 10);
  }, [query, cameras]);

  if (!isOpen) return null;

  const handleSelect = (item) => {
    onClose();
    if (item.type === 'camera') {
      onSelectCamera(item.raw);
    } else if (item.type === 'match') {
      onSelectMatch(item.id);
    } else if (item.type === 'criminal') {
      onNavigate('criminals');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 text-center sm:p-6 sm:pt-24">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl border border-slate-200 transition-all">
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
            <SearchIcon className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Camera ID, Criminal ID, FIR Case, Police Station, Area..."
              className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
            <kbd className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-mono">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2">
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((item) => {
                  let Icon = VideoIcon;
                  let iconBg = 'bg-blue-50 text-blue-600';
                  if (item.type === 'criminal') {
                    Icon = DatabaseIcon;
                    iconBg = 'bg-amber-50 text-amber-700';
                  } else if (item.type === 'match') {
                    Icon = ShieldAlertIcon;
                    iconBg = 'bg-rose-50 text-rose-600';
                  }

                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition flex items-center justify-between border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {item.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : query.trim() ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No matching cameras, criminal records, or FIR cases found for "{query}".
              </div>
            ) : (
              <div className="p-4 text-xs text-slate-400">
                <div className="font-semibold text-slate-600 mb-2">Quick Search Suggestions:</div>
                <div className="flex flex-wrap gap-1.5">
                  {['CAM-042', 'CR-20841', 'SG Highway', 'Sola Police Station', 'Varachha', 'Ahmedabad', 'MATCH-1024'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
