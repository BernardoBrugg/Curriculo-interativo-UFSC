import nodemailer from "nodemailer";

export function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) throw new Error("SMTP configuration is incomplete");

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass: password },
  });
}

export function getDefaultSender(): string {
  const sender = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  if (!sender) throw new Error("SMTP sender is not configured");
  return sender;
}
