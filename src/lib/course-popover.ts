import { Course } from "@/types/curriculum";

const courseTypeLabels: Record<Course["type"], string> = {
  Ob: "Obrigatória",
  Op: "Optativa do curso",
  FreeOp: "Optativa livre",
};

const formatCourse = (course: Course) => `${course.code} · ${course.name}`;

export function getCoursePopoverData(course: Course, courses: Course[]) {
  const courseMap = new Map(courses.map((item) => [item.id, item]));
  const prerequisites = course.prerequisites
    .map((id) => courseMap.get(id))
    .filter((item): item is Course => Boolean(item))
    .map(formatCourse);
  const dependents = courses
    .filter((item) => item.prerequisites.includes(course.id))
    .map(formatCourse);

  return {
    typeLabel: courseTypeLabels[course.type],
    creditsLabel: `${course.credits} ${course.credits === 1 ? "crédito" : "créditos"}`,
    prerequisites,
    dependents,
    dragInstruction: "Segure e arraste pelo puxador para mover entre semestres.",
  };
}
