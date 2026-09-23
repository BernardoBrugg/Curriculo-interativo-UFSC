import { getFirebaseAdminAuth, getFirebaseAdminFirestore } from "@/lib/firebase-admin";
import { buildMonthlyReportEmail, MonthlyFeedbackItem, MonthlyReportMetrics } from "@/lib/email/templates/monthly-report-template";
import { getDefaultSender, getMailTransporter } from "@/lib/email/transporter";

const MONTH_NAMES_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export async function gatherMonthlyReportMetrics(): Promise<MonthlyReportMetrics> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const auth = getFirebaseAdminAuth();
  let totalAccounts = 0;
  let activeUsers30d = 0;
  let newUsers30d = 0;
  let googleUsers = 0;
  let passwordUsers = 0;

  let nextPageToken: string | undefined = undefined;
  do {
    const listResult = await auth.listUsers(1000, nextPageToken);
    totalAccounts += listResult.users.length;

    for (const user of listResult.users) {
      const lastSignIn = user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : null;
      const created = user.metadata.creationTime ? new Date(user.metadata.creationTime) : null;

      if (lastSignIn && lastSignIn >= thirtyDaysAgo) activeUsers30d += 1;
      if (created && created >= thirtyDaysAgo) newUsers30d += 1;

      const hasGoogle = user.providerData.some((p) => p.providerId === "google.com");
      const hasPassword = user.providerData.some((p) => p.providerId === "password");

      if (hasGoogle) googleUsers += 1;
      if (hasPassword) passwordUsers += 1;
    }

    nextPageToken = listResult.pageToken;
  } while (nextPageToken);

  const firestore = getFirebaseAdminFirestore();
  const feedbacksSnapshot = await firestore.collection("feedbacks").get();
  const feedbacks: MonthlyFeedbackItem[] = [];

  for (const doc of feedbacksSnapshot.docs) {
    const data = doc.data();
    const createdAtDate = data.createdAt && typeof data.createdAt.toDate === "function"
      ? data.createdAt.toDate()
      : (data.createdAt instanceof Date ? data.createdAt : new Date());

    if (createdAtDate >= thirtyDaysAgo) {
      feedbacks.push({
        id: doc.id,
        message: String(data.message || ""),
        createdAt: createdAtDate,
        userEmail: typeof data.userEmail === "string" ? data.userEmail : null,
        fileAttachment: data.fileAttachment || null,
      });
    }
  }

  feedbacks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    monthName: MONTH_NAMES_PT[now.getMonth()],
    year: now.getFullYear(),
    generatedAt: now,
    totalAccounts,
    activeUsers30d,
    newUsers30d,
    googleUsers,
    passwordUsers,
    feedbacks,
  };
}

export async function sendMonthlyExecutiveReport(targetRecipient?: string) {
  const recipient = targetRecipient || process.env.FEEDBACK_TO || "bbbrugg@gmail.com";
  const metrics = await gatherMonthlyReportMetrics();
  const { subject, html, text } = buildMonthlyReportEmail(metrics);

  const transporter = getMailTransporter();
  const from = getDefaultSender();

  await transporter.sendMail({
    from,
    to: recipient,
    subject,
    text,
    html,
  });

  return {
    success: true,
    recipient,
    totalAccounts: metrics.totalAccounts,
    activeUsers30d: metrics.activeUsers30d,
    newUsers30d: metrics.newUsers30d,
    feedbacksCount: metrics.feedbacks.length,
    generatedAt: metrics.generatedAt.toISOString(),
  };
}
