"use client";

import { use, useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useCourseStatus } from "@/hooks/useCourseStatus";
import { useCourseGraph } from "@/hooks/useCourseGraph";
import { useCustomPhases } from "@/hooks/useCustomPhases";
import { useRouter } from "next/navigation";
import { useCurriculum } from "@/hooks/useCurricula";

import { SearchBar } from "@/components/SearchBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { CurriculumGrid } from "@/components/CurriculumGrid";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/components/AuthProvider";

export default function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = use(params);
  const router = useRouter();
  const { user, isLoading, logOut } = useAuth();
  const { curriculum, isLoading: curriculumLoading, error: curriculumError } = useCurriculum(course);
  const curriculumCourses = useMemo(() => curriculum?.courses ?? [], [curriculum]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { statuses, toggleStatus, setStatus, resetAll, error: statusError } = useCourseStatus(course);
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

  useEffect(() => {
    if (!isLoading && !user) router.replace("/");
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return <main className="app-gradient min-h-screen" />;
  }

  if (curriculumLoading) {
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
        <button
          type="button"
          onClick={() => void logOut()}
          className="rounded-full border border-[var(--glass-border)] bg-[var(--glass-surface)]/60 px-4 py-2 text-sm font-semibold text-[var(--text-strong)] backdrop-blur-md transition hover:bg-[var(--glass-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          Sair
        </button>
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1920px] min-w-0 flex-col gap-4 px-3 pb-8 pt-20 sm:px-5 lg:px-7">
        <ScrollReveal>
          {(statusError || phaseError) && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600">{statusError || phaseError}</p>}
          <ProgressDashboard
            courses={curriculumCourses}
            statuses={statuses}
            totalHours={curriculum.totalHours}
            onReset={resetAll}
            searchSlot={<SearchBar query={searchQuery} onChange={setSearchQuery} />}
          />
        </ScrollReveal>

        <ScrollReveal delay={90}>
          <CurriculumGrid
            phases={curriculum.phases}
            courses={curriculumCourses}
            statuses={statuses}
            selectedId={selectedId}
            searchQuery={searchQuery}
            prerequisites={prerequisites}
            dependents={dependents}
            customPhases={customPhases}
            onSelectCourse={(id) => setSelectedId(id === selectedId ? null : id)}
            onToggleStatus={handleToggleStatus}
            onMoveCourse={setCustomPhase}
          />
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <SiteFooter />
      </ScrollReveal>
    </main>
  );
}
