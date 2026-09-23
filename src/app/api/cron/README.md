# Cron Tasks Directory

## Responsibility
Contains scheduled route handlers executed by cron workers (such as Vercel Cron) for recurring batch jobs, metrics generation, and maintenance routines.

## Subdirectories
- `monthly-report/`: Scheduled monthly report trigger that emails metric summaries and feedback logs to the platform administrator.
