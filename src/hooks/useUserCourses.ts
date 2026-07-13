"use client";

import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { firestore } from "@/lib/firebase";

export function useUserCourses() {
  const { user } = useAuth();
  const [courseIds, setCourseIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    return onSnapshot(collection(firestore, "users", user.uid, "courses"), (snapshot) => {
      setCourseIds(snapshot.docs.map((item) => item.id));
      setIsLoading(false);
      setError("");
    }, () => {
      setIsLoading(false);
      setError("Não foi possível carregar seus cursos.");
    });
  }, [user]);

  const addCourse = useCallback(async (courseId: string) => {
    if (!user) return;
    try {
      await setDoc(doc(firestore, "users", user.uid, "courses", courseId), { courseId, addedAt: serverTimestamp() }, { merge: true });
    } catch {
      setError("Não foi possível adicionar este curso.");
    }
  }, [user]);

  const removeCourse = useCallback(async (courseId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(firestore, "users", user.uid, "courses", courseId));
    } catch {
      setError("Não foi possível remover este curso.");
    }
  }, [user]);

  return { courseIds, isLoading, error, addCourse, removeCourse };
}
