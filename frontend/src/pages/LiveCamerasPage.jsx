import React, { useState } from 'react';
import { CameraCard } from '../components/dashboard/CameraCard';
import { VideoIcon, FilterIcon, RefreshCwIcon, MaximizeIcon } from '../components/common/Icons';

export function LiveCamerasPage({ cameras, onViewCamera, onSelectMatch }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState(3); // 2, 3, or 4

  const filtered = cameras.filter((cam) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'match' && cam.status === 'match') ||
      (statusFilter === 'warning' && cam.status === 'warning') ||
      (statusFilter === 'online' && cam.status === 'online');

    const matchesSearch =
      cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Live Surveillance Matrix ({filtered.length} Channels)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized multi-camera CCTV feeds from Gujarat State Police grid
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <input
            type="text"
            placeholder="Filter camera by ID or station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 outline-none w-48 sm:w-60 focus:bg-white focus:border-blue-500"
          />

          {/* Status Filter Buttons */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 font-medium transition ${
                statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('match')}
              className={`px-3 py-1.5 font-medium transition ${
                statusFilter === 'match' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Matches
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('warning')}
              className={`px-3 py-1.5 font-medium transition ${
                statusFilter === 'warning' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Warnings
            </button>
          </div>

          {/* Grid Layout Toggle */}
          <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
            {[2, 3, 4].map((cols) => (
              <button
                key={cols}
                type="button"
                onClick={() => setGridCols(cols)}
                className={`px-2.5 py-1 rounded font-mono font-bold transition ${
                  gridCols === cols ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cols}x{cols}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cameras Grid */}
      <div
        className={`grid gap-4 ${
          gridCols === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : gridCols === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {filtered.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onViewCamera={onViewCamera}
            onSelectMatch={onSelectMatch}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
          No cameras match the current filters.
        </div>
      )}
    </div>
  );
}
