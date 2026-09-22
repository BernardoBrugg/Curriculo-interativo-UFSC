"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Course } from "@/types/curriculum";
import { parseCagrTranscript } from "@/lib/cagr-transcript-parser";

interface CagrImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCourses: Course[];
  onApply: (completedIds: string[], inProgressIds: string[]) => void;
}

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function CagrImportModal({ isOpen, onClose, allCourses, onApply }: CagrImportModalProps) {
  const isMounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
  const [rawText, setRawText] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const handleClose = useCallback(() => {
    setRawText("");
    setHasApplied(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    allCourses.forEach((c) => {
      map.set(c.code.toUpperCase(), c);
      map.set(c.id.toUpperCase(), c);
    });
    return map;
  }, [allCourses]);

  const parseResult = useMemo(() => parseCagrTranscript(rawText), [rawText]);

  const matchedCompleted = useMemo(() => {
    const matched: Course[] = [];
    const unmatched: string[] = [];
    parseResult.completedCourses.forEach((code) => {
      const course = courseMap.get(code);
      if (course) matched.push(course);
      else unmatched.push(code);
    });
    return { matched, unmatched };
  }, [courseMap, parseResult.completedCourses]);

  const matchedInProgress = useMemo(() => {
    const matched: Course[] = [];
    const unmatched: string[] = [];
    parseResult.inProgressCourses.forEach((code) => {
      const course = courseMap.get(code);
      if (course) matched.push(course);
      else unmatched.push(code);
    });
    return { matched, unmatched };
  }, [courseMap, parseResult.inProgressCourses]);

  const handleConfirm = () => {
    const completedIds = matchedCompleted.matched.map((c) => c.id);
    const inProgressIds = matchedInProgress.matched.map((c) => c.id);
    onApply(completedIds, inProgressIds);
    setHasApplied(true);
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cagr-import-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-base)] p-5 shadow-2xl backdrop-blur-2xl sm:p-6 overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--glass-border)] pb-3">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              Importação rápida
            </span>
            <h2 id="cagr-import-title" className="mt-1 text-lg font-bold text-[var(--text-strong)] sm:text-xl">
              Importar histórico do CAGR
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Copie o texto do seu Histórico Escolar ou Espelho de Matrícula no CAGR e cole abaixo.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-muted)] text-[var(--text-muted)] transition hover:bg-[var(--glass-strong)] hover:text-[var(--text-strong)]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pt-4 pr-1">
          <div>
            <label htmlFor="cagr-text" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
              Conteúdo do CAGR
            </label>
            <textarea
              id="cagr-text"
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole aqui o texto do seu histórico (ex: MTM3101 - CÁLCULO 1 ... 8.5 AP 2021.1)..."
              className="glass-control mt-2 w-full resize-none rounded-2xl p-3.5 text-xs text-[var(--text-strong)] outline-none placeholder:text-[var(--text-faint)] focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          {rawText.trim() && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                  <p className="text-lg font-bold text-emerald-700">{matchedCompleted.matched.length}</p>
                  <p className="font-semibold text-emerald-800">Aprovadas identificadas</p>
                </div>
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3">
                  <p className="text-lg font-bold text-amber-700">{matchedInProgress.matched.length}</p>
                  <p className="font-semibold text-amber-800">Matriculadas / Cursando</p>
                </div>
              </div>

              {matchedCompleted.matched.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                    Disciplinas para marcar como concluídas ({matchedCompleted.matched.length})
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto rounded-xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-2">
                    {matchedCompleted.matched.map((course) => (
                      <span
                        key={course.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--glass-strong)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-strong)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {course.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchedInProgress.matched.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                    Disciplinas para marcar como cursando ({matchedInProgress.matched.length})
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto rounded-xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-2">
                    {matchedInProgress.matched.map((course) => (
                      <span
                        key={course.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--glass-strong)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-strong)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {course.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasApplied && (
            <div role="status" className="rounded-xl border border-emerald-400/40 bg-emerald-500/15 p-3 text-center text-xs font-bold text-emerald-700">
              Disciplinas aplicadas com sucesso à sua grade!
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 border-t border-[var(--glass-border)] pt-3">
          <button
            type="button"
            onClick={handleClose}
            className="auth-secondary rounded-xl px-4 py-2.5 text-xs font-bold"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={matchedCompleted.matched.length === 0 && matchedInProgress.matched.length === 0}
            onClick={handleConfirm}
            className="auth-primary rounded-xl px-4 py-2.5 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aplicar à grade ({matchedCompleted.matched.length + matchedInProgress.matched.length})
          </button>
        </div>
      </div>
    </div>
  );

  if (isMounted && typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}
