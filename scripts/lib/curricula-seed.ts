import { createHash } from "node:crypto";

export interface CurriculaSeedAdapter {
  readExisting: () => Promise<Record<string, unknown>>;
  writeBackup: (documents: Record<string, unknown>) => Promise<string>;
  commit: (payloads: Record<string, unknown>) => Promise<void>;
  readBack: (ids: string[]) => Promise<Record<string, unknown>>;
}

export interface CurriculaSeedResult {
  applied: boolean;
  documentCount: number;
  backupPath?: string;
  hashes: Record<string, string>;
}

interface RunCurriculaSeedInput {
  apply: boolean;
  payloads: Record<string, unknown>;
  adapter?: CurriculaSeedAdapter;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => [key, canonicalize(item)]));
}

export function canonicalHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}

export async function runCurriculaSeed({ apply, payloads, adapter }: RunCurriculaSeedInput): Promise<CurriculaSeedResult> {
  const ids = Object.keys(payloads).sort();
  if (ids.length === 0) throw new Error("Nenhum currículo foi informado para publicação.");
  for (const id of ids) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Identificador de currículo inválido: ${id}`);
  }
  const hashes = Object.fromEntries(ids.map((id) => [id, canonicalHash(payloads[id])]));
  if (!apply) return { applied: false, documentCount: ids.length, hashes };
  if (!adapter) throw new Error("Adaptador do Firestore ausente para publicação.");

  const existing = await adapter.readExisting();
  const backupPath = await adapter.writeBackup(existing);
  await adapter.commit(payloads);
  const readback = await adapter.readBack(ids);
  const divergent = ids.filter((id) => canonicalHash(readback[id]) !== hashes[id]);
  if (divergent.length > 0) throw new Error(`Verificação divergente apó a publicação: ${divergent.join(", ")}`);
  return { applied: true, documentCount: ids.length, backupPath, hashes };
}
