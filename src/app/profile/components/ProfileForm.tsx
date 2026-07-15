"use client";

import { FormEvent, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "@/components/AuthProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { getProfileValidationErrors } from "@/lib/profile-validation";
import { PASSWORD_MIN_LENGTH } from "@/lib/password-policy";

interface ProfileFormProps {
  user: User;
}

function getErrorCode(reason: unknown) {
  return reason instanceof Error && "code" in reason ? String(reason.code) : "";
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { updateDisplayName, updateEmail, updatePassword, sendPasswordReset, deleteAccount, logOut } = useAuth();
  const [name, setName] = useState(user.displayName ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPasswordProvider = useMemo(() => user.providerData.some((provider) => provider.providerId === "password"), [user.providerData]);

  const runAction = async (action: () => Promise<void>, successMessage: string) => {
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      await action();
      setNotice(successMessage);
    } catch (reason) {
      setError(getAuthErrorMessage(getErrorCode(reason)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = getProfileValidationErrors({ name, email });
    if (validationErrors.name || name.trim() !== user.displayName?.trim()) {
      if (validationErrors.name) {
        setError(validationErrors.name);
        return;
      }
      await runAction(() => updateDisplayName(name), "Nome atualizado.");
    }
    if (email.trim() !== user.email?.trim()) {
      if (validationErrors.email) {
        setError(validationErrors.email);
        return;
      }
      await runAction(() => updateEmail(email, isPasswordProvider ? emailPassword : undefined), "E-mail atualizado.");
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = getProfileValidationErrors({ name, email, newPassword });
    if (validationErrors.newPassword) {
      setError(validationErrors.newPassword);
      return;
    }
    if (newPassword !== confirmation) {
      setError("As senhas novas não coincidem.");
      return;
    }
    await runAction(async () => {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
    }, "Senha atualizada.");
  };

  const handleResetPassword = async () => {
    if (!user.email) return;
    await runAction(() => sendPasswordReset(user.email ?? ""), "Link de redefinição enviado para seu e-mail.");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) return;
    await runAction(async () => {
      await deleteAccount(isPasswordProvider ? emailPassword : undefined);
      await logOut();
    }, "Conta excluída.");
  };

  return (
    <div className="mt-8 grid gap-4">
      {(error || notice) && <p role={error ? "alert" : "status"} className={`rounded-2xl border px-4 py-3 text-sm ${error ? "border-red-500/20 bg-red-500/10 text-red-500" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"}`}>{error || notice}</p>}
      <section className="glass-surface rounded-3xl p-5 sm:p-7">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-strong)]">Dados pessoais</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Esses dados aparecem na sua conta.</p>
        </div>
        <form onSubmit={handleProfileSubmit} className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-[var(--text-strong)]">Nome<input value={name} onChange={(event) => setName(event.target.value)} className="glass-control mt-2 w-full rounded-xl px-4 py-3 text-[var(--text-strong)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" /></label>
          <label className="text-sm font-semibold text-[var(--text-strong)]">E-mail<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="glass-control mt-2 w-full rounded-xl px-4 py-3 text-[var(--text-strong)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" /></label>
          {isPasswordProvider && email.trim() !== user.email?.trim() && <label className="text-sm font-semibold text-[var(--text-strong)]">Senha atual<input value={emailPassword} onChange={(event) => setEmailPassword(event.target.value)} type="password" autoComplete="current-password" className="glass-control mt-2 w-full rounded-xl px-4 py-3 text-[var(--text-strong)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" /></label>}
          <button type="submit" disabled={isSubmitting} className="auth-primary w-fit rounded-xl px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60">Salvar dados</button>
        </form>
      </section>

      <section className="glass-surface rounded-3xl p-5 sm:p-7">
        <h2 className="text-xl font-semibold text-[var(--text-strong)]">Segurança</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Mantenha seu acesso protegido.</p>
        <form onSubmit={handlePasswordSubmit} className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-[var(--text-strong)]">Senha atual<input required={isPasswordProvider} minLength={isPasswordProvider ? 1 : undefined} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" autoComplete="current-password" disabled={!isPasswordProvider} className="glass-control mt-2 w-full rounded-xl px-4 py-3 text-[var(--text-strong)] outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" /></label>
          <label className="text-sm font-semibold text-[var(--text-strong)]">Nova senha<input required minLength={PASSWORD_MIN_LENGTH} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" autoComplete="new-password" disabled={!isPasswordProvider} className="glass-control mt-2 w-full rounded-xl px-4 py-3 text-[var(--text-strong)] outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" /></label>
          <label className="text-sm font-semibold text-[var(--text-strong)]">Confirmar nova senha<input required minLength={PASSWORD_MIN_LENGTH} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} type="password" autoComplete="new-password" disabled={!isPasswordProvider} className="glass-control mt-2 w-full rounded-xl px-4 py-3 text-[var(--text-strong)] outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" /></label>
          <button type="submit" disabled={isSubmitting || !isPasswordProvider} className="auth-primary w-fit rounded-xl px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60">Trocar senha</button>
        </form>
        <button type="button" onClick={() => void handleResetPassword()} disabled={isSubmitting || !user.email} className="auth-tab mt-5 text-sm font-semibold text-[var(--accent)] hover:underline disabled:opacity-60">Enviar link de redefinição por e-mail</button>
      </section>

      <section className="glass-surface rounded-3xl p-5 sm:p-7">
        <h2 className="text-xl font-semibold text-[var(--text-strong)]">Preferências</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Escolha como o currículo aparece para você.</p>
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-muted)] px-4 py-3"><span className="text-sm font-semibold text-[var(--text-strong)]">Tema da interface</span><ThemeToggle /></div>
      </section>

      <section className="glass-surface rounded-3xl border-red-500/20 p-5 sm:p-7">
        <h2 className="text-xl font-semibold text-[var(--text-strong)]">Zona de risco</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">A exclusão remove sua conta de autenticação.</p>
        <button type="button" onClick={() => void handleDeleteAccount()} disabled={isSubmitting} className="mt-5 rounded-xl border border-red-500/35 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60">Excluir conta</button>
      </section>

      <button type="button" onClick={() => void logOut()} className="auth-secondary w-full rounded-xl px-4 py-3 text-sm font-bold">Sair da conta</button>
    </div>
  );
}
