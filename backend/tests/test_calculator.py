def _payload(**overrides):
    payload = {
        "toggle": "abertura",
        "activity": "servico",
        "employees": 1,
        "routine": "sozinho",
        "contact": "chat",
        "benefits": False,
    }
    payload.update(overrides)
    return payload


def test_calculate_basic_plan(client):
    response = client.post("/api/calculator/calculate", json=_payload())

    assert response.status_code == 200
    body = response.json()
    assert body["recommended_plan"] == "Básico"
    assert body["price"] == 139


def test_calculate_comercio_plan(client):
    response = client.post(
        "/api/calculator/calculate", json=_payload(activity="comercio", employees=5)
    )

    assert response.status_code == 200
    body = response.json()
    assert body["recommended_plan"] == "Comércio Avançado"


def test_calculate_invalid_payload_returns_422(client):
    response = client.post("/api/calculator/calculate", json={"toggle": "abertura"})

    assert response.status_code == 422
