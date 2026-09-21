# Design Spec: Mobile UX Overhaul, Desktop Polish & Optativas Logic Fixes

**Date:** 2026-09-21  
**Status:** Approved  
**Author:** AI Agent (Antigravity) & Bernardo  

---

## 1. Overview & Goals

1. **Mobile UX Overhaul:**
   - Eliminate touchscreen interaction conflicts on mobile devices (`< md` breakpoint).
   - Remove drag-and-drop completely from mobile views.
   - Disable stuck hover popovers on touch devices.
   - Implement a fluid Mobile Bottom Sheet / Modal for course inspection, status updates (Pendente, Cursando, Concluída), and semester reassignment without dragging.
   - Replace misleading "Semestre 0" labels with "Optativas".

2. **Optativas Logic & Data Integrity:**
   - Remove `Math.min(targetPhase, 10)` in `CurriculumGrid.tsx` which hid courses in phases 11 and 13 (e.g., Engenharia de Materiais).
   - Include unassigned optatives in `completion.requirements` (Automação: `DAS5200` Atividades Complementares; Eletrônica: `EEL7701-7704` etc.).
   - Verify and ensure completion hours calculations correctly track mandatory and optative requirements.

3. **Desktop UI/UX Polish:**
   - Fix Phase 0 / Optativas column height blowout (e.g. 163 optatives in Elétrica stretching the column to 15,000px tall) by implementing a sticky header and scrollable card container.
   - Provide clear visual feedback when clicking on a blocked course instead of silently ignoring user clicks.
   - Adhere strictly to the workspace's Zero-Comment Rule and directory documentation guidelines.

---

## 2. Architecture & Component Changes

### 2.1 Mobile Bottom Sheet (`CourseDetailModal.tsx` or `CourseBottomSheet.tsx`)
- Located at: `src/app/[course]/components/CourseDetailModal.tsx`
- Props:
  - `course: Course | null`
  - `allCourses: Course[]`
  - `status: CourseStatus`
  - `computedState: "completed" | "in-progress" | "available" | "blocked"`
  - `currentPhase: number`
  - `phases: PhaseInfo[]`
  - `isBlocked: boolean`
  - `blockingPrerequisites: string[]`
  - `onClose: () => void`
  - `onSetStatus: (status: CourseStatus) => void`
  - `onMovePhase: (toPhase: number) => void`
- Capabilities:
  - Renders as an accessible modal / bottom sheet on mobile screens (backdrop overlay with blur).
  - Status toggle buttons (Pendente / Cursando / Concluída). If blocked, shows warning and prevents setting to completed/in-progress.
  - Semester selector ("Mover para...") dropdown / pill group to move courses to any valid phase without dragging.
  - Lists prerequisite courses with status indicators and dependent courses.
  - Displays course syllabus (ementa).

### 2.2 `CourseCard.tsx`
- Remove drag activator button (`data-drag-handle`) on mobile devices (`hidden md:flex`).
- Disable portal popover on touch devices by checking pointer media or viewport width, preventing stuck tooltips.
- On mobile (`< md`), tapping the card opens the `CourseDetailModal`.
- On desktop (`>= md`), hovering displays the popover and clicking cycles status (with feedback if blocked).

### 2.3 `CurriculumGrid.tsx`
- Disable `DndContext` drag operations on touch/mobile (e.g. only enable pointer sensor with mouse constraint or wrap DnD around desktop only).
- Remove `Math.min(targetPhase, 10)` clamping so phases 11 and 13 render correctly in Materiais.
- Dynamically format phase titles: use `phase.name` or if `phase.number === 0`, label as `"Optativas"` instead of `"Semestre 0"`.
- Style column cards container with `max-h-[calc(100vh-270px)] overflow-y-auto` and sticky headers on desktop so columns with 100+ courses (Elétrica/Mecânica optatives) don't stretch the page infinitely.
- Update mobile semester tabs: replace "Semestre 0" with "Optativas".
- Update tutorial card: conditionally adapt message for mobile (tap to view details / change status / move semester).

### 2.4 Optativas & Data Integrity
- Ensure `DAS5200` in `automacao/curriculum.json` is properly included in the `free-electives` requirement.
- Ensure `EEL7701-EEL7704` and related activities in `eletronica/curriculum.json` are included in `general-electives` requirement.
- Verify that `calculateCurriculumProgress` handles all scenarios accurately without errors.

---

## 3. Testing & Verification

1. Automated Tests:
   - Run `npm test` across all unit tests to ensure contracts and progression calculations pass.
   - Add tests for `CourseDetailModal` interactions (status change, phase move).
   - Test phase grouping to ensure phases > 10 (Materiais) are properly retained.
2. Build & Type Checking:
   - Run `npm run build` to guarantee no TypeScript or Next.js build issues.
3. Code Style Verification:
   - Confirm zero comments in any `.ts` / `.tsx` files.
   - Verify `README.md` in `src/app/[course]/components/`.
