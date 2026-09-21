import { assertValidCurriculum } from "@/lib/curriculum-validation";
import { CurriculumData } from "@/types/curriculum";
import data from "./curriculum.json";

export const curriculumElétrica = assertValidCurriculum("eletrica", data as CurriculumData);
