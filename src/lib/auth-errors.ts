const messages: Record<string, string> = {
  "auth/email-already-in-use": "Este e-mail já está cadastrado.",
  "auth/configuration-not-found": "Autenticação por e-mail ainda não foi ativada no Firebase Console.",
  "auth/invalid-credential": "E-mail ou senha inválidos.",
  "auth/invalid-email": "Informe um e-mail válido.",
  "auth/popup-closed-by-user": "O login com Google foi cancelado.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  "auth/user-not-found": "E-mail ou senha inválidos.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "auth/operation-not-allowed": "Este método de autenticação ainda não foi ativado no Firebase Console.",
  "auth/wrong-password": "E-mail ou senha inválidos.",
};

export function getAuthErrorMessage(code: string) {
  return messages[code] ?? "Não foi possível concluir a solicitação. Tente novamente.";
}
