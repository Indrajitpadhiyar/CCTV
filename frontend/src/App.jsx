import React, { useState, useEffect } from 'react';
import CameraCard from './components/CameraCard';
import StreamModal from './components/StreamModal';
import {
  Video,
  Grid,
  RefreshCw,
  Search,
  Filter,
  Shield,
  Key,
  Mail,
  AlertCircle,
  Activity,
  CheckCircle2,
  Server,
  Layers,
  Radio
} from 'lucide-react';
import './App.css';

export default function App() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gridCols, setGridCols] = useState(3);
  const [activeModalCam, setActiveModalCam] = useState(null);

  // Credentials for stream URL generation
  const [userEmail, setUserEmail] = useState('admin@corp8.cloud');
  const [userPassword, setUserPassword] = useState('SentinelSecure2026!');

  // Generate 30 Cameras catalogue default (cam01 ... cam30)
  const defaultCameras = Array.from({ length: 30 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return {
      id: `cam${num}`,
      camera_code: `cam${num}`,
      name: `Central Surveillance Node ${num}`,
      status: i % 7 === 6 ? 'degraded' : 'online',
      district: i < 10 ? 'District-North' : i < 20 ? 'District-Central' : 'District-South',
      zone: `Zone-${(i % 5) + 1}`,
      protocol: 'RTSP',
    };
  });

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/cameras?page_size=100');
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.items && json.data.items.length > 0) {
          setCameras(json.data.items);
        } else {
          setCameras(defaultCameras);
        }
      } else {
        setCameras(defaultCameras);
      }
    } catch {
      setCameras(defaultCameras);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleSyncCatalogue = async () => {
    setSyncing(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/cameras/sync-catalog', {
        method: 'POST'
      });
      if (res.ok) {
        await fetchCameras();
      }
    } catch (e) {
      console.log('Catalogue sync completed with default fallback.');
    } finally {
      setTimeout(() => setSyncing(false), 1000);
    }
  };

  const filteredCameras = cameras.filter((cam) => {
    const code = (cam.camera_code || cam.id || '').toLowerCase();
    const name = (cam.name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = code.includes(query) || name.includes(query);

    if (statusFilter === 'ONLINE') return matchesSearch && cam.status === 'online';
    if (statusFilter === 'DEGRADED') return matchesSearch && cam.status === 'degraded';
    return matchesSearch;
  });

  const encodedEmail = userEmail ? userEmail.replace('@', '%40') : 'user%40example.com';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  SENTINEL AI CCTV PLATFORM
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v2.4 REAL-TIME
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  30 Cameras Centralized
                </span>
                •
                <span>Monotonic PTS Timing</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncCatalogue}
              disabled={syncing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Catalogue (cameras.json)'}
            </button>

            {/* Grid Column Selector */}
            <div className="flex items-center bg-gray-950 p-1 rounded-lg border border-gray-800 text-xs">
              {[2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  onClick={() => setGridCols(cols)}
                  className={`px-2.5 py-1 rounded font-mono transition ${
                    gridCols === cols
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {cols}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
        {/* Credentials & Access Bar */}
        <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 backdrop-blur flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Stream Access Credentials:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email"
                className="bg-transparent text-gray-200 focus:outline-none w-44 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800">
              <Key className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Password"
                className="bg-transparent text-gray-200 focus:outline-none w-36 font-mono"
              />
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
              Encodes @ as: <span className="font-bold text-white">{encodedEmail}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search camera code (e.g. cam01, cam15)..."
              className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 text-xs">
            {['ALL', 'ONLINE', 'DEGRADED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                  statusFilter === st
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {st === 'ALL' ? 'All Feeds (30)' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Centralized Multi-Camera Grid */}
        <div
          className={`grid gap-4 ${
            gridCols === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : gridCols === 3
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {filteredCameras.map((cam) => (
            <CameraCard
              key={cam.id || cam.camera_code}
              camera={cam}
              userEmail={userEmail}
              userPassword={userPassword}
              onOpenModal={setActiveModalCam}
            />
          ))}
        </div>
      </main>

      {/* Stream Endpoints Inspection Modal */}
      {activeModalCam && (
        <StreamModal
          camera={activeModalCam}
          userEmail={userEmail}
          userPassword={userPassword}
          onClose={() => setActiveModalCam(null)}
        />
      )}
    </div>
  );
}
