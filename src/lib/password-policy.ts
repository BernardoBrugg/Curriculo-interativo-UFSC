export const PASSWORD_MIN_LENGTH = 8;

export function getPasswordValidationError(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) return "A senha precisa ter pelo menos 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "A senha precisa ter uma letra maiúscula.";
  if (!/[a-z]/.test(password)) return "A senha precisa ter uma letra minúscula.";
  if (!/[0-9]/.test(password)) return "A senha precisa ter um número.";
  return "";
}
