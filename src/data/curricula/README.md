# Curricula Data Models

## Directory Purpose
Contains official curriculum matrices and completion specifications extracted from CAGR reports for all 93 UFSC undergraduate programs across all 5 campuses.

## Architecture
Each program directory (`automacao`, `civil`, `eletrica`, etc.) holds:
- `curriculum.json`: Normalized JSON structure conforming to `CurriculumData` (total hours, phases, courses, completion requirements, and SHA256 integrity hash).
- `index.ts`: Strongly typed module export.
The top-level `index.ts` provides a unified registry mapping program IDs to curriculum data.
