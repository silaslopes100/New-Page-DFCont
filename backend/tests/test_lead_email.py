import ssl
from unittest.mock import MagicMock

import pytest

from app.api.models.lead import LeadRequest
from app.services.email_service import (
    LEAD_SUBJECT,
    _compose_lead_body,
    _compose_lead_html,
    send_lead_notification,
)
from app.core.config import settings
from app.services.lead_service import lead_to_notification_dict


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


@pytest.mark.parametrize("port,implicit_tls", [(587, False), (465, True)])
def test_send_lead_notification_uses_correct_smtp_transport(monkeypatch, port, implicit_tls):
    monkeypatch.setattr(settings, "EMAIL_MODE", "smtp")
    monkeypatch.setattr(settings, "SMTP_HOST", "smtp.example.com")
    monkeypatch.setattr(settings, "SMTP_PORT", port)
    monkeypatch.setattr(settings, "SMTP_USER", "user")
    monkeypatch.setattr(settings, "SMTP_PASSWORD", "password")
    smtp = MagicMock()
    smtp_ssl = MagicMock()
    monkeypatch.setattr("app.services.email_service.smtplib.SMTP", smtp)
    monkeypatch.setattr("app.services.email_service.smtplib.SMTP_SSL", smtp_ssl)

    assert send_lead_notification(_lead_payload()) is True

    selected, unused = (smtp_ssl, smtp) if implicit_tls else (smtp, smtp_ssl)
    selected.assert_called_once()
    assert selected.call_args.args == ("smtp.example.com", port)
    unused.assert_not_called()
    server = selected.return_value.__enter__.return_value
    methods = [entry[0] for entry in server.method_calls]
    assert methods == (["login", "send_message"] if implicit_tls else
                       ["ehlo", "starttls", "ehlo", "login", "send_message"])
    context = (selected.call_args.kwargs["context"] if implicit_tls else
               server.starttls.call_args.kwargs["context"])
    assert context.verify_mode == ssl.CERT_REQUIRED
    assert context.check_hostname
    server.login.assert_called_once_with("user", "password")
    server.send_message.assert_called_once()


def test_send_lead_notification_does_not_authenticate_if_starttls_fails(monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_MODE", "smtp")
    monkeypatch.setattr(settings, "SMTP_HOST", "smtp.example.com")
    monkeypatch.setattr(settings, "SMTP_PORT", 587)
    monkeypatch.setattr(settings, "SMTP_USER", "user")
    monkeypatch.setattr(settings, "SMTP_PASSWORD", "password")
    smtp = MagicMock()
    server = smtp.return_value.__enter__.return_value
    server.starttls.side_effect = RuntimeError("STARTTLS unavailable")
    monkeypatch.setattr("app.services.email_service.smtplib.SMTP", smtp)
    smtp_ssl = MagicMock()
    monkeypatch.setattr("app.services.email_service.smtplib.SMTP_SSL", smtp_ssl)

    assert send_lead_notification(_lead_payload()) is False
    smtp_ssl.assert_not_called()
    server.login.assert_not_called()
    server.send_message.assert_not_called()


def test_compose_lead_body_contains_all_context(monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_MODE", "console")
    body = _compose_lead_body(_lead_payload())

    assert LEAD_SUBJECT == "Novo lead — Calculadora DFCont"
    for field in [
        "Maria Silva",
        "maria@example.com",
        "11999999999",
        "São Paulo",
        "Comércio",
        "Vou abrir empresa",
        "3",
        "Com ajuda de um assessor (adicional)",
        "Via chat, e-mail e WhatsApp",
        "Comércio Avançado",
        "R$ 564,00",
    ]:
        assert field in body


def test_compose_lead_body_tolerates_missing_fields():
    body = _compose_lead_body({"name": "João"})
    assert "João" in body
    assert "Não informado" in body


def test_smtp_message_contains_html_and_plain_text(monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_MODE", "smtp")
    send = MagicMock()
    monkeypatch.setattr("app.services.email_service._send_via_smtp", send)
    data = lead_to_notification_dict(LeadRequest(**_lead_payload(monthly_price=1234.5)))

    assert send_lead_notification(data) is True
    message = send.call_args.args[0]
    assert message.get_content_type() == "multipart/alternative"
    text = message.get_body(preferencelist=("plain",)).get_content()
    html = message.get_body(preferencelist=("html",)).get_content()
    for content in (text, html):
        for value in ("Maria Silva", "Comércio", "Comércio Avançado", "R$ 1.234,50", "Sim"):
            assert value in content
    assert 'href="mailto:maria@example.com"' in html
    assert 'href="https://wa.me/5511999999999"' in html


def test_html_escapes_lead_values_and_omits_invalid_phone_link():
    html = _compose_lead_html(_lead_payload(
        name='<img src=x onerror="alert(1)">',
        city="<script>alert(1)</script>",
        phone="123",
    ))
    assert '<img src=x' not in html
    assert "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;" in html
    assert "&lt;script&gt;alert(1)&lt;/script&gt;" in html
    assert "https://wa.me/" not in html


def test_lead_format_handles_optional_values_and_unknown_options():
    data = {"toggle": "migracao", "activity": "atividade personalizada", "employees": 0,
            "benefits": False, "monthly_price": None}
    for content in (_compose_lead_body(data), _compose_lead_html(data)):
        assert "Vou trocar de contador" in content
        assert "atividade personalizada" in content
        assert "Não informado" in content
        assert "Não" in content
        assert "0" in content


def test_create_lead_with_context_and_email_notification(client, caplog, monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_MODE", "console")
    with caplog.at_level("INFO"):
        response = client.post(
            "/api/leads/create", json=_lead_payload(origin="calculator")
        )

    assert response.status_code == 200
    assert response.json()["id"] > 0
    assert "Novo lead" in caplog.text