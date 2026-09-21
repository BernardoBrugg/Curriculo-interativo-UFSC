import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { CurriculumCompletion, CurriculumData, CurriculumRequirement, CurriculumRequirementSource } from "../src/types/curriculum";
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

interface CurriculumDefinition {
  program: string;
  version: string;
  totalHours: number;
  completion: (text: string, courses: CurriculumData["courses"]) => CurriculumCompletion;
}

const root = resolve(process.cwd());
const sourceDirectory = resolve(root, "data/curricula/sources");

function courseIdsBetween(text: string, startMarker: string, endMarker?: string): string[] {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line.includes(startMarker));
  if (start < 0) throw new Error(`Seção não encontrada: ${startMarker}`);
  const relativeEnd = endMarker ? lines.slice(start + 1).findIndex((line) => line.includes(endMarker)) : -1;
  const end = relativeEnd >= 0 ? start + relativeEnd + 1 : lines.length;
  return [...new Set(lines.slice(start + 1, end).flatMap((line) => line.match(/^\s{3,10}([A-Z]{3}\d{4})\s+/)?.[1] ?? []))];
}

function catalogueSource(id: string, courseIds: string[], maxHours?: number, hoursField?: CurriculumRequirementSource["hoursField"]): CurriculumRequirementSource {
  return { id, courseIds, allowsManualHours: false, ...(maxHours === undefined ? {} : { maxHours }), ...(hoursField === undefined ? {} : { hoursField }) };
}

function manualSource(id: string, maxHours?: number, manualLabel?: string): CurriculumRequirementSource {
  return { id, courseIds: [], allowsManualHours: true, ...(maxHours === undefined ? {} : { maxHours }), ...(manualLabel === undefined ? {} : { manualLabel }) };
}

function requirement(id: string, name: string, requiredHours: number, sources: CurriculumRequirementSource[]): CurriculumRequirement {
  return { id, name, requiredHours, sources };
}

function idsByType(courses: CurriculumData["courses"], type: "Ob" | "Op"): string[] {
  return courses.filter((course) => course.type === type).map((course) => course.id);
}

function without(ids: string[], excluded: string[]): string[] {
  const excludedSet = new Set(excluded);
  return ids.filter((id) => !excludedSet.has(id));
}

function known(ids: string[], courses: CurriculumData["courses"]): string[] {
  const available = new Set(courses.map((course) => course.id));
  return ids.filter((id) => available.has(id));
}

const definitions: Record<string, CurriculumDefinition> = {
  automacao: {
    program: "Engenharia de Controle e Automação",
    version: "Matriz 2024.1",
    totalHours: 4464,
    completion: (text, courses) => {
      const free = [
        ...known(courseIdsBetween(text, "Rol de Disciplinas Optativas Livres", "Rol de Atividades Complementares"), courses),
        ...known(courseIdsBetween(text, "Rol de Atividades Complementares", "Rol de Ações de Extensão"), courses),
      ];
      const professional = without(known(courseIdsBetween(text, "Rol de Disciplinas Optativas Profissionalizantes", "Rol de Disciplinas Optativas Livres"), courses), free);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("professional-electives", "Optativas profissionalizantes", 432, [catalogueSource("professional-electives-catalogue", professional)]),
          requirement("free-electives", "Optativas livres ou atividades complementares", 36, [catalogueSource("free-electives-catalogue", free), manualSource("free-electives-external", 36)]),
        ],
      };
    },
  },
  civil: {
    program: "Engenharia Civil",
    version: "Matriz 2020.1",
    totalHours: 4518,
    completion: (text, courses) => {
      const complementary = known(courseIdsBetween(text, "Atividades Complementares", "Disciplinas Optativas"), courses);
      const electives = without(idsByType(courses, "Op"), complementary);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [requirement("electives", "Disciplinas optativas e atividades complementares", 432, [catalogueSource("electives-catalogue", electives), catalogueSource("complementary-activities", complementary, 54)])],
      };
    },
  },
  eletrica: {
    program: "Engenharia Elétrica",
    version: "Matriz 2005.1",
    totalHours: 4446,
    completion: (text, courses) => {
      const project = courses.filter((course) => course.type === "Ob" && course.phase === 0 && course.name.startsWith("Projeto")).map((course) => course.id);
      const internship = ["EEL7830", "EEL7871", "EEL7872"];
      const area = known(courseIdsBetween(text, "Optativas da Área de Especialização em Sistemas de Energia", "Atividades Complementares"), courses).filter((id) => courses.find((course) => course.id === id)?.type === "Op");
      const complementary = known(courseIdsBetween(text, "Atividades Complementares"), courses).filter((id) => courses.find((course) => course.id === id)?.type === "Op");
      const remaining = without(idsByType(courses, "Op"), [...area, ...complementary]);
      return {
        requiredCourseIds: without(idsByType(courses, "Ob"), [...project, ...internship]),
        requirements: [
          requirement("graduation-project", "Projeto de conclusão de curso", 216, [catalogueSource("graduation-project-options", project, 216)]),
          requirement("internship", "Estágio curricular", 360, [catalogueSource("internship-options", internship, 360)]),
          requirement("electives", "Disciplinas optativas", 432, [catalogueSource("professional-area-electives", area), catalogueSource("other-electives", remaining, 144), catalogueSource("complementary-activities", complementary, 144), manualSource("external-free-electives", 144)]),
        ],
      };
    },
  },
  eletronica: {
    program: "Engenharia Eletrônica",
    version: "Matriz 2009.2",
    totalHours: 4644,
    completion: (text, courses) => {
      const internship = ["EEL7901", "EEL7902", "EEL7903"];
      const professional = known(courseIdsBetween(text, "Optativas Profissionalizantes - Sistemas Eletrônicos", "Optativas Gerais"), courses);
      const general = without(known(courseIdsBetween(text, "Optativas Gerais", "Estágio Curricular"), courses), internship);
      const complementary = known(courseIdsBetween(text, "ATIVIDADES COMPLEMENTARES", "5ª Fase"), courses);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("internship", "Estágio curricular", 360, [catalogueSource("internship-options", internship, 360)]),
          requirement("electives", "Disciplinas optativas", 720, [
            catalogueSource("professional-electives", professional),
            catalogueSource("general-electives", [...general, ...complementary], 144),
            manualSource("external-free-electives", 144),
          ]),
          requirement("mandatory-hours-adjustment", "Carga obrigatória adicional da Portaria nº 148/2025/PROGRAD", 144, [manualSource("mandatory-hours-adjustment", 144, "Horas obrigatórias adicionais concluídas")]),
        ],
      };
    },
  },
  materiais: {
    program: "Engenharia de Materiais",
    version: "Matriz 2001.1",
    totalHours: 4344,
    completion: (_text, courses) => ({
      requiredCourseIds: without(idsByType(courses, "Ob"), ["EMC5728"]),
      requirements: [requirement("electives", "Disciplinas optativas", 198, [catalogueSource("electives-catalogue", idsByType(courses, "Op")), manualSource("external-electives", 54)])],
    }),
  },
  mecanica: {
    program: "Engenharia Mecânica",
    version: "Matriz 2025.1",
    totalHours: 4608,
    completion: (text, courses) => {
      const special = known([
        ...courseIdsBetween(text, "Rol de Disciplinas Optativas do Bloco Especial", "Rol de Disciplinas Optativas de Pós-Graduação"),
        ...courseIdsBetween(text, "Rol de Atividades Complementares", "Rol de Ações de Extensão"),
      ], courses);
      const electives = without(idsByType(courses, "Op"), ["EMC7000", ...special]);
      return {
        requiredCourseIds: [...idsByType(courses, "Ob"), "EMC7000"],
        requirements: [requirement("electives", "Disciplinas optativas", 288, [catalogueSource("electives-catalogue", electives), catalogueSource("special-topics-and-activities", special, 72)])],
      };
    },
  },
  producao: {
    program: "Engenharia de Produção",
    version: "Matriz 2023.1",
    totalHours: 4320,
    completion: (text, courses) => {
      const area = known(courseIdsBetween(text, "Disciplinas Optativas da Área de Engenharia de Produção", "Disciplinas Optativas Gerais"), courses);
      const free = without(idsByType(courses, "Op"), area);
      const extension = courses.filter((course) => course.type === "Op" && (course.extensionHours ?? 0) > 0).map((course) => course.id);
      return {
        requiredCourseIds: idsByType(courses, "Ob"),
        requirements: [
          requirement("electives", "Disciplinas optativas", 378, [catalogueSource("production-area-electives", area, undefined, "nonExtension"), catalogueSource("free-electives", free, 54, "nonExtension"), manualSource("external-free-electives", 54)]),
          requirement("extension", "Extensão optativa ou ações de extensão", 54, [catalogueSource("optional-extension-hours", extension, 54, "extension")]),
        ],
      };
    },
  },
  quimica: {
    program: "Engenharia Química",
    version: "Matriz 1991.1",
    totalHours: 4374,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [requirement("electives", "Disciplinas optativas", 216, [catalogueSource("electives-catalogue", idsByType(courses, "Op")), manualSource("free-electives", 54)])],
    }),
  },
  sanitaria: {
    program: "Engenharia Sanitária e Ambiental",
    version: "Matriz 2015.1",
    totalHours: 4518,
    completion: (_text, courses) => ({
      requiredCourseIds: idsByType(courses, "Ob"),
      requirements: [requirement("electives", "Disciplinas optativas", 162, [catalogueSource("recommended-electives", idsByType(courses, "Op")), manualSource("free-electives", 54)])],
    }),
  },
};

function phasesFor(courses: CurriculumData["courses"]): CurriculumData["phases"] {
  const phases = [...new Set(courses.map((course) => course.phase))].sort((left, right) => left - right);
  return phases.map((number) => ({ number, name: number === 0 ? "Optativas e outros componentes" : `${number}ª Fase` }));
}

async function generate(source: ManifestSource, capturedAt: string): Promise<void> {
  const definition = definitions[source.id];
  if (!definition) throw new Error(`Curso sem definição: ${source.id}`);
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
  for (const source of manifest.sources) await generate(source, manifest.capturedAt);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
