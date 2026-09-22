# Course Page Components

## Directory Purpose
This directory contains UI components specific to the course curriculum viewer route (`/[course]`). It renders the interactive curriculum matrix, progress dashboard, requirement meters, course cards, and modal dialogs for desktop and mobile devices.

## Architecture and Components

- **`CurriculumGrid.tsx`**: Orchestrates the multi-phase curriculum board.
  - Manages column grouping for all semesters and the "Optativas" pool.
  - Controls horizontal scrolling on desktop and single-phase tabbed navigation on mobile.
  - Integrates `@dnd-kit` for desktop drag-and-drop course phase relocation while isolating mobile touch interactions.
  - Mounts `CourseDetailModal` when courses are selected on mobile devices or when blocked courses are tapped.
  - Constrains desktop column height (`max-h-[calc(100vh-270px)]`) with sticky phase headers to avoid page blowout from large elective pools.

- **`CourseCard.tsx`**: Renders individual discipline cards.
  - Displays course code, title, credits, hours, status indicators, and prerequisite ring highlights.
  - Encapsulates desktop drag activator (`hidden md:flex`) and desktop hover popovers (`@media (hover: hover)`).
  - Delegates click interactions: on mobile or when a course is blocked by prerequisites, triggers `onOpenDetails` instead of dead clicks.

- **`CourseDetailModal.tsx`**: Bottom sheet / dialog for touch and inspection workflows.
  - Provides touch-friendly status controls (Pendente, Cursando, Concluída).
  - Offers a semester picker allowing instantaneous phase relocation without drag-and-drop.
  - Lists prerequisite statuses (fulfilled vs missing) and dependent courses unlocked.
  - Displays the complete course syllabus (ementa).

- **`ProgressDashboard.tsx`**: Top-level dashboard displaying graduation progress percentage, completed hours, course counts, and search controls.
  - Integrates `RequirementProgress` for curriculum requirements (electives, complementary activities, extension).

- **`RequirementProgress.tsx`**: Sub-component tracking specific curricular requirements and external manual hours inputs.

- **`CurriculumFilters.tsx`**: Quick status and course type filter chips (Todas, Liberadas, Cursando, Pendentes, Concluídas, Obrigatórias, Optativas) with dynamic badge counters.
- **`CagrImportModal.tsx`**: Modal dialog allowing students to paste UFSC CAGR academic history text and automatically match completed and enrolled disciplines to their curriculum.

- **`SearchBar.tsx`**: Quick search input filtering courses across all phases by code or name, with keyboard shortcut `/`.

## Data Flow
1. Parent page (`[course].tsx`) fetches curriculum data and user statuses.
2. `CurriculumGrid` receives `phases`, `courses`, `statuses`, and `customPhases`.
3. User interactions on mobile (tapping a card) open `CourseDetailModal`.
4. Updating status or phase calls `onToggleStatus` and `onMoveCourse`, updating parent state and persisting changes.
