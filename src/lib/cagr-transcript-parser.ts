export interface CagrParseResult {
  studentName?: string;
  courseName?: string;
  matricula?: string;
  curriculumCode?: string;
  completedCourses: string[];
  inProgressCourses: string[];
  recognizedCount: number;
}

const PDF_ROW_REGEX = /(.+?)\s+([0-9]{2,3})\s+([0-9]{1,2}(?:\.[0-9]+)?|--)\s+(FS|FI|--)\s+(Ob|Op|Ex|Livre)\s+([A-Z]{3}[0-9]{4})(?:\s+(Rv))?/i;
const START_CODE_ROW_REGEX = /\b([A-Z]{3}[0-9]{4})\b\s+(.+?)\s+([0-9]{1,2}(?:\.[0-9]+)?|--)\s+([0-9]{2,3})\s+(FS|FI|--)\s+(Ob|Op|Ex|Livre)(?:\s+(Rv))?/i;
const EXPLICIT_APPROVED_REGEX = /\b(AP|APRN|DISP|EQUIV|VALID)\b/;
const EXPLICIT_IN_PROGRESS_REGEX = /\b(MATR|MATRICULADO)\b/i;
const EXPLICIT_REPROVED_REGEX = /\b(REP|REPF|REC|TRANC|CANCEL)\b/i;
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

  const courseMatch =
    rawText.match(/HISTÓRICO SÍNTESE DE GRADUAÇÃO\s*\n\s*([^\n\r]+)/i) ||
    rawText.match(/Curso:\s*(?:[0-9]+\s*[-–]?\s*)?([^\n\r]+)/i);
  if (courseMatch) {
    const rawCourse = courseMatch[1].replace(/^(?:237|Bacharelado|\d+)\s*[-–]?\s*/i, "").trim();
    if (rawCourse && !rawCourse.toLowerCase().startsWith("currículo")) {
      courseName = rawCourse;
    }
  }

  const matriculaMatch = rawText.match(/(?:Matr[íi]cula:\s*([0-9]{6,10})|([0-9]{6,10})\s+Matr[íi]cula:)/i);
  if (matriculaMatch) {
    matricula = (matriculaMatch[1] || matriculaMatch[2]).trim();
  }

  const currMatch = rawText.match(/(?:Curr[íi]culo:\s*([0-9]{4}\/[0-9])|(20[0-9]{2}\/[12])[\s\S]{0,40}Curr[íi]culo:)/i);
  if (currMatch) {
    curriculumCode = (currMatch[1] || currMatch[2]).trim();
  }

  const hasAnyStatusInText =
    /\b(FS|FI|AP|APRN|DISP|EQUIV|VALID|MATR|REP|REPF|TRANC|CANCEL|Rv)\b/.test(rawText);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("Observação") || trimmed.startsWith("Legenda:") || trimmed.startsWith("Prazo máximo")) {
      break;
    }

    const pdfMatch = trimmed.match(PDF_ROW_REGEX);
    if (pdfMatch) {
      const code = pdfMatch[6].toUpperCase();
      const notaStr = pdfMatch[3];
      const freq = pdfMatch[4].toUpperCase();
      const isRv = Boolean(pdfMatch[7]);
      const nota = parseFloat(notaStr);
      if (isRv || (freq === "FS" && !isNaN(nota) && nota >= 6.0)) {
        completedSet.add(code);
        inProgressSet.delete(code);
      } else if (freq === "FI" || (!isNaN(nota) && nota < 6.0)) {
        continue;
      } else if (notaStr === "--" || freq === "--") {
        if (!completedSet.has(code)) {
          inProgressSet.add(code);
        }
      }
      continue;
    }

    const startMatch = trimmed.match(START_CODE_ROW_REGEX);
    if (startMatch) {
      const code = startMatch[1].toUpperCase();
      const notaStr = startMatch[3];
      const freq = startMatch[5].toUpperCase();
      const isRv = Boolean(startMatch[7]);
      const nota = parseFloat(notaStr);
      if (isRv || (freq === "FS" && !isNaN(nota) && nota >= 6.0)) {
        completedSet.add(code);
        inProgressSet.delete(code);
      } else if (freq === "FI" || (!isNaN(nota) && nota < 6.0)) {
        continue;
      } else if (notaStr === "--" || freq === "--") {
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
      if (EXPLICIT_REPROVED_REGEX.test(trimmed)) {
        continue;
      }
      if (EXPLICIT_APPROVED_REGEX.test(trimmed)) {
        completedSet.add(code);
        inProgressSet.delete(code);
        continue;
      }
      if (EXPLICIT_IN_PROGRESS_REGEX.test(trimmed)) {
        if (!completedSet.has(code)) {
          inProgressSet.add(code);
        }
        continue;
      }
      if (!hasAnyStatusInText) {
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
