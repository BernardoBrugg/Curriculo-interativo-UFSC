import { CurriculumRequirement } from "@/types/curriculum";
import { RequirementProgress as RequirementProgressData } from "@/lib/curriculum-progress";

interface RequirementProgressProps {
  requirements: CurriculumRequirement[];
  progress: RequirementProgressData[];
  requirementHours: Record<string, number>;
  onRequirementHoursChange: (sourceId: string, hours: number) => void;
}

export function RequirementProgress({ requirements, progress, requirementHours, onRequirementHoursChange }: RequirementProgressProps) {
  const progressById = new Map(progress.map((item) => [item.id, item]));

  return (
    <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {requirements.map((requirement) => {
        const item = progressById.get(requirement.id);
        const manualSources = requirement.sources.filter((source) => source.allowsManualHours);
        return (
          <div key={requirement.id} className="glass-card rounded-2xl p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-[var(--text-strong)]">{requirement.name}</p>
              <span className="whitespace-nowrap text-xs text-[var(--text-muted)]">{item?.completedHours ?? 0}h de {requirement.requiredHours}h</span>
            </div>
            {manualSources.map((source) => (
              <label key={source.id} className="mt-2 flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                {source.manualLabel ?? "Horas validadas externamente"}
                <input
                  type="number"
                  min={0}
                  max={source.maxHours ?? requirement.requiredHours}
                  step={1}
                  value={requirementHours[source.id] ?? 0}
                  onChange={(event) => onRequirementHoursChange(source.id, Math.min(source.maxHours ?? requirement.requiredHours, Math.max(0, Number(event.target.value) || 0)))}
                  className="w-20 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-muted)] px-2 py-1 text-right text-[var(--text-strong)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
}
