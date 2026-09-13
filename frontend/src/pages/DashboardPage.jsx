import React, { useState } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { CameraCard } from '../components/dashboard/CameraCard';
import { CameraMapPanel } from '../components/dashboard/CameraMapPanel';
import { RecentMatchesTable } from '../components/dashboard/RecentMatchesTable';
import { FindPersonSidePanel } from '../components/common/FindPersonSidePanel';
import { HumanVerificationCard } from '../components/common/HumanVerificationCard';
import { AreaCameraGrid } from '../components/common/AreaCameraGrid';
import {
  VideoIcon,
  ScanFaceIcon,
  UserCheckIcon,
  BellIcon,
  ShieldAlertIcon,
  ArrowUpRightIcon,
  CheckCircleIcon
} from '../components/common/Icons';
import { ANALYTICS_DATA, getTenCamerasForArea } from '../data/mockData';

export function DashboardPage({
  filteredCameras,
  filteredMatches,
  apiCameras,
  isLoadingCameras,
  onViewCamera,
  onSelectMatch,
  onNavigate,
  selectedDistrict,
  selectedArea,
  onDistrictChange,
  onAreaChange,
  availableDistricts,
  availableAreas,
  onStartFaceScan,
  isScanning,
  scanProgress,
  scanResult,
  uploadedPhoto,
  backendConnected,
  onClearScan,
  onVerifySpotting
}) {
  const kpis = ANALYTICS_DATA.kpis;
  const [filterOnlyMatches, setFilterOnlyMatches] = useState(true);

  // Derive cameras for the area: Use API-fetched cameras if available, otherwise getTenCamerasForArea
  const areaCameras = React.useMemo(() => {
    if (apiCameras && apiCameras.length > 0) {
      // If apiCameras belongs to this area/city, use it
      const matchesArea = apiCameras.filter(
        (c) => (!selectedArea || c.area === selectedArea) && (!selectedDistrict || c.city === selectedDistrict)
      );
      if (matchesArea.length > 0) return matchesArea.slice(0, 10);
      return apiCameras.slice(0, 10);
    }
    return getTenCamerasForArea(selectedDistrict, selectedArea);
  }, [apiCameras, selectedDistrict, selectedArea]);

  // Derive matched cameras from scanResult
  const matchedCameras = scanResult?.matched_cameras || [];

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* SECTION A: FIND PERSON BY FACE & AREA CAMERA SCANNING (USER'S KEY FEATURE) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left / Side Panel: Upload Photo & Select District/Area to scan first 10 cameras */}
        <div className="lg:col-span-4 w-full">
          <FindPersonSidePanel
            selectedDistrict={selectedDistrict}
            selectedArea={selectedArea}
            onDistrictChange={onDistrictChange}
            onAreaChange={onAreaChange}
            availableDistricts={availableDistricts}
            availableAreas={availableAreas}
            onStartScan={onStartFaceScan}
            isScanning={isScanning}
            scanProgress={scanProgress}
            scanResult={scanResult}
            backendConnected={backendConnected}
            onClearScan={onClearScan}
          />
        </div>

        {/* Right / Main Panel: Verification Review & Area Camera Grid Structure */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. If Target Person is Spotted: Prominent Human Verification Review Card for Multiple Matches */}
          {scanResult?.person_found && (scanResult?.matched_cameras?.length > 0 || scanResult?.last_known_spot) && (
            <HumanVerificationCard
              matches={scanResult.matched_cameras && scanResult.matched_cameras.length > 0 ? scanResult.matched_cameras : [scanResult.last_known_spot]}
              uploadedPhoto={uploadedPhoto}
              onVerify={(match) => {
                if (onVerifySpotting) onVerifySpotting(match, 'confirmed');
              }}
              onReject={(match) => {
                if (onVerifySpotting) onVerifySpotting(match, 'rejected');
              }}
              onOpenLiveFeed={(match) => {
                onViewCamera({
                  id: match.camera_id,
                  name: match.camera_name,
                  station: match.police_station,
                  area: match.area,
                  city: match.city,
                  status: 'match',
                  fps: 30,
                  facesNow: 1
                });
              }}
            />
          )}

          {/* 2. Area Camera Grid: Shows all 10 cameras or ONLY matched cameras for verification */}
          <AreaCameraGrid
            cameras={areaCameras}
            matchedCameras={matchedCameras}
            filterOnlyMatches={filterOnlyMatches && matchedCameras.length > 0}
            onToggleFilterOnlyMatches={setFilterOnlyMatches}
            onViewCamera={onViewCamera}
            onInspectMatch={(match) => {
              if (onSelectMatch) onSelectMatch('MATCH-1024');
            }}
            selectedArea={selectedArea}
            selectedDistrict={selectedDistrict}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B: DASHBOARD OVERVIEW (KPIS, GUJARAT MAP, & MATCHES REGISTRY)     */}
      {/* ========================================================================= */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Statewide Surveillance Telemetry & Intelligence
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gujarat State Police Central Command overview across 128 active highway and municipal checkpoints
            </p>
          </div>
        </div>

        {/* KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Cameras"
            value={kpis.activeCameras}
            trend={kpis.activeCamerasTrend}
            trendPositive={true}
            subtitle={kpis.activeCamerasSubtitle}
            icon={VideoIcon}
            variant="default"
            onClick={() => onNavigate('cameras')}
          />

          <StatCard
            title="Faces Detected"
            value={kpis.facesDetected}
            trend="+18.4%"
            trendPositive={true}
            subtitle={kpis.facesDetectedSubtitle}
            icon={ScanFaceIcon}
            variant="default"
            onClick={() => onNavigate('detections')}
          />

          <StatCard
            title="Criminal Matches"
            value={kpis.criminalMatches}
            trend="Action Required"
            trendPositive={false}
            subtitle={kpis.criminalMatchesSubtitle}
            icon={UserCheckIcon}
            variant="danger"
            onClick={() => onNavigate('matches')}
          />

          <StatCard
            title="Active Alerts"
            value={kpis.activeAlerts}
            trend="Immediate"
            trendPositive={false}
            subtitle={kpis.activeAlertsSubtitle}
            icon={BellIcon}
            variant="warning"
            onClick={() => onNavigate('alerts')}
          />
        </div>
      </div>

      {/* SECTION 6: CAMERA MAP / LOCATION VIEW */}
      <div className="space-y-3">
        <CameraMapPanel
          onSelectMatch={onSelectMatch}
          onViewCamera={onViewCamera}
        />
      </div>

      {/* SECTION 7: RECENT CRIMINAL MATCHES TABLE */}
      <div className="space-y-3">
        <RecentMatchesTable
          matches={filteredMatches}
          onSelectMatch={onSelectMatch}
        />
      </div>
    </div>
  );
}
