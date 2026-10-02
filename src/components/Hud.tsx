"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { progressPct, useGame } from "@/game/store";
import Avatar from "./Avatar";

function Meter({
  label,
  value,
  hint,
  color,
  icon,
  bar,
}: {
  label: string;
  value: string;
  hint: string;
  color: string;
  icon: string;
  bar?: number;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl bg-panel-2/80 px-2 py-1 sm:gap-2 sm:px-2.5 sm:py-1.5" title={`${label}: ${hint}`}>
      <span className="text-lg leading-none" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[10px] font-black tracking-wider" style={{ color }}>
            {label}
          </span>
          <span className="font-display text-base leading-none">{value}</span>
        </div>
        {bar !== undefined && (
          <div className="mt-1 hidden h-1.5 w-16 overflow-hidden rounded-full bg-bg sm:block">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(4, bar * 100)}%`, background: color }} />
          </div>
        )}
        <span className="sr-only">{hint}</span>
      </div>
    </div>
  );
}

/** Persistent HUD (Brief §6): UP$, STACK, RIPPLE, PROGRESS, STREAK, plus the classroom GLOBAL MUTE. */
export default function Hud() {
  const g = useGame();
  const path = usePathname();
  if (!g.avatar) return null;
  const stackLv = Math.floor(g.stack / 50) + 1;
  const rippleLv = Math.floor(g.ripple / 50) + 1;
  const nav = [
    { href: "/block", label: "Block" },
    { href: "/collection", label: "Collection" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-2">
        <Link href="/block" className="flex items-center gap-2 pr-1" aria-label="Back to My Block">
          <div className="h-11 w-8 overflow-hidden">
            <Avatar avatar={g.avatar} size={44} />
          </div>
          <span className="hidden font-display text-sm sm:inline">{g.avatar.name}</span>
        </Link>
        <div className="order-last flex w-full flex-wrap items-center gap-1.5 sm:order-none sm:w-auto sm:flex-1">
          <Meter label="UP$" icon="🪙" value={`$${g.ups}`} hint="Your money. Earn it, spend it, keep it." color="var(--gold)" />
          <Meter label="STACK" icon="🧱" value={`${g.stack}`} hint={`What you build for yourself. Level ${stackLv}.`} color="var(--violet)" bar={(g.stack % 50) / 50} />
          <Meter label="RIPPLE" icon="🌊" value={`${g.ripple}`} hint={`What your moves do for the block. Level ${rippleLv}.`} color="var(--cyan)" bar={(g.ripple % 50) / 50} />
          <Meter label="PROGRESS" icon="🗺️" value={`${progressPct(g)}%`} hint="Missions completed across the game." color="var(--lime)" bar={progressPct(g) / 100} />
          <Meter label="STREAK" icon="🔥" value={`${g.streak}`} hint="Days you finished a mission." color="var(--orange)" />
        </div>
        <nav className="ml-auto flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-xl px-2.5 py-2 text-sm font-bold ${path === n.href ? "bg-panel-2 text-lime" : "text-muted hover:text-ink"}`}
            >
              {n.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={g.toggleMute}
            className="btn-ghost rounded-xl px-3 py-2 text-sm font-bold"
            aria-pressed={g.muted}
            aria-label={g.muted ? "Sound is off. Turn sound on" : "Sound is on. Mute all sound"}
            title="Mute (M)"
          >
            {g.muted ? "🔇" : "🔊"}
          </button>
        </nav>
      </div>
    </header>
  );
}
