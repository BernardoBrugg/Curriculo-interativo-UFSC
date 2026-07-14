"use client";

import Link from "next/link";

import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthScreen } from "./components/AuthScreen";
import { CourseLibrary } from "./components/CourseLibrary";
import { ProfileMenu } from "@/components/ProfileMenu";
import { useAuth } from "@/components/AuthProvider";

const featureCards = [
  {
    title: "Progresso claro",
    text: "Veja horas, disciplinas concluídas e andamento geral sem planilhas paralelas.",
  },
  {
    title: "Dependências visuais",
    text: "Passe por uma disciplina e entenda rapidamente o que destrava ou bloqueia o caminho.",
  },
  {
    title: "Planejamento por semestre",
    text: "Organize a grade por semestre, status e disponibilidade em uma única superfície.",
  },
  {
    title: "Optativas sem confusão",
    text: "Separe optativas do curso e livres com as regras de carga horária visíveis.",
  },
];


export default function LandingPage() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <main className="app-gradient min-h-screen" />;
  }

  return (
    <main className="app-gradient min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-[var(--text-strong)]">
            Currículo Interativo UFSC
          </Link>
          <div className="flex items-center gap-2">
            {user && <ProfileMenu />}
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
              <span className="block">Acompanhe progresso e pré-requisitos.</span>
              <span className="block">Simule seu percurso em um painel interativo.</span>
            </p>


          </div>

          <div className="animate-rise-delayed w-full min-w-0">
            {user ? <CourseLibrary /> : <AuthScreen />}
          </div>

        </div>
      </section>

      <section id="recursos" className="relative z-10 mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {featureCards.map((feature, index) => (
          <ScrollReveal key={feature.title} delay={index * 90} className="h-full">
            <article
              key={feature.title}
              className="animate-soft-pop glass-surface h-full rounded-3xl p-6 transition hover:-translate-y-1"
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
