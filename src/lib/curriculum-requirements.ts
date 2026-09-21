import { Course, CourseStatus, RequirementExpression } from "@/types/curriculum";

export function isRequirementSatisfied(expression: RequirementExpression, statuses: Record<string, CourseStatus>, coursesById: Map<string, Course>): boolean {
  const evaluate = (current: RequirementExpression, allowEquivalences: boolean): boolean => {
    if (current.kind === "course") {
      if (statuses[current.code] === "completed") return true;
      const equivalent = coursesById.get(current.code)?.equivalentExpression;
      return Boolean(allowEquivalences && equivalent && evaluate(equivalent, false));
    }
    if (current.kind === "all") return current.requirements.every((requirement) => evaluate(requirement, allowEquivalences));
    if (current.kind === "any") return current.requirements.some((requirement) => evaluate(requirement, allowEquivalences));
    const completedHours = [...coursesById.values()].reduce((total, course) => {
      const matchesType = current.courseType === undefined || course.type === current.courseType;
      return total + (matchesType && statuses[course.id] === "completed" ? course.hours : 0);
    }, 0);
    return completedHours >= current.hours;
  };

  return evaluate(expression, true);
}
