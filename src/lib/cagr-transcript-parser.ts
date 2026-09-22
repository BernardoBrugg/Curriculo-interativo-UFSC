export interface CagrParseResult {
  studentName?: string;
  courseName?: string;
  matricula?: string;
  curriculumCode?: string;
  completedCourses: string[];
  inProgressCourses: string[];
  recognizedCount: number;
}

const PDF_ROW_REGEX = /(.+?)\s+([0-9]{2,3})\s+([0-9]{1,2}(?:[.,][0-9]+)?|--)\s+(FS|FI|--)\s+(Ob|Op|Ex|Livre)\s+([A-Z]{3}[0-9]{4})(?:\s+(Rv))?/i;
const START_CODE_ROW_REGEX = /\b([A-Z]{3}[0-9]{4})\b\s+(.+?)\s+([0-9]{1,2}(?:[.,][0-9]+)?|--)\s+([0-9]{2,3})\s+(FS|FI|--)\s+(Ob|Op|Ex|Livre)(?:\s+(Rv))?/i;
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
  const reprovedSet = new Set<string>();

  let studentName: string | undefined;
  let courseName: string | undefined;
  let matricula: string | undefined;
  let curriculumCode: string | undefined;

  const studentMatch = rawText.match(/Aluno:\s*([^–\n\r]+?)(?=\s+(?:Nascimento|Sexo|Matr[íi]cula|Identidade|CPF|Natural|Curso|Curr[íi]culo|Semestre|$)|[\n\r])/i);
  if (studentMatch) {
    studentName = studentMatch[1].trim();
  }

  const specificCourseMatch = rawText.match(/Curso:[^\S\r\n]*(?:[0-9]+\s*[-–]?\s*)?([^–\n\r]+?)(?=\s+(?:Semestre|Curr[íi]culo|Carga|Situa[çc]|Matr[íi]cula|Aluno|$)|[\n\r])/i);
  if (specificCourseMatch) {
    const rawCourse = specificCourseMatch[1].replace(/^(?:237|Bacharelado|\d+)\s*[-–]?\s*/i, "").trim();
    if (rawCourse && !rawCourse.toLowerCase().startsWith("currículo")) {
      courseName = rawCourse;
    }
  }

  if (!courseName) {
    const headerMatch = rawText.match(/HISTÓRICO SÍNTESE DE GRADUAÇÃO\s*\n\s*([^\n\r]+)/i);
    if (headerMatch && !headerMatch[1].includes("Matrícula") && !headerMatch[1].includes("Aluno")) {
      courseName = headerMatch[1].replace(/^(?:237|Bacharelado|\d+)\s*[-–]?\s*/i, "").trim();
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
    if (trimmed.startsWith("Observação") || trimmed.startsWith("Legenda:") || trimmed.startsWith("Prazo máximo") || trimmed.startsWith("PDIC")) {
      continue;
    }

    const pdfMatch = trimmed.match(PDF_ROW_REGEX);
    if (pdfMatch) {
      const code = pdfMatch[6].toUpperCase();
      const notaStr = pdfMatch[3].replace(",", ".");
      const freq = pdfMatch[4].toUpperCase();
      const isRv = Boolean(pdfMatch[7]);
      const nota = parseFloat(notaStr);
      if (isRv || (freq === "FS" && !isNaN(nota) && nota >= 6.0)) {
        completedSet.add(code);
        inProgressSet.delete(code);
      } else if (freq === "FI" || (!isNaN(nota) && nota < 6.0)) {
        reprovedSet.add(code);
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
      const notaStr = startMatch[3].replace(",", ".");
      const freq = startMatch[5].toUpperCase();
      const isRv = Boolean(startMatch[7]);
      const nota = parseFloat(notaStr);
      if (isRv || (freq === "FS" && !isNaN(nota) && nota >= 6.0)) {
        completedSet.add(code);
        inProgressSet.delete(code);
      } else if (freq === "FI" || (!isNaN(nota) && nota < 6.0)) {
        reprovedSet.add(code);
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
        reprovedSet.add(code);
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

  const allCodeMatches = Array.from(rawText.matchAll(GENERAL_CODE_REGEX));
  for (let index = 0; index < allCodeMatches.length; index++) {
    const match = allCodeMatches[index];
    const code = match[1].toUpperCase();
    if (completedSet.has(code) || inProgressSet.has(code) || reprovedSet.has(code)) {
      continue;
    }

    const prevEnd = index > 0 ? allCodeMatches[index - 1].index + allCodeMatches[index - 1][0].length : 0;
    const nextStart = index < allCodeMatches.length - 1 ? allCodeMatches[index + 1].index : rawText.length;
    const beforeText = rawText.slice(prevEnd, match.index).replace(/^\s*Rv\b/i, "").trim();
    const afterText = rawText.slice(match.index + match[0].length, nextStart).trim();

    const isCodeLast = /(?:FS|FI|--)\s+(?:Ob|Op|Ex|Livre)\s*$/i.test(beforeText);
    const segment = isCodeLast ? beforeText + " " + afterText.slice(0, 15) : afterText;

    if (/\b(Rv|AP|APRN|DISP|EQUIV|VALID)\b/i.test(segment)) {
      completedSet.add(code);
      continue;
    }
    if (/\b(MATR|MATRICULADO)\b|--\s+[0-9]{2,3}\s+--|--\s+--/i.test(segment)) {
      inProgressSet.add(code);
      continue;
    }
    if (/\b(REP|REPF|REC|TRANC|CANCEL)\b/i.test(segment)) {
      reprovedSet.add(code);
      continue;
    }

    const fsScoreMatch = segment.match(/(?:FS|FI)\s+(?:Ob|Op|Ex|Livre)?\s*([0-9]{1,2}(?:[.,][0-9]+)?)|([0-9]{1,2}(?:[.,][0-9]+)?)\s+(?:[0-9]{2,3}\s+)?(?:FS|FI)/i);
    if (fsScoreMatch) {
      const scoreString = (fsScoreMatch[1] || fsScoreMatch[2]).replace(",", ".");
      const numericScore = parseFloat(scoreString);
      if (!isNaN(numericScore) && numericScore >= 6.0) {
        completedSet.add(code);
      } else if (!isNaN(numericScore) && numericScore < 6.0) {
        reprovedSet.add(code);
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
