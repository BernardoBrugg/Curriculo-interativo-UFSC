import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  clearLocalProgress,
  getLocalProgress,
  hasLocalProgress,
  saveLocalProgress,
  setLocalCourseStatus,
  setLocalCustomPhase,
  setLocalRequirementHours,
} from "../../src/lib/local-progress";

class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe("local-progress", () => {
  const originalWindow = globalThis.window;
  let mockStorage: LocalStorageMock;

  beforeEach(() => {
    mockStorage = new LocalStorageMock();
    (globalThis as unknown as { window: unknown }).window = {
      localStorage: mockStorage,
    };
  });

  afterEach(() => {
    (globalThis as unknown as { window: unknown }).window = originalWindow;
  });

  it("returns empty progress by default", () => {
    expect(getLocalProgress("producao")).toEqual({
      statuses: {},
      customPhases: {},
      requirementHours: {},
    });
    expect(hasLocalProgress("producao")).toBe(false);
  });

  it("saves and reads local progress", () => {
    saveLocalProgress("producao", {
      statuses: { EPS7014: "completed" },
      customPhases: { EPS7014: 2 },
      requirementHours: { external: 36 },
    });
    expect(getLocalProgress("producao")).toEqual({
      statuses: { EPS7014: "completed" },
      customPhases: { EPS7014: 2 },
      requirementHours: { external: 36 },
    });
    expect(hasLocalProgress("producao")).toBe(true);
  });

  it("updates individual status and deletes pending", () => {
    setLocalCourseStatus("producao", "EPS7014", "completed");
    expect(getLocalProgress("producao").statuses).toEqual({ EPS7014: "completed" });

    setLocalCourseStatus("producao", "EPS7014", "pending");
    expect(getLocalProgress("producao").statuses).toEqual({});
  });

  it("updates custom phases and requirement hours", () => {
    setLocalCustomPhase("producao", "EPS7014", 5);
    expect(getLocalProgress("producao").customPhases).toEqual({ EPS7014: 5 });

    setLocalRequirementHours("producao", "ext", 72);
    expect(getLocalProgress("producao").requirementHours).toEqual({ ext: 72 });
  });

  it("clears progress", () => {
    setLocalCourseStatus("producao", "EPS7014", "completed");
    clearLocalProgress("producao");
    expect(hasLocalProgress("producao")).toBe(false);
  });

  it("returns default values in non-browser environment", () => {
    (globalThis as unknown as { window: unknown }).window = undefined;
    expect(getLocalProgress("producao")).toEqual({
      statuses: {},
      customPhases: {},
      requirementHours: {},
    });
    expect(hasLocalProgress("producao")).toBe(false);
    expect(() => clearLocalProgress("producao")).not.toThrow();
  });
});
