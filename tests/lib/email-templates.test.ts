import { describe, expect, it } from "vitest";
import { buildPasswordResetEmail } from "@/lib/email/templates/password-reset-template";
import { buildMonthlyReportEmail } from "@/lib/email/templates/monthly-report-template";

describe("buildPasswordResetEmail", () => {
  it("renders branded email with application colors and link", () => {
    const link = "https://curriculo-interativo-ufsc.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=123456";
    const email = "estudante@ufsc.br";
    const result = buildPasswordResetEmail({ resetLink: link, recipientEmail: email });

    expect(result.subject).toContain("Redefinição de senha");
    expect(result.html).toContain(link);
    expect(result.html).toContain("#315cff");
    expect(result.html).toContain("#050505");
    expect(result.html).toContain("Currículo Interativo UFSC");
    expect(result.text).toContain(link);
  });
});

describe("buildMonthlyReportEmail", () => {
  it("renders executive monthly report with KPI cards and feedback items", () => {
    const result = buildMonthlyReportEmail({
      monthName: "Setembro",
      year: 2026,
      generatedAt: new Date("2026-09-23T14:00:00Z"),
      totalAccounts: 120,
      activeUsers30d: 85,
      newUsers30d: 30,
      googleUsers: 90,
      passwordUsers: 30,
      feedbacks: [
        {
          id: "fb-1",
          message: "Excelente aplicativo!",
          createdAt: new Date("2026-09-20T10:00:00Z"),
          userEmail: "aluno@ufsc.br",
          fileAttachment: { name: "print.png", size: 10240, type: "image/png" },
        },
      ],
    });

    expect(result.subject).toContain("Setembro/2026");
    expect(result.html).toContain("120");
    expect(result.html).toContain("85");
    expect(result.html).toContain("+30");
    expect(result.html).toContain("Excelente aplicativo!");
    expect(result.html).toContain("aluno@ufsc.br");
    expect(result.text).toContain("Total de Contas: 120");
    expect(result.text).toContain("Excelente aplicativo!");
  });

  it("handles period with zero feedbacks gracefully", () => {
    const result = buildMonthlyReportEmail({
      monthName: "Outubro",
      year: 2026,
      generatedAt: new Date("2026-10-01T09:00:00Z"),
      totalAccounts: 50,
      activeUsers30d: 25,
      newUsers30d: 5,
      googleUsers: 30,
      passwordUsers: 20,
      feedbacks: [],
    });

    expect(result.html).toContain("Nenhum feedback");
    expect(result.text).toContain("Nenhum feedback registrado no período.");
  });
});
