import { CurriculumData, RequirementExpression } from "@/types/curriculum";

function expressionCourseCodes(expression: RequirementExpression | undefined): string[] {
  if (!expression || expression.kind === "hours") return [];
  if (expression.kind === "course") return [expression.code];
  return expression.requirements.flatMap(expressionCourseCodes);
}

function sourceCourseHours(course: CurriculumData["courses"][number], hoursField: "course" | "extension" | "nonExtension"): number {
  if (hoursField === "extension") return course.extensionHours ?? 0;
  if (hoursField === "nonExtension") return Math.max(0, course.hours - (course.extensionHours ?? 0));
  return course.hours;
}

export function validateCurriculum(courseId: string, curriculum: CurriculumData): string[] {
  const errors: string[] = [];
  const coursesById = new Map<string, CurriculumData["courses"][number]>();

  for (const course of curriculum.courses) {
    if (coursesById.has(course.id)) errors.push(`${courseId}: código duplicado ${course.id}.`);
    coursesById.set(course.id, course);
    if (course.id !== course.code) errors.push(`${courseId}: identificador ${course.id} diverge do código ${course.code}.`);
    if (!/^[A-Z]{3}\d{4}$/.test(course.code)) errors.push(`${courseId}: código inválido ${course.code}.`);
    if (!course.name.trim()) errors.push(`${courseId}: ${course.code} está sem nome.`);
    if (course.hours < 0 || course.credits < 0) errors.push(`${courseId}: ${course.code} possui carga ou créditos negativos.`);
    const prerequisiteCodes = [...new Set(expressionCourseCodes(course.prerequisiteExpression))].sort();
    const equivalentCodes = [...new Set(expressionCourseCodes(course.equivalentExpression))].sort();
    if (course.prerequisites.length > 0 && prerequisiteCodes.join(",") !== [...course.prerequisites].sort().join(",")) errors.push(`${courseId}: expressão de pré-requisito inconsistente em ${course.code}.`);
    if (course.equivalents.length > 0 && equivalentCodes.join(",") !== [...course.equivalents].sort().join(",")) errors.push(`${courseId}: expressão de equivalência inconsistente em ${course.code}.`);
  }

  const completion = curriculum.completion;
  if (!completion) {
    errors.push(`${courseId}: configuração de conclusão ausente.`);
    return errors;
  }

  const assignedFields = new Map<string, Set<"course" | "extension" | "nonExtension">>();
  const sourceIds = new Set<string>();
  let completionHours = 0;

  const assign = (courseCode: string, hoursField: "course" | "extension" | "nonExtension") => {
    const fields = assignedFields.get(courseCode) ?? new Set<"course" | "extension" | "nonExtension">();
    const overlaps = fields.size > 0 && (fields.has(hoursField) || fields.has("course") || hoursField === "course");
    if (overlaps) errors.push(`${courseId}: ${courseCode} contribui para mais de um requisito de conclusão.`);
    fields.add(hoursField);
    assignedFields.set(courseCode, fields);
  };

  for (const requiredCourseId of completion.requiredCourseIds) {
    const course = coursesById.get(requiredCourseId);
    if (!course) {
      errors.push(`${courseId}: requisito fixo inexistente ${requiredCourseId}.`);
      continue;
    }
    assign(requiredCourseId, "course");
    completionHours += course.hours;
  }

  for (const requirement of completion.requirements) {
    if (requirement.requiredHours <= 0) errors.push(`${courseId}: requisito ${requirement.id} não possui carga positiva.`);
    let availableHours = 0;
    for (const source of requirement.sources) {
      if (sourceIds.has(source.id)) errors.push(`${courseId}: fonte de requisito duplicada ${source.id}.`);
      sourceIds.add(source.id);
      let sourceHours = 0;
      for (const sourceCourseId of source.courseIds) {
        const course = coursesById.get(sourceCourseId);
        if (!course) {
          errors.push(`${courseId}: fonte ${source.id} referencia ${sourceCourseId}, que não existe.`);
          continue;
        }
        assign(sourceCourseId, source.hoursField ?? "course");
        sourceHours += sourceCourseHours(course, source.hoursField ?? "course");
      }
      const sourceCapacity = source.allowsManualHours && source.maxHours === undefined ? Number.POSITIVE_INFINITY : sourceHours;
      availableHours += source.maxHours === undefined ? sourceCapacity : Math.min(source.maxHours, source.allowsManualHours ? Number.POSITIVE_INFINITY : sourceHours);
    }
    if (availableHours < requirement.requiredHours) errors.push(`${courseId}: requisito ${requirement.id} oferece apenas ${availableHours}h para uma exigência de ${requirement.requiredHours}h.`);
    completionHours += requirement.requiredHours;
  }

  if (completionHours !== curriculum.totalHours) {
    errors.push(`${courseId}: a soma dos requisitos de conclusão é ${completionHours}h, mas o total oficial é ${curriculum.totalHours}h.`);
  }

  return errors;
}

export function assertValidCurriculum(courseId: string, curriculum: CurriculumData): CurriculumData {
  const errors = validateCurriculum(courseId, curriculum);
  if (errors.length > 0 && process.env.STRICT_CURRICULUM_VALIDATION === "true") {
    throw new Error(errors.join("\n"));
  }
  return curriculum;
}
