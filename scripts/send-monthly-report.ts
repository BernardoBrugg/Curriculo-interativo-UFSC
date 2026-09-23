import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sendMonthlyExecutiveReport } from "../src/lib/reporting/monthly-report";

function loadEnvironmentVariables(): void {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main(): Promise<void> {
  loadEnvironmentVariables();
  const recipient = process.argv[2] || process.env.FEEDBACK_TO || "bbbrugg@gmail.com";
  process.stdout.write(`Iniciando geração do relatório mensal para: ${recipient}...\n`);

  const result = await sendMonthlyExecutiveReport(recipient);

  process.stdout.write(`Relatório mensal gerado e enviado com sucesso!\n`);
  process.stdout.write(`Destinatário: ${result.recipient}\n`);
  process.stdout.write(`Total de contas cadastradas: ${result.totalAccounts}\n`);
  process.stdout.write(`Usuários ativos nos últimos 30 dias: ${result.activeUsers30d}\n`);
  process.stdout.write(`Novos usuários no período: ${result.newUsers30d}\n`);
  process.stdout.write(`Feedbacks coletados no mês: ${result.feedbacksCount}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`Falha ao gerar relatório mensal: ${message}\n`);
  process.exitCode = 1;
});
