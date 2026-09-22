"use client";

export type CurriculumFilter = "all" | "available" | "in-progress" | "pending" | "completed" | "mandatory" | "elective";

interface CurriculumFiltersProps {
  activeFilter: CurriculumFilter;
  onFilterChange: (filter: CurriculumFilter) => void;
  counts: Record<CurriculumFilter, number>;
}

const filterConfig: { id: CurriculumFilter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "available", label: "Liberadas" },
  { id: "in-progress", label: "Cursando" },
  { id: "pending", label: "Pendentes" },
  { id: "completed", label: "Concluídas" },
  { id: "mandatory", label: "Obrigatórias" },
  { id: "elective", label: "Optativas" },
];

export function CurriculumFilters({ activeFilter, onFilterChange, counts }: CurriculumFiltersProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
      {filterConfig.map((item) => {
        const isActive = activeFilter === item.id;
        const count = counts[item.id] ?? 0;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onFilterChange(item.id)}
            className={`whitespace-nowrap inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition active:scale-95 ${
              isActive
                ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                : "border border-[var(--glass-border)] bg-[var(--glass-muted)] text-[var(--text-muted)] hover:bg-[var(--glass-strong)] hover:text-[var(--text-strong)]"
            }`}
          >
            <span>{item.label}</span>
            <span
              className={`rounded-full px-1 text-[10px] ${
                isActive ? "bg-black/20 text-white" : "bg-[var(--glass-border)] text-[var(--text-faint)]"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
