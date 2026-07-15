import { describe, expect, it } from "vitest";
import { toggleCourseRemovalConfirmation } from "../../src/lib/course-removal";

describe("toggleCourseRemovalConfirmation", () => {
  it("opens confirmation for a course and closes it when selected again", () => {
    expect(toggleCourseRemovalConfirmation(null, "civil")).toBe("civil");
    expect(toggleCourseRemovalConfirmation("civil", "civil")).toBeNull();
    expect(toggleCourseRemovalConfirmation("civil", "mecanica")).toBe("mecanica");
  });
});
