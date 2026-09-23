import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "@/lib/firebase-admin";
import { validateFeedbackPayload } from "@/lib/feedback-validation";

export const runtime = "nodejs";

const ipRateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const INLINE_FILE_MAX_BYTES = 500 * 1024;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (clientIp !== "unknown" && isRateLimited(clientIp)) {
      return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos antes de enviar outro feedback." }, { status: 429 });
    }

    const formData = await request.formData();
    const honeypot = formData.get("website_url");
    if (typeof honeypot === "string" && honeypot.length > 0) {
      return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
    }

    const message = formData.get("message");
    const file = formData.get("file");

    if (typeof message !== "string") {
      return NextResponse.json({ error: "Escreva uma mensagem antes de enviar." }, { status: 400 });
    }

    const fileMetadata = file instanceof File ? { type: file.type, size: file.size } : null;
    const validation = validateFeedbackPayload(message, fileMetadata);

    if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });

    let fileAttachment: {
      name: string;
      size: number;
      type: string;
      base64?: string;
    } | null = null;

    if (file instanceof File) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileAttachment = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      if (file.size <= INLINE_FILE_MAX_BYTES) {
        fileAttachment.base64 = buffer.toString("base64");
      }
    }

    const firestore = getFirebaseAdminFirestore();
    await firestore.collection("feedbacks").add({
      message: message.trim(),
      createdAt: FieldValue.serverTimestamp(),
      status: "unread",
      clientIp,
      fileAttachment,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar o feedback agora." }, { status: 500 });
  }
}
