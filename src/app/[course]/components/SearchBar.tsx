"use client";

import { useEffect, useRef } from "react";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export function SearchBar({ query, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar por codigo ou disciplina"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-full border border-[var(--glass-border)] bg-[var(--glass-strong)] px-4 pr-11 text-sm text-[var(--text-strong)] outline-none backdrop-blur transition placeholder:text-[var(--text-faint)] focus:ring-2 focus:ring-[var(--ring)]"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-muted)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-faint)] sm:block">
        /
      </span>
      {query && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-faint)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text-strong)] sm:right-9"
          aria-label="Limpar busca"
        >
          x
        </button>
      )}
    </div>
  );
}
