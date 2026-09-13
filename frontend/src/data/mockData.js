// Police Surveillance & Camera Analysis System - Mock Data (Gujarat State Network)

export const GUJARAT_CITIES_DATA = {
  Ahmedabad: {
    coordinates: { lat: 23.0225, lng: 72.5714, mapX: 48, mapY: 42 },
    areas: {
      'SG Highway': {
        stations: ['Sola Police Station', 'Sarkhej Police Station', 'Vastrapur Police Station'],
        cameras: [
          { id: 'CAM-01', code: 'cam01', name: 'SG Highway - Sola Cross Road (North)', station: 'Sola Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 12, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam01/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam01/stream' },
          { id: 'CAM-02', code: 'cam02', name: 'SG Highway - Science City Flyover', station: 'Sola Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 8, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam02/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam02/stream' },
          { id: 'CAM-03', code: 'cam03', name: 'SG Highway - ISKCON Junction Cross', station: 'Sarkhej Police Station', status: 'online', fps: 28, resolution: '1080p FHD', facesNow: 19, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam03/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam03/stream' },
          { id: 'CAM-04', code: 'cam04', name: 'SG Highway - Gota Flyover Junction', station: 'Sola Police Station', status: 'warning', fps: 30, resolution: '1080p FHD', facesNow: 5, lastMatch: null, riskLevel: 'warning', type: 'ANPR Highway', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam04/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam04/stream' },
          { id: 'CAM-05', code: 'cam05', name: 'SG Highway - YMCA Club Cross Road', station: 'Sarkhej Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 7, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam05/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam05/stream' },
          { id: 'CAM-06', code: 'cam06', name: 'SG Highway - Pakwan Cross Road', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam06/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam06/stream' },
          { id: 'CAM-07', code: 'cam07', name: 'SG Highway - Thaltej Underpass', station: 'Sola Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 9, lastMatch: null, riskLevel: 'normal', type: 'ANPR Highway', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam07/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam07/stream' },
          { id: 'CAM-08', code: 'cam08', name: 'SG Highway - Vaishnodevi Circle', station: 'Sola Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam08/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam08/stream' },
          { id: 'CAM-09', code: 'cam09', name: 'SG Highway - Prahladnagar Entry', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 16, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam09/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam09/stream' },
          { id: 'CAM-10', code: 'cam10', name: 'SG Highway - Sarkhej Toll Plaza', station: 'Sarkhej Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 10, lastMatch: null, riskLevel: 'normal', type: 'ANPR Highway', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam10/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam10/stream' }
        ]
      },
      'Navrangpura': {
        stations: ['Navrangpura Police Station', 'Gujarat University Police Station'],
        cameras: [
          { id: 'CAM-11', code: 'cam11', name: 'Commerce Six Roads', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam11/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam11/stream' },
          { id: 'CAM-12', code: 'cam12', name: 'CG Road - Municipal Market', station: 'Navrangpura Police Station', status: 'online', fps: 29, resolution: '1080p FHD', facesNow: 22, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam12/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam12/stream' },
          { id: 'CAM-13', code: 'cam13', name: 'Swastik Cross Road', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 9, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam13/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam13/stream' },
          { id: 'CAM-14', code: 'cam14', name: 'Mithakhali Six Roads', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 18, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam14/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam14/stream' },
          { id: 'CAM-15', code: 'cam15', name: 'Stadium Cross Road', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 15, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam15/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam15/stream' },
          { id: 'CAM-16', code: 'cam16', name: 'Law Garden Entry Road', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 12, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam16/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam16/stream' },
          { id: 'CAM-17', code: 'cam17', name: 'Gujarat University Circle', station: 'Gujarat University Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 21, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam17/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam17/stream' },
          { id: 'CAM-18', code: 'cam18', name: 'Panchvati Circle', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 8, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam18/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam18/stream' },
          { id: 'CAM-19', code: 'cam19', name: 'Chimanlal Girdharlal Road', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 13, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam19/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam19/stream' },
          { id: 'CAM-20', code: 'cam20', name: 'Navrangpura Bus Terminus', station: 'Navrangpura Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 25, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam20/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam20/stream' }
        ]
      },
      'Satellite': {
        stations: ['Satellite Police Station', 'Anandnagar Police Station'],
        cameras: [
          { id: 'CAM-21', code: 'cam21', name: 'Shivranjani Cross Roads', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 16, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam21/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam21/stream' },
          { id: 'CAM-22', code: 'cam22', name: 'Jodhpur Cross Roads', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam22/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam22/stream' },
          { id: 'CAM-23', code: 'cam23', name: 'Shyamal Cross Roads', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam23/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam23/stream' },
          { id: 'CAM-24', code: 'cam24', name: 'Ramdevnagar Circle', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 10, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam24/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam24/stream' },
          { id: 'CAM-25', code: 'cam25', name: 'Mansi Circle Satellite', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 13, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam25/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam25/stream' },
          { id: 'CAM-26', code: 'cam26', name: 'Star Bazaar Junction', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 17, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam26/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam26/stream' },
          { id: 'CAM-27', code: 'cam27', name: 'Prernatirth Derasar Road', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 7, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam27/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam27/stream' },
          { id: 'CAM-28', code: 'cam28', name: 'Keshavbaug Party Plot Cross', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 19, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam28/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam28/stream' },
          { id: 'CAM-29', code: 'cam29', name: 'Satellite Police Station Gate', station: 'Satellite Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 6, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam29/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam29/stream' },
          { id: 'CAM-30', code: 'cam30', name: 'Seema Hall Cross Road', station: 'Anandnagar Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 15, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam30/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam30/stream' }
        ]
      },
      'Vastrapur': {
        stations: ['Vastrapur Police Station'],
        cameras: [
          { id: 'CAM-31', code: 'cam01', name: 'Vastrapur Lake East Promenade', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 9, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam01/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam01/stream' },
          { id: 'CAM-32', code: 'cam02', name: 'IIM Ahmedabad New Campus Gate', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 15, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam02/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam02/stream' },
          { id: 'CAM-33', code: 'cam03', name: 'Alpha One Mall Concourse', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 18, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam03/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam03/stream' },
          { id: 'CAM-34', code: 'cam04', name: 'Sanjivani Hospital Cross Road', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 8, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam04/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam04/stream' },
          { id: 'CAM-35', code: 'cam05', name: 'Gurukul Road Junction', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam05/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam05/stream' },
          { id: 'CAM-36', code: 'cam06', name: 'Lad Society Road', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 6, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam06/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam06/stream' },
          { id: 'CAM-37', code: 'cam07', name: 'Himmatlal Park Cross Road', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 11, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam07/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam07/stream' },
          { id: 'CAM-38', code: 'cam08', name: 'Vastrapur Gam Gate', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 9, lastMatch: null, riskLevel: 'normal', type: '4K Bullet', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam08/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam08/stream' },
          { id: 'CAM-39', code: 'cam09', name: 'Bodakdev Circle Link', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 13, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam09/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam09/stream' },
          { id: 'CAM-40', code: 'cam10', name: 'Drive-In Road Cinema Junction', station: 'Vastrapur Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 17, lastMatch: null, riskLevel: 'normal', type: '4K PTZ Dome', snapshot_url: 'http://127.0.0.1:8000/api/camera/cam10/snapshot', stream_url: 'http://127.0.0.1:8000/api/camera/cam10/stream' }
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
          { id: 'CAM-072', name: 'Mini Bazar Diamond Flyover', station: 'Varachha Police Station', status: 'online', fps: 30, resolution: '4K (3840x2160)', facesNow: 31, lastMatch: null, riskLevel: 'normal', type: 'PTZ Dome 360°' }
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
          { id: 'CAM-112', name: 'Bhaktinagar Circle', station: 'Bhaktinagar Police Station', status: 'online', fps: 30, resolution: '1080p FHD', facesNow: 14, lastMatch: null, riskLevel: 'normal', type: 'Fixed Bullet' }
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

// Recent Criminal Matches (Dynamic - Populated upon actual Face Detection scans)
export const RECENT_MATCHES = [];

// Criminal Database Records (Dynamic - Populated when targets are registered or scanned)
export const CRIMINAL_DATABASE = [];

// Security Alerts (Dynamic - Generated when face matches or incidents occur)
export const SECURITY_ALERTS = [];

// Real-time Detections Stream (Dynamic - Generated from live camera face detection)
export const REALTIME_DETECTIONS = [];

// Reports & Analytics Charts Data
export const ANALYTICS_DATA = {
  hourlyDetections: [
    { time: '00:00', detections: 0, matches: 0 },
    { time: '04:00', detections: 0, matches: 0 },
    { time: '08:00', detections: 0, matches: 0 },
    { time: '12:00', detections: 0, matches: 0 },
    { time: '16:00', detections: 0, matches: 0 },
    { time: '20:00', detections: 0, matches: 0 }
  ],
  cityMatches: [],
  confidenceDistribution: [],
  alertsByCategory: [],
  kpis: {
    activeCameras: 50,
    activeCamerasTrend: '100% Online',
    activeCamerasSubtitle: '50 Feeds Active Across Gujarat',
    facesDetected: '0',
    facesDetectedSubtitle: 'Today',
    criminalMatches: 0,
    criminalMatchesSubtitle: 'Awaiting Scans',
    activeAlerts: 0,
    activeAlertsSubtitle: 'Normal Surveillance'
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

