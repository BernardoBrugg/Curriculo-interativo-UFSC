# Curricula Data Models

## Directory Purpose
Contains official curriculum matrices and completion specifications extracted from CAGR reports for UFSC engineering programs.

## Architecture
Each program directory (`automacao`, `civil`, `eletrica`, etc.) holds:
- `curriculum.json`: Normalized JSON structure conforming to `CurriculumData` (total hours, phases, courses, completion requirements, and SHA256 integrity hash).
- `index.ts`: Strongly typed module export.
The top-level `index.ts` provides a unified registry mapping program IDs to curriculum data.
