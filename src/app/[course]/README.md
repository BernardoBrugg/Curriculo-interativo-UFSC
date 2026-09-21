# Course Curriculum Page Module

## Directory Purpose
Contains the main course view route (`/[course]`) where users track progress, browse phases, toggle subject completion, and reassign course phases.

## Architecture
- **`[course].tsx`**: Main client component containing course state, course graph computation, prerequisite blocking verification, custom phases hooks, and dashboard integration.
- **`page.tsx`**: Route entry point delegating to `[course].tsx`.
- **`components/`**: Modular presentation components including `CurriculumGrid`, `CourseCard`, `CourseDetailModal`, `ProgressDashboard`, and `SearchBar`.

## Usage & Data Flow
When visiting `/[course]`, the route fetches curriculum data via `useCurriculum(course)` and user progress via `useCourseStatus(course)`. It calculates prerequisite dependency graphs using `useCourseGraph` and renders `ProgressDashboard` and `CurriculumGrid`.
