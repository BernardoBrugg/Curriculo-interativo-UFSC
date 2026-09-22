import { assertValidCurriculum } from "@/lib/curriculum-validation";
import { CurriculumData } from "@/types/curriculum";
import data from "./curriculum.json";

export const curriculum = assertValidCurriculum("ciencia-de-dados", data as CurriculumData);
