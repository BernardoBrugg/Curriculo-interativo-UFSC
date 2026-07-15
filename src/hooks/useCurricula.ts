"use client";

import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { firestore } from "@/lib/firebase";
import { CurriculumDocument, CurriculumSummary, normalizeCurriculumDocument, normalizeCurriculumSummary } from "@/lib/curriculum-repository";

export function useCurriculumSummaries() {
  const { user } = useAuth();
  const [curricula, setCurricula] = useState<CurriculumSummary[]>([]);
  const [error, setError] = useState("");
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    return onSnapshot(collection(firestore, "curricula"), (snapshot) => {
      setCurricula(snapshot.docs.map((item) => normalizeCurriculumSummary({ id: item.id, ...item.data() })).filter((item) => item.id));
      setError("");
      setLoadedUserId(user.uid);
    }, () => {
      setCurricula([]);
      setError("Não foi possível carregar os currículos disponíveis.");
      setLoadedUserId(user.uid);
    });
  }, [user]);

  const isCurrentUserLoaded = Boolean(user && loadedUserId === user.uid);

  return {
    curricula: isCurrentUserLoaded ? curricula : [],
    isLoading: user ? !isCurrentUserLoaded : false,
    error: isCurrentUserLoaded ? error : "",
  };
}

export function useCurriculum(courseId: string) {
  const { user } = useAuth();
  const [curriculum, setCurriculum] = useState<CurriculumDocument | null>(null);
  const [error, setError] = useState("");
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const subscriptionKey = `${user.uid}:${courseId}`;

    return onSnapshot(doc(firestore, "curricula", courseId), (snapshot) => {
      if (!snapshot.exists()) {
        setCurriculum(null);
        setError("Este currículo não está disponível.");
        setLoadedKey(subscriptionKey);
        return;
      }
      setCurriculum(normalizeCurriculumDocument({ id: snapshot.id, ...snapshot.data() }));
      setError("");
      setLoadedKey(subscriptionKey);
    }, () => {
      setCurriculum(null);
      setError("Não foi possível carregar este currículo.");
      setLoadedKey(subscriptionKey);
    });
  }, [courseId, user]);

  const currentKey = user ? `${user.uid}:${courseId}` : null;
  const isCurrentSubscriptionLoaded = Boolean(currentKey && loadedKey === currentKey);

  return {
    curriculum: isCurrentSubscriptionLoaded ? curriculum : null,
    isLoading: user ? !isCurrentSubscriptionLoaded : false,
    error: isCurrentSubscriptionLoaded ? error : "",
  };
}
