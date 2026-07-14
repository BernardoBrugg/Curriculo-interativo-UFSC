import { describe, expect, it } from "vitest";
import { shouldStartDragScroll } from "./drag-scroll";

describe("shouldStartDragScroll", () => {
  it("does not start board scrolling from interactive controls", () => {
    const handle = { closest: () => ({}) } as unknown as EventTarget;

    expect(shouldStartDragScroll(handle)).toBe(false);
  });

  it("starts board scrolling from the board surface", () => {
    const surface = { closest: () => null } as unknown as EventTarget;

    expect(shouldStartDragScroll(surface)).toBe(true);
  });
});
