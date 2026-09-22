import { Course, RequirementExpression } from "../../src/types/curriculum";

export interface ParsedCagrCurriculum {
  courses: Course[];
}

interface Columns {
  discipline: number;
  type: number;
  hours: number;
  credits: number;
  equivalents: number;
  prerequisites: number;
  set: number;
  prerequisiteHours: number;
}

interface CourseRow {
  index: number;
  code: string;
  name: string;
  type: Course["type"];
  hours: number;
  credits: number;
  phase: number;
  extensionHours?: number;
  nameContinuationIndexes: Set<number>;
}

const courseCodePattern = /[A-Z]{3}\d{4}/g;

function parseColumns(header: string): Columns {
  return {
    discipline: header.indexOf("Disciplina"),
    type: header.indexOf("Tipo"),
    hours: header.indexOf("H/A"),
    credits: header.indexOf("Aulas"),
    equivalents: header.indexOf("Equivalentes"),
    prerequisites: header.indexOf("Pré-Requisito"),
    set: header.indexOf("Conjunto"),
    prerequisiteHours: header.indexOf("Pré CH"),
  };
}

function parsePhase(page: string): number {
  const phase = page.match(/(?:(?:Fase|Per[íi]odo)\s*0?(\d+)|(\d+)[ªaº°]\s*(?:Fase|Per[íi]odo))/i);
  return Number(phase?.[1] ?? phase?.[2] ?? 0);
}

function parseType(value: string): Course["type"] | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "ob") return "Ob";
  if (normalized === "op") return "Op";
  return null;
}

function parseNumber(value: string): number {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function shouldContinueName(name: string, value: string, availableWidth: number, allowWidthInference: boolean): boolean {
  if (!value || /^(?:\(\*\)|\*|-)$/.test(value)) return false;
  if (/[.;]$/.test(value)) return false;
  return /(?:[,;:]|\b(?:e|de|da|do|dos|das|para|em)|\(|Ext)$/i.test(name) || (allowWidthInference && name.length >= availableWidth - 8);
}

function findNameContinuations(lines: string[], rowIndex: number, columns: Columns, initialName: string): { name: string; indexes: Set<number> } {
  const indexes = new Set<number>();
  const parts = [initialName];
  const availableWidth = columns.type - (columns.discipline + 8);

  for (let index = rowIndex + 1; index < Math.min(lines.length, rowIndex + 4); index += 1) {
    const prefix = lines[index].slice(columns.discipline, columns.type).trim();
    const currentName = parts.join(" ");
    if (!shouldContinueName(currentName, prefix, availableWidth, parts.length === 1)) break;
    parts.push(prefix);
    indexes.add(index);
  }

  return { name: parts.join(" ").replace(/\s+/g, " ").trim(), indexes };
}

function tokens(value: string): string[] {
  return [...new Set(value.match(courseCodePattern) ?? [])];
}

function combine(kind: "all" | "any", requirements: RequirementExpression[]): RequirementExpression | undefined {
  const flattened = requirements.flatMap((requirement) => requirement.kind === kind ? requirement.requirements : [requirement]);
  if (flattened.length === 0) return undefined;
  if (flattened.length === 1) return flattened[0];
  return { kind, requirements: flattened };
}

function relationExpression(value: string): RequirementExpression | undefined {
  const relationTokens = (value.match(/[A-Z]{3}\d{4}|\(|\)|\bou\b|\beh\b|\be\b/gi) ?? []).map((token) => token.toLowerCase() === "eh" ? "e" : token.toLowerCase());
  let index = 0;

  const parseAtom = (): RequirementExpression | undefined => {
    const token = relationTokens[index];
    if (!token) return undefined;
    if (token === "(") {
      index += 1;
      const expression = parseAny();
      if (relationTokens[index] === ")") index += 1;
      return expression;
    }
    if (/^[a-z]{3}\d{4}$/.test(token)) {
      index += 1;
      return { kind: "course", code: token.toUpperCase() };
    }
    index += 1;
    return parseAtom();
  };

  const parseAll = (): RequirementExpression | undefined => {
    const requirements: RequirementExpression[] = [];
    const first = parseAtom();
    if (first) requirements.push(first);
    while (index < relationTokens.length && relationTokens[index] !== ")" && relationTokens[index] !== "ou") {
      if (relationTokens[index] === "e") index += 1;
      const next = parseAtom();
      if (next) requirements.push(next);
    }
    return combine("all", requirements);
  };

  function parseAny(): RequirementExpression | undefined {
    const requirements: RequirementExpression[] = [];
    const first = parseAll();
    if (first) requirements.push(first);
    while (relationTokens[index] === "ou") {
      index += 1;
      const next = parseAll();
      if (next) requirements.push(next);
    }
    return combine("any", requirements);
  }

  return parseAny();
}

function relationText(lines: string[], row: CourseRow, nextRowIndex: number, columns: Columns, start: number, end: number): string {
  const parts: string[] = [];
  for (let index = row.index; index < nextRowIndex; index += 1) {
    const prefix = lines[index].slice(columns.discipline, columns.type).trim();
    if (index !== row.index && prefix && !row.nameContinuationIndexes.has(index)) break;
    const value = lines[index].slice(start, end).trim();
    if (value) parts.push(value);
  }
  return parts.join(" ");
}

function syllabusText(lines: string[], previousRow: CourseRow | undefined, row: CourseRow, columns: Columns, headerIndex: number): string {
  const start = previousRow ? previousRow.index + 1 : headerIndex + 1;
  const ignored = previousRow?.nameContinuationIndexes ?? new Set<number>();
  const parts: string[] = [];

  for (let index = start; index < row.index; index += 1) {
    if (ignored.has(index)) continue;
    const prefix = lines[index].slice(columns.discipline, columns.type).trim();
    const indentation = lines[index].search(/\S/);
    if (!prefix || indentation < columns.discipline + 4) continue;
    if (/^(?:\(\*\)|\*|Página:|SeTIC|Curso:|Currículo:|Habilitação:)/.test(prefix)) continue;
    parts.push(lines[index].trim());
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function parsePage(page: string, inheritedColumns?: Columns): { courses: Course[]; columns?: Columns } {
  const lines = page.split("\n");
  const headerIndex = lines.findIndex((line) => line.includes("Disciplina") && line.includes("Tipo") && line.includes("Equivalentes") && line.includes("Pré-Requisito"));
  const columns = headerIndex >= 0 ? parseColumns(lines[headerIndex]) : inheritedColumns;
  if (!columns || Object.values(columns).some((value) => value < 0)) return { courses: [], columns: inheritedColumns };
  const phase = parsePhase(page);
  const rows: CourseRow[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const flexibleMatch = lines[index].match(/^\s{3,10}([A-Z]{3}\d{4})\s+(.+?)\s+(Ob|Op|Es|Ex)(?:\s+(\d+)(?:\s+(\d+))?)?(?:\s|$)/i);
    const code = flexibleMatch?.[1];
    const initialName = flexibleMatch?.[2];
    if (!code || !initialName) continue;
    const type = parseType(flexibleMatch[3]);
    if (!type) continue;
    const nameData = findNameContinuations(lines, index, columns, initialName.trim());
    const extension = nameData.name.match(/\bEXT?\s*(\d+)h-a\b/i);
    rows.push({
      index,
      code,
      name: nameData.name.replace(/\s*\(\s*EXT?\s*\d+h-a\s*\)\s*/i, " ").replace(/\s+Ext\s*(?=\d*h-a\)?$)/i, " ").trim(),
      type,
      hours: parseNumber(flexibleMatch[4] ?? ""),
      credits: parseNumber(flexibleMatch[5] ?? ""),
      phase,
      extensionHours: extension ? Number(extension[1]) : undefined,
      nameContinuationIndexes: nameData.indexes,
    });
  }

  const courses = rows.map((row, rowIndex) => {
    const nextRowIndex = rows[rowIndex + 1]?.index ?? lines.length;
    const equivalentText = relationText(lines, row, nextRowIndex, columns, columns.equivalents, columns.prerequisites);
    const prerequisiteText = relationText(lines, row, nextRowIndex, columns, columns.prerequisites, columns.set);
    const prerequisiteHoursText = relationText(lines, row, nextRowIndex, columns, 0, Number.MAX_SAFE_INTEGER);
    const prerequisiteHoursMatch = prerequisiteHoursText.match(/(\d+)\s*hs?(?:\s*(Ob))?/i);
    const prerequisiteHours = prerequisiteHoursMatch ? Number(prerequisiteHoursMatch[1]) : undefined;
    const courseRequirement = relationExpression(prerequisiteText);
    const hourRequirement: RequirementExpression | undefined = prerequisiteHours === undefined ? undefined : { kind: "hours", hours: prerequisiteHours, ...(prerequisiteHoursMatch?.[2] ? { courseType: "Ob" as const } : {}) };
    const prerequisiteExpression = combine("all", [courseRequirement, hourRequirement].filter((requirement): requirement is RequirementExpression => Boolean(requirement)));
    const equivalents = tokens(equivalentText);
    const prerequisites = tokens(prerequisiteText);
    const syllabus = syllabusText(lines, rows[rowIndex - 1], row, columns, Math.max(0, headerIndex));
    return {
      id: row.code,
      code: row.code,
      name: row.name,
      credits: row.credits,
      hours: row.hours,
      phase: row.phase,
      type: row.type,
      prerequisites,
      equivalents,
      ...(prerequisiteExpression ? { prerequisiteExpression } : {}),
      ...(equivalents.length > 0 ? { equivalentExpression: relationExpression(equivalentText) } : {}),
      ...(prerequisiteHours === undefined ? {} : { prerequisiteHours }),
      syllabus,
      ...(row.extensionHours ? { extensionHours: row.extensionHours } : {}),
    };
  });
  return { courses, columns };
}

function recoverMissingSyllabi(text: string, courses: Course[]): Course[] {
  const lines = text.split("\n");
  const rows = lines.flatMap((line, index) => {
    const code = line.match(/^\s{3,10}([A-Z]{3}\d{4})\s+/)?.[1];
    return code ? [{ code, index }] : [];
  });
  const candidatesByCode = new Map<string, string[]>();

  rows.forEach((row, rowIndex) => {
    const start = rows[rowIndex - 1]?.index ?? 0;
    const blocks: string[][] = [];
    let currentBlock: string[] = [];
    for (const line of lines.slice(start + 1, row.index)) {
      const indentation = line.search(/\S/);
      const value = line.trim();
      const eligible = indentation >= 12 && indentation <= 40 && Boolean(value) && !/^(?:CURRÍCULO DO CURSO|Curso:|Currículo:|Habilitação:|Disciplina\s+Tipo|Fase\s|Página:|SeTIC|Legenda:|Observações|Rol de |Optativas |Disciplinas Optativas|Atividades Acadêmicas)/i.test(value);
      if (eligible) {
        currentBlock.push(value);
        continue;
      }
      if (currentBlock.length > 0) blocks.push(currentBlock);
      currentBlock = [];
    }
    if (currentBlock.length > 0) blocks.push(currentBlock);
    const candidate = (blocks.at(-1) ?? []).join(" ").replace(/\s+/g, " ").trim();
    if (candidate.length < 40) return;
    const current = candidatesByCode.get(row.code) ?? [];
    current.push(candidate);
    candidatesByCode.set(row.code, current);
  });

  return courses.map((course) => {
    if (course.syllabus) return course;
    const candidate = (candidatesByCode.get(course.code) ?? []).sort((left, right) => right.length - left.length)[0];
    return candidate ? { ...course, syllabus: candidate } : course;
  });
}

export function parseCagrCurriculum(text: string): ParsedCagrCurriculum {
  const byCode = new Map<string, Course>();
  let columns: Columns | undefined;
  for (const page of text.split("\f")) {
    const parsed = parsePage(page, columns);
    columns = parsed.columns;
    for (const course of parsed.courses) {
      const current = byCode.get(course.code);
      if (!current || (!current.syllabus && course.syllabus)) byCode.set(course.code, course);
    }
  }
  return { courses: recoverMissingSyllabi(text, [...byCode.values()]) };
}
