import { describe, expect, it } from "vitest";
import { sumCourseCredits } from "./curriculum-stats";

describe("sumCourseCredits", () => {
  it("sums the credits from the courses in a semester", () => {
    expect(sumCourseCredits([{ credits: 4 }, { credits: 6 }, { credits: 2 }])).toBe(12);
  });
});
