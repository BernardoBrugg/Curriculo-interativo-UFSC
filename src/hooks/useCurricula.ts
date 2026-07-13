"use client";

import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { CurriculumDocument, CurriculumSummary, normalizeCurriculumDocument, normalizeCurriculumSummary } from "@/lib/curriculum-repository";

export function useCurriculumSummaries() {
  const [curricula, setCurricula] = useState<CurriculumSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => onSnapshot(collection(firestore, "curricula"), (snapshot) => {
    setCurricula(snapshot.docs.map((item) => normalizeCurriculumSummary({ id: item.id, ...item.data() })).filter((item) => item.id));
    setIsLoading(false);
    setError("");
  }, () => {
    setIsLoading(false);
    setError("Não foi possível carregar os currículos disponíveis.");
  }), []);

  return { curricula, isLoading, error };
}

export function useCurriculum(courseId: string) {
  const [curriculum, setCurriculum] = useState<CurriculumDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    return onSnapshot(doc(firestore, "curricula", courseId), (snapshot) => {
      if (!snapshot.exists()) {
        setCurriculum(null);
        setError("Este currículo não está disponível.");
        setIsLoading(false);
        return;
      }
      setCurriculum(normalizeCurriculumDocument({ id: snapshot.id, ...snapshot.data() }));
      setError("");
      setIsLoading(false);
    }, () => {
      setCurriculum(null);
      setError("Não foi possível carregar este currículo.");
      setIsLoading(false);
    });
  }, [courseId]);

  return { curriculum, isLoading, error };
}
