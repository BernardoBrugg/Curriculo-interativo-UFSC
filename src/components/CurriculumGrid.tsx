"use client";

import { useMemo } from "react";
import { Course, CourseStatus, PhaseInfo } from "@/types/curriculum";
import { CourseCard } from "./CourseCard";

interface CurriculumGridProps {
  phases: PhaseInfo[];
  courses: Course[];
  statuses: Record<string, CourseStatus>;
  selectedId: string | null;
  searchQuery: string;
  prerequisites: Set<string>;
  dependents: Set<string>;
  onSelectCourse: (id: string | null) => void;
  onToggleStatus: (id: string) => void;
}

export function CurriculumGrid({
  phases,
  courses,
  statuses,
  selectedId,
  searchQuery,
  prerequisites,
  dependents,
  onSelectCourse,
  onToggleStatus,
}: CurriculumGridProps) {
  // Group courses by phase
  const coursesByPhase = useMemo(() => {
    const grouped = new Map<number, Course[]>();
    phases.forEach((p) => grouped.set(p.number, []));
    
    courses.forEach((c) => {
      // If course is phase 10 but optative, we put it in phase 10 column
      const phaseNum = Math.min(c.phase, 10);
      if (!grouped.has(phaseNum)) grouped.set(phaseNum, []);
      grouped.get(phaseNum)!.push(c);
    });

    const typeOrder = { Ob: 0, Op: 1, FreeOp: 2 };
    grouped.forEach((list) => {
      list.sort((a, b) => {
        if (a.type !== b.type) return typeOrder[a.type] - typeOrder[b.type];
        return a.name.localeCompare(b.name);
      });
    });

    return grouped;
  }, [phases, courses]);

  // Determine if a course matches the search query
  const searchMatches = useMemo(() => {
    const matches = new Set<string>();
    if (!searchQuery) return matches;
    
    const query = searchQuery.toLowerCase();
    courses.forEach((c) => {
      if (c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)) {
        matches.add(c.id);
      }
    });
    return matches;
  }, [courses, searchQuery]);

  const getPhaseStats = (phaseCourses: Course[]) => {
    const completed = phaseCourses.filter((course) => statuses[course.id] === "completed").length;
    const total = phaseCourses.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percent };
  };

  return (
    <section className="glass-surface w-full min-w-0 max-w-full rounded-3xl">
      <div className="border-b border-[var(--glass-border)] px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-strong)]">Grade curricular</h2>
            <p className="text-sm text-[var(--text-muted)]">
              Selecione uma disciplina para ver relacoes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-1 rounded-sm bg-[var(--color-type-ob)]" />
              Obrigatoria
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-1 rounded-sm bg-[var(--color-type-op)]" />
              Optativa do curso
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-1 rounded-sm bg-[var(--color-type-free-op)]" />
              Optativa livre
            </span>
          </div>
        </div>

        <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
          <div className="glass-card rounded-2xl px-3 py-2">
            <p className="font-semibold text-[var(--text-strong)]">Optativas do curso: minimo 324h-a</p>
            <p className="mt-0.5 text-[var(--text-muted)]">Trilhas GOP/EPP, graduacao ou pos-graduacao.</p>
          </div>
          <div className="glass-card rounded-2xl px-3 py-2">
            <p className="font-semibold text-[var(--text-strong)]">Optativas livres: ate 108h-a</p>
            <p className="mt-0.5 text-[var(--text-muted)]">Disciplinas extracurriculares de qualquer departamento.</p>
          </div>
        </div>
      </div>

      <div className="max-w-full touch-pan-x overflow-x-auto overflow-y-visible overscroll-x-contain pb-4 [scrollbar-gutter:stable]">
        <div className="flex min-w-max gap-3 p-3 pr-6">
          {phases.map((phase) => {
            const phaseCourses = coursesByPhase.get(phase.number) ?? [];
            const phaseStats = getPhaseStats(phaseCourses);

            return (
              <div key={phase.number} className="flex w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-muted)] backdrop-blur">
                <div className="border-b border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-strong)]">Semestre {phase.number}</h3>
                    <span className="rounded-full bg-[var(--accent-soft)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
                      {phaseStats.completed}/{phaseStats.total}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--accent-soft)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
                      style={{ width: `${phaseStats.percent}%` }}
                    />
                  </div>
                </div>

                <div className="relative z-10 flex flex-col gap-2 p-2">
                  {phaseCourses.map((course) => {
                const isSelected = selectedId === course.id;
                const isPrereq = prerequisites.has(course.id);
                const isDependent = dependents.has(course.id);
                const isFilteredOut = searchQuery.length > 0 && !searchMatches.has(course.id);
                const status = statuses[course.id] ?? "pending";
                const isBlocked = course.prerequisites.some((pid) => statuses[pid] !== "completed");
                
                let computedState: "completed" | "in-progress" | "available" | "blocked" = "available";
                if (status === "completed") computedState = "completed";
                else if (status === "in-progress") computedState = "in-progress";
                else if (isBlocked) computedState = "blocked";

                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    computedState={computedState}
                    isSelected={isSelected}
                    isPrereq={isPrereq}
                    isDependent={isDependent}
                    isFilteredOut={isFilteredOut}
                    onClick={() => onToggleStatus(course.id)}
                    onMouseEnter={() => onSelectCourse(course.id)}
                    onMouseLeave={() => onSelectCourse(null)}
                  />
                );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
