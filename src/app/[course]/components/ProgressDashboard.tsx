"use client";

import { ReactNode, useMemo } from "react";
import { Course, CourseStatus } from "@/types/curriculum";

interface ProgressDashboardProps {
  courses: Course[];
  statuses: Record<string, CourseStatus>;
  totalHours: number;
  onReset: () => void;
  searchSlot: ReactNode;
}

const statusLegend = [
  ["bg-emerald-500", "Concluida"],
  ["bg-amber-500", "Cursando"],
  ["bg-[var(--accent)]", "Liberada"],
  ["bg-slate-400", "Trancada"],
];

export function ProgressDashboard({
  courses,
  statuses,
  totalHours,
  onReset,
  searchSlot,
}: ProgressDashboardProps) {
  const stats = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let rawCompletedHours = 0;

    courses.forEach((course) => {
      if (statuses[course.id] === "completed") {
        completed++;
        rawCompletedHours += course.hours;
      } else if (statuses[course.id] === "in-progress") {
        inProgress++;
      }
    });

    const completedHours = Math.min(rawCompletedHours, totalHours);
    const percent = totalHours > 0 ? Math.min(100, Math.round((completedHours / totalHours) * 100)) : 0;

    return { completed, inProgress, total: courses.length, completedHours, totalHours, percent };
  }, [courses, statuses, totalHours]);

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

          <div className="grid min-w-0 grid-cols-1 gap-2 min-[520px]:grid-cols-3">
            <div className="glass-card min-w-0 rounded-2xl p-2.5">
              <p className="text-xl font-semibold text-[var(--text-strong)]">{stats.completed}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">Concluidas</p>
            </div>
            <div className="glass-card min-w-0 rounded-2xl p-2.5">
              <p className="text-xl font-semibold text-[var(--text-strong)]">{stats.inProgress}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">Cursando</p>
            </div>
            <div className="glass-card min-w-0 rounded-2xl p-2.5">
              <p className="text-xl font-semibold text-[var(--text-strong)]">{stats.total}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">Disciplinas</p>
            </div>
          </div>
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
            <button
              type="button"
              onClick={() => {
                if (confirm("Tem certeza que deseja limpar toda a selecao de disciplinas?")) {
                  onReset();
                }
              }}
              className="col-span-2 justify-self-start rounded-full border border-[var(--glass-border)] bg-[var(--text-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--bg-base)] shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] sm:ml-auto"
            >
              Limpar selecao
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
