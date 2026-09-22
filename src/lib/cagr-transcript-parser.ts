export interface CagrParseResult {
  completedCourses: string[];
  inProgressCourses: string[];
  recognizedCount: number;
}

const APPROVED_PATTERN = /\b(AP|APRN|DISP|EQUIV|DA|VALID|APROVADO|DISPENSADO)\b/i;
const IN_PROGRESS_PATTERN = /\b(MATR|MATRICULADO)\b/i;
const REPROVED_OR_CANCELLED_PATTERN = /\b(REP|REPF|REC|TRANC|CANCEL)\b/i;
const COURSE_CODE_REGEX = /\b([A-Z]{3}[0-9]{4})\b/g;

export function parseCagrTranscript(rawText: string): CagrParseResult {
  if (!rawText || typeof rawText !== "string") {
    return { completedCourses: [], inProgressCourses: [], recognizedCount: 0 };
  }

  const lines = rawText.split("\n");
  const completedSet = new Set<string>();
  const inProgressSet = new Set<string>();

  const hasAnyExplicitStatus = lines.some(
    (line) => APPROVED_PATTERN.test(line) || IN_PROGRESS_PATTERN.test(line) || REPROVED_OR_CANCELLED_PATTERN.test(line)
  );

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const matches = Array.from(trimmed.matchAll(COURSE_CODE_REGEX));
    if (matches.length === 0) continue;

    for (const match of matches) {
      const code = match[1].toUpperCase();

      if (hasAnyExplicitStatus) {
        if (REPROVED_OR_CANCELLED_PATTERN.test(trimmed)) {
          continue;
        }
        if (APPROVED_PATTERN.test(trimmed)) {
          completedSet.add(code);
          inProgressSet.delete(code);
          continue;
        }
        if (IN_PROGRESS_PATTERN.test(trimmed)) {
          if (!completedSet.has(code)) {
            inProgressSet.add(code);
          }
          continue;
        }
      } else {
        completedSet.add(code);
      }
    }
  }

  const completedCourses = Array.from(completedSet);
  const inProgressCourses = Array.from(inProgressSet);
  const recognizedCount = completedCourses.length + inProgressCourses.length;

  return { completedCourses, inProgressCourses, recognizedCount };
}
