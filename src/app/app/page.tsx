"use client";

import { useState } from "react";
import { curriculum } from "@/data/curriculum";
import { useCourseStatus } from "@/hooks/useCourseStatus";
import { useCourseGraph } from "@/hooks/useCourseGraph";

import { SearchBar } from "@/components/SearchBar";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { CurriculumGrid } from "@/components/CurriculumGrid";
import { ArrowOverlay } from "@/components/ArrowOverlay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";

export default function AppPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { statuses, toggleStatus, resetAll } = useCourseStatus();
  const graph = useCourseGraph(curriculum.courses);

  const prerequisites = selectedId ? graph.getPrerequisites(selectedId) : new Set<string>();
  const dependents = selectedId ? graph.getDependents(selectedId) : new Set<string>();

  return (
    <main className="app-gradient relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1920px] min-w-0 flex-col gap-4 px-3 py-4 sm:px-5 lg:px-7">
        <ProgressDashboard
          courses={curriculum.courses}
          statuses={statuses}
          onReset={resetAll}
          searchSlot={<SearchBar query={searchQuery} onChange={setSearchQuery} />}
        />

        <CurriculumGrid
          phases={curriculum.phases}
          courses={curriculum.courses}
          statuses={statuses}
          selectedId={selectedId}
          searchQuery={searchQuery}
          prerequisites={prerequisites}
          dependents={dependents}
          onSelectCourse={(id) => setSelectedId(id === selectedId ? null : id)}
          onToggleStatus={toggleStatus}
        />
      </div>

      <SiteFooter />

      <ArrowOverlay
        selectedId={selectedId}
        prerequisites={prerequisites}
        dependents={dependents}
        courses={curriculum.courses}
      />
    </main>
  );
}
