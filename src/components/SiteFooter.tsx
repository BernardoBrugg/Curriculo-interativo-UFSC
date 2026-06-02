const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-10 w-full px-0 pt-8">
      <div className="glass-surface w-full rounded-none border-x-0 px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight text-[var(--text-strong)]">
              Curriculo Interativo UFSC
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
              Uma ferramenta local para visualizar progresso, dependencias e planejamento da
              Engenharia de Producao da UFSC.
            </p>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Engenharia de Producao - matriz 2023.1
          </p>
        </div>

        <div className="mx-auto mt-7 flex w-full max-w-7xl flex-col gap-3 border-t border-[var(--glass-border)] pt-5 text-xs text-[var(--text-faint)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Curriculo Interativo UFSC. Todos os direitos reservados.</span>
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
    </footer>
  );
}
