# Feedback API Route

## Directory Purpose
This directory contains the Next.js Route Handler for handling user feedback and issue submissions.

## Architecture & Endpoints
- **`route.ts`**: Handles `POST` requests submitting feedback messages.
  - Validates payload structure, message length, and optional attachment properties.
  - Implements an anti-spam honeypot check.
  - Enforces in-memory client IP rate limiting (maximum 5 requests per 10-minute window).
  - Persists validated submissions directly into the `feedbacks` collection in Firestore using Firebase Admin SDK.
  - Does not send individual automatic notification emails per feedback; entries are preserved for monthly batch reporting.

## Data Flow
- **Input**: FormData containing `message: string`, optional `file: File`, and hidden `website_url` honeypot.
- **Output**: JSON status response `{ success: true }` or standard HTTP 400/429/500 error messages.
