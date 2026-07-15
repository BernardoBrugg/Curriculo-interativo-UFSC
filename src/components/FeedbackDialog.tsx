"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { feedbackCharacterLimit, validateFeedbackPayload } from "@/lib/feedback-validation";

type FeedbackDialogProps = { onClose: () => void };

export function FeedbackDialog({ onClose }: FeedbackDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateFeedbackPayload(message, file);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError("");
    setIsSending(true);
    const formData = new FormData();
    formData.append("message", message);
    if (file) formData.append("file", file);

    try {
      const response = await fetch("/api/feedback", { method: "POST", body: formData });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Não foi possível enviar o feedback agora.");
      setIsSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível enviar o feedback agora.");
    } finally {
      setIsSending(false);
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-md" role="presentation" onClick={onClose}>
      <div className="glass-surface my-auto max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="feedback-title" onClick={(event) => event.stopPropagation()}>
        {isSent ? (
          <div className="py-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-2xl text-[var(--on-accent)]">✓</div>
            <h2 id="feedback-title" className="mt-5 text-xl font-black text-[var(--text-strong)]">Feedback enviado</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">Obrigado por ajudar a melhorar a plataforma.</p>
            <button type="button" onClick={onClose} className="auth-primary mt-6 rounded-xl px-5 py-3 text-sm font-bold">Fechar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-faint)]">Sua opinião importa</p>
                <h2 id="feedback-title" className="mt-2 text-2xl font-black text-[var(--text-strong)]">Enviar feedback</h2>
              </div>
              <button type="button" aria-label="Fechar feedback" onClick={onClose} className="rounded-full p-2 text-xl leading-none text-[var(--text-muted)] transition hover:bg-[var(--glass-muted)] hover:text-[var(--text-strong)]">×</button>
            </div>
            <label htmlFor="feedback-message" className="mt-6 block text-sm font-bold text-[var(--text-strong)]">Mensagem</label>
            <textarea id="feedback-message" value={message} maxLength={feedbackCharacterLimit} onChange={(event) => setMessage(event.target.value)} rows={5} className="glass-control mt-2 w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" placeholder="Conte o que podemos melhorar..." />
            <div className="mt-2 flex justify-end text-xs text-[var(--text-faint)]">{message.length}/{feedbackCharacterLimit}</div>
            <label htmlFor="feedback-file" className="mt-4 block text-sm font-bold text-[var(--text-strong)]">Foto <span className="font-normal text-[var(--text-muted)]">(opcional)</span></label>
            <input ref={fileInputRef} id="feedback-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-2xl border border-dashed border-[var(--glass-border)] px-4 py-3 text-sm text-[var(--text-muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-2 file:font-bold file:text-[var(--text-strong)]" />
            {file && <p className="mt-2 truncate text-xs text-[var(--text-muted)]">{file.name}</p>}
            {error && <p role="alert" className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-500">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="auth-secondary rounded-xl px-4 py-3 text-sm font-bold">Cancelar</button>
              <button type="submit" disabled={isSending} className="auth-primary rounded-xl px-5 py-3 text-sm font-bold disabled:cursor-wait disabled:opacity-60">{isSending ? "Enviando..." : "Enviar feedback"}</button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
