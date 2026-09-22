"use client";

import { use, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useCourseStatus } from "@/hooks/useCourseStatus";
import { useCourseGraph } from "@/hooks/useCourseGraph";
import { useCustomPhases } from "@/hooks/useCustomPhases";
import { useCurriculum } from "@/hooks/useCurricula";
import { isRequirementSatisfied } from "@/lib/curriculum-requirements";

import { SearchBar } from "./components/SearchBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { CurriculumGrid } from "./components/CurriculumGrid";
import { CurriculumFilters, CurriculumFilter } from "./components/CurriculumFilters";
import { CagrImportModal } from "./components/CagrImportModal";
import { ProfileMenu } from "@/components/ProfileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/components/AuthProvider";
import { CourseStatus } from "@/types/curriculum";

export default function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = use(params);
  const { user, isLoading } = useAuth();
  const { curriculum, isLoading: curriculumLoading, error: curriculumError } = useCurriculum(course);
  const curriculumCourses = useMemo(() => curriculum?.courses ?? [], [curriculum]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<CurriculumFilter>("all");
  const [isCagrModalOpen, setIsCagrModalOpen] = useState(false);

  const { statuses, requirementHours, toggleStatus, setStatus, setBatchStatuses, setRequirementHours, resetAll, error: statusError } = useCourseStatus(course);
  const { customPhases, setCustomPhase, error: phaseError } = useCustomPhases(course);
  const graph = useCourseGraph(curriculumCourses);

  const coursesById = useMemo(
    () => new Map(curriculumCourses.map((courseItem) => [courseItem.id, courseItem])),
    [curriculumCourses]
  );

  const prerequisites = selectedId ? graph.getPrerequisites(selectedId) : new Set<string>();
  const dependents = selectedId ? graph.getDependents(selectedId) : new Set<string>();

  const isBlockedByPrerequisites = useCallback(
    (id: string) => {
      const selectedCourse = coursesById.get(id);
      if (!selectedCourse) return false;
      if (selectedCourse.prerequisiteExpression) {
        return !isRequirementSatisfied(selectedCourse.prerequisiteExpression, statuses, coursesById);
      }
      return selectedCourse.prerequisites.some((prerequisiteId) => {
        if (statuses[prerequisiteId] === "completed") return false;
        const prereqCourse = coursesById.get(prerequisiteId);
        if (prereqCourse?.equivalents?.some(eqId => statuses[eqId] === "completed")) return false;
        return true;
      });
    },
    [coursesById, statuses]
  );

  const hasNonPendingStatus = useCallback(
    (id: string) => {
      const currentStatus = statuses[id] ?? "pending";
      return currentStatus !== "pending";
    },
    [statuses]
  );

  const handleToggleStatus = useCallback(
    (id: string) => {
      if (!coursesById.has(id)) return;
      if (isBlockedByPrerequisites(id)) {
        if (!hasNonPendingStatus(id)) return;
        setStatus(id, "pending");
        return;
      }
      toggleStatus(id);
    },
    [coursesById, hasNonPendingStatus, isBlockedByPrerequisites, setStatus, toggleStatus]
  );

  const handleCagrApply = useCallback(
    (completedIds: string[], inProgressIds: string[]) => {
      const updates: Record<string, CourseStatus> = {};
      completedIds.forEach((id) => {
        updates[id] = "completed";
      });
      inProgressIds.forEach((id) => {
        updates[id] = "in-progress";
      });
      setBatchStatuses(updates);
    },
    [setBatchStatuses]
  );

  const filterCounts = useMemo<Record<CurriculumFilter, number>>(() => {
    let all = 0;
    let available = 0;
    let inProgress = 0;
    let pending = 0;
    let completed = 0;
    let mandatory = 0;
    let elective = 0;

    for (const c of curriculumCourses) {
      all++;
      const s = statuses[c.id] ?? "pending";
      if (s === "completed") {
        completed++;
      } else if (s === "in-progress") {
        inProgress++;
      } else {
        pending++;
        if (!isBlockedByPrerequisites(c.id)) {
          available++;
        }
      }

      if (c.type === "Ob") {
        mandatory++;
      } else if (c.type === "Op" || c.type === "FreeOp") {
        elective++;
      }
    }

    return {
      all,
      available,
      "in-progress": inProgress,
      pending,
      completed,
      mandatory,
      elective,
    };
  }, [curriculumCourses, isBlockedByPrerequisites, statuses]);

  if (isLoading || curriculumLoading) {
    return <main className="app-gradient min-h-screen" />;
  }

  if (!curriculum) {
    return <main className="app-gradient flex min-h-screen items-center justify-center px-4"><div className="glass-surface rounded-3xl p-8 text-center"><p className="text-sm text-[var(--text-muted)]">{curriculumError || "Este currículo não está disponível."}</p><Link href="/" className="mt-4 inline-flex rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)]">Voltar para meus cursos</Link></div></main>;
  }

  return (
    <main className="app-gradient relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="fixed left-4 top-4 z-50">
        <Link
          href="/"
          className="group flex h-10 items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-surface)]/60 px-4 text-sm font-semibold text-[var(--text-strong)] backdrop-blur-md transition-all duration-300 hover:bg-[var(--glass-strong)] hover:shadow-md hover:border-[var(--glass-border)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Cursos
        </Link>
      </div>

      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        <ProfileMenu />
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1920px] min-w-0 flex-col gap-3 px-3 pb-8 pt-16 sm:px-5 lg:px-7">
        {!user && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3.5 py-1.5 text-xs text-[var(--text-muted)] shadow-sm backdrop-blur">
            <span className="flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Modo visitante: seu planejamento está sendo salvo neste navegador.
            </span>
            <Link href="/" className="font-bold text-[var(--accent)] hover:underline">
              Entrar ou criar conta para salvar na nuvem
            </Link>
          </div>
        )}
        <ScrollReveal>
          {(statusError || phaseError) && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">{statusError || phaseError}</p>}
          <ProgressDashboard
            curriculum={curriculum}
            statuses={statuses}
            requirementHours={requirementHours}
            onRequirementHoursChange={setRequirementHours}
            onReset={resetAll}
            onOpenCagrImport={() => setIsCagrModalOpen(true)}
            searchSlot={<SearchBar query={searchQuery} onChange={setSearchQuery} />}
          />
        </ScrollReveal>

        <CurriculumFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />

        <ScrollReveal delay={90}>
          <CurriculumGrid
            phases={curriculum.phases}
            courses={curriculumCourses}
            statuses={statuses}
            selectedId={selectedId}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            prerequisites={prerequisites}
            dependents={dependents}
            customPhases={customPhases}
            onSelectCourse={(id) => setSelectedId(id === selectedId ? null : id)}
            onToggleStatus={handleToggleStatus}
            onSetStatus={setStatus}
            onMoveCourse={setCustomPhase}
          />
        </ScrollReveal>
      </div>

      <CagrImportModal
        isOpen={isCagrModalOpen}
        onClose={() => setIsCagrModalOpen(false)}
        allCourses={curriculumCourses}
        onApply={handleCagrApply}
      />

      <ScrollReveal>
        <SiteFooter />
      </ScrollReveal>
    </main>
  );
}
