# Shared Components Layer

## Directory Purpose
This directory contains application-wide shared UI components used across multiple pages and layouts, including navigation, feedback modal dialogs, authentication wrappers, and theme controls.

## Components Overview

- **`AuthProvider.tsx`**: React context provider managing Firebase authentication state, user credentials, and session synchronization across client components.
- **`FeedbackDialog.tsx`**: Accessible modal dialog enabling students and visitors to submit feedback, bug reports, or feature requests. Features honeypot anti-spam protection and direct API integration.
- **`ProfileMenu.tsx`**: Top navigation header dropdown displaying authenticated user profile details, theme switcher, account deletion options, and sign-out controls.
- **`ScrollReveal.tsx`**: IntersectionObserver-powered subtle entrance animation wrapper for page sections.
- **`SiteFooter.tsx`**: Global site footer with institutional accreditation, contact links, and copyright notices.
- **`ThemeToggle.tsx`**: High-contrast theme toggle switching between light and dark modes with persistent local storage preference.

## Data Flow
Components in this directory interact with `@/components/AuthProvider` for identity context and dispatch feedback submissions directly to `/api/feedback`.
