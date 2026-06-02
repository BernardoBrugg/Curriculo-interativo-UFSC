# Curriculo Interativo UFSC - Workspace Rules

## Tech Stack

- Framework: Next.js 16 App Router with TypeScript
- Runtime UI: React 19 Client Components for interactive curriculum behavior
- Styling: Tailwind CSS v4 plus semantic CSS variables in `src/app/globals.css`
- Font: Geist through `next/font/google`
- State: React hooks plus `localStorage`

## Routes

- `/`: landing page with product presentation and CTA to the app.
- `/producao`: interactive curriculum board for Engenharia de Producao.
- `/app`: legacy redirect to `/producao`.

## Architecture

```text
src/
├── app/           # Next.js routes, layout, global CSS
├── components/    # Shared UI and interactive components
├── data/          # Static curriculum data
├── hooks/         # Course status and graph traversal hooks
└── types/         # Curriculum TypeScript interfaces
```

## Design System

- Use the semantic tokens in `globals.css` for colors, glass surfaces, shadows,
  gradients, text, and theme-aware states.
- Use gradient backgrounds and glassmorphism, but keep the result elegant:
  translucent surfaces, subtle blur, thin borders, soft shadows, restrained
  animation.
- Keep this visual language consistent across all routes: same semantic tokens,
  glass surfaces, typography, spacing rhythm, dark-mode neutrality, and
  restrained motion.
- Elements that enter below the fold should use the shared scroll-reveal motion:
  fade in with a small upward translate, stagger only when it improves scanning,
  and respect `prefers-reduced-motion`.
- Avoid noisy neon, excessive glow, and layout-shifting card scale effects.
- The app must support light and dark themes with an icon-only toggle.
- Dark theme must stay neutral black/gray. Do not introduce blue or purple as
  the dark-mode palette.
- Theme preference is persisted with `localStorage` key `curriculo-theme`.
- Footer is full width and includes the author's LinkedIn and GitHub links.

## Interaction Rules

- Course progress is persisted with `localStorage` key `curriculo-eps-status`.
- Keep course data static and exact to the source curriculum.
- Show optative rules in the UI: 324h-a minimum from course optatives
  (GOP/EPP) and up to 108h-a as free optatives from any department.
- Free optatives must remain selectable and count toward completion progress.
- Course pages should be route-specific (`/producao` now) so future graduation
  courses can be added without overloading a generic `/app` route.
- Do not add backend, auth, or database dependencies.
- Preserve search, status cycling, reset, prerequisite highlighting, and
  dependent highlighting behavior.

## Verification

Before handing off UI changes, run:

```bash
npm run lint
npm run build
```

For visual changes, check desktop and mobile renders for clipping, contrast,
theme behavior, horizontal board scrolling, and excessive motion.
