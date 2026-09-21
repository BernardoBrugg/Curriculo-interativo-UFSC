# Mobile UX Overhaul, Desktop Polish & Optativas Logic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the mobile touch experience (remove drag-and-drop conflicts, add a mobile bottom sheet modal for course status and phase management), fix optativas logic and phase clamping bugs (Materiais, Automação, Eletrônica), and polish desktop UI/UX (column height blowout and blocked feedback).

**Architecture:** A dedicated `CourseDetailModal` provides touch-first status cycling, phase relocation, prerequisite inspection, and syllabus reading without dragging. On desktop, `@dnd-kit` and hover popovers remain active, with sticky headers and scrollable phase containers. Curricula completion requirements are updated to cover unassigned optatives.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, `@dnd-kit/core`, Vitest, Testing Library.

## Global Constraints
- Zero comments inside any `.ts` or `.tsx` file (strictly enforced by workspace rules).
- Documentation via Markdown: every touched or new folder must maintain a valid `README.md`.
- No regression in existing tests; all Vitest tests must pass.

---

### Task 1: Fix Optativas and Phase Data Bugs

**Files:**
- Modify: `src/app/[course]/components/CurriculumGrid.tsx`
- Modify: `src/data/curricula/automacao/curriculum.json`
- Modify: `src/data/curricula/eletronica/curriculum.json`
- Modify: `src/lib/drag-copy.ts`
- Test: `tests/data/curricula-contract.test.ts`
- Test: `tests/lib/drag-copy.test.ts`

**Interfaces:**
- Consumes: `CurriculumData`, `PhaseInfo`, `Course`
- Produces: Correctly grouped courses by phase without clipping at phase 10; Phase 0 labeled as "Optativas".

- [ ] **Step 1: Write test for phase grouping with phases > 10 and Phase 0 labeling**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Update `CurriculumGrid.tsx` to remove `Math.min(targetPhase, 10)` and format Phase 0 label as "Optativas"**
- [ ] **Step 4: Update `drag-copy.ts` so `getDropTargetLabel(0)` returns "Soltar em Optativas"**
- [ ] **Step 5: Include `DAS5200` in automacao completion requirements and `EEL7701-7704` in eletronica completion requirements**
- [ ] **Step 6: Run test suite to verify tests pass**
- [ ] **Step 7: Commit changes**

---

### Task 2: Implement Mobile Course Details Modal / Bottom Sheet

**Files:**
- Create: `src/app/[course]/components/CourseDetailModal.tsx`
- Test: `tests/app/course-detail-modal.test.tsx`

**Interfaces:**
- Consumes: `Course`, `CourseStatus`, `PhaseInfo`, `coursesById`
- Produces: `CourseDetailModal` component with status switching, phase relocation, prerequisite status display, and syllabus reading.

- [ ] **Step 1: Write test for `CourseDetailModal` rendering and interactions**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `CourseDetailModal.tsx` with zero in-code comments**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 3: Refactor `CourseCard.tsx` and `CurriculumGrid.tsx` for Touch and Desktop Polish

**Files:**
- Modify: `src/app/[course]/components/CourseCard.tsx`
- Modify: `src/app/[course]/components/CurriculumGrid.tsx`
- Modify: `src/app/[course]/[course].tsx`
- Test: `tests/app/curriculum-grid.test.tsx`

**Interfaces:**
- Consumes: `CourseDetailModal`, `useDragScroll`, `useDragTutorial`
- Produces: Conflict-free touch scrolling, mobile modal trigger on card tap, desktop popovers restricted to mouse hover, sticky column headers and scrollable containers on desktop.

- [ ] **Step 1: Write tests for mobile tap triggering modal and drag handle hidden on mobile**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Update `CourseCard.tsx` to hide drag handle on mobile and prevent stuck hover popover**
- [ ] **Step 4: Update `CurriculumGrid.tsx` to connect `CourseDetailModal`, fix desktop column heights, and provide feedback on blocked courses**
- [ ] **Step 5: Run tests and verify all pass**
- [ ] **Step 6: Commit changes**

---

### Task 4: Documentation and Workspace Integrity

**Files:**
- Modify/Create: `src/app/[course]/components/README.md`

**Interfaces:**
- Documents the purpose, component interactions, and data flow of `CourseDetailModal`, `CurriculumGrid`, `CourseCard`, and related components.

- [ ] **Step 1: Write/update `src/app/[course]/components/README.md`**
- [ ] **Step 2: Check all modified files to ensure zero comments remain**
- [ ] **Step 3: Run full test suite and build (`npm test && npm run build`)**
- [ ] **Step 4: Commit changes**
