import { CourseStatus, CurriculumData } from "@/types/curriculum";

export interface CurriculumProgressInput {
  curriculum: CurriculumData;
  statuses: Record<string, CourseStatus>;
  requirementHours: Record<string, number>;
}

export interface RequirementProgress {
  id: string;
  name: string;
  completedHours: number;
  requiredHours: number;
}

export interface CurriculumProgress {
  completedHours: number;
  totalHours: number;
  percent: number;
  completedCourses: number;
  inProgressCourses: number;
  requirements: RequirementProgress[];
}

function courseHours(course: CurriculumData["courses"][number], hoursField: "course" | "extension" | "nonExtension"): number {
  if (hoursField === "extension") return course.extensionHours ?? 0;
  if (hoursField === "nonExtension") return Math.max(0, course.hours - (course.extensionHours ?? 0));
  return course.hours;
}

export function calculateCurriculumProgress({ curriculum, statuses, requirementHours }: CurriculumProgressInput): CurriculumProgress {
  const coursesById = new Map(curriculum.courses.map((course) => [course.id, course]));
  const completion = curriculum.completion ?? {
    requiredCourseIds: curriculum.courses.map((course) => course.id),
    requirements: [],
  };
  const assignedFields = new Map<string, Set<"course" | "extension" | "nonExtension">>();

  const assign = (courseId: string, hoursField: "course" | "extension" | "nonExtension") => {
    const fields = assignedFields.get(courseId) ?? new Set<"course" | "extension" | "nonExtension">();
    const overlaps = fields.size > 0 && (fields.has(hoursField) || fields.has("course") || hoursField === "course");
    if (overlaps) throw new Error(`Disciplina ${courseId} atribuída a mais de um requisito de conclusão.`);
    fields.add(hoursField);
    assignedFields.set(courseId, fields);
  };

  for (const courseId of completion.requiredCourseIds) assign(courseId, "course");

  for (const requirement of completion.requirements) {
    for (const source of requirement.sources) {
      for (const courseId of source.courseIds) {
        assign(courseId, source.hoursField ?? "course");
      }
    }
  }

  const requiredHours = completion.requiredCourseIds.reduce((total, courseId) => total + (coursesById.get(courseId)?.hours ?? 0), 0);
  const completedRequiredHours = completion.requiredCourseIds.reduce((total, courseId) => {
    const course = coursesById.get(courseId);
    return total + (course && statuses[courseId] === "completed" ? course.hours : 0);
  }, 0);
  const requirements = completion.requirements.map((requirement) => {
    const sourceHours = requirement.sources.reduce((total, source) => {
      const catalogueHours = source.courseIds.reduce((sourceTotal, courseId) => {
        const course = coursesById.get(courseId);
        return sourceTotal + (course && statuses[courseId] === "completed" ? courseHours(course, source.hoursField ?? "course") : 0);
      }, 0);
      const manualHours = source.allowsManualHours ? Math.max(0, requirementHours[source.id] ?? 0) : 0;
      const availableHours = catalogueHours + manualHours;
      return total + (source.maxHours === undefined ? availableHours : Math.min(source.maxHours, availableHours));
    }, 0);

    return {
      id: requirement.id,
      name: requirement.name,
      completedHours: Math.min(requirement.requiredHours, sourceHours),
      requiredHours: requirement.requiredHours,
    };
  });
  const requirementsTarget = requirements.reduce((total, requirement) => total + requirement.requiredHours, 0);
  const completedRequirementHours = requirements.reduce((total, requirement) => total + requirement.completedHours, 0);
  const totalHours = requiredHours + requirementsTarget;
  const completedHours = completedRequiredHours + completedRequirementHours;
  const completedCourses = curriculum.courses.filter((course) => statuses[course.id] === "completed").length;
  const inProgressCourses = curriculum.courses.filter((course) => statuses[course.id] === "in-progress").length;

  return {
    completedHours,
    totalHours,
    percent: totalHours > 0 ? Math.min(100, Math.round((completedHours / totalHours) * 100)) : 0,
    completedCourses,
    inProgressCourses,
    requirements,
  };
}
