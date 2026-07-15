# Curricula Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild nine UFSC curricula from official CAGR reports, calculate graduation progress from course-specific requirements, and safely repopulate Firestore.

**Architecture:** Official PDF snapshots and normalized text are immutable inputs. A deterministic generator produces typed curriculum JSON plus explicit completion requirements, while pure domain functions validate data and calculate progress. The Firestore seed validates, backs up, atomically writes, and verifies only the `curricula` collection.

**Tech Stack:** TypeScript 5, Next.js 16, React 19, Vitest 4, Firebase 12, Firebase Admin 14, Firestore, Poppler `pdftotext` for source extraction.

## Global Constraints

- Source files contain no inline, block, or documentation comments.
- TypeScript remains strict and does not use `any`.
- Existing user statuses remain keyed by official course code.
- Firestore writes never mutate the `users` collection.
- Curriculum generation fails on ambiguity or integrity errors.
- Completion rules are explicit per curriculum and never inferred from catalogue size.

---

### Task 1: Completion domain model and calculator

**Files:**
- Modify: `src/types/curriculum.ts`
- Create: `src/lib/curriculum-progress.ts`
- Test: `tests/lib/curriculum-progress.test.ts`

**Interfaces:**
- Produces: `RequirementExpression`, `CurriculumRequirementSource`, `CurriculumRequirement`, `CurriculumCompletion`, `CurriculumProgressInput`, `CurriculumProgress`, `calculateCurriculumProgress(input)`.
- Consumes: existing `Course` and `CourseStatus`.

- [ ] **Step 1: Write failing calculator tests**

```ts
it("does not let excess electives replace a required course", () => {
  const progress = calculateCurriculumProgress({ curriculum, statuses: { OB1: "pending", OP1: "completed", OP2: "completed" }, requirementHours: {} });
  expect(progress.percent).toBeLessThan(100);
});

it("reaches one hundred with every fixed component and exact elective minima", () => {
  const progress = calculateCurriculumProgress({ curriculum, statuses: { OB1: "completed", OP1: "completed" }, requirementHours: {} });
  expect(progress.percent).toBe(100);
});
```

- [ ] **Step 2: Run tests and confirm RED**

Run: `npm test -- tests/lib/curriculum-progress.test.ts`

Expected: failure because `calculateCurriculumProgress` does not exist.

- [ ] **Step 3: Add typed requirement expressions and completion configuration**

```ts
export type RequirementExpression =
  | { kind: "course"; code: string }
  | { kind: "all"; requirements: RequirementExpression[] }
  | { kind: "any"; requirements: RequirementExpression[] }
  | { kind: "hours"; hours: number; courseType?: "Ob" };

export interface CurriculumRequirementSource {
  id: string;
  courseIds: string[];
  allowsManualHours: boolean;
  maxHours?: number;
}

export interface CurriculumRequirement {
  id: string;
  name: string;
  requiredHours: number;
  sources: CurriculumRequirementSource[];
}

export interface CurriculumCompletion {
  requiredCourseIds: string[];
  requirements: CurriculumRequirement[];
}
```

- [ ] **Step 4: Implement pure capped progress calculation**

The calculator counts completed fixed courses individually, sums each source once, applies source caps before requirement caps, rejects duplicate course contribution across requirements, and returns per-requirement details plus overall hours and percent.

- [ ] **Step 5: Run calculator tests and confirm GREEN**

Run: `npm test -- tests/lib/curriculum-progress.test.ts`

Expected: all calculator tests pass.

### Task 2: Canonical source snapshots and extraction pipeline

**Files:**
- Create: `data/curricula/sources/*.pdf`
- Create: `data/curricula/sources/*.txt`
- Create: `data/curricula/sources/manifest.json`
- Create: `data/curricula/overrides/*.json`
- Create: `scripts/lib/cagr-curriculum-parser.ts`
- Create: `scripts/generate-curricula.ts`
- Test: `tests/scripts/cagr-curriculum-parser.test.ts`

**Interfaces:**
- Produces: `parseCagrCurriculum(text, overrides)`, canonical `CurriculumData` JSON files, and source hashes.
- Consumes: versioned `pdftotext -layout` outputs and explicit override records.

- [ ] **Step 1: Copy exact official PDFs and normalized text into versioned source paths**

Use names `<courseId>-<curriculumCode>.pdf` and `<courseId>-<curriculumCode>.txt`. Record exact CAGR URL and SHA-256 in `manifest.json`.

- [ ] **Step 2: Write failing parser fixture tests**

Tests cover wrapped names, lowercase official type, 14-week Materials hours, `e`/`ou` expressions, equivalent groups, course rows without hours, extension markers, phase headings, optative headings, and full ementa capture.

- [ ] **Step 3: Run parser tests and confirm RED**

Run: `npm test -- tests/scripts/cagr-curriculum-parser.test.ts`

Expected: failure because the parser does not exist.

- [ ] **Step 4: Implement parser with ambiguity reporting**

The parser returns structured courses and unresolved records. Generation exits nonzero when unresolved records remain after applying page-scoped JSON overrides.

- [ ] **Step 5: Generate and manually reconcile nine canonical JSON files**

Run: `npm run generate:curricula`

Expected: nine JSON files under `src/data/curricula`, no unresolved records, and source hashes printed.

- [ ] **Step 6: Run parser tests and confirm GREEN**

Run: `npm test -- tests/scripts/cagr-curriculum-parser.test.ts`

Expected: parser tests pass.

### Task 3: Curriculum requirements and integrity validation

**Files:**
- Create: `src/lib/curriculum-validation.ts`
- Modify: `src/data/curricula/index.ts`
- Replace: `src/data/curricula/*/index.ts`
- Remove: superseded `src/data/curricula/*/phases/*.ts`
- Test: `tests/lib/curriculum-validation.test.ts`
- Test: `tests/data/curricula-contract.test.ts`

**Interfaces:**
- Produces: `validateCurriculum(courseId, curriculum)` and typed registry imports.
- Consumes: canonical curriculum JSON and completion requirements.

- [ ] **Step 1: Write failing integrity and nine-course contract tests**

Tests assert official version, total hours, unique codes, nontruncated names, source counts, valid relationship references, exact elective minima, and denominator equality for all nine courses.

- [ ] **Step 2: Run tests and confirm RED against current data**

Run: `npm test -- tests/lib/curriculum-validation.test.ts tests/data/curricula-contract.test.ts`

Expected: failures for missing optatives, blank ementas, Materials hours, duplicate code, and Eletrônica version.

- [ ] **Step 3: Add explicit per-course completion requirements**

Encode the latest effective rules from each report, including disjoint professional/free groups, source caps for complementary activities, extension components, and manual external-hour sources.

- [ ] **Step 4: Replace registry imports with canonical JSON data**

Each index exports one typed validated curriculum without duplicating phase arrays.

- [ ] **Step 5: Run integrity and contract tests and confirm GREEN**

Run: `npm test -- tests/lib/curriculum-validation.test.ts tests/data/curricula-contract.test.ts`

Expected: all nine contracts pass.

### Task 4: Firestore progress compatibility and requirement-hour editing

**Files:**
- Modify: `src/lib/firestore-progress.ts`
- Modify: `src/hooks/useCourseStatus.ts`
- Modify: `src/app/[course]/[course].tsx`
- Modify: `src/app/[course]/components/ProgressDashboard.tsx`
- Create: `src/app/[course]/components/RequirementProgress.tsx`
- Test: `tests/lib/firestore-progress.test.ts`
- Test: `tests/app/progress-dashboard.test.tsx`

**Interfaces:**
- Produces: normalized `requirementHours`, `setRequirementHours(requirementId, hours)`, requirement-aware dashboard.
- Consumes: `calculateCurriculumProgress` and existing Firestore progress documents.

- [ ] **Step 1: Write failing compatibility and dashboard tests**

Verify old documents normalize to empty `requirementHours`, invalid and negative hours are discarded, manual values are saved by requirement ID, and the dashboard displays fixed and elective group progress.

- [ ] **Step 2: Run tests and confirm RED**

Run: `npm test -- tests/lib/firestore-progress.test.ts tests/app/progress-dashboard.test.tsx`

Expected: failures because requirement hours and requirement UI are absent.

- [ ] **Step 3: Implement additive Firestore progress schema**

Persist `requirementHours.<requirementId>` without rewriting `statuses`, custom phases, or other user data.

- [ ] **Step 4: Replace aggregate dashboard formula with the pure calculator**

Display overall progress and per-requirement completed/required hours. Manual inputs clamp to their configured source and group limits.

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run: `npm test -- tests/lib/firestore-progress.test.ts tests/app/progress-dashboard.test.tsx`

Expected: all progress persistence and dashboard tests pass.

### Task 5: Safe Firestore seed and verification

**Files:**
- Restore and modify: `scripts/seed-curricula.ts`
- Create: `scripts/lib/curricula-seed.ts`
- Test: `tests/scripts/curricula-seed.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: dry-run validation, `--apply`, timestamped backup, canonical payload hashes, post-write verification.
- Consumes: validated `curriculaRegistry` and Firebase Admin Firestore.

- [ ] **Step 1: Write failing seed-domain tests with an in-memory adapter**

Tests verify dry-run writes nothing, backup precedes mutation, nine writes use one batch, user paths are rejected, and readback hash mismatch fails.

- [ ] **Step 2: Run tests and confirm RED**

Run: `npm test -- tests/scripts/curricula-seed.test.ts`

Expected: failure because the seed domain does not exist.

- [ ] **Step 3: Implement adapter-driven seed workflow**

The CLI requires `GOOGLE_APPLICATION_CREDENTIALS`, defaults to dry-run, accepts only `--apply`, writes backup under `backups/curricula/`, commits one batch, and verifies all canonical hashes.

- [ ] **Step 4: Run seed tests and confirm GREEN**

Run: `npm test -- tests/scripts/curricula-seed.test.ts`

Expected: all seed safety tests pass.

### Task 6: Full verification and production repopulation

**Files:**
- Verify all changed files
- Create during execution: ignored backup under `backups/curricula/`

**Interfaces:**
- Consumes: all preceding tasks.
- Produces: verified local application and nine matching Firestore documents.

- [ ] **Step 1: Run complete local verification**

Run: `npm test && npm run typecheck && npm run lint && npm run build`

Expected: every command exits zero with no test failures, type errors, lint errors, or build errors.

- [ ] **Step 2: Run seed dry-run**

Run: `GOOGLE_APPLICATION_CREDENTIALS="$PWD/curriculo-interativo-ufsc-firebase-adminsdk-fbsvc-9afdca8573.json" npm run seed:curricula`

Expected: nine validated payloads, no writes.

- [ ] **Step 3: Apply seed**

Run: `GOOGLE_APPLICATION_CREDENTIALS="$PWD/curriculo-interativo-ufsc-firebase-adminsdk-fbsvc-9afdca8573.json" npm run seed:curricula -- --apply`

Expected: backup path, nine writes committed, nine readback hashes matched.

- [ ] **Step 4: Re-run contract tests after readback**

Run: `npm test -- tests/data/curricula-contract.test.ts tests/scripts/curricula-seed.test.ts`

Expected: all contracts and seed tests pass.

- [ ] **Step 5: Review final diff and confirm user data isolation**

Run: `git diff --check && git status --short && rg -n 'collection\("users"\)|doc\([^\n]*"users"' scripts`

Expected: clean diff checks and no seed script references to `users`.
