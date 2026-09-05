import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, Radio, ShieldAlert, Sparkles } from 'lucide-react';
import { AIEstimateBadge } from './AIEstimateBadge';

// Fix for default Leaflet icon paths in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom colored DivIcons
const createCustomMarker = (text, type = "normal", isLatest = false) => {
  let bgClass = "bg-[#0B2545] border-white text-white";
  let pulseHtml = "";

  if (type === "latest") {
    bgClass = "bg-emerald-600 border-white text-white font-bold";
    pulseHtml = '<span class="absolute -inset-1 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>';
  } else if (type === "predicted") {
    bgClass = "bg-amber-600 border-amber-200 text-white font-bold";
    pulseHtml = '<span class="absolute -inset-1 rounded-full bg-amber-400 opacity-75 animate-ping"></span>';
  } else if (type === "incident") {
    bgClass = "bg-[#C0392B] border-white text-white font-bold";
    pulseHtml = '<span class="absolute -inset-1.5 rounded-full bg-red-500 opacity-75 animate-ping"></span>';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${pulseHtml}
        <div class="relative px-2 py-1 rounded-md border-2 shadow-lg text-[10px] font-mono tracking-tighter whitespace-nowrap ${bgClass}">
          ${text}
        </div>
      </div>
    `,
    iconSize: [40, 24],
    iconAnchor: [20, 12]
  });
};

// Map auto-fitter helper
const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
};

export const MapVisualizer = ({
  sequence = [],
  prediction = null,
  incident = null,
  center = [23.0378, 72.5018], // Ahmedabad Center (SG Highway)
  zoom = 13,
  height = "420px",
  onSelectCamera = null,
  showHeatmap = false
}) => {
  const [mapReady, setMapReady] = useState(false);

  // Extract route coordinates
  const polylineCoords = sequence.map(item => [item.lat, item.lng]);

  // Projected line to predicted next camera
  const predictedCoords = sequence.length > 0 && prediction ? [
    [sequence[sequence.length - 1].lat, sequence[sequence.length - 1].lng],
    [prediction.lat, prediction.lng]
  ] : [];

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-900" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        {/* OpenStreetMap Base Tile Layer with clear clean cartography */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={center} zoom={zoom} />

        {/* Reconstructed Confirmed Route Polyline (Solid Navy/Gold) */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#0B2545',
              weight: 5,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {/* Projected AI Trajectory Polyline (Dashed Amber) */}
        {predictedCoords.length === 2 && (
          <Polyline
            positions={predictedCoords}
            pathOptions={{
              color: '#D97706',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8',
              lineCap: 'round'
            }}
          />
        )}

        {/* Camera Nodes on the Route */}
        {sequence.map((node, index) => {
          const isLatest = index === sequence.length - 1;
          const markerType = isLatest ? "latest" : "normal";

          return (
            <Marker
              key={`node-${node.cameraId}-${index}`}
              position={[node.lat, node.lng]}
              icon={createCustomMarker(node.cameraId, markerType)}
              eventHandlers={{
                click: () => onSelectCamera && onSelectCamera(node.cameraId)
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-xs text-slate-800 space-y-1">
                  <div className="font-bold text-[#0B2545] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    <span>{node.cameraId}: {node.cameraName}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600">
                    <div>Time: {node.timestamp}</div>
                    <div>Speed: <span className="font-bold text-slate-900">{node.speed}</span></div>
                    <div>Heading: {node.heading}</div>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Sighting Confirmed (Confidence: {node.confidence}%)
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Predicted Next Camera Marker */}
        {prediction && (
          <Marker
            position={[prediction.lat, prediction.lng]}
            icon={createCustomMarker(`${prediction.nextCameraId} (AI)`, "predicted")}
          >
            <Popup>
              <div className="p-1 font-sans text-xs text-slate-800 space-y-1.5">
                <div className="font-bold text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Predicted: {prediction.nextCameraId}</span>
                </div>
                <div className="text-[11px] text-slate-700 font-medium">
                  {prediction.nextCameraName}
                </div>
                <div className="font-mono text-[10px] text-slate-600 space-y-0.5">
                  <div>Probability: <span className="font-bold text-amber-700">{prediction.probability}</span></div>
                  <div>Est. Arrival: {prediction.estimatedArrival}</div>
                </div>
                <div className="text-[10px] bg-amber-50 border border-amber-200 text-amber-900 p-1.5 rounded">
                  <strong>AI Inferred Lead:</strong> Not confirmed by optical sighting. Requires officer checkpoint verification.
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Active CAD Incident Marker */}
        {incident && incident.coordinates && (
          <Marker
            position={[incident.coordinates.lat, incident.coordinates.lng]}
            icon={createCustomMarker(`INCIDENT: ${incident.id}`, "incident")}
          >
            <Popup>
              <div className="p-1 font-sans text-xs text-slate-800 space-y-1">
                <div className="font-bold text-red-700 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>{incident.id}: {incident.title}</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Location: {incident.location}
                </div>
                <div className="text-[11px] text-slate-600">
                  Units: PCR-17 (Dispatched), EMRI 108 (Dispatched)
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Floating Map Legend & Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-300 shadow-lg text-[11px] text-slate-700 flex flex-wrap items-center gap-3 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0B2545] border border-white"></span>
          <span className="font-medium">Detected Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white"></span>
          <span className="font-medium">Last Known Location</span>
        </div>
        {prediction && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-600 border border-white"></span>
            <span className="font-medium text-amber-900">AI Predicted Node</span>
          </div>
        )}
        <div className="h-3 w-px bg-slate-300"></div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
          <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>AHMEDABAD CCTV GIS TELEMETRY</span>
        </div>
      </div>
    </div>
  );
};
