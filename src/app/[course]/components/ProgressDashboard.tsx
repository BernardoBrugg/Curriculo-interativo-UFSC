"use client";

import { ReactNode, useMemo } from "react";
import { calculateCurriculumProgress } from "../../../lib/curriculum-progress";
import { CourseStatus, CurriculumData } from "@/types/curriculum";
import { RequirementProgress } from "./RequirementProgress";

interface ProgressDashboardProps {
  curriculum: CurriculumData;
  statuses: Record<string, CourseStatus>;
  requirementHours: Record<string, number>;
  onRequirementHoursChange: (sourceId: string, hours: number) => void;
  onReset: () => void;
  onOpenCagrImport?: () => void;
  searchSlot: ReactNode;
}

const statusLegend = [
  ["bg-emerald-500", "Concluida"],
  ["bg-amber-500", "Cursando"],
  ["bg-[var(--accent)]", "Liberada"],
  ["bg-slate-400", "Trancada"],
];

export function ProgressDashboard({
  curriculum,
  statuses,
  requirementHours,
  onRequirementHoursChange,
  onReset,
  onOpenCagrImport,
  searchSlot,
}: ProgressDashboardProps) {
  const stats = useMemo(
    () => calculateCurriculumProgress({ curriculum, statuses, requirementHours }),
    [curriculum, requirementHours, statuses]
  );

  const inProgressCoursesList = useMemo(
    () => curriculum.courses.filter((course) => statuses[course.id] === "in-progress"),
    [curriculum.courses, statuses]
  );
  const inProgressCredits = useMemo(
    () => inProgressCoursesList.reduce((sum, course) => sum + course.credits, 0),
    [inProgressCoursesList]
  );
  const inProgressHours = useMemo(
    () => inProgressCoursesList.reduce((sum, course) => sum + course.hours, 0),
    [inProgressCoursesList]
  );

  return (
    <section className="glass-surface w-full min-w-0 max-w-full rounded-3xl p-3 sm:p-4">
      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(260px,1fr)_minmax(320px,440px)] xl:items-start">
        <div className="grid min-w-0 gap-3 md:grid-cols-[1.05fr_1fr]">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
              Progresso do curso
            </p>
            <div className="mt-1.5 flex items-end gap-3">
              <span className="text-3xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-4xl">
                {stats.percent}%
              </span>
              <span className="pb-1 text-sm text-[var(--text-muted)]">
                {stats.completedHours}h de {stats.totalHours}h
              </span>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[var(--accent-soft)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-3 gap-2">
            <div className="glass-card min-w-0 rounded-2xl p-2.5">
              <p className="text-xl font-semibold text-[var(--text-strong)]">{stats.completedCourses}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">Concluidas</p>
            </div>
            <div className="glass-card min-w-0 rounded-2xl p-2.5">
              <p className="text-xl font-semibold text-[var(--text-strong)]">{stats.inProgressCourses}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">Cursando</p>
            </div>
            <div className="glass-card min-w-0 rounded-2xl p-2.5">
              <p className="text-xl font-semibold text-[var(--text-strong)]">{curriculum.courses.length}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">Disciplinas</p>
            </div>
          </div>
          {inProgressCoursesList.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-700">
              <span className="font-semibold">
                Semestre atual: {inProgressCoursesList.length} disc • {inProgressCredits} cr • {inProgressHours}h
              </span>
              {inProgressCredits > 28 && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Acima de 28 cr recomendados
                </span>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex flex-col gap-3">
          {searchSlot}
          <div className="grid grid-cols-2 gap-2 text-xs sm:flex sm:flex-wrap sm:items-center">
            {statusLegend.map(([dot, label]) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-muted)] px-2 py-1 text-[var(--text-muted)] backdrop-blur"
              >
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
            {onOpenCagrImport && (
              <button
                type="button"
                onClick={onOpenCagrImport}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] shadow-sm transition hover:bg-[var(--accent)] hover:text-[var(--on-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] sm:ml-auto"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Importar CAGR
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (confirm("Tem certeza que deseja limpar toda a selecao de disciplinas?")) {
                  onReset();
                }
              }}
              className="col-span-2 justify-self-start rounded-full border border-[var(--glass-border)] bg-[var(--text-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--bg-base)] shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              Limpar selecao
            </button>
          </div>
        </div>
      </div>
      {curriculum.completion && curriculum.completion.requirements.length > 0 && (
        <RequirementProgress
          requirements={curriculum.completion.requirements}
          progress={stats.requirements}
          requirementHours={requirementHours}
          onRequirementHoursChange={onRequirementHoursChange}
        />
      )}
    </section>
  );
}
