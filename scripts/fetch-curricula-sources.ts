import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:path/posix";
import { promisify as utilPromisify } from "node:util";

const execFileAsync = utilPromisify(execFile);

interface CatalogCourse {
  id: string;
  courseCode: string;
  courseName: string;
  campus: string;
  latestCurriculumCode: string;
  availableCurriculumCodes: string[];
  url: string;
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
const catalogPath = resolve(root, "data/curricula/catalog.json");
const manifestPath = resolve(root, "data/curricula/sources/manifest.json");
const sourcesDir = resolve(root, "data/curricula/sources");

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function convertPdfToText(pdfPath: string, txtPath: string): Promise<void> {
  await execFileAsync("pdftotext", ["-layout", pdfPath, txtPath]);
}

async function downloadPdf(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });
  if (!response.ok) throw new Error(`Falha no download HTTP ${response.status} para ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function parseCourseFilter(): string | undefined {
  const arg = process.argv.find((item) => item.startsWith("--course="));
  return arg ? arg.split("=")[1]?.trim().toLowerCase() : undefined;
}

function parseCampusFilter(): string | undefined {
  const arg = process.argv.find((item) => item.startsWith("--campus="));
  return arg ? arg.split("=")[1]?.trim().toLowerCase() : undefined;
}

async function main(): Promise<void> {
  const [catalogRaw, manifestRaw] = await Promise.all([
    readFile(catalogPath, "utf8"),
    readFile(manifestPath, "utf8"),
  ]);

  const catalog: CatalogCourse[] = JSON.parse(catalogRaw);
  const manifest: Manifest = JSON.parse(manifestRaw);
  const sourcesMap = new Map<string, ManifestSource>(manifest.sources.map((s) => [s.id, s]));

  const courseFilter = parseCourseFilter();
  const campusFilter = parseCampusFilter();

  const filteredCatalog = catalog.filter((course) => {
    if (courseFilter && !course.id.includes(courseFilter) && !course.courseCode.includes(courseFilter)) {
      return false;
    }
    if (campusFilter && !course.campus.toLowerCase().includes(campusFilter)) {
      return false;
    }
    return true;
  });

  process.stdout.write(`Processando ${filteredCatalog.length} cursos do catalogo...\n`);

  for (const course of filteredCatalog) {
    const baseName = `${course.id}-${course.latestCurriculumCode}`;
    const pdfPath = resolve(sourcesDir, `${baseName}.pdf`);
    const txtPath = resolve(sourcesDir, `${baseName}.txt`);

    const pdfAlreadyExists = await fileExists(pdfPath);
    const txtAlreadyExists = await fileExists(txtPath);

    let pdfBuffer: Buffer;
    let sha256: string;

    if (pdfAlreadyExists) {
      pdfBuffer = await readFile(pdfPath);
      sha256 = createHash("sha256").update(pdfBuffer).digest("hex");
    } else {
      process.stdout.write(`  Baixando ${course.courseName} [${course.id}]...\n`);
      pdfBuffer = await downloadPdf(course.url);
      sha256 = createHash("sha256").update(pdfBuffer).digest("hex");
      await writeFile(pdfPath, pdfBuffer);
    }

    if (!txtAlreadyExists || !pdfAlreadyExists) {
      process.stdout.write(`  Convertendo para texto: ${baseName}.txt\n`);
      await convertPdfToText(pdfPath, txtPath);
    }

    sourcesMap.set(course.id, {
      id: course.id,
      courseCode: course.courseCode,
      curriculumCode: course.latestCurriculumCode,
      url: course.url,
      sha256,
    });
  }

  const updatedSources = Array.from(sourcesMap.values()).sort((a, b) => a.id.localeCompare(b.id, "pt-BR"));
  const updatedManifest: Manifest = {
    capturedAt: new Date().toISOString().split("T")[0],
    sources: updatedSources,
  };

  await writeFile(manifestPath, `${JSON.stringify(updatedManifest, null, 2)}\n`, "utf8");
  process.stdout.write(`\nManifesto atualizado com ${updatedSources.length} cursos em ${manifestPath}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
