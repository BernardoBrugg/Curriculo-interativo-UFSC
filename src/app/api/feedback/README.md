# Feedback API Route

## Directory Purpose
This directory contains the Next.js Route Handler for handling user feedback and issue submissions.

## Architecture & Endpoints

- **`route.ts`**: Handles `POST` requests submitting feedback messages.
  - Validates payload structure and length restrictions.
  - Implements an anti-spam honeypot check.
  - Enforces in-memory client IP rate limiting (maximum 5 requests per 10-minute window).
  - Forwards validated submissions to the configured external webhook or stores them securely.

## Data Flow
- **Input**: JSON payload `{ message: string, email?: string, honeypot?: string }`.
- **Output**: JSON status response `{ success: true }` or standard HTTP 400/429 error messages.
