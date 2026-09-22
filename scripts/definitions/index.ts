import { ExtractedCurriculumRule } from "../extract-curriculum-rules";
import { araranguaDefinitions } from "./ararangua";
import { blumenauDefinitions } from "./blumenau";
import { ctcDefinitions } from "./ctc-trindade";
import { curitibanosDefinitions } from "./curitibanos";
import { buildDefaultDefinition } from "./defaults";
import { florianopolisOutrosDefinitions } from "./florianopolis-outros";
import { joinvilleDefinitions } from "./joinville";
import { CurriculumDefinition } from "./types";

export * from "./types";

const specializedRegistry: Record<string, CurriculumDefinition> = {
  ...ctcDefinitions,
  ...joinvilleDefinitions,
  ...blumenauDefinitions,
  ...araranguaDefinitions,
  ...curitibanosDefinitions,
  ...florianopolisOutrosDefinitions,
};

export function getCurriculumDefinition(id: string, rule?: ExtractedCurriculumRule): CurriculumDefinition {
  const specialized = specializedRegistry[id];
  if (specialized) return specialized;
  if (!rule) throw new Error(`Sem definicao especializada nem regra extraida para o curso: ${id}`);
  return buildDefaultDefinition(rule);
}

export function hasSpecializedDefinition(id: string): boolean {
  return Boolean(specializedRegistry[id]);
}
