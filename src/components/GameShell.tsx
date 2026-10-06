"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useGameReady } from "@/game/hooks";
import { useGame } from "@/game/store";
import FxLayer from "./FxLayer";
import Hud from "./Hud";

interface Props {
  children: ReactNode;
  requireAvatar?: boolean;
  hud?: boolean;
  className?: string;
}

/** Wraps every game screen: waits for saved progress, tracks the session, shows the HUD and FX. */
export default function GameShell({ children, requireAvatar = true, hud = true, className = "" }: Props) {
  const ready = useGameReady();
  const hasAvatar = useGame((s) => s.avatar !== null);
  const demo = useGame((s) => s.demo);
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const g = useGame.getState();
    g.ensureSession();
    const onHide = () => useGame.getState().endSession();
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "m" || e.key === "M") useGame.getState().toggleMute();
    };
    window.addEventListener("pagehide", onHide);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("keydown", onKey);
    };
  }, [ready]);

  useEffect(() => {
    if (ready && requireAvatar && !hasAvatar) router.replace("/create");
  }, [ready, requireAvatar, hasAvatar, router]);

  if (!ready || (requireAvatar && !hasAvatar)) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="font-display text-2xl text-lime bounce-soft">Loading your block…</div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-dvh flex-col ${className}`}>
      {demo && (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-gold px-3 py-1.5 text-center text-sm font-bold text-bg">
          <span>INVESTOR DEMO · seeded progress, no real accounts or money</span>
          <Link href="/demo" className="underline underline-offset-2">
            Demo tour
          </Link>
          <Link href="/insights" className="underline underline-offset-2">
            Behavior data
          </Link>
        </div>
      )}
      {hud && <Hud />}
      <FxLayer />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
