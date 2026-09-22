"use client";

import Link from "next/link";
import { useCurriculumSummaries } from "@/hooks/useCurricula";

interface GuestCourseListProps {
  onSwitchToAuth: () => void;
}

export function GuestCourseList({ onSwitchToAuth }: GuestCourseListProps) {
  const { curricula, isLoading, error } = useCurriculumSummaries();

  return (
    <div className="rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-surface)]/30 p-6 backdrop-blur-sm sm:p-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Acesso imediato</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-strong)]">Selecione seu curso</h2>
        </div>
        <button
          type="button"
          onClick={onSwitchToAuth}
          className="auth-secondary shrink-0 rounded-xl px-3 py-2 text-xs font-bold"
        >
          Entrar na conta
        </button>
      </div>

      <p className="mb-5 text-xs text-[var(--text-muted)]">
        Explore a grade curricular, pré-requisitos e simule seu progresso sem necessidade de cadastro.
      </p>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      {isLoading && <p className="py-6 text-center text-sm text-[var(--text-muted)]">Carregando cursos...</p>}

      {!isLoading && (
        <div className="grid gap-2.5 min-[430px]:grid-cols-2 lg:max-h-[26rem] lg:overflow-y-auto lg:pr-1">
          {curricula.map((curriculum) => (
            <Link
              key={curriculum.id}
              href={`/${curriculum.id}`}
              className="group relative flex min-h-[82px] items-center justify-between rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--glass-strong)] hover:shadow-md"
            >
              <div className="min-w-0 pr-2">
                <span className="block text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--accent)] transition-colors">
                  {curriculum.name}
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {curriculum.description}
                </span>
              </div>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--glass-muted)] text-[var(--text-faint)] transition group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-[var(--glass-border)] pt-4 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          Já tem conta?{" "}
          <button type="button" onClick={onSwitchToAuth} className="font-bold text-[var(--accent)] hover:underline">
            Acesse seu perfil salvo
          </button>
        </p>
      </div>
    </div>
  );
}
