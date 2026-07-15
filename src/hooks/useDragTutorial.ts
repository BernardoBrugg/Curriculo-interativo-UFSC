"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { firestore } from "@/lib/firebase";

export function useDragTutorial() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(firestore, "users", user.uid, "preferences", "tutorials"), (snapshot) => {
      setIsVisible(snapshot.data()?.dragTutorialCompleted !== true);
    }, () => setIsVisible(true));
  }, [user]);

  const dismiss = useCallback(async () => {
    if (!user) return;
    setIsVisible(false);
    await setDoc(doc(firestore, "users", user.uid, "preferences", "tutorials"), { dragTutorialCompleted: true }, { merge: true });
  }, [user]);

  return { isVisible, dismiss };
}
