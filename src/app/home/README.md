# Home and Landing Page Module

## Directory Purpose
Contains the main landing route (`/`) of Currículo Interativo UFSC. It introduces students to the platform, showcases features, and provides immediate access to all university engineering curricula.

## Architecture
- **`home.tsx`**: Main presentation component coordinating hero copy, responsive navigation, theme toggling, feature highlights, and conditional views (authenticated course library vs guest course selector vs authentication screen).
- **`page.tsx`**: Route entry point exporting `home.tsx`.
- **`components/`**: Modular view widgets:
  - `GuestCourseList.tsx`: Instant curriculum selector for unauthenticated visitors.
  - `CourseLibrary.tsx`: My courses management panel for signed-in users.
  - `AuthScreen.tsx`: Login, account creation, and password reset form.

## Usage & Data Flow
Visitors without an account can immediately browse and click any engineering course without login barriers. When signed in via Firebase Auth, the landing page displays `CourseLibrary` with their saved courses and cloud sync.
