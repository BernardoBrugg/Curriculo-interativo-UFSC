import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CagrCatalogEntry } from "./lib/cagr-tree-crawler";

const root = resolve(process.cwd());
const catalogPath = resolve(root, "data/curricula/catalog.json");
const curriculaDir = resolve(root, "src/data/curricula");

function formatVersion(code: string): string {
  if (code.length === 5) return `Matriz ${code.slice(0, 4)}.${code.slice(4)}`;
  return `Matriz ${code}`;
}

function toSafeIdentifier(id: string): string {
  return id.replace(/-/g, "_");
}

async function main(): Promise<void> {
  const catalog: CagrCatalogEntry[] = JSON.parse(await readFile(catalogPath, "utf8"));

  for (const course of catalog) {
    const courseDir = resolve(curriculaDir, course.id);
    await mkdir(courseDir, { recursive: true });

    const indexPath = resolve(courseDir, "index.ts");
    const indexContent = `import { assertValidCurriculum } from "@/lib/curriculum-validation";
import { CurriculumData } from "@/types/curriculum";
import data from "./curriculum.json";

export const curriculum = assertValidCurriculum("${course.id}", data as CurriculumData);
`;
    await writeFile(indexPath, indexContent, "utf8");

    const readmePath = resolve(courseDir, "README.md");
    const readmeContent = `# ${course.courseName} - Campus ${course.campus}

## Responsabilidade do Diretório
Armazena a matriz curricular oficial da graduação em ${course.courseName} da Universidade Federal de Santa Catarina (Campus ${course.campus}), correspondente à ${formatVersion(course.latestCurriculumCode)}.

## Arquitetura
- \`curriculum.json\`: Estrutura canônica tipada conforme \`CurriculumData\` gerada a partir dos relatórios oficiais do CAGR.
- \`index.ts\`: Exportação do currículo validado em tempo de execução via \`assertValidCurriculum\`.
`;
    await writeFile(readmePath, readmeContent, "utf8");
  }

  const importLines = catalog
    .map((course) => `import { curriculum as ${toSafeIdentifier(course.id)} } from "./${course.id}";`)
    .join("\n");

  const registryEntries = catalog
    .map((course) => `  "${course.id}": ${toSafeIdentifier(course.id)},`)
    .join("\n");

  const availableCourseEntries = catalog
    .map(
      (course) =>
        `  { id: "${course.id}", name: "${course.courseName}", description: "${formatVersion(course.latestCurriculumCode)}", campus: "${course.campus}" },`,
    )
    .join("\n");

  const topIndexContent = `import { CurriculumData } from "@/types/curriculum";
${importLines}

export const curriculaRegistry: Record<string, CurriculumData> = {
${registryEntries}
};

export const getCurriculum = (courseId: string): CurriculumData | undefined => {
  return curriculaRegistry[courseId];
};

export interface AvailableCourseItem {
  id: string;
  name: string;
  description: string;
  campus: string;
}

export const availableCourses: AvailableCourseItem[] = [
${availableCourseEntries}
];
`;

  const topIndexPath = resolve(curriculaDir, "index.ts");
  await writeFile(topIndexPath, topIndexContent, "utf8");
  process.stdout.write(`Gerados modulos index.ts, README.md e registry principal para ${catalog.length} cursos.\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
