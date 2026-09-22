"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCurriculumSummaries } from "@/hooks/useCurricula";

interface GuestCourseListProps {
  onSwitchToAuth: () => void;
}

export function GuestCourseList({ onSwitchToAuth }: GuestCourseListProps) {
  const { curricula, isLoading, error } = useCurriculumSummaries();
  const [search, setSearch] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("Todos");

  const campuses = useMemo(() => {
    const list = new Set<string>();
    for (const item of curricula) {
      if (item.campus) list.add(item.campus);
    }
    return ["Todos", ...Array.from(list).sort((a, b) => a.localeCompare(b, "pt-BR"))];
  }, [curricula]);

  const filteredCurricula = useMemo(() => {
    const query = search.trim().toLowerCase();
    return curricula.filter((item) => {
      if (selectedCampus !== "Todos" && item.campus !== selectedCampus) return false;
      if (!query) return true;
      const matchName = item.name.toLowerCase().includes(query);
      const matchId = item.id.toLowerCase().includes(query);
      const matchCampus = item.campus ? item.campus.toLowerCase().includes(query) : false;
      return matchName || matchId || matchCampus;
    });
  }, [curricula, search, selectedCampus]);

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

      <p className="mb-4 text-xs text-[var(--text-muted)]">
        Explore a grade curricular, pré-requisitos e simule seu progresso sem necessidade de cadastro.
      </p>

      <div className="mb-3 space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por curso ou código..."
            className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-surface)] px-3.5 py-2 text-xs text-[var(--text-strong)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-faint)] hover:text-[var(--text-strong)]"
            >
              ✕
            </button>
          )}
        </div>

        {campuses.length > 2 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            {campuses.map((campus) => (
              <button
                key={campus}
                type="button"
                onClick={() => setSelectedCampus(campus)}
                className={`shrink-0 rounded-lg px-2.5 py-1 font-semibold transition ${
                  selectedCampus === campus
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                    : "border border-[var(--glass-border)] bg-[var(--glass-muted)] text-[var(--text-muted)] hover:text-[var(--text-strong)]"
                }`}
              >
                {campus}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      )}

      {isLoading && <p className="py-6 text-center text-sm text-[var(--text-muted)]">Carregando cursos...</p>}

      {!isLoading && filteredCurricula.length === 0 && (
        <div className="py-8 text-center text-xs text-[var(--text-muted)]">
          Nenhum curso encontrado para os filtros selecionados.
        </div>
      )}

      {!isLoading && filteredCurricula.length > 0 && (
        <div className="grid gap-2.5 min-[430px]:grid-cols-2 lg:max-h-[22rem] lg:overflow-y-auto lg:pr-1">
          {filteredCurricula.map((curriculum) => (
            <Link
              key={curriculum.id}
              href={`/${curriculum.id}`}
              className="group relative flex min-h-[82px] items-center justify-between rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--glass-strong)] hover:shadow-md"
            >
              <div className="min-w-0 pr-2">
                <span className="block text-sm font-bold text-[var(--text-strong)] transition-colors group-hover:text-[var(--accent)]">
                  {curriculum.name}
                </span>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {curriculum.description}
                  </span>
                  {curriculum.campus && (
                    <span className="rounded bg-[var(--glass-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-faint)]">
                      {curriculum.campus}
                    </span>
                  )}
                </div>
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
