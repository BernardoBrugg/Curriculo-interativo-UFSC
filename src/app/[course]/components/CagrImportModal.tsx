"use client";

import { ChangeEvent, DragEvent, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Course } from "@/types/curriculum";
import { parseCagrTranscript, CagrParseResult } from "@/lib/cagr-transcript-parser";
import { extractTextFromPdf } from "@/lib/pdf-parser";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<CagrParseResult | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  const handleResetFile = useCallback(() => {
    setFile(null);
    setParsedResult(null);
    setParseError(null);
    setHasApplied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleClose = useCallback(() => {
    handleResetFile();
    onClose();
  }, [handleResetFile, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const processFile = useCallback(async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith(".pdf") && selectedFile.type !== "application/pdf") {
      setParseError("Formato de arquivo inválido. Por favor, envie um arquivo .pdf emitido pelo CAGR.");
      return;
    }

    setFile(selectedFile);
    setParseError(null);
    setIsProcessing(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const text = await extractTextFromPdf(buffer);
      const result = parseCagrTranscript(text);

      if (result.recognizedCount === 0) {
        setParseError("Nenhuma disciplina foi identificada neste arquivo. Certifique-se de que é o Histórico Síntese de Graduação oficial do CAGR.");
        setParsedResult(null);
      } else {
        setParsedResult(result);
      }
    } catch {
      setParseError("Erro ao processar o arquivo PDF. Verifique se o arquivo não está corrompido ou protegido por senha.");
      setParsedResult(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      void processFile(droppedFiles[0]);
    }
  }, [processFile]);

  const handleFileInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      void processFile(selectedFiles[0]);
    }
  }, [processFile]);

  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    allCourses.forEach((courseItem) => {
      map.set(courseItem.code.toUpperCase(), courseItem);
      map.set(courseItem.id.toUpperCase(), courseItem);
      if (courseItem.equivalents) {
        courseItem.equivalents.forEach((equiv) => {
          map.set(equiv.toUpperCase(), courseItem);
        });
      }
    });
    return map;
  }, [allCourses]);

  const matchedCompleted = useMemo(() => {
    if (!parsedResult) return { matched: [], unmatched: [] };
    const matched: Course[] = [];
    const unmatched: string[] = [];
    parsedResult.completedCourses.forEach((code) => {
      const courseItem = courseMap.get(code);
      if (courseItem) matched.push(courseItem);
      else unmatched.push(code);
    });
    return { matched, unmatched };
  }, [courseMap, parsedResult]);

  const matchedInProgress = useMemo(() => {
    if (!parsedResult) return { matched: [], unmatched: [] };
    const matched: Course[] = [];
    const unmatched: string[] = [];
    parsedResult.inProgressCourses.forEach((code) => {
      const courseItem = courseMap.get(code);
      if (courseItem) matched.push(courseItem);
      else unmatched.push(code);
    });
    return { matched, unmatched };
  }, [courseMap, parsedResult]);

  const totalMatchedCount = matchedCompleted.matched.length + matchedInProgress.matched.length;
  const unmatchedCount = matchedCompleted.unmatched.length + matchedInProgress.unmatched.length;

  const handleConfirm = () => {
    const completedIds = matchedCompleted.matched.map((courseItem) => courseItem.id);
    const inProgressIds = matchedInProgress.matched.map((courseItem) => courseItem.id);
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
              Importação Inteligente
            </span>
            <h2 id="cagr-import-title" className="mt-1 text-lg font-bold text-[var(--text-strong)] sm:text-xl">
              Importar Histórico do CAGR
            </h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Envie o PDF do Histórico Síntese oficial para preencher suas disciplinas automaticamente.
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
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
            aria-label="Selecionar arquivo PDF do Histórico Escolar"
          />

          {!parsedResult && !isProcessing && (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragging
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--glass-border)] bg-[var(--glass-muted)] hover:border-[var(--accent)] hover:bg-[var(--glass-strong)]"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] text-[var(--accent)] shadow-sm transition-transform group-hover:scale-105">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <p className="mt-4 text-sm font-bold text-[var(--text-strong)]">
                  Arraste e solte o Histórico em PDF aqui
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  ou clique para selecionar o arquivo no seu computador ou celular
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-surface)] px-3 py-1 text-[11px] font-semibold text-[var(--text-faint)]">
                  <svg className="h-3.5 w-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5h-1V15H7V9h2.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5zm0-3.5H8.5v2H9.5c.6 0 1-.4 1-1s-.4-1-1-1zm8 6h-1.5l-1.8-3.2V15H13V9h2.5c1.4 0 2.5 1.1 2.5 2.5 0 1.1-.7 2-1.7 2.3l2.2 3.2zm-2-4.5h-1V12h1c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  Aceita exclusivamente arquivo PDF
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                  Como emitir seu histórico no CAGR
                </p>
                <ol className="mt-2 space-y-1.5 text-xs text-[var(--text-muted)]">
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--glass-strong)] font-mono text-[10px] font-bold text-[var(--accent)]">1</span>
                    <span>Acesse <strong className="text-[var(--text-strong)]">cagr.sistemas.ufsc.br</strong> com seu IdUFSC.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--glass-strong)] font-mono text-[10px] font-bold text-[var(--accent)]">2</span>
                    <span>No menu lateral esquerdo, clique em <strong className="text-[var(--text-strong)]">Histórico Escolar &gt; Histórico Síntese</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--glass-strong)] font-mono text-[10px] font-bold text-[var(--accent)]">3</span>
                    <span>Clique em Imprimir ou salvar em PDF e faça o envio acima.</span>
                  </li>
                </ol>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <svg className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span><strong>Privacidade total:</strong> Seu PDF é lido 100% no seu navegador. Nenhum dado ou arquivo é enviado para a internet.</span>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-muted)] py-12 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--accent)] border-t-transparent" />
              <p className="mt-4 text-sm font-bold text-[var(--text-strong)]">
                Lendo e processando seu Histórico Síntese...
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Identificando disciplinas cursadas, notas e frequências
              </p>
            </div>
          )}

          {parseError && (
            <div role="alert" className="space-y-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1 text-xs text-red-700 dark:text-red-300">
                  <p className="font-bold">Não foi possível importar o arquivo</p>
                  <p className="mt-1">{parseError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetFile}
                className="w-full rounded-xl border border-red-500/30 bg-red-500/15 py-2 text-xs font-bold text-red-700 hover:bg-red-500/25 dark:text-red-300"
              >
                Tentar com outro arquivo
              </button>
            </div>
          )}

          {parsedResult && !isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[var(--text-strong)]">{file?.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {file?.size ? `${(file.size / 1024).toFixed(1)} KB` : "PDF processado"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetFile}
                  className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-strong)]"
                >
                  Trocar PDF
                </button>
              </div>

              {(parsedResult.studentName || parsedResult.courseName || parsedResult.matricula) && (
                <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-3.5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--on-accent)] font-bold">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      {parsedResult.studentName && (
                        <p className="truncate text-sm font-bold text-[var(--text-strong)]">
                          {parsedResult.studentName}
                        </p>
                      )}
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--text-muted)]">
                        {parsedResult.courseName && <span>{parsedResult.courseName}</span>}
                        {parsedResult.matricula && (
                          <span>
                            • Matrícula: <strong className="font-mono text-[var(--text-strong)]">{parsedResult.matricula}</strong>
                          </span>
                        )}
                        {parsedResult.curriculumCode && (
                          <span>
                            • Currículo: <strong className="font-mono text-[var(--text-strong)]">{parsedResult.curriculumCode}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{matchedCompleted.matched.length}</p>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">Aprovadas na grade</p>
                </div>
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3">
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{matchedInProgress.matched.length}</p>
                  <p className="font-semibold text-amber-800 dark:text-amber-300">Cursando / Matriculadas</p>
                </div>
              </div>

              {matchedCompleted.matched.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)]">
                    Disciplinas para marcar como concluídas ({matchedCompleted.matched.length})
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto rounded-xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-2">
                    {matchedCompleted.matched.map((courseItem) => (
                      <span
                        key={courseItem.id}
                        title={courseItem.name}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--glass-strong)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-strong)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {courseItem.code}
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
                    {matchedInProgress.matched.map((courseItem) => (
                      <span
                        key={courseItem.id}
                        title={courseItem.name}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--glass-strong)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-strong)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {courseItem.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {totalMatchedCount === 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
                  <p className="font-bold">Nenhuma disciplina reconhecida pertence à grade deste curso.</p>
                  <p className="mt-1">Foram encontradas {parsedResult.recognizedCount} disciplinas no documento, mas nenhuma delas corresponde à grade ou equivalências do curso aberto.</p>
                </div>
              )}

              {unmatchedCount > 0 && totalMatchedCount > 0 && (
                <p className="text-[11px] text-[var(--text-muted)]">
                  + {unmatchedCount} disciplina(s) do histórico não constam na grade deste curso (optativas livres ou outros departamentos).
                </p>
              )}

              {hasApplied && (
                <div role="status" className="rounded-xl border border-emerald-400/40 bg-emerald-500/15 p-3 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Disciplinas aplicadas com sucesso à sua grade!
                </div>
              )}
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
            disabled={totalMatchedCount === 0 || isProcessing || hasApplied}
            onClick={handleConfirm}
            className="auth-primary rounded-xl px-4 py-2.5 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasApplied
              ? "Aplicado!"
              : isProcessing
              ? "Processando..."
              : `Aplicar à grade (${totalMatchedCount})`}
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
