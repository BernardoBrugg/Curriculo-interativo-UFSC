"use client";

import { useMemo, useState, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
  MouseSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
} from "@dnd-kit/core";
import { Course, CourseStatus, PhaseInfo } from "@/types/curriculum";
import { CourseCard } from "./CourseCard";
import { CourseDetailModal } from "./CourseDetailModal";
import { CurriculumFilter } from "./CurriculumFilters";
import { useDragTutorial } from "@/hooks/useDragTutorial";
import { getDropTargetLabel } from "@/lib/drag-copy";
import { sumCourseCredits } from "@/lib/curriculum-stats";
import { isRequirementSatisfied } from "@/lib/curriculum-requirements";

const collisionDetectionStrategy: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  return rectIntersection(args);
};

interface CurriculumGridProps {
  phases: PhaseInfo[];
  courses: Course[];
  statuses: Record<string, CourseStatus>;
  selectedId: string | null;
  searchQuery: string;
  activeFilter?: CurriculumFilter;
  prerequisites: Set<string>;
  dependents: Set<string>;
  customPhases: Record<string, number>;
  onSelectCourse: (id: string | null) => void;
  onToggleStatus: (id: string) => void;
  onSetStatus?: (courseId: string, status: CourseStatus) => void;
  onMoveCourse: (courseId: string, toPhase: number) => void;
}

export function CurriculumGrid({
  phases,
  courses,
  statuses,
  selectedId,
  searchQuery,
  activeFilter = "all",
  prerequisites,
  dependents,
  customPhases,
  onSelectCourse,
  onToggleStatus,
  onSetStatus,
  onMoveCourse,
}: CurriculumGridProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { isVisible: isTutorialVisible, dismiss: dismissTutorial } = useDragTutorial();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const defaultPhase = useMemo(
    () => phases.find((p) => p.number === 1)?.number ?? phases[0]?.number ?? 1,
    [phases]
  );
  const [activeMobilePhase, setActiveMobilePhase] = useState<number>(defaultPhase);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [moveConfirmation, setMoveConfirmation] = useState<string | null>(null);
  const [modalCourse, setModalCourse] = useState<Course | null>(null);

  const checkScrollability = useCallback(() => {
    const element = gridContainerRef.current;
    if (!element) return;
    const hasOverflow = element.scrollWidth > element.clientWidth + 5;
    setCanScrollLeft(element.scrollLeft > 10);
    setCanScrollRight(hasOverflow && element.scrollLeft < element.scrollWidth - element.clientWidth - 10);
  }, []);

  useEffect(() => {
    const element = gridContainerRef.current;
    if (!element) return;

    checkScrollability();
    element.addEventListener("scroll", checkScrollability, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(element);
    }

    return () => {
      element.removeEventListener("scroll", checkScrollability);
      resizeObserver?.disconnect();
    };
  }, [checkScrollability, phases, courses]);

  const handleNavigate = useCallback((direction: "left" | "right") => {
    const element = gridContainerRef.current;
    if (!element) return;
    const scrollStep = Math.max(280, Math.floor(element.clientWidth * 0.7));
    element.scrollBy({
      left: direction === "left" ? -scrollStep : scrollStep,
      behavior: "smooth",
    });
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      const phaseNum = grouped.has(targetPhase) ? targetPhase : c.phase;
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

  const sortedMobilePhases = useMemo(
    () => phases.slice().sort((a, b) => (a.number === 0 ? 1 : b.number === 0 ? -1 : a.number - b.number)),
    [phases]
  );

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

  const isCourseBlocked = useCallback(
    (course: Course) => {
      if (course.prerequisiteExpression) {
        return !isRequirementSatisfied(course.prerequisiteExpression, statuses, courseMap);
      }
      return course.prerequisites.some((prerequisiteId) => {
        if (statuses[prerequisiteId] === "completed") return false;
        const prerequisiteCourse = courseMap.get(prerequisiteId);
        return !prerequisiteCourse?.equivalents?.some((equivalentId) => statuses[equivalentId] === "completed");
      });
    },
    [courseMap, statuses]
  );

  const activeCourse = activeCourseId ? courseMap.get(activeCourseId) : undefined;
  const activeCourseStatus = activeCourse ? statuses[activeCourse.id] ?? "pending" : "pending";
  const activeCourseBlocked = activeCourse ? isCourseBlocked(activeCourse) : false;
  const activeComputedState: "completed" | "in-progress" | "available" | "blocked" = activeCourseStatus === "completed"
    ? "completed"
    : activeCourseStatus === "in-progress"
      ? "in-progress"
      : activeCourseBlocked
        ? "blocked"
        : "available";

  const getPhaseStats = (phaseCourses: Course[]) => {
    const completed = phaseCourses.filter((course) => statuses[course.id] === "completed").length;
    const total = phaseCourses.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const credits = sumCourseCredits(phaseCourses);
    return { completed, total, percent, credits };
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCourseId(null);
    if (!over) return;

    const courseId = String(active.id);
    const toPhase = Number(over.id);
    onMoveCourse(courseId, toPhase);
    setMoveConfirmation(
      toPhase === 0 ? "Disciplina movida para Optativas" : `Disciplina movida para o semestre ${toPhase}`
    );
    window.setTimeout(() => setMoveConfirmation(null), 2600);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setMoveConfirmation(null);
    setActiveCourseId(String(event.active.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      autoScroll={{
        threshold: { x: 0.15, y: 0.15 },
        acceleration: 10,
      }}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveCourseId(null)}
      onDragEnd={handleDragEnd}
    >
      <section className="glass-surface w-full min-w-0 max-w-full rounded-3xl">
        <div className="border-b border-[var(--glass-border)] px-4 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-strong)]">Grade curricular</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Clique no cartão para atualizar o status ou arraste para outro semestre.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-1">
                <button
                  type="button"
                  onClick={() => handleNavigate("left")}
                  disabled={!canScrollLeft}
                  aria-label="Semestres anteriores"
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-[var(--text-strong)] transition hover:bg-[var(--glass-strong)] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("right")}
                  disabled={!canScrollRight}
                  aria-label="Próximos semestres"
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-[var(--text-strong)] transition hover:bg-[var(--glass-strong)] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <span>Próximo</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
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
        </div>

        {isTutorialVisible && (
          <aside className="mx-3 mt-3 rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-4 py-4 text-sm text-[var(--text-muted)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-bold text-[var(--text-strong)]">Dicas de uso</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--glass-strong)] px-3 py-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold text-[var(--on-accent)]">1</span>
                    <span><strong className="text-[var(--text-strong)]">Toque</strong> para abrir detalhes, alterar status ou mover de fase no mobile.</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--glass-strong)] px-3 py-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--accent)] text-xs font-bold text-[var(--accent)]">2</span>
                    <span>No desktop, <strong className="text-[var(--text-strong)]">clique</strong> para alternar status ou <strong className="text-[var(--text-strong)]">arraste o cartão</strong> para outro semestre.</span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => void dismissTutorial()} className="auth-primary shrink-0 rounded-xl px-3 py-2 text-xs font-bold">Entendi</button>
            </div>
          </aside>
        )}

        {moveConfirmation && <div role="status" className="mx-3 mt-3 rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-center text-xs font-semibold text-emerald-700">{moveConfirmation}</div>}

        <div className="md:hidden border-b border-[var(--glass-border)] overflow-x-auto pb-1 pt-2 px-2 flex gap-2 hide-scrollbar">
          {sortedMobilePhases.map((phase) => (
            <button
              key={phase.number}
              type="button"
              onClick={() => setActiveMobilePhase(phase.number)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeMobilePhase === phase.number
                  ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md"
                  : "bg-[var(--glass-muted)] text-[var(--text-muted)] hover:text-[var(--text-strong)]"
              }`}
            >
              {phase.number === 0 ? "Optativas" : `Semestre ${phase.number}`}
            </button>
          ))}
        </div>

        <div className="relative mx-auto max-w-[1920px]">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleNavigate("left")}
              aria-label="Rolar para a esquerda"
              className="absolute left-2 top-1/2 z-30 -translate-y-1/2 hidden h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-strong)] text-[var(--text-strong)] shadow-2xl backdrop-blur-md transition duration-200 hover:scale-105 hover:border-[var(--accent)] hover:bg-[var(--glass-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] md:flex"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleNavigate("right")}
              aria-label="Rolar para a direita"
              className="absolute right-2 top-1/2 z-30 -translate-y-1/2 hidden h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-strong)] text-[var(--text-strong)] shadow-2xl backdrop-blur-md transition duration-200 hover:scale-105 hover:border-[var(--accent)] hover:bg-[var(--glass-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] md:flex"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            ref={gridContainerRef}
            data-testid="curriculum-grid-container"
            className="max-w-full overflow-x-auto pb-4 scroll-smooth md:[scrollbar-gutter:stable]"
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
                    activeFilter={activeFilter}
                    statuses={statuses}
                    prerequisites={prerequisites}
                    dependents={dependents}
                    courseMap={courseMap}
                    onSelectCourse={onSelectCourse}
                    onToggleStatus={onToggleStatus}
                    onOpenDetails={(course) => setModalCourse(course)}
                    isMobileHidden={isMobileHidden}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {isMounted && activeCourse && typeof document !== "undefined"
        ? createPortal(
            <DragOverlay dropAnimation={null} zIndex={100}>
              <CourseCard
                course={activeCourse}
                allCourses={courses}
                computedState={activeComputedState}
                isSelected={selectedId === activeCourse.id}
                isPrereq={prerequisites.has(activeCourse.id)}
                isDependent={dependents.has(activeCourse.id)}
                isFilteredOut={false}
                onClick={() => undefined}
                onMouseEnter={() => undefined}
                onMouseLeave={() => undefined}
                isOverlay
              />
            </DragOverlay>,
            document.body
          )
        : null}

      <CourseDetailModal
        course={modalCourse}
        allCourses={courses}
        statuses={statuses}
        customPhases={customPhases}
        isBlocked={modalCourse ? isCourseBlocked(modalCourse) : false}
        onClose={() => setModalCourse(null)}
        onToggleStatus={onToggleStatus}
        onSetStatus={onSetStatus}
        onMovePhase={(courseId, toPhase) => {
          onMoveCourse(courseId, toPhase);
          setMoveConfirmation(
            toPhase === 0 ? "Disciplina movida para Optativas" : `Disciplina movida para o semestre ${toPhase}`
          );
          window.setTimeout(() => setMoveConfirmation(null), 2600);
        }}
        phases={phases}
      />
    </DndContext>
  );
}

interface PhaseColumnProps {
  phase: PhaseInfo;
  phaseCourses: Course[];
  phaseStats: { completed: number; total: number; percent: number; credits: number };
  selectedId: string | null;
  searchQuery: string;
  searchMatches: Set<string>;
  activeFilter?: CurriculumFilter;
  statuses: Record<string, CourseStatus>;
  prerequisites: Set<string>;
  dependents: Set<string>;
  courseMap: Map<string, Course>;
  onSelectCourse: (id: string | null) => void;
  onToggleStatus: (id: string) => void;
  onOpenDetails: (course: Course) => void;
  isMobileHidden: boolean;
}

function PhaseColumn({
  phase,
  phaseCourses,
  phaseStats,
  selectedId,
  searchQuery,
  searchMatches,
  activeFilter,
  statuses,
  prerequisites,
  dependents,
  courseMap,
  onSelectCourse,
  onToggleStatus,
  onOpenDetails,
  isMobileHidden,
}: PhaseColumnProps) {
  const allCourses = useMemo(() => Array.from(courseMap.values()), [courseMap]);
  const { isOver, setNodeRef } = useDroppable({
    id: String(phase.number),
  });

  const phaseTitle = phase.number === 0 ? "Optativas" : phase.name || `Semestre ${phase.number}`;

  return (
    <div
      ref={setNodeRef}
      data-phase-column="true"
      aria-label={`${phaseTitle}, ${phaseStats.total} disciplinas`}
      className={`flex w-full md:w-[260px] shrink-0 flex-col rounded-2xl border ${
        isOver ? "border-[var(--accent)] bg-[var(--accent-soft)] shadow-lg" : "border-[var(--glass-border)]"
      } bg-[var(--glass-muted)] backdrop-blur transition-colors ${
        isMobileHidden ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="sticky top-0 z-20 border-b border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2.5 rounded-t-2xl backdrop-blur-md">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--text-strong)]">{phaseTitle}</h3>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-[var(--glass-muted)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
              {phaseStats.credits} cr
            </span>
            <span className="rounded-full bg-[var(--accent-soft)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
              {phaseStats.completed}/{phaseStats.total}
            </span>
          </div>
        </div>
        {isOver && <p className="mt-2 rounded-lg bg-[var(--accent)] px-2 py-1 text-center text-[11px] font-bold text-[var(--on-accent)]">{getDropTargetLabel(phase.number)}</p>}
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
          const status = statuses[course.id] ?? "pending";

          const isBlocked = course.prerequisiteExpression
            ? !isRequirementSatisfied(course.prerequisiteExpression, statuses, courseMap)
            : course.prerequisites.some((pid) => {
                if (statuses[pid] === "completed") return false;
                const prereqCourse = courseMap.get(pid);
                if (prereqCourse?.equivalents?.some((eqId) => statuses[eqId] === "completed")) {
                  return false;
                }
                return true;
              });

          const matchesFilter =
            !activeFilter ||
            activeFilter === "all" ||
            (activeFilter === "available" && status !== "completed" && status !== "in-progress" && !isBlocked) ||
            (activeFilter === "in-progress" && status === "in-progress") ||
            (activeFilter === "pending" && status === "pending") ||
            (activeFilter === "completed" && status === "completed") ||
            (activeFilter === "mandatory" && course.type === "Ob") ||
            (activeFilter === "elective" && (course.type === "Op" || course.type === "FreeOp"));

          const isFilteredOut = (searchQuery.length > 0 && !searchMatches.has(course.id)) || !matchesFilter;

          let computedState: "completed" | "in-progress" | "available" | "blocked" = "available";
          if (status === "completed") computedState = "completed";
          else if (status === "in-progress") computedState = "in-progress";
          else if (isBlocked) computedState = "blocked";

          return (
            <CourseCard
              key={course.id}
              course={course}
              allCourses={allCourses}
              computedState={computedState}
              isSelected={isSelected}
              isPrereq={isPrereq}
              isDependent={isDependent}
              isFilteredOut={isFilteredOut}
              onClick={() => onToggleStatus(course.id)}
              onMouseEnter={() => onSelectCourse(course.id)}
              onMouseLeave={() => onSelectCourse(null)}
              onOpenDetails={onOpenDetails}
            />
          );
        })}
      </div>
    </div>
  );
}
