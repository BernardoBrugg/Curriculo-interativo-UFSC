"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { EmailAuthProvider, GoogleAuthProvider, User, createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithPopup, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updateEmail: (email: string, password?: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => onAuthStateChanged(firebaseAuth, (nextUser) => {
    setUser(nextUser);
    setIsLoading(false);
  }), []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(firebaseAuth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    firebaseAuth.languageCode = "pt-BR";
    await sendPasswordResetEmail(firebaseAuth, email);
  }, []);

  const reauthenticate = useCallback(async (currentUser: User, password?: string) => {
    const hasPasswordProvider = currentUser.providerData.some((provider) => provider.providerId === "password");
    const hasGoogleProvider = currentUser.providerData.some((provider) => provider.providerId === "google.com");
    if (hasPasswordProvider && password) {
      await reauthenticateWithCredential(currentUser, EmailAuthProvider.credential(currentUser.email ?? "", password));
      return;
    }
    if (hasPasswordProvider) throw new Error("auth/password-required");
    if (hasGoogleProvider) {
      await reauthenticateWithPopup(currentUser, new GoogleAuthProvider());
      return;
    }
    throw new Error("auth/provider-not-supported");
  }, []);

  const getCurrentUser = useCallback(() => {
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) throw new Error("auth/user-not-found");
    return currentUser;
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) return;
    await currentUser.reload();
    setUser(firebaseAuth.currentUser);
  }, []);

  const updateDisplayName = useCallback(async (name: string) => {
    await updateProfile(getCurrentUser(), { displayName: name.trim() });
    await refreshUser();
  }, [getCurrentUser, refreshUser]);

  const updateEmailAddress = useCallback(async (email: string, password?: string) => {
    const currentUser = getCurrentUser();
    await reauthenticate(currentUser, password);
    await updateEmail(currentUser, email.trim());
    await refreshUser();
  }, [getCurrentUser, reauthenticate, refreshUser]);

  const updateUserPassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const currentUser = getCurrentUser();
    await reauthenticate(currentUser, currentPassword);
    await updatePassword(currentUser, newPassword);
  }, [getCurrentUser, reauthenticate]);

  const deleteAccount = useCallback(async (password?: string) => {
    const currentUser = getCurrentUser();
    await reauthenticate(currentUser, password);
    await deleteUser(currentUser);
    setUser(null);
  }, [getCurrentUser, reauthenticate]);

  const logOut = useCallback(async () => {
    await signOut(firebaseAuth);
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    sendPasswordReset,
    updateDisplayName,
    updateEmail: updateEmailAddress,
    updatePassword: updateUserPassword,
    deleteAccount,
    logOut,
  }), [deleteAccount, isLoading, logOut, sendPasswordReset, signIn, signInWithGoogle, signUp, updateDisplayName, updateEmailAddress, updateUserPassword, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
