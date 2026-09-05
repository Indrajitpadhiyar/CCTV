import React, { useState } from 'react';
import { 
  SearchCode, 
  Sparkles, 
  SlidersHorizontal, 
  Camera, 
  Clock, 
  Tag, 
  CheckCircle2, 
  FolderPlus, 
  LayoutGrid, 
  Table as TableIcon,
  Eye,
  Send,
  HelpCircle
} from 'lucide-react';
import { QueryPills } from './QueryPills';
import { AIEstimateBadge } from '../../common/AIEstimateBadge';
import { CameraFeedModal } from '../../common/CameraFeedModal';
import { getCameraById } from '../../../data/mockCameras';
import { useCase } from '../../../context/CaseContext';
import { useLanguage } from '../../../context/LanguageContext';

export const NLSearchView = () => {
  const { activeCase, recordAuditLog, addToast } = useCase();
  const { t } = useLanguage();

  const [prompt, setPrompt] = useState("Find red cars seen near SG Highway between 8 PM and 10 PM");
  const [viewMode, setViewMode] = useState("grid"); // grid | table
  const [selectedCameraForModal, setSelectedCameraForModal] = useState(null);

  // Structured query parse state
  const [parsedQuery, setParsedQuery] = useState({
    color: "Red",
    objectType: "Car / Sedan",
    location: "SG Highway Corridor (CAM-08 to CAM-23)",
    timeRange: "20:00 – 22:00 IST",
    speedThreshold: "Any"
  });

  // Sample Detection Results
  const [results, setResults] = useState([
    {
      id: "DET-8801",
      plate: "GJ05AB9921",
      makeModel: "Maruti Suzuki Swift (Red)",
      cameraId: "CAM-08",
      cameraName: "Pakwan Junction (North-Bound)",
      timestamp: "20:42:15 IST",
      confidence: 96.8,
      speed: "54 km/h",
      thumbnail: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=400&q=80",
      plateCrop: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=200&q=80",
      bbox: { top: "35%", left: "30%", width: "40%", height: "45%" }
    },
    {
      id: "DET-8802",
      plate: "GJ01XY4419",
      makeModel: "Hyundai i20 (Deep Maroon)",
      cameraId: "CAM-14",
      cameraName: "Iskcon Flyover (Ascent Gate)",
      timestamp: "21:05:30 IST",
      confidence: 92.4,
      speed: "62 km/h",
      thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80",
      plateCrop: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=200&q=80",
      bbox: { top: "40%", left: "25%", width: "45%", height: "40%" }
    },
    {
      id: "DET-8803",
      plate: "GJ27CR1092",
      makeModel: "Honda City (Red Metallic)",
      cameraId: "CAM-23",
      cameraName: "Thaltej Underpass (West Exit)",
      timestamp: "21:38:44 IST",
      confidence: 94.1,
      speed: "68 km/h",
      thumbnail: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80",
      plateCrop: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=200&q=80",
      bbox: { top: "30%", left: "35%", width: "38%", height: "50%" }
    }
  ]);

  const sampleQueries = [
    "Find red cars seen near SG Highway between 8 PM and 10 PM",
    "Show all detections of vehicle GJ01XX1234 yesterday",
    "Which cameras saw this vehicle after 6 PM?",
    "White SUV speeding over 70 km/h near Pakwan Junction"
  ];

  const handleRunSearch = (queryText = prompt) => {
    setPrompt(queryText);

    // Parse logic simulation
    let newParsed = { ...parsedQuery };
    if (queryText.toLowerCase().includes("red")) {
      newParsed.color = "Red";
      newParsed.objectType = "Car / Sedan";
      newParsed.location = "SG Highway Corridor (CAM-08 to CAM-23)";
      newParsed.timeRange = "20:00 – 22:00 IST";
    } else if (queryText.toLowerCase().includes("gj01xx1234")) {
      newParsed.color = "White";
      newParsed.objectType = "SUV (Hyundai Creta)";
      newParsed.location = "City Wide (SP Ring Rd to SG Hwy)";
      newParsed.timeRange = "12:00 – 14:00 IST";
    } else if (queryText.toLowerCase().includes("speeding") || queryText.toLowerCase().includes("70 km/h")) {
      newParsed.color = "White";
      newParsed.objectType = "SUV";
      newParsed.location = "Pakwan Junction (CAM-42)";
      newParsed.timeRange = "14:00 – 16:00 IST";
      newParsed.speedThreshold = "> 70 km/h";
    }

    setParsedQuery(newParsed);
    recordAuditLog("NATURAL_LANGUAGE_QUERY", `NL Query: "${queryText}"`, activeCase?.id);
    addToast(`AI Parsed query and retrieved ${results.length} detection sightings`, "success");
  };

  const handleUpdateParsedField = (field, value) => {
    setParsedQuery(prev => ({ ...prev, [field]: value }));
  };

  const handleAddToCase = (detection) => {
    recordAuditLog(
      "ATTACH_SIGHTING_TO_CASE",
      `Attached sighting ${detection.id} (${detection.plate} at ${detection.cameraId}) to Case ${activeCase?.id}`,
      activeCase?.id
    );
    addToast(`Attached detection ${detection.id} (${detection.plate}) to Case ${activeCase?.id}`, "success");
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
            <SearchCode className="w-6 h-6 text-[#0B2545]" />
            <span>{t('nlTitle')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('nlSubtitle')}
          </p>
        </div>
      </div>

      {/* Command Console Search Input */}
      <div className="bg-[#0B2545] rounded-xl p-5 shadow-md border border-[#10305A] text-white space-y-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleRunSearch(prompt); }} 
          className="relative flex items-center"
        >
          <div className="absolute left-4 flex items-center gap-2 pointer-events-none">
            <Sparkles className="w-5 h-5 text-[#C9A227] animate-pulse" />
            <span className="text-slate-400 font-mono text-xs hidden sm:inline">Ask Drishti:</span>
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type query in plain language (e.g. Find red cars seen near SG Highway between 8 PM and 10 PM)..."
            className="w-full bg-[#07172B] border-2 border-slate-700 focus:border-[#C9A227] rounded-xl py-3.5 pl-14 sm:pl-32 pr-28 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-hidden"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-[#C9A227] hover:bg-[#D4AF37] text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span>Execute</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Query Example Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">EXAMPLE QUERIES:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleRunSearch(sq)}
              className="bg-[#10305A] hover:bg-[#163f75] text-slate-200 border border-slate-600/80 px-2.5 py-1 rounded-md text-[11px] transition-colors"
            >
              "{sq}"
            </button>
          ))}
        </div>
      </div>

      {/* Parsed Query Panel (Human-in-the-loop) */}
      <QueryPills 
        parsedQuery={parsedQuery}
        onUpdateField={handleUpdateParsedField}
        onReRun={() => handleRunSearch(prompt)}
      />

      {/* Results Header & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Detection Sightings ({results.length} Matches Found)
          </h3>
          <AIEstimateBadge 
            text="AI Detections — Unverified" 
            details="Objects detected via YOLO edge neural networks. Officer review required prior to evidentiary filing."
            size="sm"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-lg text-xs">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-[#0B2545] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-white text-[#0B2545] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
            title="Tabular Forensic View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detection Cards Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#0B2545]">{item.id}</span>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-sm font-semibold">
                    {item.confidence}% Match
                  </span>
                </div>

                {/* Thumbnail with Bounding Box */}
                <div 
                  onClick={() => handleInspect(item.cameraId)}
                  className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group border border-slate-200"
                >
                  <img src={item.thumbnail} alt={item.cameraName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 cctv-scanline opacity-30"></div>
                  
                  {/* Simulated Bounding Box */}
                  <div 
                    className="absolute border-2 border-amber-400 bg-amber-400/20 rounded-xs pointer-events-none"
                    style={item.bbox}
                  >
                    <span className="absolute -top-4 left-0 bg-amber-500 text-slate-950 font-mono text-[8px] font-bold px-1">
                      {item.plate}
                    </span>
                  </div>

                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#C9A227]" />
                    <span>Inspect</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <p className="font-mono font-bold text-sm text-[#0B2545]">{item.plate}</p>
                  <p className="text-xs text-slate-700 font-semibold">{item.makeModel}</p>
                  
                  <div className="pt-2 text-[11px] font-mono text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Camera:</span>
                      <span className="font-semibold text-slate-800">{item.cameraId} ({item.cameraName})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Timestamp:</span>
                      <span className="font-semibold text-slate-800">{item.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Velocity:</span>
                      <span className="font-bold text-[#0B2545]">{item.speed}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Case: {activeCase?.id}</span>
                <button
                  type="button"
                  onClick={() => handleAddToCase(item)}
                  className="px-3 py-1.5 bg-[#0B2545] hover:bg-[#10305A] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{t('addToCase')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 font-mono text-[11px]">
                <th className="p-3">ID</th>
                <th className="p-3">Plate No.</th>
                <th className="p-3">Vehicle Details</th>
                <th className="p-3">Camera Node</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Speed</th>
                <th className="p-3">Confidence</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-900">{item.id}</td>
                  <td className="p-3 font-mono font-bold bg-slate-100 text-[#0B2545] rounded">{item.plate}</td>
                  <td className="p-3 text-slate-800 font-medium">{item.makeModel}</td>
                  <td className="p-3 font-mono text-slate-700">{item.cameraId} ({item.cameraName})</td>
                  <td className="p-3 font-mono text-slate-600">{item.timestamp}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">{item.speed}</td>
                  <td className="p-3 font-mono text-emerald-700 font-bold">{item.confidence}%</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleAddToCase(item)}
                      className="px-2.5 py-1 bg-[#0B2545] hover:bg-[#10305A] text-white text-[11px] font-semibold rounded transition-colors"
                    >
                      Attach
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Camera Inspection Modal */}
      <CameraFeedModal
        camera={selectedCameraForModal}
        isOpen={!!selectedCameraForModal}
        onClose={() => setSelectedCameraForModal(null)}
      />
    </div>
  );
};
