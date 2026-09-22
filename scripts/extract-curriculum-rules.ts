import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface ExtractedCurriculumRule {
  id: string;
  courseCode: string;
  curriculumCode: string;
  program: string;
  version: string;
  totalHoursUfsc: number;
  totalHoursCne?: number;
  electiveHours?: number;
  stageHours?: number;
  observations: string;
  sectionHeadings: string[];
}

interface ManifestSource {
  id: string;
  courseCode: string;
  curriculumCode: string;
  url: string;
  sha256: string;
}

interface Manifest {
  capturedAt: string;
  sources: ManifestSource[];
}

const root = resolve(process.cwd());
const sourcesDir = resolve(root, "data/curricula/sources");
const manifestPath = resolve(sourcesDir, "manifest.json");
const outputPath = resolve(root, "data/curricula/rules-extracted.json");

function parseHours(matchValue?: string): number | undefined {
  if (!matchValue) return undefined;
  const parsed = Number(matchValue.replace(/\D/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function extractProgramName(text: string): string {
  const match = text.match(/Curso:\s+\d+\s+-\s+([^-\n\r]+?)(?:\s+-\s+(?:Bacharelado|Licenciatura|EaD))?(?:\r?\n|$)/i);
  if (match) return match[1].trim();
  const fallback = text.match(/Diplomado em:\s+([^\r\n]+)/i);
  return fallback ? fallback[1].trim() : "";
}

function extractObservations(text: string): string {
  const marker = text.search(/(?:Observa[çc][õo]es|Regras de Integraliza[çc][ãa]o)/i);
  if (marker < 0) return "";
  const candidate = text.slice(marker);
  const endMarker = candidate.search(/Legenda:\s+Tipo:/i);
  const raw = endMarker >= 0 ? candidate.slice(0, endMarker) : candidate;
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.includes("SeTIC - Superintendência"))
    .join("\n");
}

function extractSectionHeadings(text: string): string[] {
  const headings: string[] = [];
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(?:Rol de |Disciplinas Optativas|Atividades Complementares|A[çc][õo]es de Extens[ãa]o|Optativas da |Optativas do )/i.test(trimmed)) {
      if (trimmed.length < 80 && !headings.includes(trimmed)) {
        headings.push(trimmed);
      }
    }
  }
  return headings;
}

export function extractRuleFromText(id: string, courseCode: string, curriculumCode: string, text: string): ExtractedCurriculumRule {
  const program = extractProgramName(text);
  const ufscMatch = text.match(/Carga Hor[aá]ria Obrigat[oó]ria:.*?UFSC:\s*(\d+)\s*H\/A/i);
  const cneMatch = text.match(/Carga Hor[aá]ria Obrigat[oó]ria:.*?CNE:\s*(\d+)\s*H/i);
  const optMatch = text.match(/Optativas Profissionais:\s*(\d+)\s*H\/A/i);
  const estagioMatch = text.match(/Est[aá]gio:\s*(\d+)\s*H\/A/i);

  const totalHoursUfsc = parseHours(ufscMatch?.[1]) ?? 0;
  const totalHoursCne = parseHours(cneMatch?.[1]);
  const electiveHours = parseHours(optMatch?.[1]);
  const stageHours = parseHours(estagioMatch?.[1]);
  const observations = extractObservations(text);
  const sectionHeadings = extractSectionHeadings(text);

  const versionPrefix = curriculumCode.length === 5 ? `${curriculumCode.slice(0, 4)}.${curriculumCode.slice(4)}` : curriculumCode;

  return {
    id,
    courseCode,
    curriculumCode,
    program,
    version: `Matriz ${versionPrefix}`,
    totalHoursUfsc,
    ...(totalHoursCne ? { totalHoursCne } : {}),
    ...(electiveHours ? { electiveHours } : {}),
    ...(stageHours ? { stageHours } : {}),
    observations,
    sectionHeadings,
  };
}

async function main(): Promise<void> {
  const manifest: Manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const rules: ExtractedCurriculumRule[] = [];

  for (const source of manifest.sources) {
    const baseName = `${source.id}-${source.curriculumCode}`;
    const txtPath = resolve(sourcesDir, `${baseName}.txt`);
    try {
      const text = await readFile(txtPath, "utf8");
      const rule = extractRuleFromText(source.id, source.courseCode, source.curriculumCode, text);
      rules.push(rule);
    } catch (error) {
      process.stderr.write(`Erro ao ler ${txtPath}: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  await writeFile(outputPath, `${JSON.stringify(rules, null, 2)}\n`, "utf8");
  process.stdout.write(`Extraídas regras de ${rules.length} cursos em: ${outputPath}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
