interface PasswordResetEmailParams {
  resetLink: string;
  recipientEmail: string;
}

export function buildPasswordResetEmail({ resetLink }: PasswordResetEmailParams): { subject: string; html: string; text: string } {
  const subject = "Redefinição de senha • Currículo Interativo UFSC";

  const text = [
    "Currículo Interativo UFSC",
    "",
    "Recebemos uma solicitação para redefinir a senha da sua conta.",
    "",
    "Acesse o link abaixo para criar uma nova senha:",
    resetLink,
    "",
    "Este link expira em 1 hora.",
    "Se você não solicitou a redefinição, nenhuma ação é necessária e sua conta permanece protegida.",
  ].join("\n");

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
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#111111;border:1px solid #262626;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding:36px 36px 20px;text-align:center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 16px;">
                <tr>
                  <td style="background-color:#050505;border:1px solid #333333;border-radius:14px;padding:10px 14px;text-align:center;">
                    <span style="font-size:20px;font-weight:900;letter-spacing:1px;background:linear-gradient(135deg,#315cff,#7c3aed);-webkit-background-clip:text;color:#315cff;">CI</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Currículo Interativo UFSC</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#9ca3af;">Redefinição de acesso à sua conta</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 32px;">
              <div style="background-color:#18181b;border:1px solid #27272a;border-radius:16px;padding:24px;margin-bottom:28px;">
                <p style="margin:0 0 16px;font-size:15px;line-height:24px;color:#d4d4d8;">
                  Olá! Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Currículo Interativo UFSC</strong>.
                </p>
                <p style="margin:0;font-size:15px;line-height:24px;color:#d4d4d8;">
                  Para criar sua nova senha com segurança, clique no botão abaixo:
                </p>
              </div>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#315cff;color:#ffffff;font-size:15px;font-weight:700;line-height:1;text-decoration:none;padding:16px 36px;border-radius:14px;border:1px solid #4f7cff;box-shadow:0 10px 24px rgba(49,92,255,0.35);">
                      Redefinir Senha
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color:#0d0d0f;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Link direto</p>
                <p style="margin:0;font-size:12px;line-height:18px;color:#71717a;word-break:break-all;">
                  <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;">${resetLink}</a>
                </p>
              </div>

              <p style="margin:0;font-size:13px;line-height:20px;color:#71717a;text-align:center;">
                Se você não solicitou esta redefinição, nenhuma alteração será feita e sua senha permanece segura. O link acima expira em 1 hora.
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #222222;padding:20px 36px;text-align:center;background-color:#0a0a0a;">
              <p style="margin:0;font-size:12px;color:#52525b;">
                Currículo Interativo UFSC • Plataforma independente para acompanhamento curricular
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
