# backend/emailer.py
import os
from email.message import EmailMessage
import aiosmtplib

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM") or GMAIL_USER
EMAIL_TO = os.getenv("EMAIL_TO")  # where you want to receive messages
SUBJECT_PREFIX = os.getenv("EMAIL_SUBJECT_PREFIX", "[Portfolio Contact]")

async def send_contact_email(*, first_name: str, last_name: str, email: str, subject: str, message: str):
    if not (GMAIL_USER and GMAIL_APP_PASSWORD and EMAIL_TO):
        raise RuntimeError("Email not configured. Set GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_TO (and optionally EMAIL_FROM).")

    msg = EmailMessage()
    msg["Subject"] = f"{SUBJECT_PREFIX} {subject}".strip()
    msg["From"] = EMAIL_FROM
    msg["To"] = EMAIL_TO
    msg["Reply-To"] = email

    body = f"""New contact submission

Name: {first_name} {last_name}
Email: {email}
Subject: {subject}

Message:
{message}
"""
    msg.set_content(body)

    await aiosmtplib.send(
        msg,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        start_tls=True,
        username=GMAIL_USER,
        password=GMAIL_APP_PASSWORD,
    )