import { describe, expect, it } from "vitest";
import { normalizeProgress } from "../../src/lib/firestore-progress";

describe("normalizeProgress", () => {
  it("returns empty progress for a missing Firestore document", () => {
    expect(normalizeProgress(undefined)).toEqual({
      statuses: {},
      customPhases: {},
    });
  });

  it("keeps valid status and phase values from Firestore", () => {
    expect(
      normalizeProgress({
        statuses: { MTM3100: "completed", EEL5105: "in-progress" },
        customPhases: { MTM3100: 3 },
      })
    ).toEqual({
      statuses: { MTM3100: "completed", EEL5105: "in-progress" },
      customPhases: { MTM3100: 3 },
    });
  });

  it("removes invalid custom phase values", () => {
    expect(
      normalizeProgress({
        customPhases: { invalid: 0, decimal: 2.5, valid: 7 },
      })
    ).toEqual({
      statuses: {},
      customPhases: { valid: 7 },
    });
  });
});
