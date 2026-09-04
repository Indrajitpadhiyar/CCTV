import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_vehicle_tracking(client: AsyncClient, admin_auth_headers: dict):
    response = await client.get("/api/v1/tracking/vehicles/search?plate_number=GJ01AB1234", headers=admin_auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["plate_number"] == "GJ01AB1234"
    assert "timeline" in data
