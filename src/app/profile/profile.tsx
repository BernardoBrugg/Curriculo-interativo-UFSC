"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProfileForm } from "./components/ProfileForm";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/");
  }, [isLoading, router, user]);

  if (isLoading || !user) return <main className="app-gradient min-h-screen" />;

  return (
    <main className="app-gradient min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-[var(--text-strong)]">Currículo Interativo UFSC</Link>
          <ThemeToggle />
        </header>
        <div className="py-12 sm:py-16">
          <Link href="/" className="text-sm font-semibold text-[var(--accent)] hover:underline">Voltar para meus cursos</Link>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">Conta</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text-strong)]">Seu perfil</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-muted)]">Atualize seus dados, preferências e formas de acesso ao currículo.</p>
          </div>
          <ProfileForm user={user} />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
