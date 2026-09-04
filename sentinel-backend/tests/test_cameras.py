import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_and_list_camera(client: AsyncClient, admin_auth_headers: dict):
    payload = {
        "camera_code": "CAM-TEST-001",
        "name": "Test Highway Camera",
        "rtsp_url": "rtsp://admin:pass@192.168.1.50:554/live",
        "latitude": 23.0225,
        "longitude": 72.5714,
        "district": "Ahmedabad"
    }
    # Create Camera
    response = await client.post("/api/v1/cameras", json=payload, headers=admin_auth_headers)
    assert response.status_code == 201
    cam_data = response.json()["data"]
    assert cam_data["camera_code"] == "CAM-TEST-001"
    # Ensure RTSP password was masked
    assert "pass" not in cam_data["rtsp_url"]

    # List Cameras
    list_res = await client.get("/api/v1/cameras", headers=admin_auth_headers)
    assert list_res.status_code == 200
    assert list_res.json()["data"]["total"] >= 1
