"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTeacher } from "./classroom";
import { useGame } from "./store";

/**
 * Game state lives in localStorage, so the server can't render it. This hook rehydrates the
 * persisted store on the client and reports when it's ready, keeping SSR markup and the first
 * client render identical.
 */
export function useGameReady() {
  const ready = useSyncExternalStore(
    (cb) => useGame.persist.onFinishHydration(cb),
    () => useGame.persist.hasHydrated(),
    () => false,
  );
  useEffect(() => {
    if (!useGame.persist.hasHydrated()) void useGame.persist.rehydrate();
  }, []);
  return ready;
}

export function useTeacherReady() {
  const ready = useSyncExternalStore(
    (cb) => useTeacher.persist.onFinishHydration(cb),
    () => useTeacher.persist.hasHydrated(),
    () => false,
  );
  useEffect(() => {
    if (!useTeacher.persist.hasHydrated()) void useTeacher.persist.rehydrate();
  }, []);
  return ready;
}
