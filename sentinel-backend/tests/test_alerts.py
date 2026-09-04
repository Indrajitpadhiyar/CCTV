import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_alerts_listing(client: AsyncClient, admin_auth_headers: dict):
    response = await client.get("/api/v1/alerts", headers=admin_auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "items" in data
    assert "total" in data
