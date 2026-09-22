export interface CagrParseResult {
  studentName?: string;
  courseName?: string;
  matricula?: string;
  curriculumCode?: string;
  completedCourses: string[];
  inProgressCourses: string[];
  recognizedCount: number;
}

const COURSE_LINE_REGEX = /\b([A-Z]{3}[0-9]{4})\b\s+(.+?)\s+([0-9]{1,2}(?:\.[0-9]+)?|--)\s+([0-9]{2,3})\s+(FS|FI|--)\s+(Ob|Op|Ex|Livre)(?:\s+(Rv))?/i;
const APPROVED_EXPLICIT_REGEX = /\b(AP|APRN|DISP|EQUIV|DA|VALID)\b/i;
const IN_PROGRESS_EXPLICIT_REGEX = /\b(MATR|MATRICULADO)\b/i;
const REPROVED_EXPLICIT_REGEX = /\b(REP|REPF|REC|TRANC|CANCEL|FI)\b/i;
const GENERAL_CODE_REGEX = /\b([A-Z]{3}[0-9]{4})\b/g;

export function parseCagrTranscript(rawText: string): CagrParseResult {
  if (!rawText || typeof rawText !== "string") {
    return { completedCourses: [], inProgressCourses: [], recognizedCount: 0 };
  }

  const lines = rawText.split("\n");
  const completedSet = new Set<string>();
  const inProgressSet = new Set<string>();

  let studentName: string | undefined;
  let courseName: string | undefined;
  let matricula: string | undefined;
  let curriculumCode: string | undefined;

  const studentMatch = rawText.match(/Aluno:\s*([^\n\r]+)/i);
  if (studentMatch) {
    studentName = studentMatch[1].trim();
  }

  const courseMatch = rawText.match(/Curso:\s*(?:[0-9]+\s*[-–]?\s*)?([^\n\r]+)/i);
  if (courseMatch) {
    courseName = courseMatch[1].replace(/^(?:237|Bacharelado|\d+)\s*[-–]?\s*/i, "").trim();
  }

  const matriculaMatch = rawText.match(/Matr[íi]cula:\s*([0-9]+)/i);
  if (matriculaMatch) {
    matricula = matriculaMatch[1].trim();
  }

  const currMatch = rawText.match(/Curr[íi]culo:\s*([0-9]+\/[0-9]+)/i);
  if (currMatch) {
    curriculumCode = currMatch[1].trim();
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("Observação") || trimmed.startsWith("Legenda:") || trimmed.startsWith("Prazo máximo")) {
      break;
    }

    const tableMatch = trimmed.match(COURSE_LINE_REGEX);
    if (tableMatch) {
      const code = tableMatch[1].toUpperCase();
      const notaStr = tableMatch[3];
      const freq = tableMatch[5]?.toUpperCase();
      const isRevalidated = Boolean(tableMatch[7]);
      const nota = parseFloat(notaStr);

      if (isRevalidated || (freq === "FS" && !isNaN(nota) && nota >= 6.0)) {
        completedSet.add(code);
        inProgressSet.delete(code);
      } else if (freq === "FI" || (!isNaN(nota) && nota < 6.0)) {
        continue;
      } else if (notaStr === "--" || !freq || freq === "--") {
        if (!completedSet.has(code)) {
          inProgressSet.add(code);
        }
      }
      continue;
    }

    const generalMatches = Array.from(trimmed.matchAll(GENERAL_CODE_REGEX));
    if (generalMatches.length === 0) continue;

    for (const match of generalMatches) {
      const code = match[1].toUpperCase();
      if (REPROVED_EXPLICIT_REGEX.test(trimmed)) {
        continue;
      }
      if (APPROVED_EXPLICIT_REGEX.test(trimmed)) {
        completedSet.add(code);
        inProgressSet.delete(code);
        continue;
      }
      if (IN_PROGRESS_EXPLICIT_REGEX.test(trimmed)) {
        if (!completedSet.has(code)) {
          inProgressSet.add(code);
        }
        continue;
      }
      if (!APPROVED_EXPLICIT_REGEX.test(rawText)) {
        completedSet.add(code);
      }
    }
  }

  const completedCourses = Array.from(completedSet);
  const inProgressCourses = Array.from(inProgressSet);
  const recognizedCount = completedCourses.length + inProgressCourses.length;

  return {
    studentName,
    courseName,
    matricula,
    curriculumCode,
    completedCourses,
    inProgressCourses,
    recognizedCount,
  };
}
