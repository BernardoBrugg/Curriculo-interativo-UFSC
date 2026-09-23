import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { App, applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let adminApp: App | null = null;

function resolveServiceAccountFromDisk() {
  const localCredentialsPath = resolve(process.cwd(), "curriculo-interativo-ufsc-firebase-adminsdk-fbsvc-9afdca8573.json");
  if (!existsSync(localCredentialsPath)) return null;
  const rawContent = readFileSync(localCredentialsPath, "utf8");
  return JSON.parse(rawContent);
}

function getInitializedAdminApp(): App {
  if (adminApp) return adminApp;
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (rawServiceAccount) {
    try {
      const parsed = JSON.parse(rawServiceAccount);
      adminApp = initializeApp({ credential: cert(parsed) });
      return adminApp;
    } catch {}
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ?.replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    adminApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    return adminApp;
  }

  const diskServiceAccount = resolveServiceAccountFromDisk();
  if (diskServiceAccount) {
    adminApp = initializeApp({ credential: cert(diskServiceAccount) });
    return adminApp;
  }

  adminApp = initializeApp({ credential: applicationDefault() });
  return adminApp;
}

export function getFirebaseAdminAuth(): Auth {
  return getAuth(getInitializedAdminApp());
}

export function getFirebaseAdminFirestore(): Firestore {
  return getFirestore(getInitializedAdminApp());
}
