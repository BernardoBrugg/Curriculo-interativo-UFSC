import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { curriculaRegistry } from "../src/data/curricula";

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("Defina GOOGLE_APPLICATION_CREDENTIALS apontando para sua chave de serviço Firebase.");
  }

  if (getApps().length === 0) initializeApp({ credential: applicationDefault() });

  const database = getFirestore();
  const batch = database.batch();

  for (const [courseId, curriculum] of Object.entries(curriculaRegistry)) {
    batch.set(database.collection("curricula").doc(courseId), { id: courseId, ...curriculum });
  }

  await batch.commit();
  console.log(`Currículos publicados: ${Object.keys(curriculaRegistry).length}`);
}

void main();
