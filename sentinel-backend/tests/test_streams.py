import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_stream_crud(client: AsyncClient, admin_auth_headers: dict):
    # First create camera
    cam_payload = {
        "camera_code": "CAM-STREAM-001",
        "name": "Stream Camera",
        "rtsp_url": "rtsp://admin:secret@192.168.1.60:554/live"
    }
    cam_res = await client.post("/api/v1/cameras", json=cam_payload, headers=admin_auth_headers)
    cam_id = cam_res.json()["data"]["id"]

    # Create stream for camera
    stream_payload = {
        "camera_id": cam_id,
        "stream_url": "rtsp://admin:secret@192.168.1.60:554/live",
        "stream_type": "main"
    }
    st_res = await client.post("/api/v1/streams", json=stream_payload, headers=admin_auth_headers)
    assert st_res.status_code == 201
    st_id = st_res.json()["data"]["id"]

    # Get stream
    get_res = await client.get(f"/api/v1/streams/{st_id}", headers=admin_auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["data"]["status"] == "disconnected"
