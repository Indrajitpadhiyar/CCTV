import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Camera, 
  MapPin, 
  Eye, 
  Activity, 
  Radio, 
  ShieldAlert, 
  Search, 
  Filter,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import { mockCameras } from '../../../data/mockCameras';
import { CameraFeedModal } from '../../common/CameraFeedModal';
import { StatusPill } from '../../common/StatusPill';
import { MapVisualizer } from '../../common/MapVisualizer';
import { useLanguage } from '../../../context/LanguageContext';
import { useCase } from '../../../context/CaseContext';

export const LiveMatrixView = () => {
  const { t } = useLanguage();
  const { recordAuditLog } = useCase();

  const [selectedZone, setSelectedZone] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCameraForModal, setSelectedCameraForModal] = useState(null);
  const [viewTab, setViewTab] = useState("matrix"); // matrix | map

  const zones = [
    "ALL",
    "SG Highway Corridor",
    "Bopal - SBR Sector",
    "Central Heritage Zone",
    "Navrangpura Commercial",
    "Old City Transport Hub",
    "Outer Ring Road Sector"
  ];

  const filteredCameras = mockCameras.filter(c => {
    const matchesZone = selectedZone === "ALL" || c.zone === selectedZone;
    const matchesStatus = selectedStatus === "ALL" || c.status === selectedStatus;
    const matchesQuery = searchQuery === "" ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesStatus && matchesQuery;
  });

  const handleInspectCamera = (cam) => {
    setSelectedCameraForModal(cam);
    recordAuditLog("INSPECT_LIVE_STREAM", `Opened live optical CCTV matrix view for ${cam.id}`, "GENERAL_SURVEILLANCE");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0B2545] tracking-wide uppercase flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-[#0B2545]" />
            <span>{t('navLiveMatrix')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Metropolitan CCTV Sensor Network • 30 Tactical Nodes Across Ahmedabad
          </p>
        </div>

        {/* View Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-lg text-xs">
          <button
            onClick={() => setViewTab("matrix")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewTab === "matrix" ? "bg-[#0B2545] text-white shadow-xs font-bold" : "text-slate-700 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Video Wall (Grid)</span>
          </button>
          <button
            onClick={() => setViewTab("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewTab === "map" ? "bg-[#0B2545] text-white shadow-xs font-bold" : "text-slate-700 hover:text-slate-900"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>GIS Map View</span>
          </button>
        </div>
      </div>

      {/* Filter and Zone Selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search camera by ID, junction or sector name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 text-[11px]">STATUS:</span>
            {["ALL", "ACTIVE", "ALERT", "MAINTENANCE"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  selectedStatus === st
                    ? "bg-[#0B2545] text-white font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Zone Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-400 text-[11px] font-mono shrink-0">ZONE:</span>
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors shrink-0 ${
                selectedZone === zone
                  ? "bg-[#C9A227] text-slate-950 font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Mode */}
      {viewTab === "matrix" ? (
        /* Video Wall Grid */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>SHOWING {filteredCameras.length} CCTV NODES</span>
            <span>CLICK ANY CAMERA TO EXPAND 4K RTSP FEED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCameras.map((cam) => {
              const isAlert = cam.status === 'ALERT';

              return (
                <div
                  key={cam.id}
                  onClick={() => handleInspectCamera(cam)}
                  className={`bg-white rounded-xl border overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                    isAlert ? 'border-2 border-red-500 bg-red-50/10' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Live Stream Thumbnail */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={cam.snapshot}
                        alt={cam.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 cctv-scanline opacity-30"></div>

                      {/* Top Bar OSD */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                        <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
                        <span className="font-bold text-white">{cam.id}</span>
                      </div>

                      <div className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300">
                        {cam.resolution.split(' ')[0]}
                      </div>

                      {/* Inspect Overlay on Hover */}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="px-3 py-1.5 bg-[#0B2545] text-white font-mono text-xs font-bold rounded-md shadow-md flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
                          <span>Inspect Live</span>
                        </span>
                      </div>
                    </div>

                    {/* Camera Info */}
                    <div className="p-3 space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1" title={cam.name}>
                          {cam.name}
                        </h4>
                        <StatusPill status={cam.status} size="sm" />
                      </div>

                      <p className="text-[11px] text-slate-500 font-mono line-clamp-1">
                        {cam.zone}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-600">
                        <span>FPS: {cam.fps}</span>
                        <span>PTZ: {cam.ptz ? 'YES' : 'FIXED'}</span>
                        <span className="text-emerald-700 font-semibold">{cam.anprEnabled ? 'ANPR' : 'OPTICAL'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* GIS Map View */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>GIS CAMERA POSITIONING • CLICK MARKERS TO VIEW METADATA</span>
          </div>

          <MapVisualizer
            sequence={filteredCameras.map((c, i) => ({
              step: i + 1,
              cameraId: c.id,
              cameraName: c.name,
              lat: c.lat,
              lng: c.lng,
              timestamp: "ACTIVE STREAM",
              speed: `${c.fps} FPS`,
              heading: c.zone,
              confidence: 99.0
            }))}
            center={[23.0378, 72.5118]}
            zoom={13}
            height="600px"
            onSelectCamera={(camId) => {
              const cam = mockCameras.find(c => c.id === camId);
              if (cam) handleInspectCamera(cam);
            }}
          />
        </div>
      )}

      {/* Modal */}
      <CameraFeedModal
        camera={selectedCameraForModal}
        isOpen={!!selectedCameraForModal}
        onClose={() => setSelectedCameraForModal(null)}
      />
    </div>
  );
};
