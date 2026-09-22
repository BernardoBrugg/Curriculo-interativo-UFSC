# Service Layer and Domain Libraries

## Directory Purpose
This directory encapsulates the business logic, service layers, validation rules, and persistence integrations for the curriculum system, decoupled from UI presentation.

## Modules and Responsibilities

- **`curriculum-progress.ts`**: Core graduation progress calculation service.
  - Takes curriculum data, subject statuses, and manual requirement hours.
  - Computes exact completed hours, total required hours, percentage, and requirement breakdown.
  - Ensures optative and extension limits are respected without exceeding source bounds.

- **`curriculum-requirements.ts`**: Prerequisite rule evaluation engine.
  - Evaluates complex expressions (`all`, `any`, `hours`, `course`).
  - Supports equivalent courses.

- **`curriculum-repository.ts`**: Data access abstraction for curricula data models.

- **`curriculum-validation.ts`**: Schema and consistency validator verifying curricula structures against official standards.

- **`firestore-progress.ts`**: Firebase Firestore persistence adapter for user subject status and preferences.

- **`local-progress.ts`**: Browser localStorage persistence layer supporting guest mode and offline-first state synchronization.

- **`pdf-parser.ts`**: Client-side PDF text extraction service utilizing `pdfjs-dist` to parse documents locally in the user's browser without uploading files to servers. Implements vertical line clustering and horizontal coordinate sorting to preserve visual table layout regardless of stream item ordering, and loads `pdf.worker.min.mjs` directly from the local public origin.
- **`cagr-transcript-parser.ts`**: Parser extracting student metadata (name, course, matrícula, curriculum code), course codes, and statuses (approved, in-progress) from official UFSC CAGR Histórico Síntese transcripts and legacy text copies. Implements dual-format row matching, comma and period decimal handling, multi-page continuation without premature abortion on legend footers, and directional fallback segmentation.

- **`course-popover.ts` & `course-popover-position.ts`**: Helper services calculating hover metadata and viewport boundary positioning for desktop cards.

- **`drag-copy.ts` & `drag-scroll.ts`**: Drag-and-drop text formatters and horizontal mouse dragging utilities.

## Data Flow
UI components or hooks call `calculateCurriculumProgress` passing `CurriculumProgressInput`. Results return immutable statistics (`CurriculumProgress`) rendered directly by progress dashboards.
