"use client";

import { use, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { getCurriculum } from "@/data/curricula";
import { useCourseStatus } from "@/hooks/useCourseStatus";
import { useCourseGraph } from "@/hooks/useCourseGraph";
import { notFound } from "next/navigation";

import { SearchBar } from "@/components/SearchBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { CurriculumGrid } from "@/components/CurriculumGrid";
import { ArrowOverlay } from "@/components/ArrowOverlay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";

export default function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = use(params);
  const curriculum = getCurriculum(course);

  if (!curriculum) {
    notFound();
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { statuses, toggleStatus, setStatus, resetAll } = useCourseStatus(course);
  const graph = useCourseGraph(curriculum.courses);
  const coursesById = useMemo(
    () => new Map(curriculum.courses.map((courseItem) => [courseItem.id, courseItem])),
    [curriculum.courses]
  );

  const prerequisites = selectedId ? graph.getPrerequisites(selectedId) : new Set<string>();
  const dependents = selectedId ? graph.getDependents(selectedId) : new Set<string>();
  const hasUnmetPrerequisites = useCallback(
    (id: string) => {
      const selectedCourse = coursesById.get(id);
      if (!selectedCourse) return false;
      return selectedCourse.prerequisites.some(
        (prerequisiteId) => statuses[prerequisiteId] !== "completed"
      );
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
      if (!hasUnmetPrerequisites(id)) {
        toggleStatus(id);
        return;
      }
      if (!hasNonPendingStatus(id)) return;
      setStatus(id, "pending");
    },
    [coursesById, hasNonPendingStatus, hasUnmetPrerequisites, setStatus, toggleStatus]
  );

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

      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1920px] min-w-0 flex-col gap-4 px-3 pb-8 pt-20 sm:px-5 lg:px-7">
        <ScrollReveal>
          <ProgressDashboard
            courses={curriculum.courses}
            statuses={statuses}
            totalHours={curriculum.totalHours}
            onReset={resetAll}
            searchSlot={<SearchBar query={searchQuery} onChange={setSearchQuery} />}
          />
        </ScrollReveal>

        <ScrollReveal delay={90}>
          <CurriculumGrid
            phases={curriculum.phases}
            courses={curriculum.courses}
            statuses={statuses}
            selectedId={selectedId}
            searchQuery={searchQuery}
            prerequisites={prerequisites}
            dependents={dependents}
            onSelectCourse={(id) => setSelectedId(id === selectedId ? null : id)}
            onToggleStatus={handleToggleStatus}
          />
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <SiteFooter />
      </ScrollReveal>

      <ArrowOverlay
        selectedId={selectedId}
        prerequisites={prerequisites}
        dependents={dependents}
        courses={curriculum.courses}
      />
    </main>
  );
}
