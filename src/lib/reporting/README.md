# Reporting Module

## Responsibility
Aggregates user metrics, authentication trends, and monthly user feedbacks from Firebase Admin Auth and Firestore to produce executive performance reports.

## Files
- `monthly-report.ts`: Implements metric aggregation (`gatherMonthlyReportMetrics`) and automated email dispatch (`sendMonthlyExecutiveReport`).

## Metric Indicators
- Total registered user accounts.
- Active users in the past 30 days (`lastSignInTime`).
- Newly registered accounts in the past 30 days (`creationTime`).
- Authentication provider breakdown (Google OAuth vs Email/Password).
- User feedback submissions collected in Firestore during the past 30 days.
