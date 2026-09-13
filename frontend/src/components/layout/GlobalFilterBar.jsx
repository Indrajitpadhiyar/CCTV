import React from 'react';
import { FilterIcon, RefreshCwIcon, ChevronDownIcon } from '../common/Icons';
import { GUJARAT_CITIES_DATA } from '../../data/mockData';

export function GlobalFilterBar({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  activeFilterCount = 0
}) {
  const selectedCityData = GUJARAT_CITIES_DATA[filters.city];

  // Derive available areas based on selected city
  const availableAreas = selectedCityData ? Object.keys(selectedCityData.areas) : [];

  // Derive available police stations based on selected city and area
  let availableStations = [];
  if (selectedCityData) {
    if (filters.area && selectedCityData.areas[filters.area]) {
      availableStations = selectedCityData.areas[filters.area].stations;
    } else {
      // Aggregate all stations in the city
      const stationSet = new Set();
      Object.values(selectedCityData.areas).forEach((areaObj) => {
        areaObj.stations.forEach((st) => stationSet.add(st));
      });
      availableStations = Array.from(stationSet);
    }
  }

  // Derive available cameras based on selected city, area, and police station
  let availableCameras = [];
  if (selectedCityData) {
    let camerasToFilter = [];
    if (filters.area && selectedCityData.areas[filters.area]) {
      camerasToFilter = selectedCityData.areas[filters.area].cameras;
    } else {
      Object.values(selectedCityData.areas).forEach((areaObj) => {
        camerasToFilter.push(...areaObj.cameras);
      });
    }

    if (filters.policeStation) {
      camerasToFilter = camerasToFilter.filter((c) => c.station === filters.policeStation);
    }
    availableCameras = camerasToFilter;
  }

  // Cascading Handlers
  const handleCityChange = (newCity) => {
    onFilterChange({
      ...filters,
      city: newCity,
      area: '',
      policeStation: '',
      camera: ''
    });
  };

  const handleAreaChange = (newArea) => {
    onFilterChange({
      ...filters,
      area: newArea,
      policeStation: '',
      camera: ''
    });
  };

  const handleStationChange = (newStation) => {
    onFilterChange({
      ...filters,
      policeStation: newStation,
      camera: ''
    });
  };

  const handleCameraChange = (newCam) => {
    onFilterChange({
      ...filters,
      camera: newCam
    });
  };

  return (
    <section className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="px-4 sm:px-6 py-3">
        {/* Header line of filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-50 text-blue-700">
              <FilterIcon className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Surveillance Grid Filter Bar
            </span>
            {activeFilterCount > 0 && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {activeFilterCount} Active
              </span>
            )}
            <span className="text-[11px] text-slate-400 hidden md:inline">
              (Cascading Location & Camera Telemetry)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <label className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={filters.onlyAvailable !== false}
                onChange={(e) => onFilterChange({ ...filters, onlyAvailable: e.target.checked })}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
              />
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Only Available Cameras (API)
              </span>
            </label>

            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition shadow-2xs"
            >
              <RefreshCwIcon className="w-3 h-3 text-slate-400" />
              Reset
            </button>
            <button
              type="button"
              onClick={onApplyFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
            >
              Commit Filtering & Query API
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* 1. State */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => onFilterChange({ ...filters, state: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="Gujarat">Gujarat (State)</option>
            </select>
          </div>

          {/* 2. City */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              City
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Cities</option>
              {Object.keys(GUJARAT_CITIES_DATA).map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Area (Dynamic) */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Area
            </label>
            <select
              value={filters.area}
              onChange={(e) => handleAreaChange(e.target.value)}
              disabled={!filters.city}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">All Areas {filters.city ? `(${availableAreas.length})` : ''}</option>
              {availableAreas.map((areaName) => (
                <option key={areaName} value={areaName}>
                  {areaName}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Police Station (Dynamic) */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Police Station
            </label>
            <select
              value={filters.policeStation}
              onChange={(e) => handleStationChange(e.target.value)}
              disabled={!filters.city}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">All Police Stations</option>
              {availableStations.map((stationName) => (
                <option key={stationName} value={stationName}>
                  {stationName}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Camera (Dynamic) */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Camera ID
            </label>
            <select
              value={filters.camera}
              onChange={(e) => handleCameraChange(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Cameras</option>
              {availableCameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.id} - {cam.name.slice(0, 18)}...
                </option>
              ))}
              {!filters.city && (
                <>
                  <option value="CAM-042">CAM-042 (SG Highway)</option>
                  <option value="CAM-072">CAM-072 (Varachha)</option>
                  <option value="CAM-088">CAM-088 (Alkapuri)</option>
                  <option value="CAM-104">CAM-104 (Kalawad)</option>
                  <option value="CAM-095">CAM-095 (Infocity)</option>
                </>
              )}
            </select>
          </div>

          {/* 6. Detection Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Detection Status
            </label>
            <select
              value={filters.detectionStatus}
              onChange={(e) => onFilterChange({ ...filters, detectionStatus: e.target.value })}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="All">All Detections</option>
              <option value="Face Detected">Face Detected</option>
              <option value="No Match">No Match (Clear)</option>
              <option value="Criminal Match">Criminal Match (Flagged)</option>
            </select>
          </div>

          {/* 7. Date Picker */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
