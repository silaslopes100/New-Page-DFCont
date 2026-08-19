def _payload(**overrides):
    payload = {
        "name": "João Souza",
        "email": "joao@example.com",
        "phone": "11988887777",
        "message": "Gostaria de mais informações sobre os planos.",
    }
    payload.update(overrides)
    return payload


def test_send_contact_returns_success(client):
    response = client.post("/api/contact/send", json=_payload())

    assert response.status_code == 200
    assert "sucesso" in response.json()["message"].lower()


def test_send_contact_persists_message(client):
    from app.core.database import SessionLocal
    from app.api.models.contact import ContactDB

    client.post("/api/contact/send", json=_payload(email="persisted@example.com"))

    db = SessionLocal()
    try:
        saved = db.query(ContactDB).filter_by(email="persisted@example.com").first()
        assert saved is not None
        assert saved.message == _payload()["message"]
    finally:
        db.close()


def test_send_contact_invalid_email_returns_422(client):
    response = client.post("/api/contact/send", json=_payload(email="not-an-email"))

    assert response.status_code == 422


def test_send_contact_accepts_empty_phone(client):
    response = client.post("/api/contact/send", json=_payload(phone=""))

    assert response.status_code == 200


def test_send_contact_accepts_missing_phone(client):
    payload = _payload()
    del payload["phone"]
    response = client.post("/api/contact/send", json=payload)

    assert response.status_code == 200
