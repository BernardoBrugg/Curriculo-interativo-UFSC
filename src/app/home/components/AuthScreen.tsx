"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { getPasswordValidationError, PASSWORD_MIN_LENGTH } from "@/lib/password-policy";

type AuthMode = "sign-in" | "sign-up" | "reset";

export function AuthScreen() {
  const { signIn, signInWithGoogle, signUp, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isReset = mode === "reset";
  const isSignUp = mode === "sign-up";
  const passwordRules = [
    { label: "8 caracteres", valid: password.length >= PASSWORD_MIN_LENGTH },
    { label: "letra maiúscula", valid: /[A-Z]/.test(password) },
    { label: "letra minúscula", valid: /[a-z]/.test(password) },
    { label: "número", valid: /[0-9]/.test(password) },
  ];

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
    setNotice("");
  };

  const getErrorCode = (reason: unknown) => reason instanceof Error && "code" in reason ? String(reason.code) : "";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (isSignUp) {
      const passwordError = getPasswordValidationError(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }
    setIsSubmitting(true);
    try {
      if (mode === "sign-in") await signIn(email, password);
      if (mode === "sign-up") await signUp(email, password);
      if (isReset) {
        await sendPasswordReset(email);
        setNotice("E-mail enviado. Confira sua caixa de entrada para definir uma nova senha.");
      }
    } catch (reason) {
      setError(getAuthErrorMessage(getErrorCode(reason)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (reason) {
      setError(getAuthErrorMessage(getErrorCode(reason)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "sign-in" ? "Entre na sua conta" : mode === "sign-up" ? "Crie sua conta" : "Esqueci minha senha";
  const description = mode === "sign-in" ? "Acesse seu currículo e continue de onde parou." : mode === "sign-up" ? "Salve seu planejamento e acesse de qualquer dispositivo." : "Informe seu e-mail para receber um link e definir uma nova senha.";
  const action = mode === "sign-in" ? "Entrar" : mode === "sign-up" ? "Criar conta" : "Enviar e-mail de recuperação";

  return (
    <div className="rounded-[2rem] border border-[var(--glass-border)] bg-[var(--glass-surface)]/30 p-6 backdrop-blur-sm sm:p-8">
      {!isReset && <div className="grid grid-cols-2 gap-1 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-muted)] p-1">
        <button type="button" onClick={() => changeMode("sign-in")} className={`auth-tab rounded-xl px-4 py-3 text-sm font-bold transition ${mode === "sign-in" ? "auth-tab-active shadow-sm" : ""}`}>Entrar</button>
        <button type="button" onClick={() => changeMode("sign-up")} className={`auth-tab rounded-xl px-4 py-3 text-sm font-bold transition ${mode === "sign-up" ? "auth-tab-active shadow-sm" : ""}`}>Criar conta</button>
      </div>}
      <div className="mt-7">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label htmlFor="auth-email" className="block text-sm font-semibold text-[var(--text-strong)]">E-mail<input id="auth-email" required type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} className="glass-control mt-2 w-full rounded-xl px-4 py-3.5 text-[var(--text-strong)] outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" /></label>
        {!isReset && <label htmlFor="auth-password" className="block text-sm font-semibold text-[var(--text-strong)]">Senha<input id="auth-password" required minLength={isSignUp ? PASSWORD_MIN_LENGTH : 1} autoComplete={isSignUp ? "new-password" : "current-password"} type="password" placeholder={isSignUp ? "Crie uma senha forte" : "Digite sua senha"} value={password} onChange={(event) => setPassword(event.target.value)} className="glass-control mt-2 w-full rounded-xl px-4 py-3.5 text-[var(--text-strong)] outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--ring)]" />{isSignUp && <span className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-medium text-[var(--text-muted)]">{passwordRules.map((rule) => <span key={rule.label} className={rule.valid ? "text-emerald-500" : ""}>{rule.valid ? "✓" : "○"} {rule.label}</span>)}</span>}</label>}
        {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-500">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-600">{notice}</p>}
        <button type="submit" disabled={isSubmitting} className="auth-primary w-full rounded-xl px-4 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Aguarde..." : action}</button>
      </form>
      {!isReset && <><div className="my-5 flex items-center gap-3 text-xs font-semibold text-[var(--text-faint)]"><span className="h-px flex-1 bg-[var(--glass-border)]" />ou<span className="h-px flex-1 bg-[var(--glass-border)]" /></div><button type="button" disabled={isSubmitting} onClick={handleGoogleSignIn} className="auth-secondary w-full rounded-xl px-4 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">Continuar com Google</button></>}
      <div className="mt-5 flex justify-center text-sm font-semibold">{mode === "sign-in" && <button type="button" onClick={() => changeMode("reset")} className="auth-tab cursor-pointer px-2 py-1 text-[var(--accent)] hover:underline">Esqueci minha senha</button>}{mode !== "sign-in" && <button type="button" onClick={() => changeMode("sign-in")} className="auth-tab cursor-pointer px-2 py-1 text-[var(--accent)] hover:underline">Voltar para entrar</button>}</div>
    </div>
  );
}
