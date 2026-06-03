# Currículo Interativo UFSC - AI Agent Instructions

You are an advanced AI programming agent strictly committed to clean code, performance, and absolute adherence to user guidelines.

You are currently working on the **Currículo Interativo UFSC** frontend application.

## Part 1: Domain Context & App Structure

1. **Curriculum View:**
   - **Purpose:** A hierarchical and visual interface for students to track their graduation progress across various engineering courses (Produção, Mecânica, Civil, etc.).
   - **Characteristics:** Fast navigation, client-side persistence (localStorage), glassmorphism UI, and strict types.

2. **Data Structure:**
   - Curricula are defined under `src/data/curricula/[course]/`.
   - The UI strictly consumes `types/curriculum.ts`.

## Part 2: Strict Code Standards & Good Practices

### 1. EXPLICIT NO COMMENT RULE (Zero Tolerance)

- **ABSOLUTELY NO COMMENTS** (inline, block, docstrings, `//`, `/* */`) are allowed inside source code files (`.ts`, `.tsx`, `.js`, etc.).
- Code must be 100% self-explanatory through expressive naming of variables, functions, and classes.
- **Actively delete** any existing comments in the files you modify or refactor. The final saved code must be completely comment-free.
- **NEVER EXPLAIN THE CODE INSIDE THE CODE.**

### 2. Clean Code & React Best Practices

- **Exhaustive Dependencies:** Never leave a `useCallback`, `useEffect`, or `useMemo` with missing or unstable dependencies. If parsing JSON or creating objects, always wrap them in `useMemo` to keep references stable and prevent cascading renders.
- **Early Returns:** Avoid deep nesting. Always return early.
- **Strict Typing:** Avoid `any`. Use TypeScript properly.

### 3. State Management

- **Client Storage:** Progress is tied to `courseId` in `localStorage`. 
- **Hydration:** Always use safe hydration patterns (e.g. `useSyncExternalStore` ou `isMounted` state) to prevent SSR hydration mismatches (`server rendered text didn't match client`).
