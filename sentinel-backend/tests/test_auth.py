import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    payload = {
        "username": "testadmin",
        "password": "Test1234!"
    }
    response = await client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]


@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient):
    payload = {
        "username": "testadmin",
        "password": "WrongPassword!"
    }
    response = await client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me(client: AsyncClient, admin_auth_headers: dict):
    response = await client.get("/api/v1/auth/me", headers=admin_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["email"] == "admin@test.com"
