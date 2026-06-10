"use client";

import { Course } from "@/types/curriculum";

interface CourseCardProps {
  course: Course;
  computedState: "completed" | "in-progress" | "available" | "blocked";
  isSelected: boolean;
  isPrereq: boolean;
  isDependent: boolean;
  isFilteredOut: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CourseCard({
  course,
  computedState,
  isSelected,
  isPrereq,
  isDependent,
  isFilteredOut,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CourseCardProps) {
  const statusMeta = {
    completed: {
      label: "Concluída",
      code: "OK",
      card: "border-emerald-400/35 bg-emerald-500/12",
      accent: "bg-emerald-500",
      text: "text-emerald-700",
    },
    "in-progress": {
      label: "Cursando",
      code: "IP",
      card: "border-amber-400/35 bg-amber-500/12",
      accent: "bg-amber-500",
      text: "text-amber-700",
    },
    available: {
      label: "Liberada",
      code: "AV",
      card: "border-[var(--glass-border)] bg-[var(--glass-strong)]",
      accent: "bg-[var(--accent)]",
      text: "text-[var(--accent)]",
    },
    blocked: {
      label: "Trancada",
      code: "BL",
      card: "border-[var(--glass-border)] bg-[var(--glass-muted)]",
      accent: "bg-slate-400",
      text: "text-[var(--text-muted)]",
    },
  }[computedState];

  const typeMeta = {
    Ob: {
      accent: "bg-[var(--color-type-ob)]",
      label: "Obrigatória",
    },
    Op: {
      accent: "bg-[var(--color-type-op)]",
      label: "Optativa do curso",
    },
    FreeOp: {
      accent: "bg-[var(--color-type-free-op)]",
      label: "Optativa livre",
    },
  }[course.type];

  let relationshipClass = "";
  if (isSelected) relationshipClass = "z-10 ring-2 ring-[var(--text-strong)]";
  else if (isPrereq) relationshipClass = "z-10 ring-2 ring-[var(--accent)]";
  else if (isDependent) relationshipClass = "z-10 ring-2 ring-[var(--accent-2)]";

  let visibilityClass = "opacity-100";
  if (isFilteredOut) visibilityClass = "opacity-25 grayscale";
  else if (computedState === "blocked") visibilityClass = "opacity-70 hover:opacity-95";

  const handleClick = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    onClick();
  };

  return (
    <button
      id={`course-${course.id}`}
      type="button"
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      className={`relative min-h-[82px] w-full rounded-2xl border p-2.5 text-left shadow-sm backdrop-blur transition-all duration-200 hover:bg-[var(--glass-strong)] hover:shadow-[var(--shadow-card)] active:scale-[0.97] active:opacity-90 active:shadow-inner focus:outline-none ${statusMeta.card} ${relationshipClass} ${visibilityClass}`}
    >
      <span className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${typeMeta.accent}`} />
      <div className="flex items-start justify-between gap-2 pl-2">
        <span className="font-mono text-[11px] font-semibold tracking-wide text-[var(--text-muted)]">
          {course.code}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`inline-flex h-5 items-center rounded-full bg-[var(--glass-muted)] px-1.5 text-[10px] font-semibold ${statusMeta.text}`}>
            {statusMeta.code}
          </span>
          <span className="inline-flex h-5 items-center rounded-full bg-[var(--glass-muted)] px-1.5 text-[10px] font-semibold text-[var(--text-muted)]">
            {course.credits} cr
          </span>
          {course.extensionHours && (
            <span
              className="inline-flex h-5 items-center rounded-full bg-[var(--accent-soft)] px-1.5 text-[10px] font-semibold text-[var(--accent-2)]"
              title="Horas de extensão"
            >
              Ext
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-1.5 line-clamp-2 pl-2 text-[13px] font-semibold leading-snug text-[var(--text-strong)]">
        {course.name}
      </h3>
      <div className="mt-1.5 flex items-center justify-between gap-2 pl-2">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${statusMeta.text}`}>
          <span className={`h-2 w-2 rounded-full ${statusMeta.accent}`} />
          {statusMeta.label}
        </span>
        <span className="text-[10px] font-semibold text-[var(--text-faint)]">
          {typeMeta.label}
        </span>
      </div>
    </button>
  );
}
