def _payload(**overrides):
    payload = {
        "name": "Maria Silva",
        "email": "maria@example.com",
        "phone": "11999999999",
        "city": "São Paulo",
        "activity": "comercio",
        "origin": "hero",
    }
    payload.update(overrides)
    return payload


def test_create_lead_persists_and_returns_id(client):
    response = client.post("/api/leads/create", json=_payload())

    assert response.status_code == 200
    body = response.json()
    assert body["id"] > 0
    assert "sucesso" in body["message"].lower()


def test_create_lead_invalid_email_returns_422(client):
    response = client.post("/api/leads/create", json=_payload(email="not-an-email"))

    assert response.status_code == 422


def test_create_lead_invalid_origin_returns_422(client):
    response = client.post("/api/leads/create", json=_payload(origin="not-a-valid-origin"))

    assert response.status_code == 422


def test_create_lead_rate_limited_after_threshold(client):
    for _ in range(10):
        response = client.post("/api/leads/create", json=_payload())
        assert response.status_code == 200

    response = client.post("/api/leads/create", json=_payload())
    assert response.status_code == 429
