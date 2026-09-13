import React, { useState } from 'react';
import { CameraMapPanel } from '../components/dashboard/CameraMapPanel';
import { Badge } from '../components/common/Badge';
import { MapPinIcon, VideoIcon, EyeIcon } from '../components/common/Icons';

export function CameraLocationsPage({ cameras, onViewCamera, onSelectMatch }) {
  const [selectedCity, setSelectedCity] = useState('All');

  const filtered = selectedCity === 'All'
    ? cameras
    : cameras.filter(c => c.city === selectedCity);

  return (
    <div className="space-y-5">
      {/* Map Interactive Visualization */}
      <CameraMapPanel
        onSelectMatch={onSelectMatch}
        onViewCamera={onViewCamera}
      />

      {/* Camera Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Gujarat State Police Camera Directory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive list of all installed high-definition surveillance units
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Filter City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium outline-none"
            >
              <option value="All">All Cities ({cameras.length})</option>
              {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand', 'Bharuch', 'Vapi', 'Mehsana'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="px-4 py-3">Camera ID</th>
                <th scope="col" className="px-4 py-3">Camera Location Name</th>
                <th scope="col" className="px-4 py-3">City & Area</th>
                <th scope="col" className="px-4 py-3">Police Station Jurisdiction</th>
                <th scope="col" className="px-4 py-3">Hardware Type</th>
                <th scope="col" className="px-4 py-3">Stream Health</th>
                <th scope="col" className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cam) => (
                <tr key={cam.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {cam.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {cam.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-700">{cam.area}</span>, {cam.city}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {cam.station}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                    {cam.type}
                  </td>
                  <td className="px-4 py-3">
                    {cam.status === 'match' ? (
                      <Badge variant="danger" dot size="sm">Criminal Match</Badge>
                    ) : cam.status === 'warning' ? (
                      <Badge variant="warning" dot size="sm">Warning</Badge>
                    ) : (
                      <Badge variant="success" dot size="sm">Online (30 FPS)</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onViewCamera(cam)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs inline-flex items-center gap-1"
                    >
                      <VideoIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Feed</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
