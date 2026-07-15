import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { validateFeedbackPayload } from "@/lib/feedback-validation";

export const runtime = "nodejs";

function getSmtpTransporter() {
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const message = formData.get("message");
    const file = formData.get("file");

    if (typeof message !== "string") {
      return NextResponse.json({ error: "Escreva uma mensagem antes de enviar." }, { status: 400 });
    }

    const fileMetadata = file instanceof File ? { type: file.type, size: file.size } : null;
    const validation = validateFeedbackPayload(message, fileMetadata);

    if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });

    const attachments = file instanceof File ? [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()), contentType: file.type }] : [];
    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
    const to = process.env.FEEDBACK_TO ?? "bbbrugg@gmail.com";

    if (!from) throw new Error("SMTP sender is not configured");

    await getSmtpTransporter().sendMail({
      from,
      to,
      subject: "Novo feedback do Currículo Interativo UFSC",
      text: message.trim(),
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar o feedback agora." }, { status: 500 });
  }
}
