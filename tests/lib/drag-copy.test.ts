import { describe, expect, it } from "vitest";
import { getDropTargetLabel } from "../../src/lib/drag-copy";

describe("getDropTargetLabel", () => {
  it("returns a clear destination label for a semester", () => {
    expect(getDropTargetLabel(4)).toBe("Soltar no semestre 4");
  });
});
