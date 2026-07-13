# Drag and Drop UX Design

## Goal

Make curriculum rearrangement discoverable and predictable for first-time users while preserving the existing click-to-cycle-status behavior.

## Interaction model

The course card remains a button that changes the course status when clicked. Dragging is initiated only from a dedicated drag handle inside the card. This separates the two actions and prevents accidental status changes while users attempt to move a course.

The drag handle is keyboard-focusable, has an accessible label, and exposes a visible hover and focus state. The card continues to expose its existing course, status, prerequisite, and relationship information.

## Drag feedback

When dragging begins, the active card lifts visually and remains readable. Other cards reduce visual emphasis so the destination columns become the main focus. Every valid semester column receives an active drop-target treatment during the drag session.

The column under the pointer receives an accent border, a tinted surface, and a short destination label such as “Soltar no semestre 4”. The target treatment must remain legible in light and dark themes and must not rely on color alone.

After a successful move, the interface provides a brief confirmation state communicating the destination semester. The existing persistence callback remains the source of truth for the move.

## First-use experience

The current single-paragraph tutorial becomes a compact instructional panel with two explicit actions:

- Click a course card to update its status.
- Use the grip on the right side of a card to move it to another semester.

The panel includes a simple visual sequence that distinguishes click from drag. It can be dismissed and remains persisted through the existing tutorial preference flow. A successful first move may also complete the tutorial automatically, provided the user can still reopen or understand the interaction from the persistent handle affordance.

## Responsive behavior

Desktop keeps the horizontally scrollable semester board. During a drag, semester columns remain visible as destinations and the active drop target is emphasized.

Mobile keeps the semester selector but exposes a temporary destination strip while dragging so users can select or target another semester without guessing where hidden columns are. The selected destination receives the same semantic label and visual treatment as desktop.

## Accessibility and motion

The drag handle receives an accessible name and keyboard focus styling. Destination feedback includes text and structural emphasis in addition to color. Motion is reduced or removed under the user’s reduced-motion preference. Status changes and course moves remain operable without relying exclusively on pointer dragging.

## Scope boundaries

The curriculum data model, status persistence, custom phase persistence, prerequisite logic, and course sorting remain unchanged. This work is limited to the card interaction affordance, drag feedback, onboarding copy and presentation, responsive destination guidance, and related visual styles.

## Verification criteria

- Clicking the card still cycles status exactly as before.
- Dragging from the dedicated handle moves a course and does not toggle its status.
- All valid semester destinations expose clear drag-over feedback.
- A successful move communicates its destination.
- The first-use panel explains both click and drag behavior and persists dismissal.
- Desktop and mobile layouts provide an understandable destination during drag.
- Light theme, dark theme, keyboard focus, and reduced-motion behavior remain usable.
- Existing lint, type-check, test, and production build checks pass.
