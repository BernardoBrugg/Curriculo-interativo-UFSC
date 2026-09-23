export interface MonthlyFeedbackItem {
  id: string;
  message: string;
  createdAt: Date;
  userEmail?: string | null;
  fileAttachment?: {
    name?: string;
    size?: number;
    type?: string;
  } | null;
}

export interface MonthlyReportMetrics {
  monthName: string;
  year: number;
  generatedAt: Date;
  totalAccounts: number;
  activeUsers30d: number;
  newUsers30d: number;
  googleUsers: number;
  passwordUsers: number;
  feedbacks: MonthlyFeedbackItem[];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date: Date): string {
  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatKilobytes(bytes?: number): string {
  if (!bytes) return "";
  return `${Math.round(bytes / 1024)} KB`;
}

export function buildMonthlyReportEmail(metrics: MonthlyReportMetrics): { subject: string; html: string; text: string } {
  const subject = `Relatório Mensal (${metrics.monthName}/${metrics.year}) • Currículo Interativo UFSC`;

  const textLines = [
    `RELATÓRIO MENSAL - CURRÍCULO INTERATIVO UFSC`,
    `Período: ${metrics.monthName}/${metrics.year}`,
    `Gerado em: ${formatDate(metrics.generatedAt)}`,
    "",
    "--- RESUMO DE MÉTRICAS ---",
    `Total de Contas: ${metrics.totalAccounts}`,
    `Usuários Ativos (últimos 30 dias): ${metrics.activeUsers30d}`,
    `Novos Cadastros no Mês: ${metrics.newUsers30d}`,
    `Provedores: Google (${metrics.googleUsers}) | Senha (${metrics.passwordUsers})`,
    `Feedbacks Recebidos no Mês: ${metrics.feedbacks.length}`,
    "",
    "--- FEEDBACKS DO MÊS ---",
  ];

  if (metrics.feedbacks.length === 0) {
    textLines.push("Nenhum feedback registrado no período.");
  } else {
    metrics.feedbacks.forEach((fb, index) => {
      textLines.push(`[#${index + 1}] ${formatDate(fb.createdAt)} - ${fb.userEmail || "Anônimo"}`);
      textLines.push(`Mensagem: ${fb.message}`);
      if (fb.fileAttachment?.name) {
        textLines.push(`Anexo: ${fb.fileAttachment.name} (${formatKilobytes(fb.fileAttachment.size)})`);
      }
      textLines.push("");
    });
  }

  const text = textLines.join("\n");

  const feedbacksHtml = metrics.feedbacks.length === 0
    ? `<div style="background-color:#18181b;border:1px solid #27272a;border-radius:14px;padding:24px;text-align:center;color:#71717a;font-size:14px;">
        Nenhum feedback foi enviado pela plataforma neste período.
      </div>`
    : metrics.feedbacks.map((fb, index) => `
        <div style="background-color:#141417;border:1px solid #27272a;border-radius:14px;padding:18px 20px;margin-bottom:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:12px;font-weight:700;color:#60a5fa;background-color:rgba(96,165,250,0.12);padding:4px 10px;border-radius:8px;border:1px solid rgba(96,165,250,0.25);">
              #${index + 1} • ${escapeHtml(fb.userEmail || "Anônimo")}
            </span>
            <span style="font-size:12px;color:#71717a;">${formatDate(fb.createdAt)}</span>
          </div>
          <p style="margin:0 0 10px;font-size:14px;line-height:22px;color:#e4e4e7;white-space:pre-wrap;">${escapeHtml(fb.message)}</p>
          ${fb.fileAttachment?.name ? `
            <div style="font-size:12px;color:#a1a1aa;background-color:#0d0d0f;border-radius:8px;padding:6px 12px;display:inline-block;">
              📎 ${escapeHtml(fb.fileAttachment.name)} (${formatKilobytes(fb.fileAttachment.size)})
            </div>
          ` : ""}
        </div>
      `).join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e5e7eb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#050505;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background-color:#0f0f12;border:1px solid #262626;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.6);">
          <tr>
            <td style="padding:36px 36px 24px;border-bottom:1px solid #1f1f23;background:linear-gradient(180deg,#16161c 0%,#0f0f12 100%);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="font-size:11px;font-weight:800;letter-spacing:1.5px;color:#315cff;text-transform:uppercase;">Painel Administrativo</span>
                    <h1 style="margin:6px 0 0;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Relatório Mensal Executivo</h1>
                    <p style="margin:4px 0 0;font-size:14px;color:#9ca3af;">Currículo Interativo UFSC • ${metrics.monthName} / ${metrics.year}</p>
                  </td>
                  <td align="right" valign="top">
                    <span style="display:inline-block;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700;color:#34d399;background-color:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.25);">
                      Ativo
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 36px;">
              <h2 style="margin:0 0 16px;font-size:16px;font-weight:800;color:#f3f4f6;text-transform:uppercase;letter-spacing:0.8px;">Métricas Principais</h2>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td width="48%" style="background-color:#16161b;border:1px solid #27272a;border-radius:16px;padding:20px;">
                    <p style="margin:0;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Total de Contas</p>
                    <p style="margin:8px 0 0;font-size:32px;font-weight:900;color:#ffffff;line-height:1;">${metrics.totalAccounts}</p>
                    <p style="margin:6px 0 0;font-size:12px;color:#38bdf8;">Base geral acumulada</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background-color:#16161b;border:1px solid #27272a;border-radius:16px;padding:20px;">
                    <p style="margin:0;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Ativos (30 dias)</p>
                    <p style="margin:8px 0 0;font-size:32px;font-weight:900;color:#34d399;line-height:1;">${metrics.activeUsers30d}</p>
                    <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">${metrics.totalAccounts > 0 ? Math.round((metrics.activeUsers30d / metrics.totalAccounts) * 100) : 0}% da base</p>
                  </td>
                </tr>
                <tr><td colspan="3" height="12"></td></tr>
                <tr>
                  <td width="48%" style="background-color:#16161b;border:1px solid #27272a;border-radius:16px;padding:20px;">
                    <p style="margin:0;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Novos Cadastros</p>
                    <p style="margin:8px 0 0;font-size:32px;font-weight:900;color:#818cf8;line-height:1;">+${metrics.newUsers30d}</p>
                    <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">Registrados nos últimos 30 dias</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background-color:#16161b;border:1px solid #27272a;border-radius:16px;padding:20px;">
                    <p style="margin:0;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Feedbacks Recebidos</p>
                    <p style="margin:8px 0 0;font-size:32px;font-weight:900;color:#f59e0b;line-height:1;">${metrics.feedbacks.length}</p>
                    <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">Registros de usuários</p>
                  </td>
                </tr>
              </table>

              <div style="background-color:#16161b;border:1px solid #27272a;border-radius:16px;padding:20px;margin-bottom:32px;">
                <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#d4d4d8;text-transform:uppercase;letter-spacing:0.5px;">Métodos de Autenticação</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="font-size:13px;color:#a1a1aa;">Google Auth</td>
                    <td align="right" style="font-size:14px;font-weight:700;color:#ffffff;">${metrics.googleUsers}</td>
                  </tr>
                  <tr><td colspan="2" height="8"></td></tr>
                  <tr>
                    <td style="font-size:13px;color:#a1a1aa;">E-mail e Senha</td>
                    <td align="right" style="font-size:14px;font-weight:700;color:#ffffff;">${metrics.passwordUsers}</td>
                  </tr>
                </table>
              </div>

              <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
                <h2 style="margin:0;font-size:16px;font-weight:800;color:#f3f4f6;text-transform:uppercase;letter-spacing:0.8px;">Feedbacks do Período</h2>
                <span style="font-size:12px;color:#71717a;">${metrics.feedbacks.length} registro(s)</span>
              </div>

              ${feedbacksHtml}
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #1f1f23;padding:20px 36px;text-align:center;background-color:#0a0a0d;">
              <p style="margin:0;font-size:12px;color:#52525b;">
                Gerado automaticamente pelo Currículo Interativo UFSC • ${formatDate(metrics.generatedAt)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
