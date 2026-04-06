#!/usr/bin/env python3
"""Basic tests for the Property Drive API."""

import asyncio
import httpx
import pytest
from fastapi.testclient import TestClient
from main import app


def test_health_endpoint():
    """Test the health check endpoint."""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "requests_remaining" in data
    assert "monthly_cap" in data


def test_scout_endpoint_validation():
    """Test input validation for scout endpoint."""
    client = TestClient(app)

    # Test missing both zip_code and addresses
    response = client.post("/scout", json={})
    assert response.status_code == 400

    # Test empty zip_code
    response = client.post("/scout", json={"zip_code": ""})
    assert response.status_code == 400

    # Test empty addresses list
    response = client.post("/scout", json={"addresses": []})
    assert response.status_code == 400

    # Test invalid addresses
    response = client.post("/scout", json={"addresses": [""]})
    assert response.status_code == 400


def test_rate_limit_endpoint():
    """Test the rate limit endpoint."""
    client = TestClient(app)
    response = client.get("/rate-limit")
    assert response.status_code == 200
    data = response.json()
    assert "remaining" in data
    assert "used" in data
    assert "monthly_cap" in data


def test_leads_endpoint():
    """Test the leads endpoint."""
    client = TestClient(app)
    response = client.get("/leads")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


if __name__ == "__main__":
    # Run basic tests
    print("Running basic API tests...")

    test_health_endpoint()
    print("✓ Health endpoint test passed")

    test_scout_endpoint_validation()
    print("✓ Scout endpoint validation test passed")

    test_rate_limit_endpoint()
    print("✓ Rate limit endpoint test passed")

    test_leads_endpoint()
    print("✓ Leads endpoint test passed")

    print("\nAll basic tests passed! 🎉")