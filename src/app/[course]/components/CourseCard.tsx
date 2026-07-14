"use client";

import { useDraggable } from "@dnd-kit/core";
import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Course } from "@/types/curriculum";
import { getCoursePopoverData } from "@/lib/course-popover";
import { getCoursePopoverPosition } from "@/lib/course-popover-position";

interface CourseCardProps {
  course: Course;
  allCourses: Course[];
  computedState: "completed" | "in-progress" | "available" | "blocked";
  isSelected: boolean;
  isPrereq: boolean;
  isDependent: boolean;
  isFilteredOut: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isOverlay?: boolean;
}

export function CourseCard({
  course,
  allCourses,
  computedState,
  isSelected,
  isPrereq,
  isDependent,
  isFilteredOut,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isOverlay = false,
}: CourseCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ left: number; top: number } | null>(null);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({
    id: course.id,
    data: { course },
  });

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
  const popoverData = useMemo(() => getCoursePopoverData(course, allCourses), [allCourses, course]);

  let relationshipClass = "";
  if (isSelected) relationshipClass = "z-10 ring-2 ring-[var(--text-strong)]";
  else if (isPrereq) relationshipClass = "z-10 ring-2 ring-[var(--accent)]";
  else if (isDependent) relationshipClass = "z-10 ring-2 ring-[var(--accent-2)]";

  let visibilityClass = "opacity-100";
  if (isFilteredOut) visibilityClass = "opacity-25 grayscale";
  else if (computedState === "blocked") visibilityClass = "opacity-70 hover:opacity-95";

  if (isDragging && !isOverlay) visibilityClass += " opacity-0";

  const handleClick = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    onClick();
  };

  const updatePopoverPosition = useCallback(() => {
    if (!cardRef.current || typeof window === "undefined") return;
    const rect = cardRef.current.getBoundingClientRect();
    setPopoverPosition(getCoursePopoverPosition(rect, { width: window.innerWidth, height: window.innerHeight }));
  }, []);

  const handleMouseEnter = () => {
    updatePopoverPosition();
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setPopoverPosition(null);
    onMouseLeave();
  };

  const setCardRefs = useCallback(
    (node: HTMLDivElement | null) => {
      cardRef.current = node;
      if (!isOverlay) setNodeRef(node);
    },
    [isOverlay, setNodeRef]
  );

  const popover = !isOverlay && popoverPosition && typeof document !== "undefined" ? createPortal(
    <div role="tooltip" className="pointer-events-none fixed z-[80] w-72 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-4 text-left shadow-2xl backdrop-blur-xl" style={popoverPosition}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]">Detalhes da disciplina</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-[var(--glass-muted)] px-2.5 py-2">
          <dt className="text-[var(--text-faint)]">Tipo</dt>
          <dd className="mt-0.5 font-semibold text-[var(--text-strong)]">{popoverData.typeLabel}</dd>
        </div>
        <div className="rounded-lg bg-[var(--glass-muted)] px-2.5 py-2">
          <dt className="text-[var(--text-faint)]">Carga</dt>
          <dd className="mt-0.5 font-semibold text-[var(--text-strong)]">{popoverData.creditsLabel}</dd>
        </div>
      </dl>
      <PopoverList label="Necessárias antes" items={popoverData.prerequisites} />
      <PopoverList label="Desbloqueia" items={popoverData.dependents} />
      <p className="mt-3 border-t border-[var(--glass-border)] pt-3 text-xs font-semibold leading-5 text-[var(--text-muted)]">{popoverData.dragInstruction}</p>
    </div>,
    document.body
  ) : null;

  return (
    <div
      ref={setCardRefs}
      id={isOverlay ? undefined : `course-${course.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className={`group/card relative min-h-[82px] w-full rounded-2xl border p-2.5 text-left shadow-sm backdrop-blur transition-all duration-200 hover:z-50 hover:bg-[var(--glass-strong)] hover:shadow-[var(--shadow-card)] focus-within:z-50 ${statusMeta.card} ${relationshipClass} ${visibilityClass} ${isDragging && !isOverlay ? "z-50 scale-[1.03] shadow-2xl" : ""} ${isOverlay ? "w-[260px] cursor-grabbing shadow-2xl" : ""}`}
    >
      <span className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${typeMeta.accent}`} />
      <button type="button" onClick={handleClick} className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
      <div className="flex items-start justify-between gap-2 pl-2 pr-7">
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
      <div className="mt-1.5 flex items-center justify-between gap-2 pl-2 pr-1">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${statusMeta.text}`}>
          <span className={`h-2 w-2 rounded-full ${statusMeta.accent}`} />
          {statusMeta.label}
        </span>
        <span className="text-[10px] font-semibold text-[var(--text-faint)] flex items-center gap-1">
          {typeMeta.label}
          <svg className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </span>
      </div>
      </button>
      {popover}
      {!isOverlay && <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={`Arrastar ${course.name} para outro semestre`}
          title="Arrastar disciplina"
          data-drag-handle="true"
          {...attributes}
          {...listeners}
          className="absolute right-1.5 top-1/2 flex h-9 w-7 -translate-y-1/2 touch-none items-center justify-center rounded-lg text-[var(--text-faint)] opacity-75 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <span aria-hidden="true" className="grid grid-cols-2 gap-1">
            {Array.from({ length: 6 }, (_, index) => <span key={index} className="h-1 w-1 rounded-full bg-current" />)}
          </span>
        </button>}
    </div>
  );
}

function PopoverList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-faint)]">{label}</p>
      {items.length > 0 ? <ul className="mt-1 space-y-1 text-xs text-[var(--text-muted)]">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-1 text-xs text-[var(--text-muted)]">Nenhuma</p>}
    </div>
  );
}
