import pytest

from app.api.models.lead import LeadRequest
from app.services.email_service import (
    LEAD_SUBJECT,
    _compose_lead_body,
    send_lead_notification,
)
from app.core.config import settings


@pytest.fixture(autouse=True)
def _email_mode_console(monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_MODE", "console")
    monkeypatch.setattr(
        settings, "LEAD_NOTIFICATION_EMAIL", "silaslopesdesouza@gmail.com"
    )


def _lead_payload(**overrides):
    payload = {
        "name": "Maria Silva",
        "email": "maria@example.com",
        "phone": "11999999999",
        "city": "São Paulo",
        "activity": "comercio",
        "origin": "calculator",
        "toggle": "abertura",
        "employees": 3,
        "routine": "assessor",
        "contact": "chat_email_whats",
        "benefits": True,
        "recommended_plan": "Comércio Avançado",
        "monthly_price": 564.0,
    }
    payload.update(overrides)
    return payload


def test_lead_request_accepts_calculator_context_fields():
    request = LeadRequest(**_lead_payload())
    assert request.toggle == "abertura"
    assert request.employees == 3
    assert request.recommended_plan == "Comércio Avançado"
    assert request.monthly_price == 564.0


def test_lead_request_normalizes_phone_to_digits():
    request = LeadRequest(**_lead_payload(phone="(11) 99999-9999"))
    assert request.phone == "11999999999"


@pytest.mark.parametrize(
    "phone",
    ["12345", "1234567890123", "abc", ""],
)
def test_lead_request_rejects_invalid_phone(phone):
    with pytest.raises(Exception):
        LeadRequest(**_lead_payload(phone=phone))


def test_send_lead_notification_console_mode_logs_without_sending(caplog):
    with caplog.at_level("INFO"):
        ok = send_lead_notification(_lead_payload())

    assert ok is True
    assert "Novo lead" in caplog.text
    assert "Maria Silva" in caplog.text
    assert "silaslopesdesouza@gmail.com" in caplog.text


def test_send_lead_notification_returns_false_on_failure(monkeypatch):
    def boom(*args, **kwargs):
        raise RuntimeError("smtp down")

    monkeypatch.setattr(settings, "EMAIL_MODE", "smtp")
    monkeypatch.setattr("app.services.email_service._send_via_smtp", boom)

    assert send_lead_notification(_lead_payload()) is False


def test_compose_lead_body_contains_all_context(monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_MODE", "console")
    body = _compose_lead_body(_lead_payload())

    assert LEAD_SUBJECT == "Novo lead — Calculadora DFCont"
    for field in [
        "Maria Silva",
        "maria@example.com",
        "11999999999",
        "São Paulo",
        "comercio",
        "abertura",
        "3",
        "assessor",
        "chat_email_whats",
        "Comércio Avançado",
        "R$ 564.00",
    ]:
        assert field in body


def test_compose_lead_body_tolerates_missing_fields():
    body = _compose_lead_body({"name": "João"})
    assert "João" in body
    assert "Não informado" not in body
    assert "-" in body


def test_create_lead_with_context_and_email_notification(client, caplog, monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_MODE", "console")
    with caplog.at_level("INFO"):
        response = client.post(
            "/api/leads/create", json=_lead_payload(origin="calculator")
        )

    assert response.status_code == 200
    assert response.json()["id"] > 0
    assert "Novo lead" in caplog.text