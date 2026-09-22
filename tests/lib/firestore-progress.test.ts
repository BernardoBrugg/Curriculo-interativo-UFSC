import { describe, expect, it } from "vitest";
import { normalizeProgress } from "../../src/lib/firestore-progress";

describe("normalizeProgress", () => {
  it("returns empty progress for a missing Firestore document", () => {
    expect(normalizeProgress(undefined)).toEqual({
      statuses: {},
      customPhases: {},
      requirementHours: {},
    });
  });

  it("keeps valid status and phase values from Firestore", () => {
    expect(
      normalizeProgress({
        statuses: { MTM3100: "completed", EEL5105: "in-progress" },
        customPhases: { MTM3100: 3 },
        requirementHours: { external: 54 },
      })
    ).toEqual({
      statuses: { MTM3100: "completed", EEL5105: "in-progress" },
      customPhases: { MTM3100: 3 },
      requirementHours: { external: 54 },
    });
  });

  it("removes invalid custom phase values", () => {
    expect(
      normalizeProgress({
        customPhases: { negative: -1, decimal: 2.5, tooHigh: 99, valid: 7, validZero: 0 },
      })
    ).toEqual({
      statuses: {},
      customPhases: { valid: 7, validZero: 0 },
      requirementHours: {},
    });
  });

  it("keeps only finite nonnegative requirement hours", () => {
    expect(normalizeProgress({ requirementHours: { valid: 36, negative: -1, text: "54", infinite: Infinity } })).toEqual({
      statuses: {},
      customPhases: {},
      requirementHours: { valid: 36 },
    });
  });
});
