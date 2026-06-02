import Link from "next/link";
import { curriculum } from "@/data/curriculum";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";

const featureCards = [
  {
    title: "Progresso claro",
    text: "Veja horas, disciplinas concluidas e andamento geral sem planilhas paralelas.",
  },
  {
    title: "Dependencias visuais",
    text: "Passe por uma disciplina e entenda rapidamente o que destrava ou bloqueia o caminho.",
  },
  {
    title: "Planejamento por semestre",
    text: "Organize a grade por semestre, status e disponibilidade em uma unica superficie.",
  },
  {
    title: "Optativas sem confusao",
    text: "Separe optativas do curso e livres com as regras de carga horaria visiveis.",
  },
];

export default function LandingPage() {
  const totalCourses = curriculum.courses.length;
  const totalHours = curriculum.totalHours;

  return (
    <main className="app-gradient min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-[var(--text-strong)]">
            Curriculo Interativo UFSC
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="grid min-w-0 flex-1 items-center gap-10 py-14 lg:grid-cols-[1fr_0.92fr] lg:py-10">
          <div className="landing-copy animate-rise w-full min-w-0">
            <p className="mb-4 inline-flex rounded-full border border-[var(--glass-border)] bg-[var(--glass-muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] backdrop-blur">
              Engenharia de Producao UFSC 2023.1
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[var(--text-strong)] min-[430px]:text-5xl sm:text-6xl lg:text-7xl">
              <span className="block">Planeje sua</span>
              <span className="gradient-text block">Graduação</span>
              <span className="block">Atinja seus</span>
              <span className="block">Objetivos</span>
            </h1>
            <p className="mt-6 max-w-full text-base leading-7 text-[var(--text-muted)] min-[430px]:max-w-2xl sm:text-lg sm:leading-8">
              <span className="block">Acompanhe progresso e pre-requisitos.</span>
              <span className="block">Simule seu percurso em um painel interativo.</span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/producao"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--text-strong)] px-6 text-sm font-semibold text-[var(--bg-base)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                style={{ maxWidth: "18rem" }}
              >
                Comece ja
              </Link>
              <a
                href="#recursos"
                className="glass-control inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                style={{ maxWidth: "18rem" }}
              >
                Ver recursos
              </a>
            </div>
          </div>

          <div className="landing-preview animate-rise-delayed glass-surface w-full min-w-0 overflow-hidden rounded-[2rem] p-3 sm:p-4 lg:p-5">
            <div className="min-w-0 rounded-[1.5rem] border border-[var(--glass-border)] bg-[var(--glass-strong)] p-3 sm:p-4">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    Preview da ferramenta
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">28%</p>
                  <p className="text-sm text-[var(--text-muted)]">1210h de {totalHours}h</p>
                </div>
                <div className="flex min-w-0 flex-wrap gap-2 text-xs sm:shrink-0 sm:flex-col sm:text-right">
                  <span className="max-w-full truncate rounded-full bg-[var(--accent-soft)] px-2 py-1 font-semibold text-[var(--accent)]">
                    {totalCourses} disciplinas
                  </span>
                  <span className="max-w-full truncate rounded-full bg-[var(--glass-muted)] px-2 py-1 text-[var(--text-muted)]">
                    10 semestres
                  </span>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--accent-soft)]">
                <div className="preview-bar h-full w-[28%] origin-left rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[
                  ["Semestre 1", "MTM3100", "Concluida", "bg-emerald-500"],
                  ["Semestre 5", "EPS2351", "Liberada", "bg-[var(--accent)]"],
                  ["Semestre 9", "Optativas", "324h-a curso", "bg-[var(--color-type-op)]"],
                ].map(([semester, code, status, dot], index) => (
                  <div
                    key={semester}
                    className="animate-soft-pop glass-card min-w-0 rounded-2xl p-3"
                    style={{ animationDelay: `${240 + index * 110}ms` }}
                  >
                    <p className="truncate text-xs font-semibold text-[var(--text-muted)]">{semester}</p>
                    <p className="mt-2 truncate font-mono text-xs font-semibold text-[var(--text-faint)]">{code}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-strong)]">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <span className="truncate">{status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="glass-card rounded-2xl px-3 py-2">
                  <p className="text-xs text-[var(--text-faint)]">Pre-requisitos visiveis</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text-strong)]">0 {"->"} 4</p>
                </div>
                <div className="glass-card rounded-2xl px-3 py-2">
                  <p className="text-xs text-[var(--text-faint)]">Optativas livres</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text-strong)]">108h-a</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="relative z-10 mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {featureCards.map((feature, index) => (
          <ScrollReveal key={feature.title} delay={index * 90}>
            <article
            key={feature.title}
            className="animate-soft-pop glass-surface rounded-3xl p-6 transition hover:-translate-y-1"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                {index + 1}
              </span>
              <h2 className="mt-5 text-xl font-semibold text-[var(--text-strong)]">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{feature.text}</p>
            </article>
          </ScrollReveal>
        ))}
      </section>

      <ScrollReveal>
        <SiteFooter />
      </ScrollReveal>
    </main>
  );
}
