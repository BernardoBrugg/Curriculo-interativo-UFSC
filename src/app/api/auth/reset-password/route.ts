import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebase-admin";
import { buildPasswordResetEmail } from "@/lib/email/templates/password-reset-template";
import { getDefaultSender, getMailTransporter } from "@/lib/email/transporter";

export const runtime = "nodejs";

const ipRateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = ipRateLimits.get(identifier);
  if (!entry || now > entry.resetAt) {
    ipRateLimits.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  entry.count += 1;
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (clientIp !== "unknown" && isRateLimited(clientIp)) {
      return NextResponse.json({ error: "auth/too-many-requests" }, { status: 429 });
    }

    const body = await request.json().catch(() => null) as { email?: unknown } | null;
    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawEmail || !isValidEmail(rawEmail)) {
      return NextResponse.json({ error: "auth/invalid-email" }, { status: 400 });
    }

    if (isRateLimited(`email:${rawEmail}`)) {
      return NextResponse.json({ error: "auth/too-many-requests" }, { status: 429 });
    }

    const adminAuth = getFirebaseAdminAuth();
    let resetLink: string;
    try {
      resetLink = await adminAuth.generatePasswordResetLink(rawEmail);
    } catch (authError: unknown) {
      const code = typeof authError === "object" && authError !== null && "code" in authError
        ? String((authError as { code: unknown }).code)
        : "";
      if (code === "auth/user-not-found") {
        return NextResponse.json({ error: "auth/user-not-found" }, { status: 400 });
      }
      throw authError;
    }

    const { subject, html, text } = buildPasswordResetEmail({
      resetLink,
      recipientEmail: rawEmail,
    });

    const transporter = getMailTransporter();
    const from = getDefaultSender();

    await transporter.sendMail({
      from,
      to: rawEmail,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "auth/internal-error" }, { status: 500 });
  }
}
