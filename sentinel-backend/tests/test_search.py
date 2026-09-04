import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_global_search(client: AsyncClient, admin_auth_headers: dict):
    response = await client.get("/api/v1/search?query=CAM", headers=admin_auth_headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["query"] == "CAM"
    assert "results" in data
