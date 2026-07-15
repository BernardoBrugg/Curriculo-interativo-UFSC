"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";

export function ProfileMenu() {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Abrir menu do perfil"
        className="glass-control inline-grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-[var(--text-strong)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5.5 20c.8-3.2 3.05-5 6.5-5s5.7 1.8 6.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {isOpen && (
        <div role="menu" className="absolute right-0 top-12 z-50 min-w-48 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-strong)] p-2 shadow-xl backdrop-blur-xl">
          <div className="border-b border-[var(--glass-border)] px-3 py-2">
            <p className="truncate text-sm font-semibold text-[var(--text-strong)]">{user.displayName || "Seu perfil"}</p>
            <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
          </div>
          <Link href="/profile" role="menuitem" onClick={() => setIsOpen(false)} className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
            Perfil
          </Link>
          <button type="button" role="menuitem" onClick={() => void logOut()} className="mt-1 block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--accent-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
