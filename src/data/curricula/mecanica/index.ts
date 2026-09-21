import { assertValidCurriculum } from "@/lib/curriculum-validation";
import { CurriculumData } from "@/types/curriculum";
import data from "./curriculum.json";

export const curriculumMecânica = assertValidCurriculum("mecanica", data as CurriculumData);
