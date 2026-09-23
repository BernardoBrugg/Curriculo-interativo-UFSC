import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { curriculaRegistry } from "../src/data/curricula";
import { CurriculaSeedAdapter, runCurriculaSeed } from "./lib/curricula-seed";

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function firestoreAdapter(database: Firestore): CurriculaSeedAdapter {
  return {
    readExisting: async () => {
      const snapshot = await database.collection("curricula").get();
      return Object.fromEntries(snapshot.docs.map((document) => [document.id, document.data()]));
    },
    writeBackup: async (documents) => {
      const directory = resolve(process.cwd(), "backups/curricula");
      const path = resolve(directory, `${timestamp()}.json`);
      await mkdir(directory, { recursive: true });
      await writeFile(path, `${JSON.stringify(documents, null, 2)}\n`, "utf8");
      return path;
    },
    commit: async (payloads) => {
      const batch = database.batch();
      for (const [courseId, payload] of Object.entries(payloads)) batch.set(database.collection("curricula").doc(courseId), payload);
      await batch.commit();
    },
    readBack: async (ids) => {
      const snapshots = await database.getAll(...ids.map((id) => database.collection("curricula").doc(id)));
      return Object.fromEntries(snapshots.map((snapshot) => [snapshot.id, snapshot.data()]));
    },
  };
}

async function main(): Promise<void> {
  const flags = process.argv.slice(2);
  if (flags.some((flag) => flag !== "--apply")) throw new Error(`Opção desconhecida: ${flags.find((flag) => flag !== "--apply")}`);
  const apply = flags.includes("--apply");
  const payloads = Object.fromEntries(Object.entries(curriculaRegistry).map(([courseId, curriculum]) => [courseId, { id: courseId, ...curriculum }]));

  if (!apply) {
    const result = await runCurriculaSeed({ apply: false, payloads });
    process.stdout.write(`Dry-run concluído: ${result.documentCount} currículos validados; nenhuma escrita realizada.\n`);
    return;
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const defaultCredentialsPath = resolve(process.cwd(), "curriculo-interativo-ufsc-firebase-adminsdk-fbsvc-9afdca8573.json");
    if (existsSync(defaultCredentialsPath)) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = defaultCredentialsPath;
    } else {
      throw new Error("Defina GOOGLE_APPLICATION_CREDENTIALS apontando para a chave de serviço Firebase.");
    }
  }
  if (getApps().length === 0) initializeApp({ credential: applicationDefault() });
  const result = await runCurriculaSeed({ apply: true, payloads, adapter: firestoreAdapter(getFirestore()) });
  process.stdout.write(`Backup: ${result.backupPath}\nCurrículos publicados e verificados: ${result.documentCount}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
