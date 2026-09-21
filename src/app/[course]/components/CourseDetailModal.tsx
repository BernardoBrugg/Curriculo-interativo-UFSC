"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Course, CourseStatus, PhaseInfo } from "@/types/curriculum";

interface CourseDetailModalProps {
  course: Course | null;
  allCourses: Course[];
  statuses: Record<string, CourseStatus>;
  customPhases: Record<string, number>;
  isBlocked: boolean;
  onClose: () => void;
  onToggleStatus: (courseId: string) => void;
  onSetStatus?: (courseId: string, status: CourseStatus) => void;
  onMovePhase: (courseId: string, toPhase: number) => void;
  phases: PhaseInfo[];
}

export function CourseDetailModal({
  course,
  allCourses,
  statuses,
  customPhases,
  isBlocked,
  onClose,
  onToggleStatus,
  onSetStatus,
  onMovePhase,
  phases,
}: CourseDetailModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!course) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [course, onClose]);

  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    allCourses.forEach((c) => map.set(c.id, c));
    return map;
  }, [allCourses]);

  const currentPhaseNumber = useMemo(() => {
    if (!course) return 1;
    return customPhases[course.id] ?? course.phase;
  }, [course, customPhases]);

  const currentStatus: CourseStatus = course ? statuses[course.id] ?? "pending" : "pending";

  const dependents = useMemo(() => {
    if (!course) return [];
    return allCourses.filter((c) => c.prerequisites.includes(course.id));
  }, [allCourses, course]);

  const handleStatusSelect = useCallback(
    (targetStatus: CourseStatus) => {
      if (!course) return;
      if (isBlocked && targetStatus !== "pending") return;
      if (onSetStatus) {
        onSetStatus(course.id, targetStatus);
      } else {
        onToggleStatus(course.id);
      }
    },
    [course, isBlocked, onSetStatus, onToggleStatus]
  );

  const handlePhaseChange = useCallback(
    (phaseNumber: number) => {
      if (!course) return;
      onMovePhase(course.id, phaseNumber);
    },
    [course, onMovePhase]
  );

  if (!course) return null;

  const typeLabels = {
    Ob: "Obrigatória",
    Op: "Optativa do curso",
    FreeOp: "Optativa livre",
  };

  const statusLabels: Record<CourseStatus, { label: string; bg: string; text: string }> = {
    completed: { label: "Concluída", bg: "bg-emerald-500", text: "text-emerald-700" },
    "in-progress": { label: "Cursando", bg: "bg-amber-500", text: "text-amber-700" },
    pending: { label: "Pendente", bg: "bg-slate-400", text: "text-[var(--text-muted)]" },
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-course-title"
      className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-3xl border border-[var(--glass-border)] bg-[var(--bg-base)] p-5 shadow-2xl backdrop-blur-2xl sm:max-h-[88vh] sm:rounded-3xl sm:p-6 overflow-hidden">
        <div className="mx-auto mb-2 h-1.5 w-12 shrink-0 rounded-full bg-[var(--glass-border)] sm:hidden" />

        <div className="flex items-start justify-between gap-3 border-b border-[var(--glass-border)] pb-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-wider text-[var(--accent)]">
                {course.code}
              </span>
              <span className="rounded-full bg-[var(--glass-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
                {typeLabels[course.type]}
              </span>
              <span className="rounded-full bg-[var(--glass-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
                {course.credits} cr • {course.hours}h
              </span>
              {course.extensionHours && (
                <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent-2)]">
                  Ext: {course.extensionHours}h
                </span>
              )}
            </div>
            <h2 id="modal-course-title" className="mt-1.5 text-base font-bold leading-tight text-[var(--text-strong)] sm:text-lg">
              {course.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-muted)] text-[var(--text-muted)] transition hover:bg-[var(--glass-strong)] hover:text-[var(--text-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pt-4 pr-1">
          {isBlocked && (
            <div role="alert" className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-700">
              <p className="font-bold flex items-center gap-1.5">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Pré-requisitos pendentes
              </p>
              <p className="mt-1 text-amber-600">
                Esta disciplina possui pré-requisitos não concluídos. Conclua os pré-requisitos antes para liberá-la.
              </p>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
              Status da disciplina
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["pending", "in-progress", "completed"] as const).map((statusOption) => {
                const isCurrent = currentStatus === statusOption;
                const optionMeta = statusLabels[statusOption];
                const isOptionBlocked = isBlocked && statusOption !== "pending";
                return (
                  <button
                    key={statusOption}
                    type="button"
                    disabled={isOptionBlocked}
                    onClick={() => handleStatusSelect(statusOption)}
                    className={`flex h-11 items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition ${
                      isCurrent
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-strong)] shadow-sm ring-1 ring-[var(--accent)]"
                        : "border-[var(--glass-border)] bg-[var(--glass-muted)] text-[var(--text-muted)] hover:bg-[var(--glass-strong)] hover:text-[var(--text-strong)]"
                    } ${isOptionBlocked ? "opacity-40 cursor-not-allowed" : "active:scale-95"}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${optionMeta.bg}`} />
                    {optionMeta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
              Mover para o semestre
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {phases.map((phase) => {
                const isSelected = currentPhaseNumber === phase.number;
                const label = phase.number === 0 ? "Optativas" : `${phase.number}º Sem`;
                return (
                  <button
                    key={phase.number}
                    type="button"
                    onClick={() => handlePhaseChange(phase.number)}
                    className={`h-9 min-w-[54px] rounded-xl px-2.5 text-xs font-semibold transition active:scale-95 ${
                      isSelected
                        ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-sm"
                        : "border border-[var(--glass-border)] bg-[var(--glass-muted)] text-[var(--text-muted)] hover:bg-[var(--glass-strong)] hover:text-[var(--text-strong)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
              Pré-requisitos ({course.prerequisites.length})
            </p>
            {course.prerequisites.length === 0 ? (
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">Nenhum pré-requisito necessário.</p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {course.prerequisites.map((prereqId) => {
                  const prereq = courseMap.get(prereqId);
                  const isCompleted = statuses[prereqId] === "completed";
                  return (
                    <div
                      key={prereqId}
                      className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass-muted)] px-3 py-2 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-mono font-bold text-[var(--text-strong)]">{prereqId}</span>
                        <p className="truncate text-[var(--text-muted)]">{prereq?.name ?? "Disciplina externa"}</p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-700"
                            : "bg-amber-500/15 text-amber-700"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {isCompleted ? "Cumprido" : "Pendente"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
              Desbloqueia ({dependents.length})
            </p>
            {dependents.length === 0 ? (
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">Não é pré-requisito para outras disciplinas.</p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {dependents.map((dep) => (
                  <div
                    key={dep.id}
                    className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass-muted)] px-3 py-2 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-mono font-bold text-[var(--text-strong)]">{dep.code}</span>
                      <p className="truncate text-[var(--text-muted)]">{dep.name}</p>
                    </div>
                    <span className="rounded-full bg-[var(--glass-strong)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                      {dep.credits} cr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {course.syllabus && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                Ementa
              </p>
              <p className="mt-1.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-3 text-xs leading-relaxed text-[var(--text-muted)]">
                {course.syllabus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isMounted && typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
