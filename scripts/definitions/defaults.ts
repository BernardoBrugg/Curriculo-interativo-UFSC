import { CurriculumData } from "../../src/types/curriculum";
import { ExtractedCurriculumRule } from "../extract-curriculum-rules";
import { catalogueSource, CurriculumDefinition, idsByType, manualSource, requirement } from "./types";

export function buildDefaultDefinition(rule: ExtractedCurriculumRule): CurriculumDefinition {
  const totalHours = rule.totalHoursUfsc > 0 ? rule.totalHoursUfsc : 3600;

  return {
    program: rule.program || "Graduação UFSC",
    version: rule.version,
    totalHours,
    completion: (_text: string, courses: CurriculumData["courses"]) => {
      const requiredCourseIds = idsByType(courses, "Ob");
      const mandatorySum = courses
        .filter((course) => course.type === "Ob")
        .reduce((sum, course) => sum + (course.hours || 0), 0);

      const computedElectiveHours = rule.electiveHours ?? Math.max(0, totalHours - mandatorySum);
      const optativeCourseIds = idsByType(courses, "Op");

      if (computedElectiveHours <= 0) {
        return {
          requiredCourseIds,
          requirements: [],
        };
      }

      const manualHoursCap = Math.min(computedElectiveHours, 180);

      return {
        requiredCourseIds,
        requirements: [
          requirement("electives", "Disciplinas optativas e complementares", computedElectiveHours, [
            catalogueSource("electives-catalogue", optativeCourseIds),
            manualSource("external-electives", manualHoursCap),
          ]),
        ],
      };
    },
  };
}
