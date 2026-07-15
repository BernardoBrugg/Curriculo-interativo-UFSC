import { getPasswordValidationError } from "./password-policy";

export interface ProfileValidationInput {
  name: string;
  email: string;
  newPassword?: string;
}

export interface ProfileValidationErrors {
  name?: string;
  email?: string;
  newPassword?: string;
}

export function getProfileValidationErrors(input: ProfileValidationInput): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  if (!input.name.trim()) errors.name = "Informe seu nome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.email = "Informe um e-mail válido.";
  if (input.newPassword) {
    const passwordError = getPasswordValidationError(input.newPassword);
    if (passwordError) errors.newPassword = passwordError;
  }

  return errors;
}
