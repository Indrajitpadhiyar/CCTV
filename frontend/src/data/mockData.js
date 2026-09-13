// Police Surveillance & Camera Analysis System - Mock Data (Gujarat State Network)

export const GUJARAT_CITIES_DATA = {
  Ahmedabad: {
    coordinates: { lat: 23.0225, lng: 72.5714, mapX: 48, mapY: 42 },
    areas: {
      'SG Highway': {
        stations: ['Sola Police Station', 'Sarkhej Police Station', 'Vastrapur Police Station'],
        cameras: [
          { id: 'CAM-042', name: 'SG Highway - Sola Cross Roads', station: 'Sola Police Station', status: 'match', fps: 30, resolution: '4K (3840x2160)', facesNow: 12, lastMatch: 'MATCH-1024', riskLevel: 'high', type: 'PTZ Dome 360°' },
          { id: 'CAM-038', name: 'SG Highway - Science City Junction', station: 'Sola Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 8, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet 4K' },
          { id: 'CAM-045', name: 'SG Highway - ISKCON Cross Roads', station: 'Sarkhej Police Station', status: 'online', fps: 28, resolution: '1080p FHD', facesNow: 19, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' },
          { id: 'CAM-049', name: 'SG Highway - Gota Flyover North', station: 'Sola Police Station', status: 'warning', fps: 18, resolution: '1080p FHD', facesNow: 5, lastMatch: null, riskLevel: 'warning', type: 'LPR / ANPR Fixed' }
        ]
      },
      'Navrangpura': {
        stations: ['Navrangpura Police Station', 'Gujarat University Police Station'],
        cameras: [
          { id: 'CAM-021', name: 'Commerce Six Roads Junction', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' },
          { id: 'CAM-024', name: 'CG Road - Municipal Market', station: 'Navrangpura Police Station', status: 'online', fps: 29, resolution: '1080p FHD', facesNow: 22, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet 4K' }
        ]
      },
      'Satellite': {
        stations: ['Satellite Police Station', 'Anandnagar Police Station'],
        cameras: [
          { id: 'CAM-015', name: 'Shivranjani Cross Roads', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 16, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' },
          { id: 'CAM-018', name: 'Jodhpur Cross Roads', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Vastrapur': {
        stations: ['Vastrapur Police Station'],
        cameras: [
          { id: 'CAM-029', name: 'Vastrapur Lake East Promenade', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 9, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' },
          { id: 'CAM-031', name: 'IIM Road Junction', station: 'Vastrapur Police Station', status: 'match', fps: 30, resolution: '4K (3840x2160)', facesNow: 15, lastMatch: 'MATCH-1033', riskLevel: 'medium', type: 'Fixed Bullet' }
        ]
      },
      'Maninagar': {
        stations: ['Maninagar Police Station', 'Khokhra Police Station'],
        cameras: [
          { id: 'CAM-051', name: 'Kankaria Gate No. 3', station: 'Maninagar Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 27, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' },
          { id: 'CAM-053', name: 'Maninagar Railway Cross Road', station: 'Maninagar Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 13, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Bopal': {
        stations: ['Bopal Police Station'],
        cameras: [
          { id: 'CAM-054', name: 'SP Ring Road - Bopal Cross Road', station: 'Bopal Police Station', status: 'warning', fps: 20, resolution: '1080p FHD', facesNow: 7, lastMatch: null, riskLevel: 'warning', type: 'ANPR Fixed' }
        ]
      },
      'Paldi': {
        stations: ['Ellisbridge Police Station', 'Paldi Police Station'],
        cameras: [
          { id: 'CAM-060', name: 'Paldi Cross Roads - Mahalaxmi', station: 'Paldi Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 18, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Chandkheda': {
        stations: ['Chandkheda Police Station'],
        cameras: [
          { id: 'CAM-062', name: 'Visat Petrol Pump Circle', station: 'Chandkheda Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 10, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Nikol': {
        stations: ['Nikol Police Station'],
        cameras: [
          { id: 'CAM-065', name: 'Raspan Cross Roads Nikol', station: 'Nikol Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 8, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Shahibaug': {
        stations: ['Shahibaug Police Station', 'Police Commissionerate HQ'],
        cameras: [
          { id: 'CAM-011', name: 'Duffnala Circle - Airport Rd', station: 'Shahibaug Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 24, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      }
    }
  },
  Surat: {
    coordinates: { lat: 21.1702, lng: 72.8311, mapX: 52, mapY: 74 },
    areas: {
      'Adajan': {
        stations: ['Adajan Police Station'],
        cameras: [
          { id: 'CAM-067', name: 'Gujarat Gas Circle', station: 'Adajan Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 17, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Varachha': {
        stations: ['Varachha Police Station'],
        cameras: [
          { id: 'CAM-072', name: 'Mini Bazar Diamond Flyover', station: 'Varachha Police Station', status: 'match', fps: 30, resolution: '4K (3840x2160)', facesNow: 31, lastMatch: 'MATCH-1029', riskLevel: 'high', type: 'PTZ Dome 360°' }
        ]
      },
      'Vesu': {
        stations: ['Umra Police Station'],
        cameras: [
          { id: 'CAM-075', name: 'VIP Road Commercial Belt', station: 'Umra Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Ring Road': {
        stations: ['Salabatpura Police Station'],
        cameras: [
          { id: 'CAM-078', name: 'Textile Market Flyover West', station: 'Salabatpura Police Station', status: 'online', fps: 28, resolution: '1080p FHD', facesNow: 29, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Katargam': {
        stations: ['Katargam Police Station'],
        cameras: [
          { id: 'CAM-081', name: 'Gajera Circle Katargam', station: 'Katargam Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Athwa Lines': {
        stations: ['Athwa Police Station'],
        cameras: [
          { id: 'CAM-083', name: 'Chowk Bazar Heritage Corridor', station: 'Athwa Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 12, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      }
    }
  },
  Vadodara: {
    coordinates: { lat: 22.3072, lng: 73.1812, mapX: 62, mapY: 53 },
    areas: {
      'Alkapuri': {
        stations: ['Sayajigunj Police Station'],
        cameras: [
          { id: 'CAM-088', name: 'Railway Station West Outgate', station: 'Sayajigunj Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 21, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Sayajigunj': {
        stations: ['Sayajigunj Police Station'],
        cameras: [
          { id: 'CAM-090', name: 'Kala Ghoda Circle', station: 'Sayajigunj Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 15, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Manjalpur': {
        stations: ['Manjalpur Police Station'],
        cameras: [
          { id: 'CAM-092', name: 'Darbar Chowk Manjalpur', station: 'Manjalpur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 8, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Gotri': {
        stations: ['Gotri Police Station'],
        cameras: [
          { id: 'CAM-094', name: 'Gotri Lake Circle', station: 'Gotri Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 9, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Karelibaug': {
        stations: ['Karelibaug Police Station'],
        cameras: [
          { id: 'CAM-096', name: 'Amit Nagar Circle', station: 'Karelibaug Police Station', status: 'warning', fps: 15, resolution: '1080p FHD', facesNow: 6, lastMatch: null, riskLevel: 'warning', type: 'Fixed Bullet' }
        ]
      }
    }
  },
  Rajkot: {
    coordinates: { lat: 22.3039, lng: 70.8022, mapX: 28, mapY: 51 },
    areas: {
      'Kalawad Road': {
        stations: ['Gandhigram Police Station', 'Taluka Police Station'],
        cameras: [
          { id: 'CAM-104', name: 'Kotecha Chowk Underpass', station: 'Gandhigram Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 16, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Yagnik Road': {
        stations: ['A Division Police Station'],
        cameras: [
          { id: 'CAM-107', name: 'Imperial Palace Junction', station: 'A Division Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 19, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'University Road': {
        stations: ['University Police Station'],
        cameras: [
          { id: 'CAM-110', name: 'Indira Circle Flyover', station: 'University Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Bhaktinagar': {
        stations: ['Bhaktinagar Police Station'],
        cameras: [
          { id: 'CAM-112', name: 'Bhaktinagar Circle', station: 'Bhaktinagar Police Station', status: 'match', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: 'MATCH-1041', riskLevel: 'medium', type: 'Fixed Bullet' }
        ]
      },
      'Race Course': {
        stations: ['Pradhyuman Nagar Police Station'],
        cameras: [
          { id: 'CAM-115', name: 'Ring Road Ring Circle', station: 'Pradhyuman Nagar Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 25, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      }
    }
  },
  Gandhinagar: {
    coordinates: { lat: 23.2156, lng: 72.6369, mapX: 50, mapY: 38 },
    areas: {
      'Sector 6 (Sachivalaya)': {
        stations: ['Sector 7 Police Station'],
        cameras: [
          { id: 'CAM-120', name: 'New Sachivalaya Gate 1', station: 'Sector 7 Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 22, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Sector 11 (Infocity)': {
        stations: ['Infocity Police Station'],
        cameras: [
          { id: 'CAM-095', name: 'Infocity Circle Main Gate', station: 'Infocity Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 18, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Sector 21': {
        stations: ['Sector 21 Police Station'],
        cameras: [
          { id: 'CAM-124', name: 'Sector 21 Market Circle', station: 'Sector 21 Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 12, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Kudasan': {
        stations: ['Infocity Police Station'],
        cameras: [
          { id: 'CAM-126', name: 'Kudasan Cross Roads Urjanagar', station: 'Infocity Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 9, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Sargasan': {
        stations: ['Infocity Police Station'],
        cameras: [
          { id: 'CAM-128', name: 'Sargasan Cross Roads NH48', station: 'Infocity Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      }
    }
  },
  Bhavnagar: {
    coordinates: { lat: 21.7645, lng: 72.1519, mapX: 43, mapY: 66 },
    areas: {
      'Waghawadi Road': {
        stations: ['B Division Police Station'],
        cameras: [
          { id: 'CAM-130', name: 'Jewels Circle Waghawadi', station: 'B Division Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 15, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Kaliyabid': {
        stations: ['A Division Police Station'],
        cameras: [
          { id: 'CAM-132', name: 'Kaliyabid Pani Ni Taki', station: 'A Division Police Station', status: 'online', fps: 28, resolution: '1080p FHD', facesNow: 8, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Nilambaug': {
        stations: ['Nilambaug Police Station'],
        cameras: [
          { id: 'CAM-134', name: 'Nilambaug Palace Circle', station: 'Nilambaug Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      }
    }
  },
  Jamnagar: {
    coordinates: { lat: 22.4707, lng: 70.0577, mapX: 18, mapY: 48 },
    areas: {
      'Digjam Circle': {
        stations: ['C Division Police Station'],
        cameras: [
          { id: 'CAM-140', name: 'Digjam Woollen Mills Gate', station: 'C Division Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 9, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Bedi Gate': {
        stations: ['A Division Police Station'],
        cameras: [
          { id: 'CAM-142', name: 'Bedi Gate Heritage Chowk', station: 'A Division Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 21, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Patel Colony': {
        stations: ['B Division Police Station'],
        cameras: [
          { id: 'CAM-144', name: 'Patel Colony Road No 3', station: 'B Division Police Station', status: 'online', fps: 29, resolution: '1080p FHD', facesNow: 7, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      }
    }
  },
  Junagadh: {
    coordinates: { lat: 21.5222, lng: 70.4579, mapX: 24, mapY: 68 },
    areas: {
      'Kalwa Chowk': {
        stations: ['B Division Police Station'],
        cameras: [
          { id: 'CAM-150', name: 'Kalwa Chowk Bus Depot Rd', station: 'B Division Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Zanzarda Road': {
        stations: ['C Division Police Station'],
        cameras: [
          { id: 'CAM-152', name: 'Zanzarda Overbridge Cross', station: 'C Division Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 10, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Motibaug': {
        stations: ['A Division Police Station'],
        cameras: [
          { id: 'CAM-154', name: 'Motibaug Agriculture Univ Gate', station: 'A Division Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 6, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      }
    }
  },
  Anand: {
    coordinates: { lat: 22.5645, lng: 72.9289, mapX: 58, mapY: 48 },
    areas: {
      'Vidyanagar Road': {
        stations: ['Vidyanagar Police Station'],
        cameras: [
          { id: 'CAM-160', name: 'Bhaikaka Statue Circle', station: 'Vidyanagar Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 17, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Amul Dairy Road': {
        stations: ['Anand Town Police Station'],
        cameras: [
          { id: 'CAM-162', name: 'Amul Dairy Plant Entrance', station: 'Anand Town Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 12, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Gamdi Vad': {
        stations: ['Anand Rural Police Station'],
        cameras: [
          { id: 'CAM-164', name: 'Gamdi Vad Market Junction', station: 'Anand Rural Police Station', status: 'online', fps: 28, resolution: '1080p FHD', facesNow: 8, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      }
    }
  },
  Bharuch: {
    coordinates: { lat: 21.7051, lng: 72.9959, mapX: 56, mapY: 62 },
    areas: {
      'Station Road': {
        stations: ['Bharuch Town Police Station'],
        cameras: [
          { id: 'CAM-170', name: 'Bharuch Railway Circulating Area', station: 'Bharuch Town Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 23, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Zadeshwar': {
        stations: ['Bholav Police Station'],
        cameras: [
          { id: 'CAM-172', name: 'Zadeshwar Chokdi Toll Link', station: 'Bholav Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'GNFC Township': {
        stations: ['Dahej Coastal Police Station'],
        cameras: [
          { id: 'CAM-174', name: 'GNFC Narmadanagar Gate 2', station: 'Dahej Coastal Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 5, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      }
    }
  },
  Vapi: {
    coordinates: { lat: 20.3893, lng: 72.9106, mapX: 54, mapY: 88 },
    areas: {
      'GIDC Char Rasta': {
        stations: ['GIDC Vapi Police Station'],
        cameras: [
          { id: 'CAM-180', name: 'GIDC First Phase Flyover', station: 'GIDC Vapi Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 16, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Gunjan': {
        stations: ['Town Police Station Vapi'],
        cameras: [
          { id: 'CAM-182', name: 'Gunjan Cinema Underpass', station: 'Town Police Station Vapi', status: 'online', fps: 29, resolution: '1080p FHD', facesNow: 12, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Chala': {
        stations: ['Daman Link Police Station'],
        cameras: [
          { id: 'CAM-184', name: 'Chala Daman Checkpost', station: 'Daman Link Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: 'ANPR Fixed' }
        ]
      }
    }
  },
  Mehsana: {
    coordinates: { lat: 23.588, lng: 72.3693, mapX: 45, mapY: 28 },
    areas: {
      'Radhanpur Road': {
        stations: ['B Division Police Station Mehsana'],
        cameras: [
          { id: 'CAM-190', name: 'Radhanpur Chokdi Mehsana', station: 'B Division Police Station Mehsana', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
        ]
      },
      'Modhera Road': {
        stations: ['A Division Police Station Mehsana'],
        cameras: [
          { id: 'CAM-192', name: 'Modhera Cross Road Circle', station: 'A Division Police Station Mehsana', status: 'online', fps: 28, resolution: '1080p FHD', facesNow: 7, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
        ]
      },
      'Highway Circle': {
        stations: ['Mehsana Taluka Police Station'],
        cameras: [
          { id: 'CAM-194', name: 'Ahmedabad-Mehsana Toll Plaza', station: 'Mehsana Taluka Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 15, lastMatch: null, riskLevel: 'normal', type: 'ANPR Fixed' }
        ]
      }
    }
  }
};

// Flatten all cameras for easy querying
export const getAllCameras = () => {
  const list = [];
  Object.entries(GUJARAT_CITIES_DATA).forEach(([city, cityObj]) => {
    Object.entries(cityObj.areas).forEach(([area, areaObj]) => {
      areaObj.cameras.forEach(cam => {
        list.push({
          ...cam,
          city,
          area
        });
      });
    });
  });
  return list;
};

// Recent Criminal Matches
export const RECENT_MATCHES = [
  {
    matchId: 'MATCH-1024',
    detectionId: 'DET-1024',
    criminalId: 'CR-20841',
    criminalName: 'Subject #20841 (Alias: "R. K. Solanki")',
    caseId: 'FIR-2026/084-CYB',
    chargeCategory: 'Organized Vehicle Theft & Grand Larceny',
    confidence: 94.8,
    camera: 'CAM-042',
    cameraName: 'SG Highway - Sola Cross Roads',
    city: 'Ahmedabad',
    area: 'SG Highway',
    policeStation: 'Sola Police Station',
    detectedAt: '13 Sep 2026, 10:42 PM',
    detectedAgo: '4 mins ago',
    riskLevel: 'High Risk',
    status: 'Requires Verification',
    facialFeatures: {
      structureMatch: 96.2,
      eyeDistance: 93.8,
      jawlineCorrelation: 94.5,
      noseBridgeProfile: 95.1
    },
    cameraTrail: [
      {
        time: '10:42 PM',
        camera: 'CAM-042',
        name: 'SG Highway - Sola Cross Roads',
        location: 'SG Highway, Ahmedabad',
        policeStation: 'Sola Police Station',
        confidence: 94.8,
        status: 'Active Sight',
        speedEstimate: '42 km/h (Northbound in silver sedan)',
        isCurrent: true
      },
      {
        time: '10:31 PM',
        camera: 'CAM-038',
        name: 'SG Highway - Science City Junction',
        location: 'SG Highway, Ahmedabad',
        policeStation: 'Sola Police Station',
        confidence: 91.2,
        status: 'Confirmed Sight',
        speedEstimate: '45 km/h',
        isCurrent: false
      },
      {
        time: '10:18 PM',
        camera: 'CAM-021',
        name: 'Commerce Six Roads Junction',
        location: 'Navrangpura, Ahmedabad',
        policeStation: 'Navrangpura Police Station',
        confidence: 87.6,
        status: 'Matched',
        speedEstimate: '30 km/h',
        isCurrent: false
      },
      {
        time: '09:55 PM',
        camera: 'CAM-015',
        name: 'Shivranjani Cross Roads',
        location: 'Satellite, Ahmedabad',
        policeStation: 'Satellite Police Station',
        confidence: 78.4,
        status: 'Partial Angle',
        speedEstimate: 'Pedestrian Crossing',
        isCurrent: false
      }
    ]
  },
  {
    matchId: 'MATCH-1029',
    detectionId: 'DET-1029',
    criminalId: 'CR-19402',
    criminalName: 'Subject #19402 (Alias: "M. Patel")',
    caseId: 'FIR-2025/119-ECO',
    chargeCategory: 'High Value Financial Fraud & Absconding',
    confidence: 92.4,
    camera: 'CAM-072',
    cameraName: 'Mini Bazar Diamond Flyover',
    city: 'Surat',
    area: 'Varachha',
    policeStation: 'Varachha Police Station',
    detectedAt: '13 Sep 2026, 10:15 PM',
    detectedAgo: '31 mins ago',
    riskLevel: 'High Risk',
    status: 'Requires Verification',
    facialFeatures: {
      structureMatch: 93.0,
      eyeDistance: 91.5,
      jawlineCorrelation: 92.8,
      noseBridgeProfile: 92.3
    },
    cameraTrail: [
      {
        time: '10:15 PM',
        camera: 'CAM-072',
        name: 'Mini Bazar Diamond Flyover',
        location: 'Varachha, Surat',
        policeStation: 'Varachha Police Station',
        confidence: 92.4,
        status: 'Active Sight',
        speedEstimate: 'Motorcycle Transit',
        isCurrent: true
      },
      {
        time: '09:40 PM',
        camera: 'CAM-078',
        name: 'Textile Market Flyover West',
        location: 'Ring Road, Surat',
        policeStation: 'Salabatpura Police Station',
        confidence: 86.2,
        status: 'Matched',
        speedEstimate: '25 km/h',
        isCurrent: false
      }
    ]
  },
  {
    matchId: 'MATCH-1033',
    detectionId: 'DET-1033',
    criminalId: 'CR-18230',
    criminalName: 'Subject #18230 (Alias: "D. Varma")',
    caseId: 'FIR-2026/012-IPC',
    chargeCategory: 'Illegal Weapon Possession & Extortion',
    confidence: 89.6,
    camera: 'CAM-031',
    cameraName: 'IIM Road Junction',
    city: 'Ahmedabad',
    area: 'Vastrapur',
    policeStation: 'Vastrapur Police Station',
    detectedAt: '13 Sep 2026, 09:50 PM',
    detectedAgo: '56 mins ago',
    riskLevel: 'Medium Risk',
    status: 'Under Review',
    facialFeatures: {
      structureMatch: 89.2,
      eyeDistance: 90.1,
      jawlineCorrelation: 88.7,
      noseBridgeProfile: 90.4
    },
    cameraTrail: [
      {
        time: '09:50 PM',
        camera: 'CAM-031',
        name: 'IIM Road Junction',
        location: 'Vastrapur, Ahmedabad',
        policeStation: 'Vastrapur Police Station',
        confidence: 89.6,
        status: 'Active Sight',
        speedEstimate: 'Pedestrian',
        isCurrent: true
      },
      {
        time: '09:12 PM',
        camera: 'CAM-029',
        name: 'Vastrapur Lake East Promenade',
        location: 'Vastrapur, Ahmedabad',
        policeStation: 'Vastrapur Police Station',
        confidence: 85.0,
        status: 'Matched',
        speedEstimate: 'Walkway',
        isCurrent: false
      }
    ]
  },
  {
    matchId: 'MATCH-1041',
    detectionId: 'DET-1041',
    criminalId: 'CR-17655',
    criminalName: 'Subject #17655 (Alias: "V. Jadeja")',
    caseId: 'FIR-2024/902-NDP',
    chargeCategory: 'Narcotics Trafficking & Bailable Warrant',
    confidence: 88.1,
    camera: 'CAM-112',
    cameraName: 'Bhaktinagar Circle',
    city: 'Rajkot',
    area: 'Bhaktinagar',
    policeStation: 'Bhaktinagar Police Station',
    detectedAt: '13 Sep 2026, 09:22 PM',
    detectedAgo: '1h 24m ago',
    riskLevel: 'Medium Risk',
    status: 'Flagged for Intercept',
    facialFeatures: {
      structureMatch: 88.4,
      eyeDistance: 87.9,
      jawlineCorrelation: 89.0,
      noseBridgeProfile: 87.2
    },
    cameraTrail: [
      {
        time: '09:22 PM',
        camera: 'CAM-112',
        name: 'Bhaktinagar Circle',
        location: 'Bhaktinagar, Rajkot',
        policeStation: 'Bhaktinagar Police Station',
        confidence: 88.1,
        status: 'Active Sight',
        speedEstimate: 'Public Bus Terminal',
        isCurrent: true
      }
    ]
  },
  {
    matchId: 'MATCH-1048',
    detectionId: 'DET-1048',
    criminalId: 'CR-21019',
    criminalName: 'Subject #21019 (Alias: "S. Mansuri")',
    caseId: 'FIR-2026/304-EXP',
    chargeCategory: 'Inter-district Commercial Burglary',
    confidence: 95.3,
    camera: 'CAM-088',
    cameraName: 'Railway Station West Outgate',
    city: 'Vadodara',
    area: 'Alkapuri',
    policeStation: 'Sayajigunj Police Station',
    detectedAt: '13 Sep 2026, 08:44 PM',
    detectedAgo: '2h 02m ago',
    riskLevel: 'High Risk',
    status: 'Requires Verification',
    facialFeatures: {
      structureMatch: 95.8,
      eyeDistance: 94.6,
      jawlineCorrelation: 96.0,
      noseBridgeProfile: 95.0
    },
    cameraTrail: [
      {
        time: '08:44 PM',
        camera: 'CAM-088',
        name: 'Railway Station West Outgate',
        location: 'Alkapuri, Vadodara',
        policeStation: 'Sayajigunj Police Station',
        confidence: 95.3,
        status: 'Active Sight',
        speedEstimate: 'Platform concourse exit',
        isCurrent: true
      },
      {
        time: '08:20 PM',
        camera: 'CAM-090',
        name: 'Kala Ghoda Circle',
        location: 'Sayajigunj, Vadodara',
        policeStation: 'Sayajigunj Police Station',
        confidence: 88.9,
        status: 'Matched',
        speedEstimate: 'Auto-rickshaw',
        isCurrent: false
      }
    ]
  },
  {
    matchId: 'MATCH-1052',
    detectionId: 'DET-1052',
    criminalId: 'CR-16320',
    criminalName: 'Subject #16320 (Alias: "N. Gohil")',
    caseId: 'FIR-2025/441-TER',
    chargeCategory: 'Cyber Harassment & Digital Ransom',
    confidence: 84.7,
    camera: 'CAM-120',
    cameraName: 'New Sachivalaya Gate 1',
    city: 'Gandhinagar',
    area: 'Sector 6 (Sachivalaya)',
    policeStation: 'Sector 7 Police Station',
    detectedAt: '13 Sep 2026, 07:15 PM',
    detectedAgo: '3h 31m ago',
    riskLevel: 'Low Risk',
    status: 'Verified False Alarm',
    facialFeatures: {
      structureMatch: 84.0,
      eyeDistance: 85.2,
      jawlineCorrelation: 83.9,
      noseBridgeProfile: 85.8
    },
    cameraTrail: [
      {
        time: '07:15 PM',
        camera: 'CAM-120',
        name: 'New Sachivalaya Gate 1',
        location: 'Sector 6, Gandhinagar',
        policeStation: 'Sector 7 Police Station',
        confidence: 84.7,
        status: 'Cleared by Officer',
        speedEstimate: 'Visitor entrance',
        isCurrent: true
      }
    ]
  }
];

// Criminal Database Records
export const CRIMINAL_DATABASE = [
  {
    criminalId: 'CR-20841',
    name: 'Subject #20841',
    alias: 'R. K. Solanki',
    caseId: 'FIR-2026/084-CYB',
    category: 'Organized Vehicle Theft',
    riskLevel: 'High Risk',
    warrantStatus: 'Active Non-Bailable Warrant',
    lastKnownLocation: 'Ahmedabad - SG Highway Belt',
    lastDetection: '13 Sep 2026, 10:42 PM (CAM-042)',
    policeStation: 'Sola Police Station',
    city: 'Ahmedabad',
    ageRange: '32-36 yrs',
    gender: 'Male',
    height: "5' 9\"",
    biometricRecordId: 'BIO-GJ-884920',
    status: 'Active Pursuit'
  },
  {
    criminalId: 'CR-19402',
    name: 'Subject #19402',
    alias: 'M. Patel',
    caseId: 'FIR-2025/119-ECO',
    category: 'Financial Fraud & Absconding',
    riskLevel: 'High Risk',
    warrantStatus: 'Lookout Circular Issued',
    lastKnownLocation: 'Surat - Varachha Textile Zone',
    lastDetection: '13 Sep 2026, 10:15 PM (CAM-072)',
    policeStation: 'Varachha Police Station',
    city: 'Surat',
    ageRange: '44-48 yrs',
    gender: 'Male',
    height: "5' 7\"",
    biometricRecordId: 'BIO-GJ-710492',
    status: 'Requires Verification'
  },
  {
    criminalId: 'CR-18230',
    name: 'Subject #18230',
    alias: 'D. Varma',
    caseId: 'FIR-2026/012-IPC',
    category: 'Arms Act Violation & Extortion',
    riskLevel: 'Medium Risk',
    warrantStatus: 'Bailable Warrant (Summoned)',
    lastKnownLocation: 'Ahmedabad - Vastrapur',
    lastDetection: '13 Sep 2026, 09:50 PM (CAM-031)',
    policeStation: 'Vastrapur Police Station',
    city: 'Ahmedabad',
    ageRange: '28-32 yrs',
    gender: 'Male',
    height: "5' 11\"",
    biometricRecordId: 'BIO-GJ-629401',
    status: 'Under Review'
  },
  {
    criminalId: 'CR-21019',
    name: 'Subject #21019',
    alias: 'S. Mansuri',
    caseId: 'FIR-2026/304-EXP',
    category: 'Inter-district Burglary',
    riskLevel: 'High Risk',
    warrantStatus: 'Arrest Warrant Pending',
    lastKnownLocation: 'Vadodara - Alkapuri Concourse',
    lastDetection: '13 Sep 2026, 08:44 PM (CAM-088)',
    policeStation: 'Sayajigunj Police Station',
    city: 'Vadodara',
    ageRange: '38-42 yrs',
    gender: 'Male',
    height: "5' 8\"",
    biometricRecordId: 'BIO-GJ-902319',
    status: 'Active Pursuit'
  },
  {
    criminalId: 'CR-17655',
    name: 'Subject #17655',
    alias: 'V. Jadeja',
    caseId: 'FIR-2024/902-NDP',
    category: 'Narcotics Distribution',
    riskLevel: 'Medium Risk',
    warrantStatus: 'Court Appearance Pending',
    lastKnownLocation: 'Rajkot - Bhaktinagar',
    lastDetection: '13 Sep 2026, 09:22 PM (CAM-112)',
    policeStation: 'Bhaktinagar Police Station',
    city: 'Rajkot',
    ageRange: '30-34 yrs',
    gender: 'Male',
    height: "6' 0\"",
    biometricRecordId: 'BIO-GJ-540918',
    status: 'Flagged for Intercept'
  },
  {
    criminalId: 'CR-15201',
    name: 'Subject #15201',
    alias: 'P. Chudasama',
    caseId: 'FIR-2025/089-IPC',
    category: 'Smuggling & Contraband',
    riskLevel: 'High Risk',
    warrantStatus: 'Interstate Alert',
    lastKnownLocation: 'Jamnagar - Bedi Gate Corridor',
    lastDetection: '12 Sep 2026, 04:10 PM (CAM-142)',
    policeStation: 'A Division Police Station',
    city: 'Jamnagar',
    ageRange: '40-45 yrs',
    gender: 'Male',
    height: "5' 10\"",
    biometricRecordId: 'BIO-GJ-409128',
    status: 'Under Surveillance'
  },
  {
    criminalId: 'CR-16320',
    name: 'Subject #16320',
    alias: 'N. Gohil',
    caseId: 'FIR-2025/441-TER',
    category: 'Cyber Fraud Syndicate',
    riskLevel: 'Low Risk',
    warrantStatus: 'Interrogated / On Bail',
    lastKnownLocation: 'Gandhinagar - Sector 6',
    lastDetection: '13 Sep 2026, 07:15 PM (CAM-120)',
    policeStation: 'Sector 7 Police Station',
    city: 'Gandhinagar',
    ageRange: '26-29 yrs',
    gender: 'Male',
    height: "5' 6\"",
    biometricRecordId: 'BIO-GJ-381029',
    status: 'Verified False Alarm'
  },
  {
    criminalId: 'CR-22108',
    name: 'Subject #22108',
    alias: 'K. Mewada',
    caseId: 'FIR-2026/512-ROB',
    category: 'Highway Armed Robbery',
    riskLevel: 'High Risk',
    warrantStatus: 'Non-Bailable Warrant',
    lastKnownLocation: 'Mehsana - Radhanpur Circle',
    lastDetection: '11 Sep 2026, 11:20 PM (CAM-190)',
    policeStation: 'B Division Police Station Mehsana',
    city: 'Mehsana',
    ageRange: '35-39 yrs',
    gender: 'Male',
    height: "5' 8\"",
    biometricRecordId: 'BIO-GJ-991823',
    status: 'Wanted'
  }
];

// Security Alerts
export const SECURITY_ALERTS = [
  {
    alertId: 'ALT-8092',
    type: 'Criminal Match',
    priority: 'High Priority',
    priorityLevel: 'high',
    camera: 'CAM-042',
    location: 'SG Highway, Ahmedabad',
    policeStation: 'Sola Police Station',
    city: 'Ahmedabad',
    time: '10:42 PM (4m ago)',
    confidence: '94.8%',
    description: 'Potential Criminal Match detected: Subject #20841 against active vehicle grand larceny warrant FIR-2026/084-CYB.',
    status: 'Unacknowledged',
    targetMatchId: 'MATCH-1024',
    recommendedAction: 'Dispatch Sector Patrol Unit 14 for visual confirmation.'
  },
  {
    alertId: 'ALT-8089',
    type: 'Criminal Match',
    priority: 'High Priority',
    priorityLevel: 'high',
    camera: 'CAM-072',
    location: 'Mini Bazar Diamond Flyover, Surat',
    policeStation: 'Varachha Police Station',
    city: 'Surat',
    time: '10:15 PM (31m ago)',
    confidence: '92.4%',
    description: 'Potential Criminal Match detected: Subject #19402 against Lookout Circular FIR-2025/119-ECO.',
    status: 'Investigating',
    targetMatchId: 'MATCH-1029',
    recommendedAction: 'Notify Varachha PS duty officer and monitor adjoining CAM-078.'
  },
  {
    alertId: 'ALT-8084',
    type: 'Multiple Face Match',
    priority: 'Medium Priority',
    priorityLevel: 'medium',
    camera: 'CAM-038 & CAM-042',
    location: 'SG Highway Corridor, Ahmedabad',
    policeStation: 'Sola Police Station',
    city: 'Ahmedabad',
    time: '10:35 PM (11m ago)',
    confidence: '91.2%',
    description: 'Correlated multi-camera trail sequence detected within 11 minutes across northern expressway corridor.',
    status: 'Tracking',
    targetMatchId: 'MATCH-1024',
    recommendedAction: 'Keep traffic signal intersection checkpoints on alert.'
  },
  {
    alertId: 'ALT-8077',
    type: 'Camera Warning',
    priority: 'Medium Priority',
    priorityLevel: 'medium',
    camera: 'CAM-054',
    location: 'SP Ring Road - Bopal Cross Road',
    policeStation: 'Bopal Police Station',
    city: 'Ahmedabad',
    time: '10:02 PM (44m ago)',
    confidence: 'N/A',
    description: 'Stream frame drop detected. Feed operating at reduced frame rate (18 fps). Optical lens dust warning.',
    status: 'Maintenance Notified',
    targetMatchId: null,
    recommendedAction: 'Auto-switched to secondary ANPR backup stream.'
  },
  {
    alertId: 'ALT-8068',
    type: 'Suspicious Detection',
    priority: 'Low Priority',
    priorityLevel: 'low',
    camera: 'CAM-011',
    location: 'Duffnala Circle - Airport Rd, Ahmedabad',
    policeStation: 'Shahibaug Police Station',
    city: 'Ahmedabad',
    time: '09:30 PM (1h 16m ago)',
    confidence: '79.1%',
    description: 'Mask / Facial Occlusion detected during high-density pedestrian interval near VIP transit gate.',
    status: 'Reviewed',
    targetMatchId: null,
    recommendedAction: 'Logged for record. No criminal biometric pattern found.'
  },
  {
    alertId: 'ALT-8060',
    type: 'System Warning',
    priority: 'Low Priority',
    priorityLevel: 'low',
    camera: 'Gujarat Police Data Center',
    location: 'Gandhinagar Command Core',
    policeStation: 'CID Crime Branch',
    city: 'Gandhinagar',
    time: '08:00 PM (2h 46m ago)',
    confidence: '100%',
    description: 'Scheduled biometric signature index sync completed. 1,248 new state surveillance records merged.',
    status: 'Resolved',
    targetMatchId: null,
    recommendedAction: 'Automated verification check passed.'
  }
];

// Live Face Detections Stream (Realtime Feed)
export const REALTIME_DETECTIONS = [
  {
    detectionId: 'DET-1024',
    timestamp: '10:42:18 PM',
    camera: 'CAM-042',
    location: 'SG Highway - Sola Cross Roads',
    city: 'Ahmedabad',
    area: 'SG Highway',
    policeStation: 'Sola Police Station',
    faceDetected: true,
    dbMatch: 'Potential Match',
    matchedCriminalId: 'CR-20841',
    confidence: 94.8,
    estimatedAge: '34 ± 3',
    gender: 'Male',
    glasses: 'No',
    mask: 'No',
    headPose: 'Yaw: +6°, Pitch: -2°',
    status: 'Criminal Match',
    riskLevel: 'high'
  },
  {
    detectionId: 'DET-1025',
    timestamp: '10:41:55 PM',
    camera: 'CAM-042',
    location: 'SG Highway - Sola Cross Roads',
    city: 'Ahmedabad',
    area: 'SG Highway',
    policeStation: 'Sola Police Station',
    faceDetected: true,
    dbMatch: 'No Match',
    matchedCriminalId: null,
    confidence: 12.1,
    estimatedAge: '28 ± 4',
    gender: 'Female',
    glasses: 'Yes',
    mask: 'No',
    headPose: 'Yaw: -12°, Pitch: +4°',
    status: 'No Match',
    riskLevel: 'normal'
  },
  {
    detectionId: 'DET-1026',
    timestamp: '10:41:12 PM',
    camera: 'CAM-021',
    location: 'Commerce Six Roads Junction',
    city: 'Ahmedabad',
    area: 'Navrangpura',
    policeStation: 'Navrangpura Police Station',
    faceDetected: true,
    dbMatch: 'No Match',
    matchedCriminalId: null,
    confidence: 18.4,
    estimatedAge: '45 ± 5',
    gender: 'Male',
    glasses: 'No',
    mask: 'No',
    headPose: 'Yaw: +2°, Pitch: +1°',
    status: 'No Match',
    riskLevel: 'normal'
  },
  {
    detectionId: 'DET-1027',
    timestamp: '10:39:48 PM',
    camera: 'CAM-015',
    location: 'Shivranjani Cross Roads',
    city: 'Ahmedabad',
    area: 'Satellite',
    policeStation: 'Satellite Police Station',
    faceDetected: true,
    dbMatch: 'No Match',
    matchedCriminalId: null,
    confidence: 22.0,
    estimatedAge: '22 ± 2',
    gender: 'Female',
    glasses: 'No',
    mask: 'No',
    headPose: 'Yaw: +18°, Pitch: -4°',
    status: 'No Match',
    riskLevel: 'normal'
  },
  {
    detectionId: 'DET-1028',
    timestamp: '10:38:02 PM',
    camera: 'CAM-051',
    location: 'Kankaria Gate No. 3',
    city: 'Ahmedabad',
    area: 'Maninagar',
    policeStation: 'Maninagar Police Station',
    faceDetected: true,
    dbMatch: 'No Match',
    matchedCriminalId: null,
    confidence: 15.3,
    estimatedAge: '51 ± 4',
    gender: 'Male',
    glasses: 'Yes',
    mask: 'No',
    headPose: 'Yaw: -4°, Pitch: +8°',
    status: 'No Match',
    riskLevel: 'normal'
  },
  {
    detectionId: 'DET-1029',
    timestamp: '10:15:30 PM',
    camera: 'CAM-072',
    location: 'Mini Bazar Diamond Flyover',
    city: 'Surat',
    area: 'Varachha',
    policeStation: 'Varachha Police Station',
    faceDetected: true,
    dbMatch: 'Potential Match',
    matchedCriminalId: 'CR-19402',
    confidence: 92.4,
    estimatedAge: '46 ± 3',
    gender: 'Male',
    glasses: 'No',
    mask: 'No',
    headPose: 'Yaw: +9°, Pitch: +3°',
    status: 'Criminal Match',
    riskLevel: 'high'
  },
  {
    detectionId: 'DET-1030',
    timestamp: '10:10:04 PM',
    camera: 'CAM-067',
    location: 'Gujarat Gas Circle',
    city: 'Surat',
    area: 'Adajan',
    policeStation: 'Adajan Police Station',
    faceDetected: true,
    dbMatch: 'No Match',
    matchedCriminalId: null,
    confidence: 14.8,
    estimatedAge: '37 ± 3',
    gender: 'Male',
    glasses: 'No',
    mask: 'No',
    headPose: 'Yaw: -8°, Pitch: -2°',
    status: 'No Match',
    riskLevel: 'normal'
  },
  {
    detectionId: 'DET-1031',
    timestamp: '09:50:19 PM',
    camera: 'CAM-031',
    location: 'IIM Road Junction',
    city: 'Ahmedabad',
    area: 'Vastrapur',
    policeStation: 'Vastrapur Police Station',
    faceDetected: true,
    dbMatch: 'Potential Match',
    matchedCriminalId: 'CR-18230',
    confidence: 89.6,
    estimatedAge: '30 ± 3',
    gender: 'Male',
    glasses: 'No',
    mask: 'No',
    headPose: 'Yaw: +5°, Pitch: +6°',
    status: 'Criminal Match',
    riskLevel: 'medium'
  }
];

// Reports & Analytics Charts Data
export const ANALYTICS_DATA = {
  hourlyDetections: [
    { time: '00:00', detections: 64, matches: 0 },
    { time: '02:00', detections: 42, matches: 0 },
    { time: '04:00', detections: 38, matches: 1 },
    { time: '06:00', detections: 112, matches: 0 },
    { time: '08:00', detections: 290, matches: 2 },
    { time: '10:00', detections: 410, matches: 3 },
    { time: '12:00', detections: 380, matches: 1 },
    { time: '14:00', detections: 340, matches: 2 },
    { time: '16:00', detections: 430, matches: 2 },
    { time: '18:00', detections: 495, matches: 3 },
    { time: '20:00', detections: 535, matches: 2 },
    { time: '22:00', detections: 310, matches: 1 }
  ],
  cityMatches: [
    { city: 'Ahmedabad', count: 8, totalCameras: 16, activeFeeds: 15, highRisk: 4 },
    { city: 'Surat', count: 4, totalCameras: 6, activeFeeds: 6, highRisk: 2 },
    { city: 'Vadodara', count: 3, totalCameras: 5, activeFeeds: 4, highRisk: 1 },
    { city: 'Rajkot', count: 1, totalCameras: 5, activeFeeds: 5, highRisk: 0 },
    { city: 'Gandhinagar', count: 1, totalCameras: 5, activeFeeds: 5, highRisk: 0 }
  ],
  confidenceDistribution: [
    { range: '90% - 100%', count: 5, label: 'High Confidence Match', color: '#dc2626' },
    { range: '80% - 89%', count: 9, label: 'Probable Match (Verify)', color: '#ea580c' },
    { range: '70% - 79%', count: 14, label: 'Moderate Similarity', color: '#ca8a04' },
    { range: '< 70%', count: 2818, label: 'Standard Filter Clear', color: '#2563eb' }
  ],
  alertsByCategory: [
    { category: 'Criminal Match', count: 17, share: '38%' },
    { category: 'Multiple Face Match', count: 9, share: '20%' },
    { category: 'Camera Signal / Hardware', count: 6, share: '13%' },
    { category: 'Suspicious Occlusion', count: 8, share: '18%' },
    { category: 'System Maintenance', count: 5, share: '11%' }
  ],
  kpis: {
    activeCameras: 128,
    activeCamerasTrend: '+4.2%',
    activeCamerasSubtitle: 'Currently Online',
    facesDetected: '2,846',
    facesDetectedSubtitle: 'Today',
    criminalMatches: 17,
    criminalMatchesSubtitle: 'Requires Attention',
    activeAlerts: 6,
    activeAlertsSubtitle: 'High Priority'
  }
};

// Generates 10 sequential structured cameras for any selected area
export const getTenCamerasForArea = (city = 'Ahmedabad', area = 'SG Highway') => {
  const spotPrefixes = [
    'North Intersection Overpass Pillar 4',
    'Main Approaching Flyover Ramp',
    'BRTS Pedestrian Cross Walkway',
    'Underpass Concourse Platform East',
    'Commercial High Street Service Road',
    'Signal Traffic Post 2',
    'Expressway Exit Ramp Link',
    'Transit Hub Metro Gate A',
    'Pedestrian Island Central Post',
    'Toll Junction Approach Gate 3'
  ];

  const station = `${area} Police Station`;
  const list = [];

  for (let i = 1; i <= 10; i++) {
    const idNum = i < 10 ? `0${i}` : `${i}`;
    list.push({
      id: `CAM-${idNum}`,
      code: `cam${idNum}`,
      name: `${area} - Checkpoint ${idNum}`,
      spot: spotPrefixes[i - 1],
      city: city,
      area: area,
      station: station,
      status: 'online',
      fps: 30,
      resolution: '4K (3840x2160)',
      type: i % 2 === 0 ? '4K Bullet' : '4K PTZ Dome'
    });
  }

  return list;
};

