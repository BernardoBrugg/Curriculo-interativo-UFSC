"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCurriculumSummaries } from "@/hooks/useCurricula";
import { useUserCourses } from "@/hooks/useUserCourses";
import { addCourseAndNavigate } from "@/lib/course-navigation";
import { toggleCourseRemovalConfirmation } from "@/lib/course-removal";

type LibraryView = "mine" | "new";

export function CourseLibrary() {
  const router = useRouter();
  const [view, setView] = useState<LibraryView>("mine");
  const [courseToRemove, setCourseToRemove] = useState<string | null>(null);
  const { curricula, isLoading: curriculaLoading, error: curriculaError } = useCurriculumSummaries();
  const { courseIds, isLoading: coursesLoading, error: coursesError, addCourse, removeCourse } = useUserCourses();
  const selectedIds = useMemo(() => new Set(courseIds), [courseIds]);
  const visibleCurricula = useMemo(
    () => view === "mine" ? curricula.filter((curriculum) => selectedIds.has(curriculum.id)) : curricula.filter((curriculum) => !selectedIds.has(curriculum.id)),
    [curricula, selectedIds, view]
  );
  const selectedCourseToRemove = useMemo(
    () => curricula.find((curriculum) => curriculum.id === courseToRemove) ?? null,
    [courseToRemove, curricula]
  );
  const isLoading = curriculaLoading || coursesLoading;
  const error = curriculaError || coursesError;

  return (
    <div className="rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-surface)]/30 p-6 backdrop-blur-sm sm:p-8">
      <div className="mb-6 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.15em] text-[var(--text-faint)]">
        <span>{view === "mine" ? "Meus cursos" : "Cursos novos"}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-[var(--glass-border)] to-transparent" />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-1">
        <button
          type="button"
          onClick={() => {
            setView("mine");
            setCourseToRemove(null);
          }}
          className={`auth-tab rounded-xl px-3 py-2.5 text-sm font-bold transition ${view === "mine" ? "auth-tab-active shadow-sm" : ""}`}
        >
          Meus cursos
        </button>
        <button
          type="button"
          onClick={() => setView("new")}
          className={`auth-tab rounded-xl px-3 py-2.5 text-sm font-bold transition ${view === "new" ? "auth-tab-active shadow-sm" : ""}`}
        >
          Cursos novos
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-500">
          {error}
        </p>
      )}

      {isLoading && <p className="py-5 text-sm text-[var(--text-muted)]">Carregando currículos...</p>}

      {!isLoading && visibleCurricula.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--glass-border)] px-5 py-8 text-center">
          <p className="text-sm font-semibold text-[var(--text-strong)]">
            {view === "mine" ? "Você ainda não adicionou nenhum curso." : "Você já adicionou todos os cursos disponíveis."}
          </p>
          <button
            type="button"
            onClick={() => setView(view === "mine" ? "new" : "mine")}
            className="mt-3 text-sm font-bold text-[var(--accent)] hover:underline"
          >
            {view === "mine" ? "Ver cursos novos" : "Voltar para meus cursos"}
          </button>
        </div>
      )}

      {!isLoading && visibleCurricula.length > 0 && (
        <div className="grid gap-3 min-[430px]:grid-cols-2">
          {visibleCurricula.map((curriculum) => view === "mine" ? (
            <div key={curriculum.id} className="relative">
              <Link
                href={`/${curriculum.id}`}
                className="group relative flex min-h-[92px] items-center justify-between overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] px-4 pb-7 pt-4 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:bg-[var(--glass-strong)] hover:shadow-lg hover:shadow-[var(--accent)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <div className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[var(--text-strong)] transition-colors group-hover:text-[var(--accent)]">
                    {curriculum.name.replace("Engenharia ", "Eng. ")}
                  </span>
                  <span className="mt-1 block truncate text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {curriculum.description}
                  </span>
                </div>
                <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--glass-muted)] text-[var(--text-faint)] transition group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              <button
                type="button"
                aria-label={`Remover ${curriculum.name}`}
                title="Remover curso"
                onClick={() => setCourseToRemove(toggleCourseRemovalConfirmation(courseToRemove, curriculum.id))}
                className="absolute bottom-2 left-2 z-10 rounded-md bg-[var(--glass-surface)]/80 p-1 text-[var(--text-faint)] opacity-60 transition hover:bg-red-500/10 hover:text-red-500 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12m-9 0v10m6-10v10M9 7V5h6v2m-8 0l1 12h6l1-12" />
                </svg>
              </button>
            </div>
          ) : (
            <div key={curriculum.id} className="flex items-center justify-between rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] p-4">
              <div className="min-w-0">
                <span className="block truncate text-sm font-bold text-[var(--text-strong)]">
                  {curriculum.name.replace("Engenharia ", "Eng. ")}
                </span>
                <span className="mt-1 block truncate text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {curriculum.description}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void addCourseAndNavigate(addCourse, (href) => router.push(href), curriculum.id)}
                className="auth-primary ml-3 shrink-0 rounded-xl px-3 py-2 text-xs font-bold"
              >
                Adicionar e editar
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCourseToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md" role="presentation" onClick={() => setCourseToRemove(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-course-title"
            aria-describedby="remove-course-description"
            className="w-full max-w-md rounded-2xl border border-[var(--glass-border)] bg-[var(--background)] p-6 shadow-2xl shadow-black/40"
            onClick={(event) => event.stopPropagation()}
          >
            <p id="remove-course-title" className="text-lg font-black text-[var(--text-strong)]">
              Remover curso?
            </p>
            <p id="remove-course-description" className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              Você está prestes a remover {selectedCourseToRemove.name} dos seus cursos. Ele poderá ser adicionado novamente depois, mas o progresso salvo desse curso será perdido.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCourseToRemove(null)}
                className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-surface)] px-4 py-3 text-sm font-bold text-[var(--text-strong)] transition hover:bg-[var(--glass-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  void removeCourse(selectedCourseToRemove.id);
                  setCourseToRemove(null);
                }}
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remover curso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
