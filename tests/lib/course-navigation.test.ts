import { describe, expect, it, vi } from "vitest";
import { addCourseAndNavigate } from "../../src/lib/course-navigation";

describe("addCourseAndNavigate", () => {
  it("navigates to the new course after it is added", async () => {
    const addCourse = vi.fn(async () => undefined);
    const navigate = vi.fn();

    await addCourseAndNavigate(addCourse, navigate, "mecanica");

    expect(addCourse).toHaveBeenCalledWith("mecanica");
    expect(navigate).toHaveBeenCalledWith("/mecanica");
    expect(addCourse.mock.invocationCallOrder[0]).toBeLessThan(navigate.mock.invocationCallOrder[0]);
  });
});
