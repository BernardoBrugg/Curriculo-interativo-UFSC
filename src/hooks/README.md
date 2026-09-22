# Custom React Hooks Layer

## Directory Purpose
This directory encapsulates client-side state management, graph computation, and external service subscriptions into reusable React hooks.

## Hooks Overview

- **`useCourseStatus.ts`**: Connects user course completion state with client-side cache and Firestore persistence.
- **`useCourseGraph.ts`**: Builds an in-memory directed dependency graph for computing prerequisites and dependents in O(1) lookups.
- **`useCurricula.ts`**: Loads and caches curriculum data models.
- **`useCustomPhases.ts`**: Manages custom phase overrides per discipline with persistence.
- **`useDragScroll.ts`**: Manages mouse-driven horizontal dragging with activation distance threshold, wheel event translation, and trackpad gesture preservation for wide curriculum matrices on desktop.
- **`useDragTutorial.ts`**: Tracks whether the user has completed or dismissed the introductory tutorial.

## Data Flow
Hooks subscribe to storage and services in `@/lib/`, exposing reactive state and stable updater callbacks wrapped in `useCallback` to prevent cascading renders.
