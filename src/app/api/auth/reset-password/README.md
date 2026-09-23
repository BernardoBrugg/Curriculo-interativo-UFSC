# Reset Password API Route

## Responsibility
Receives password reset requests, verifies the recipient email, generates a secure reset link with Firebase Admin, and delivers a branded HTML email via SMTP.

## Route
- `POST /api/auth/reset-password`

## Request Payload
```json
{
  "email": "estudante@ufsc.br"
}
```

## Response
- `200 OK`: `{ "success": true }`
- `400 Bad Request`: `{ "error": "auth/invalid-email" }` or `{ "error": "auth/user-not-found" }`
- `429 Too Many Requests`: `{ "error": "auth/too-many-requests" }`
- `500 Internal Server Error`: `{ "error": "auth/internal-error" }`
