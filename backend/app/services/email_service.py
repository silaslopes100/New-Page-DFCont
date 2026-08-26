"""Isolated transactional e-mail layer for lead notifications.

Sends lead notifications to the configured recipient (LEAD_NOTIFICATION_EMAIL).

Modes:
- "console": logs the message body at INFO level (development default). No SMTP
  credentials are required and nothing leaves the machine.
- "smtp": sends a real e-mail via SMTP using the configured credentials.

The service never raises: failures are logged so callers can keep persisting
leads even when e-mail is temporarily unavailable.
"""

import logging
import smtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger(__name__)

LEAD_SUBJECT = "Novo lead — Calculadora DFCont"


def _build_message(to_email: str, subject: str, body: str) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.SMTP_FROM or settings.LEAD_NOTIFICATION_EMAIL
    message["To"] = to_email
    message.set_content(body)
    return message


def _send_via_smtp(message: EmailMessage) -> None:
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP mode enabled but SMTP_HOST/SMTP_USER/SMTP_PASSWORD are not "
            "configured. Falling back to console output."
        )
        _log_console(message)
        return

    if settings.SMTP_PORT == 465:
        # Port 465 is implicit TLS (SMTPS); STARTTLS on this port hangs until timeout.
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
    else:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)


def _log_console(message: EmailMessage) -> None:
    logger.info(
        "[email] Would send to=%s subject=%r\n%s",
        message["To"],
        message["Subject"],
        message.get_content(),
    )


def send_lead_notification(lead_data: dict) -> bool:
    """Send a lead notification. Returns True on success, False on failure.

    ``lead_data`` must be a plain dict with display-ready fields:
    name, email, phone, city, activity, origin, toggle, employees, routine,
    contact, benefits, recommended_plan, monthly_price.
    """
    try:
        body = _compose_lead_body(lead_data)
        message = _build_message(
            settings.LEAD_NOTIFICATION_EMAIL, LEAD_SUBJECT, body
        )
        if settings.EMAIL_MODE == "smtp":
            _send_via_smtp(message)
        else:
            _log_console(message)
        return True
    except Exception:
        logger.exception("Failed to send lead notification e-mail")
        return False


def _compose_lead_body(data: dict) -> str:
    def _label(value, fallback="-"):
        if value is None:
            return fallback
        value = str(value).strip()
        return value if value else fallback

    def _price(value):
        if value is None:
            return "-"
        try:
            return f"R$ {float(value):.2f}"
        except (TypeError, ValueError):
            return str(value)

    lines = [
        "Um novo lead foi capturado no site:",
        "",
        f"Nome: {_label(data.get('name'))}",
        f"E-mail: {_label(data.get('email'))}",
        f"Telefone: {_label(data.get('phone'))}",
        f"Cidade: {_label(data.get('city'))}",
        f"Atividade: {_label(data.get('activity'))}",
        f"Origem: {_label(data.get('origin'))}",
        "",
        "Dados da calculadora:",
        f"Tipo de operação: {_label(data.get('toggle'))}",
        f"Sócios/funcionários: {_label(data.get('employees'))}",
        f"Rotina: {_label(data.get('routine'))}",
        f"Preferência de contato: {_label(data.get('contact'))}",
        f"Benefícios: {_label(data.get('benefits'))}",
        "",
    ]
    return "\n".join(lines)