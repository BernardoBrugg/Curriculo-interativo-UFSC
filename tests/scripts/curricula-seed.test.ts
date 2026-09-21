import { describe, expect, it } from "vitest";
import { CurriculaSeedAdapter, runCurriculaSeed } from "../../scripts/lib/curricula-seed";

function adapter(events: string[], readback: Record<string, unknown>): CurriculaSeedAdapter {
  return {
    readExisting: async () => {
      events.push("read-existing");
      return { old: { id: "old" } };
    },
    writeBackup: async () => {
      events.push("backup");
      return "backups/curricula/test.json";
    },
    commit: async () => {
      events.push("commit");
    },
    readBack: async (ids) => {
      events.push("read-back");
      return Object.fromEntries(ids.map((id) => [id, readback[id]]));
    },
  };
}

describe("curricula seed workflow", () => {
  it("validates a dry run without touching the adapter", async () => {
    const events: string[] = [];
    const result = await runCurriculaSeed({ apply: false, payloads: { civil: { id: "civil", totalHours: 1 } }, adapter: adapter(events, {}) });
    expect(result.applied).toBe(false);
    expect(events).toEqual([]);
  });

  it("backs up before one atomic commit and verifies readback", async () => {
    const events: string[] = [];
    const payloads = { civil: { id: "civil", totalHours: 4518 }, mecanica: { id: "mecanica", totalHours: 4608 } };
    const result = await runCurriculaSeed({ apply: true, payloads, adapter: adapter(events, payloads) });
    expect(result.applied).toBe(true);
    expect(events).toEqual(["read-existing", "backup", "commit", "read-back"]);
  });

  it("rejects unsafe document identifiers", async () => {
    await expect(runCurriculaSeed({ apply: false, payloads: { "users/admin": {} }, adapter: adapter([], {}) })).rejects.toThrow("Identificador de currículo inválido");
  });

  it("fails when Firestore readback differs", async () => {
    const payloads = { civil: { id: "civil", totalHours: 4518 } };
    await expect(runCurriculaSeed({ apply: true, payloads, adapter: adapter([], { civil: { id: "civil", totalHours: 1 } }) })).rejects.toThrow("Verificação divergente");
  });
});
