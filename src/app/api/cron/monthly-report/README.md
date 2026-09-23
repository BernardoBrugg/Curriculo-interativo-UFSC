# Monthly Report Cron Route

## Responsibility
Serves as the scheduled execution endpoint triggered by Vercel Cron or external monitors to generate and email monthly system metrics.

## Route
- `GET /api/cron/monthly-report`
- `POST /api/cron/monthly-report`

## Authentication
When `CRON_SECRET` is configured in environment variables, requests must supply the secret via:
- Header: `Authorization: Bearer <CRON_SECRET>`
- Or query parameter: `?key=<CRON_SECRET>`

## Response
```json
{
  "success": true,
  "recipient": "bbbrugg@gmail.com",
  "totalAccounts": 142,
  "activeUsers30d": 98,
  "newUsers30d": 35,
  "feedbacksCount": 4,
  "generatedAt": "2026-09-01T09:00:00.000Z"
}
```
