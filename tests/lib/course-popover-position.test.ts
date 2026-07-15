import { describe, expect, it } from "vitest";
import { getCoursePopoverPosition } from "../../src/lib/course-popover-position";

describe("getCoursePopoverPosition", () => {
  it("places the popover to the right of the card when there is room", () => {
    expect(getCoursePopoverPosition({ left: 100, right: 360, top: 120, bottom: 220 }, { width: 1200, height: 800 })).toEqual({
      left: 372,
      top: 120,
    });
  });

  it("places the popover to the left when the right side would overflow", () => {
    expect(getCoursePopoverPosition({ left: 900, right: 1160, top: 120, bottom: 220 }, { width: 1200, height: 800 })).toEqual({
      left: 600,
      top: 120,
    });
  });

  it("keeps the popover inside the viewport vertically", () => {
    expect(getCoursePopoverPosition({ left: 100, right: 360, top: 760, bottom: 820 }, { width: 1200, height: 800 })).toEqual({
      left: 372,
      top: 544,
    });
  });
});
