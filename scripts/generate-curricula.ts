import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { CurriculumData } from "../src/types/curriculum";
import { getCurriculumDefinition } from "./definitions";
import { ExtractedCurriculumRule } from "./extract-curriculum-rules";
import { parseCagrCurriculum } from "./lib/cagr-curriculum-parser";

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
const sourceDirectory = resolve(root, "data/curricula/sources");
const rulesExtractedPath = resolve(root, "data/curricula/rules-extracted.json");

function parseCourseFilter(): string | undefined {
  const arg = process.argv.find((item) => item.startsWith("--course="));
  return arg ? arg.split("=")[1]?.trim().toLowerCase() : undefined;
}

function phasesFor(courses: CurriculumData["courses"]): CurriculumData["phases"] {
  const phases = [...new Set(courses.map((course) => course.phase))].sort((left, right) => left - right);
  return phases.map((number) => ({ number, name: number === 0 ? "Optativas e outros componentes" : `${number}ª Fase` }));
}

async function generate(source: ManifestSource, capturedAt: string, rulesMap: Map<string, ExtractedCurriculumRule>): Promise<void> {
  const rule = rulesMap.get(source.id);
  const definition = getCurriculumDefinition(source.id, rule);
  const baseName = `${source.id}-${source.curriculumCode}`;
  const textPath = resolve(sourceDirectory, `${baseName}.txt`);
  const pdfPath = resolve(sourceDirectory, `${baseName}.pdf`);
  const [text, pdf] = await Promise.all([readFile(textPath, "utf8"), readFile(pdfPath)]);
  const hash = createHash("sha256").update(pdf).digest("hex");
  if (hash !== source.sha256) throw new Error(`Hash divergente para ${baseName}.pdf`);

  const courses = parseCagrCurriculum(text).courses;
  const curriculum: CurriculumData = {
    program: definition.program,
    institution: "Universidade Federal de Santa Catarina",
    version: definition.version,
    totalHours: definition.totalHours,
    phases: phasesFor(courses),
    courses,
    completion: definition.completion(text, courses),
    source: {
      kind: "official-cagr-report",
      courseCode: source.courseCode,
      curriculumCode: source.curriculumCode,
      url: source.url,
      sha256: source.sha256,
      capturedAt,
    },
  };

  const output = resolve(root, `src/data/curricula/${source.id}/curriculum.json`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(curriculum, null, 2)}\n`, "utf8");
  process.stdout.write(`${source.id}: ${courses.length} componentes, ${definition.totalHours} h\n`);
}

async function main(): Promise<void> {
  const manifest = JSON.parse(await readFile(resolve(sourceDirectory, "manifest.json"), "utf8")) as Manifest;
  let rulesList: ExtractedCurriculumRule[] = [];
  try {
    rulesList = JSON.parse(await readFile(rulesExtractedPath, "utf8"));
  } catch {
    rulesList = [];
  }
  const rulesMap = new Map<string, ExtractedCurriculumRule>(rulesList.map((r) => [r.id, r]));

  const courseFilter = parseCourseFilter();
  const sources = courseFilter
    ? manifest.sources.filter((s) => s.id === courseFilter || s.courseCode === courseFilter)
    : manifest.sources;

  if (sources.length === 0) {
    process.stdout.write("Nenhum curso encontrado para os filtros informados.\n");
    return;
  }

  process.stdout.write(`Iniciando geracao de ${sources.length} curriculos...\n`);
  for (const source of sources) {
    await generate(source, manifest.capturedAt, rulesMap);
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
