"use client";

import { useState } from "react";
import { FeedbackDialog } from "@/components/FeedbackDialog";

const year = new Date().getFullYear();

export function SiteFooter() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <footer className="relative z-10 mt-10 w-full px-0 pt-8">
      <div className="glass-surface w-full rounded-none border-x-0 px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight text-[var(--text-strong)]">
              Currículo Interativo UFSC
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              Uma ferramenta local para visualizar progresso, dependências e planejamento da
              Engenharia de Produção da UFSC.
            </p>
          </div>
          <button type="button" onClick={() => setIsFeedbackOpen(true)} className="auth-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold">
            <span aria-hidden="true" className="text-base">✦</span>
            Enviar feedback
          </button>
        </div>

        <div className="mx-auto mt-7 flex w-full max-w-7xl flex-col gap-3 border-t border-[var(--glass-border)] pt-5 text-xs text-[var(--text-faint)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Currículo Interativo UFSC. Todos os direitos reservados.</span>
          <div className="flex flex-wrap items-center gap-3">
            <span>Desenvolvido por Bernardo Bruggemann.</span>
            <a
              href="https://www.linkedin.com/in/bernardobruggemann"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-strong)]"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/BernardoBrugg"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-strong)]"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      {isFeedbackOpen && <FeedbackDialog onClose={() => setIsFeedbackOpen(false)} />}
    </footer>
  );
}
