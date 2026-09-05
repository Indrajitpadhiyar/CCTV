export const mockActiveIncident = {
  id: "INC-2026-0941",
  caseId: "CASE #GJ-2026-0941",
  title: "Multi-Vehicle Collision & Severe Bottleneck",
  type: "ROAD_COLLISION",
  urgency: "CRITICAL",
  status: "DISPATCHED", // DETECTED | DISPATCHED | EN_ROUTE | RESOLVED
  detectedAt: "2026-09-05 15:38:12 IST",
  detectedAgo: "4 mins ago",
  cameraId: "CAM-42",
  cameraName: "Pakwan Crossroad (South Flyover Base)",
  location: "SG Highway Corridor (Pakwan Junction)",
  coordinates: { lat: 23.0354, lng: 72.5105 },
  estimatedCasualties: "2 Persons (Non-fatal, Medical Evaluation Req.)",
  aiConfidence: "96.4%",
  aiClassification: "Automated Impact Audio + Optical Vector Abrupt Deceleration",
  
  // Recommended Response Plan
  recommendedUnits: [
    {
      unitId: "PCR-17",
      name: "Gujarat Police PCR Van #17 (Vastrapur Sector)",
      type: "POLICE_PATROL",
      distanceKm: 1.4,
      etaMins: 4,
      status: "DISPATCHED",
      contact: "VHF Channel 04 (Vastrapur Control)",
      officer: "ASI Bharatbhai Desai",
      isPrimary: true
    },
    {
      unitId: "EMRI-108-09",
      name: "EMRI 108 Advanced Life Support Ambulance #09",
      type: "AMBULANCE",
      distanceKm: 2.1,
      etaMins: 6,
      status: "DISPATCHED",
      contact: "EMRI Emergency Dispatch Desk",
      officer: "Paramedic S. Joshi",
      isPrimary: true
    },
    {
      unitId: "FIRE-03",
      name: "Bodakdev Fire & Rescue Emergency Tender #03",
      type: "FIRE_RESCUE",
      distanceKm: 3.2,
      etaMins: 9,
      status: "STANDBY",
      contact: "Fire Control Station 101",
      officer: "Station Officer N. Patel",
      isPrimary: false
    },
    {
      unitId: "TRAFFIC-04",
      name: "Ahmedabad Traffic Interceptor Unit #04",
      type: "TRAFFIC_POLICE",
      distanceKm: 0.8,
      etaMins: 2,
      status: "ON_SCENE",
      contact: "SG Highway Traffic Control",
      officer: "Head Constable R. Solanki",
      isPrimary: false
    }
  ],

  greenCorridor: {
    recommended: true,
    corridorName: "SG Highway North-Bound Emergency Green Wave",
    affectedSignals: ["CAM-14 Iskcon", "CAM-42 Pakwan", "CAM-08 Pakwan North"],
    etaSavedSeconds: 140
  }
};

export const mockIncidentHistory = [
  {
    id: "INC-2026-0940",
    title: "Rash Driving & Over-speeding (>105 km/h)",
    location: "Thaltej Underpass (CAM-23)",
    timestamp: "14:50 IST",
    status: "RESOLVED",
    assignedTo: "Traffic Interceptor #02",
    resolution: "E-challan issued via ANPR trigger."
  },
  {
    id: "INC-2026-0938",
    title: "Suspicious Vehicle Abandoned on Service Lane",
    location: "Sindhu Bhavan Road (CAM-41)",
    timestamp: "13:15 IST",
    status: "RESOLVED",
    assignedTo: "PCR Van #09",
    resolution: "Towed to Bodakdev impound yard."
  },
  {
    id: "INC-2026-0935",
    title: "Wrong-Side Entry on Iskcon Flyover",
    location: "Iskcon Flyover (CAM-14)",
    timestamp: "11:20 IST",
    status: "FALSE_ALARM",
    assignedTo: "Traffic Interceptor #04",
    resolution: "Authorized emergency municipal repair convoy."
  },
  {
    id: "INC-2026-0931",
    title: "Pedestrian Jaywalking Near Kalupur Rail Concourse",
    location: "Kalupur Station (CAM-31)",
    timestamp: "09:05 IST",
    status: "RESOLVED",
    assignedTo: "Railway Police Force (RPF) Unit",
    resolution: "Crowd rerouted safely to pedestrian overhead walkway."
  }
];
