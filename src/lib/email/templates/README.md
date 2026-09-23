# Email Templates Module

## Responsibility
Generates responsive and accessible HTML and plaintext email templates using the application visual identity and tokens.

## Files
- `password-reset-template.ts`: Generates modern password reset emails with dark theme backgrounds, accent blue buttons, security notices, and fallback links.
- `monthly-report-template.ts`: Generates executive metric reports with KPI cards (total accounts, active users, new registrations, feedback list).

## Usage Example
```typescript
import { buildPasswordResetEmail } from "./password-reset-template";

const { subject, html, text } = buildPasswordResetEmail({
  resetLink: "https://.../action?mode=resetPassword&oobCode=...",
  recipientEmail: "user@example.com",
});
```
