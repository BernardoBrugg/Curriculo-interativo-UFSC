"use client";

import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { firestore } from "@/lib/firebase";
import { CurriculumDocument, CurriculumSummary, normalizeCurriculumDocument, normalizeCurriculumSummary } from "@/lib/curriculum-repository";
import { availableCourses, getCurriculum } from "@/data/curricula";

export function useCurriculumSummaries() {
  const { user } = useAuth();
  const staticSummaries = useMemo<CurriculumSummary[]>(
    () => availableCourses.map((course) => ({ id: course.id, name: course.name, description: course.description })),
    []
  );
  const [remoteCurricula, setRemoteCurricula] = useState<CurriculumSummary[]>([]);
  const [error, setError] = useState("");
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    return onSnapshot(
      collection(firestore, "curricula"),
      (snapshot) => {
        const fetched = snapshot.docs
          .map((item) => normalizeCurriculumSummary({ id: item.id, ...item.data() }))
          .filter((item) => item.id);
        setRemoteCurricula(fetched);
        setError("");
        setLoadedUserId(user.uid);
      },
      () => {
        setError("Não foi possível carregar os currículos disponíveis.");
        setLoadedUserId(user.uid);
      }
    );
  }, [user]);

  const isCurrentUserLoaded = Boolean(user && loadedUserId === user.uid);
  const curricula = !user ? staticSummaries : isCurrentUserLoaded && remoteCurricula.length > 0 ? remoteCurricula : staticSummaries;

  return {
    curricula,
    isLoading: user ? !isCurrentUserLoaded : false,
    error: isCurrentUserLoaded ? error : "",
  };
}

export function useCurriculum(courseId: string) {
  const { user } = useAuth();
  const staticCurriculum = useMemo<CurriculumDocument | null>(() => {
    const found = getCurriculum(courseId);
    if (!found) return null;
    return { ...found, id: courseId };
  }, [courseId]);

  const [remoteCurriculum, setRemoteCurriculum] = useState<CurriculumDocument | null>(null);
  const [error, setError] = useState("");
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const subscriptionKey = `${user.uid}:${courseId}`;

    return onSnapshot(
      doc(firestore, "curricula", courseId),
      (snapshot) => {
        if (!snapshot.exists()) {
          setRemoteCurriculum(null);
          setError(staticCurriculum ? "" : "Este currículo não está disponível.");
          setLoadedKey(subscriptionKey);
          return;
        }
        setRemoteCurriculum(normalizeCurriculumDocument({ id: snapshot.id, ...snapshot.data() }));
        setError("");
        setLoadedKey(subscriptionKey);
      },
      () => {
        setRemoteCurriculum(null);
        setError(staticCurriculum ? "" : "Não foi possível carregar este currículo.");
        setLoadedKey(subscriptionKey);
      }
    );
  }, [courseId, staticCurriculum, user]);

  const currentKey = user ? `${user.uid}:${courseId}` : null;
  const isCurrentSubscriptionLoaded = Boolean(!user || (currentKey && loadedKey === currentKey));
  const curriculum = !user ? staticCurriculum : (remoteCurriculum ?? staticCurriculum);

  return {
    curriculum,
    isLoading: user ? !isCurrentSubscriptionLoaded : false,
    error: isCurrentSubscriptionLoaded ? error : (staticCurriculum ? "" : "Este currículo não está disponível."),
  };
}
