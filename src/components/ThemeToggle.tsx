"use client";

import { useEffect, useState } from "react";

type ThemeChoice = "light" | "dark";

const STORAGE_KEY = "curriculo-theme";

function applyTheme(choice: ThemeChoice) {
  document.documentElement.dataset.theme = choice;
  document.documentElement.dataset.themeChoice = choice;
  localStorage.setItem(STORAGE_KEY, choice);
}

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
    const initial =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    const frameId = requestAnimationFrame(() => setChoice(initial));

    applyTheme(initial);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const toggleTheme = () => {
    const next = choice === "dark" ? "light" : "dark";
    setChoice(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass-control group inline-grid h-10 w-10 place-items-center rounded-full transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      aria-label={choice === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {choice === "dark" ? (
        <svg className="h-4 w-4 text-[var(--accent)] transition group-hover:rotate-12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4V2M12 22v-2M20 12h2M2 12h2M18.36 5.64l1.42-1.42M4.22 19.78l1.42-1.42M18.36 18.36l1.42 1.42M4.22 4.22l1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-[var(--accent)] transition group-hover:-rotate-12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20.5 14.5A7.5 7.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
