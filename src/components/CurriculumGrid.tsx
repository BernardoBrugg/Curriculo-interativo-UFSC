"use client";

import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, useDroppable, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Course, CourseStatus, PhaseInfo } from "@/types/curriculum";
import { CourseCard } from "./CourseCard";
import { useDragScroll } from "@/hooks/useDragScroll";
import { useDragTutorial } from "@/hooks/useDragTutorial";

interface CurriculumGridProps {
  phases: PhaseInfo[];
  courses: Course[];
  statuses: Record<string, CourseStatus>;
  selectedId: string | null;
  searchQuery: string;
  prerequisites: Set<string>;
  dependents: Set<string>;
  customPhases: Record<string, number>;
  onSelectCourse: (id: string | null) => void;
  onToggleStatus: (id: string) => void;
  onMoveCourse: (courseId: string, toPhase: number) => void;
}

export function CurriculumGrid({
  phases,
  courses,
  statuses,
  selectedId,
  searchQuery,
  prerequisites,
  dependents,
  customPhases,
  onSelectCourse,
  onToggleStatus,
  onMoveCourse,
}: CurriculumGridProps) {
  const { ref: scrollRef, isDragging, events } = useDragScroll<HTMLDivElement>();
  const { isVisible: isTutorialVisible, dismiss: dismissTutorial } = useDragTutorial();
  const [activeMobilePhase, setActiveMobilePhase] = useState<number>(phases[0]?.number ?? 1);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach((c) => map.set(c.id, c));
    return map;
  }, [courses]);

  const coursesByPhase = useMemo(() => {
    const grouped = new Map<number, Course[]>();
    phases.forEach((p) => grouped.set(p.number, []));
    
    courses.forEach((c) => {
      const targetPhase = customPhases[c.id] ?? c.phase;
      const phaseNum = Math.min(targetPhase, 10);
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
  }, [phases, courses, customPhases]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const courseId = String(active.id);
    const toPhase = Number(over.id);
    onMoveCourse(courseId, toPhase);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <section className="glass-surface w-full min-w-0 max-w-full rounded-3xl">
        <div className="border-b border-[var(--glass-border)] px-4 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-strong)]">Grade curricular</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Arraste disciplinas para organizar seu plano.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-1 rounded-sm bg-[var(--color-type-ob)]" />
                Obrigatória
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
        </div>

        {isTutorialVisible && <aside className="mx-3 mt-3 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-4 text-sm text-[var(--text-muted)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-[var(--text-strong)]">Monte seu currículo</p>
              <p className="mt-1 leading-6">Clique e segure uma disciplina. Arraste até outro semestre e solte. A mudança fica salva automaticamente.</p>
            </div>
            <button type="button" onClick={() => void dismissTutorial()} className="auth-primary shrink-0 rounded-xl px-3 py-2 text-xs font-bold">Entendi</button>
          </div>
        </aside>}

        <div className="md:hidden border-b border-[var(--glass-border)] overflow-x-auto pb-1 pt-2 px-2 flex gap-2 hide-scrollbar">
          {phases.map((phase) => (
            <button
              key={phase.number}
              onClick={() => setActiveMobilePhase(phase.number)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeMobilePhase === phase.number
                  ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                  : "bg-[var(--glass-muted)] text-[var(--text-muted)] hover:text-[var(--text-strong)]"
              }`}
            >
              Semestre {phase.number}
            </button>
          ))}
        </div>

        <div className="relative group mx-auto max-w-[1920px]">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 z-20 -translate-x-4 -translate-y-1/2 hidden h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-surface)] text-[var(--text-strong)] shadow-lg backdrop-blur transition duration-300 hover:scale-110 hover:bg-[var(--glass-strong)] hover:border-[var(--glass-border)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] md:flex opacity-0 group-hover:opacity-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 z-20 translate-x-4 -translate-y-1/2 hidden h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-surface)] text-[var(--text-strong)] shadow-lg backdrop-blur transition duration-300 hover:scale-110 hover:bg-[var(--glass-strong)] hover:border-[var(--glass-border)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] md:flex opacity-0 group-hover:opacity-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            {...events}
            className={`max-w-full overflow-y-visible overflow-x-hidden md:overflow-x-auto md:overscroll-x-contain pb-4 md:[scrollbar-gutter:stable] ${isDragging ? "md:cursor-grabbing md:select-none" : "md:cursor-grab"}`}
          >
            <div className="flex flex-col md:flex-row md:min-w-max gap-4 md:gap-3 p-3 md:pr-6">
            {phases.map((phase) => {
              const phaseCourses = coursesByPhase.get(phase.number) ?? [];
              const phaseStats = getPhaseStats(phaseCourses);
              const isMobileHidden = activeMobilePhase !== phase.number;

              return (
                <PhaseColumn
                  key={phase.number}
                  phase={phase}
                  phaseCourses={phaseCourses}
                  phaseStats={phaseStats}
                  selectedId={selectedId}
                  searchQuery={searchQuery}
                  searchMatches={searchMatches}
                  statuses={statuses}
                  prerequisites={prerequisites}
                  dependents={dependents}
                  courseMap={courseMap}
                  onSelectCourse={onSelectCourse}
                  onToggleStatus={onToggleStatus}
                  isMobileHidden={isMobileHidden}
                />
              );
            })}
            </div>
          </div>
        </div>
      </section>
    </DndContext>
  );
}

interface PhaseColumnProps {
  phase: PhaseInfo;
  phaseCourses: Course[];
  phaseStats: { completed: number; total: number; percent: number };
  selectedId: string | null;
  searchQuery: string;
  searchMatches: Set<string>;
  statuses: Record<string, CourseStatus>;
  prerequisites: Set<string>;
  dependents: Set<string>;
  courseMap: Map<string, Course>;
  onSelectCourse: (id: string | null) => void;
  onToggleStatus: (id: string) => void;
  isMobileHidden: boolean;
}

function PhaseColumn({
  phase,
  phaseCourses,
  phaseStats,
  selectedId,
  searchQuery,
  searchMatches,
  statuses,
  prerequisites,
  dependents,
  courseMap,
  onSelectCourse,
  onToggleStatus,
  isMobileHidden,
}: PhaseColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: String(phase.number),
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-full md:w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl border ${
        isOver ? "border-[var(--accent)] shadow-md" : "border-[var(--glass-border)]"
      } bg-[var(--glass-muted)] backdrop-blur transition-colors ${
        isMobileHidden ? "hidden md:flex" : "flex"
      }`}
    >
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

      <div className="relative z-10 flex flex-col gap-2 p-2 min-h-[100px]">
        {phaseCourses.map((course) => {
          const isSelected = selectedId === course.id;
          const isPrereq = prerequisites.has(course.id);
          const isDependent = dependents.has(course.id);
          const isFilteredOut = searchQuery.length > 0 && !searchMatches.has(course.id);
          const status = statuses[course.id] ?? "pending";

          const isBlocked = course.prerequisites.some((pid) => {
            if (statuses[pid] === "completed") return false;

            const prereqCourse = courseMap.get(pid);
            if (prereqCourse?.equivalents?.some(eqId => statuses[eqId] === "completed")) {
              return false;
            }
            return true;
          });

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
}
