// API Service to communicate with continuous Python backend (http://127.0.0.1:8000)

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function checkBackendStatus() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline or starting up
  }
  return null;
}

export async function fetchDistrictsAndAreas() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/hierarchy`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback handled in UI
  }
  return null;
}

export async function fetchCamerasByArea(city, area, onlyAvailable = true) {
  try {
    const url = new URL(`${BACKEND_URL}/api/cameras`);
    if (city) url.searchParams.append('city', city);
    if (area) url.searchParams.append('area', area);
    if (onlyAvailable) url.searchParams.append('available', 'true');

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback handled in UI
  }
  return null;
}

export async function searchPersonOnCameras({ imageBase64, city, area, targetName }) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/search-person`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_base64: imageBase64,
        city: city,
        area: area,
        target_name: targetName || 'Target Subject'
      }),
      signal: AbortSignal.timeout(15000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend search API failed or offline:', err);
  }
  return null;
}

export async function submitHumanVerification({ verdict, cameraId, officerBadge }) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verdict,
        camera_id: cameraId,
        badge: officerBadge || 'GJ-POL-8842'
      }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }
  return null;
}
