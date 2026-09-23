import { describe, expect, it } from "vitest";
import { curriculaRegistry } from "../../src/data/curricula";
import { calculateCurriculumProgress } from "../../src/lib/curriculum-progress";
import { validateCurriculum } from "../../src/lib/curriculum-validation";

describe("official curricula contracts", () => {
  for (const [id, curriculum] of Object.entries(curriculaRegistry)) {
    it(`${id} matches its official report`, () => {
      expect(curriculum.source?.kind).toBe("official-cagr-report");
      expect(validateCurriculum(id, curriculum)).toEqual([]);
      const statuses = Object.fromEntries(curriculum.courses.map((course) => [course.id, "completed" as const]));
      const requirementHours = Object.fromEntries(
        (curriculum.completion?.requirements ?? []).flatMap((requirement) =>
          requirement.sources
            .filter((source) => source.allowsManualHours)
            .map((source) => [source.id, source.maxHours ?? requirement.requiredHours]),
        ),
      );
      const progress = calculateCurriculumProgress({ curriculum, statuses, requirementHours });
      expect(progress.totalHours).toBe(curriculum.totalHours);
      expect(progress.percent).toBe(100);
    });
  }
});
