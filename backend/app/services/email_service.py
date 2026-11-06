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
import ssl
from email.message import EmailMessage
from html import escape
from urllib.parse import quote

from app.core.config import settings

logger = logging.getLogger(__name__)

LEAD_SUBJECT = "Novo lead — Calculadora DFCont"


def _build_message(to_email: str, subject: str, body: str, html_body: str) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.SMTP_FROM or settings.LEAD_NOTIFICATION_EMAIL
    message["To"] = to_email
    message.set_content(body)
    message.add_alternative(html_body, subtype="html")
    return message


def _send_via_smtp(message: EmailMessage) -> None:
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP mode enabled but SMTP_HOST/SMTP_USER/SMTP_PASSWORD are not "
            "configured. Falling back to console output."
        )
        _log_console(message)
        return

    context = ssl.create_default_context()
    if settings.SMTP_PORT == 465:
        connection = smtplib.SMTP_SSL(
            settings.SMTP_HOST, settings.SMTP_PORT, timeout=15, context=context
        )
    else:
        connection = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15)

    with connection as server:
        if settings.SMTP_PORT != 465:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(message)


def _log_console(message: EmailMessage) -> None:
    logger.info(
        "[email] Would send to=%s subject=%r\n%s",
        message["To"],
        message["Subject"],
        message.get_body(preferencelist=("plain",)).get_content(),
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
            settings.LEAD_NOTIFICATION_EMAIL, LEAD_SUBJECT, body,
            _compose_lead_html(lead_data),
        )
        if settings.EMAIL_MODE == "smtp":
            _send_via_smtp(message)
        else:
            _log_console(message)
        return True
    except Exception:
        logger.exception("Failed to send lead notification e-mail")
        return False


_LABELS = {
    "origin": {
        "calculator": "Calculadora", "contact": "Contato",
        "hero": "Página inicial", "cta": "Chamada para ação",
    },
    "activity": {
        "pj_empresa": "PJ em uma empresa", "ti": "Serviços de TI",
        "adm": "Serviços Administrativos", "medicina": "Medicina",
        "psicologia": "Psicologia e outros saúde", "marketing": "Marketing / Publicidade",
        "engenharia": "Engenharia / Arquitetura", "educacao": "Educação / Cursos",
        "advocacia": "Advocacia", "consultoria": "Consultoria",
        "comercial": "Representação Comercial", "comercio": "Comércio",
        "outros": "Minha atividade não está na lista",
    },
    "toggle": {"abertura": "Vou abrir empresa", "migracao": "Vou trocar de contador"},
    "routine": {
        "sozinho": "Sozinho, através da plataforma",
        "assessor": "Com ajuda de um assessor (adicional)",
    },
    "contact": {
        "chat_email": "Via chat e e-mail",
        "chat_email_whats": "Via chat, e-mail e WhatsApp",
        "completo": "Via chat, e-mail, WhatsApp e telefone",
    },
}


def _display_value(data: dict, key: str) -> str:
    value = data.get(key)
    if value is None or str(value).strip() == "":
        return "Não informado"
    if key == "benefits" and isinstance(value, bool):
        return "Sim" if value else "Não"
    value = str(value).strip()
    if key == "monthly_price":
        try:
            number = float(value.removeprefix("R$").strip())
            return f"R$ {number:,.2f}".replace(",", "_").replace(".", ",").replace("_", ".")
        except ValueError:
            return value
    return _LABELS.get(key, {}).get(value, value)


_SECTIONS = (
    ("Dados do lead", (
        ("Nome", "name"), ("E-mail", "email"), ("WhatsApp / Telefone", "phone"),
        ("Localização", "city"), ("Atividade / Ramo", "activity"),
        ("Origem", "origin"), ("Canal de contato", "contact"),
    )),
    ("Parâmetros da simulação", (
        ("Operação", "toggle"), ("Sócios / Funcionários", "employees"),
        ("Rotina", "routine"), ("Benefícios", "benefits"),
    )),
    ("Proposta", (("Plano recomendado", "recommended_plan"), ("Mensalidade", "monthly_price"))),
)


def _compose_lead_body(data: dict) -> str:
    lines = ["Um novo lead foi capturado no site.", ""]
    for title, fields in _SECTIONS:
        lines.append(title)
        lines.extend(f"{label}: {_display_value(data, key)}" for label, key in fields)
        lines.append("")
    return "\n".join(lines)


def _compose_lead_html(data: dict) -> str:
    cards = []
    for title, fields in _SECTIONS:
        rows = []
        for label, key in fields:
            value = escape(_display_value(data, key))
            rows.append(
                '<tr><td style="padding:10px 12px;border-bottom:1px solid #e5eeff;'
                'color:#565e74;font-size:13px;width:42%;vertical-align:top;">'
                f'{escape(label)}</td><td style="padding:10px 12px;border-bottom:1px solid '
                f'#e5eeff;color:#0b1c30;font-size:14px;overflow-wrap:anywhere;">{value}</td></tr>'
            )
        cards.append(
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
            'style="background:#ffffff;border-radius:8px;margin-bottom:16px;">'
            f'<tr><td style="padding:20px 20px 8px;color:#2a14b4;font-size:18px;'
            f'font-weight:bold;">{escape(title)}</td></tr><tr><td style="padding:0 8px 12px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
            f'{"".join(rows)}</table></td></tr></table>'
        )

    actions = []
    email = str(data.get("email") or "").strip()
    if email and "\r" not in email and "\n" not in email:
        actions.append(("Responder por e-mail", f"mailto:{quote(email, safe='@')}"))
    phone = str(data.get("phone") or "")
    digits = "".join(char for char in phone if char in "0123456789")
    if len(digits) in (10, 11):
        actions.append(("Conversar no WhatsApp", f"https://wa.me/55{digits}"))
    buttons = "".join(
        f'<a href="{escape(url, quote=True)}" style="display:inline-block;background:#2a14b4;'
        'color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:6px;'
        f'margin:0 8px 8px 0;font-weight:bold;">{escape(label)}</a>'
        for label, url in actions
    )
    return (
        '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1"></head>'
        '<body style="margin:0;padding:0;background:#f8f9ff;font-family:Arial,sans-serif;">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        '<tr><td align="center" style="padding:24px 12px;">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="max-width:640px;"><tr><td>'
        '<div style="background:#2a14b4;color:#ffffff;padding:24px;border-radius:8px;'
        'margin-bottom:16px;"><div style="font-size:12px;text-transform:uppercase;'
        'letter-spacing:1px;">DFCont · Notificação de lead</div>'
        '<h1 style="font-size:24px;line-height:30px;margin:10px 0 0;">'
        f'Novo lead recebido: {escape(_display_value(data, "name"))}</h1></div>'
        f'{"".join(cards)}'
        f'<div style="padding:8px 0;">{buttons}</div>'
        '<p style="color:#565e74;font-size:12px;line-height:18px;">'
        'Esta é uma mensagem automática gerada pelo site da DFCont.</p>'
        '</td></tr></table></td></tr></table></body></html>'
    )