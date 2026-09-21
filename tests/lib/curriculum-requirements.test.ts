import { describe, expect, it } from "vitest";
import { isRequirementSatisfied } from "../../src/lib/curriculum-requirements";
import { RequirementExpression } from "../../src/types/curriculum";

describe("curriculum requirement expressions", () => {
  it("accepts either branch of an alternative", () => {
    const expression: RequirementExpression = { kind: "any", requirements: [{ kind: "course", code: "AAA0001" }, { kind: "course", code: "BBB0001" }] };
    expect(isRequirementSatisfied(expression, { BBB0001: "completed" }, new Map())).toBe(true);
  });

  it("requires every branch of a conjunction", () => {
    const expression: RequirementExpression = { kind: "all", requirements: [{ kind: "course", code: "AAA0001" }, { kind: "course", code: "BBB0001" }] };
    expect(isRequirementSatisfied(expression, { AAA0001: "completed" }, new Map())).toBe(false);
  });
});
