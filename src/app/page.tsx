import Link from "next/link";

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

import { availableCourses } from "@/data/curricula";

export default function LandingPage() {
  return (
    <main className="app-gradient min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-[var(--text-strong)]">
            Currículo Interativo UFSC
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="grid min-w-0 flex-1 items-center gap-10 py-14 lg:grid-cols-[1fr_0.92fr] lg:py-10">
          <div className="landing-copy animate-rise w-full min-w-0">
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


          </div>

          <div className="animate-rise-delayed w-full min-w-0">
            <div className="rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-surface)]/30 p-6 backdrop-blur-sm sm:p-8">
              <h3 className="mb-6 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.15em] text-[var(--text-faint)]">
                Selecione seu curso
                <span className="h-px flex-1 bg-gradient-to-r from-[var(--glass-border)] to-transparent" />
              </h3>

              <div className="grid gap-3 min-[430px]:grid-cols-2">
                {availableCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/${course.id}`}
                    className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--glass-strong)] hover:shadow-lg hover:shadow-[var(--accent)]/10 hover:border-[var(--accent)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/0 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex min-w-0 flex-col">
                      <span className="truncate text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--accent)] transition-colors duration-300">
                        {course.name.replace("Engenharia ", "Eng. ")}
                      </span>
                      <span className="mt-1 truncate text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        {course.description}
                      </span>
                    </div>

                    <div className="relative z-10 ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-primary)] shadow-inner ring-1 ring-[var(--glass-border)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:ring-[var(--accent)] text-[var(--text-faint)]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
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
