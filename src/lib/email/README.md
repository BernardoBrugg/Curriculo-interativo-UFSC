# Email Module

## Responsibility
Provides Nodemailer transport configuration, sender address resolution, and HTML/text email builders for system communications.

## Files
- `transporter.ts`: Configures and returns Nodemailer SMTP transport using environment variables.
- `templates/`: Directory containing HTML and plaintext email templates.

## Configuration Requirements
The following environment variables are required for sending emails:
- `SMTP_HOST`: Host of the SMTP server.
- `SMTP_PORT`: Port of the SMTP server (typically 587 or 465).
- `SMTP_SECURE`: "true" for port 465, "false" for other ports.
- `SMTP_USER`: User/email account for authentication.
- `SMTP_PASSWORD`: Application password or credentials for SMTP.
- `SMTP_FROM`: Address to use in the From header.
