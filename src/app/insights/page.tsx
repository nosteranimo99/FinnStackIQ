"use client";

import Link from "next/link";
import GameShell from "@/components/GameShell";
import { MISSIONS } from "@/game/content";
import { deriveAdaptations, deriveSignals, type Level } from "@/game/signals";
import { useGame } from "@/game/store";
import type { EventType } from "@/game/types";

const LEVEL_STYLE: Record<Level, string> = {
  none: "bg-panel-2 text-muted",
  low: "bg-cyan/20 text-cyan",
  medium: "bg-gold/20 text-gold",
  high: "bg-lime/20 text-lime",
};

const EVENT_COLOR: Partial<Record<EventType, string>> = {
  money_earned: "text-gold",
  money_spent: "text-gold",
  down_triggered: "text-orange",
  recovery_started: "text-orange",
  recovery_completed: "text-lime",
  ripple_changed: "text-cyan",
  stack_changed: "text-violet",
  red_flag_collected: "text-pink",
  clue_discovered: "text-pink",
  scam_decision_made: "text-pink",
  mission_completed: "text-lime",
  choice_made: "text-ink",
};

function fmtData(d?: Record<string, unknown>) {
  if (!d) return "";
  return Object.entries(d)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}

/** Behavioral data dashboard (Brief §30–32): events → signals → (future) adaptation. */
function Insights() {
  const g = useGame();
  const signals = deriveSignals(g);
  const adaptations = deriveAdaptations(signals, g);
  const counts = g.events.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e.type]: (acc[e.type] ?? 0) + 1 }), {});
  const topCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = topCounts[0]?.[1] ?? 1;
  const recent = [...g.events].reverse().slice(0, 80);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ playerId: g.playerId, events: g.events, signals }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `money-muvz-events-${g.playerId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-6 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-black tracking-[0.25em] text-muted">BEHAVIORAL DATA</div>
          <h1 className="font-display text-3xl sm:text-4xl">ACTION → DECISION → OUTCOME → SIGNAL</h1>
          <p className="max-w-2xl text-muted">Every meaningful move creates an event. Signals are plain rules over those events today. They are the foundation a future AI layer would read. Nothing here is AI yet.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={exportJson}>
          ⬇ Export events (JSON)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["EVENTS", g.events.length, "text-ink"],
          ["SESSIONS", new Set(g.events.filter((e) => e.type === "session_started").map((e) => e.sessionId)).size, "text-ink"],
          ["MISSIONS", `${g.completedMissions.length}/${MISSIONS.length}`, "text-lime"],
          ["DOWN$ → RECOVERED", `${counts.down_triggered ?? 0} → ${counts.recovery_completed ?? 0}`, "text-orange"],
        ].map(([k, v, c]) => (
          <div key={k as string} className="panel p-4">
            <div className="text-xs font-black tracking-widest text-muted">{k}</div>
            <div className={`font-display text-2xl ${c}`}>{v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {(["financial", "gameplay"] as const).map((grp) => (
          <section key={grp} className="panel p-4">
            <h2 className="mb-3 font-display text-lg">{grp === "financial" ? "FINANCIAL BEHAVIOR" : "GAMEPLAY BEHAVIOR"}</h2>
            <ul className="flex flex-col gap-2">
              {signals
                .filter((s) => s.group === grp)
                .map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-3 rounded-xl bg-bg/50 px-3 py-2">
                    <div>
                      <div className="font-bold">{s.label}</div>
                      <div className="text-xs text-muted">{s.evidence}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`rounded-md px-2 py-0.5 text-xs font-black uppercase ${LEVEL_STYLE[s.level]}`}>{s.level}</span>
                      <div className="mt-1 text-xs font-semibold text-muted">{s.value}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="panel p-4">
        <h2 className="font-display text-lg">FUTURE PERSONALIZATION · PREVIEW</h2>
        <p className="mb-3 text-sm text-muted">Architected for, not built. These rules show what the next mission could adapt to, based on this player&apos;s signals.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {adaptations.map((a) => (
            <div key={a.trigger} className={`rounded-xl border-2 p-3 ${a.active ? "border-lime bg-lime/10" : "border-line"}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold">{a.trigger}</div>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-black ${a.active ? "bg-lime text-bg" : "bg-panel-2 text-muted"}`}>{a.active ? "WOULD TRIGGER" : "NOT SEEN"}</span>
              </div>
              <div className="text-sm text-muted">→ {a.next}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <section className="panel p-4">
          <h2 className="mb-3 font-display text-lg">EVENT COUNTS</h2>
          <ul className="space-y-1.5">
            {topCounts.map(([t, n]) => (
              <li key={t}>
                <div className="flex justify-between font-mono text-xs">
                  <span className={EVENT_COLOR[t as EventType] ?? "text-muted"}>{t}</span>
                  <span>{n}</span>
                </div>
                <div className="h-1.5 rounded-full bg-bg">
                  <div className="h-full rounded-full bg-violet" style={{ width: `${(n / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel p-4">
          <h2 className="mb-3 font-display text-lg">EVENT STREAM</h2>
          {recent.length === 0 ? (
            <p className="text-muted">No events yet. Go make some moves.</p>
          ) : (
            <ol className="max-h-[520px] space-y-1 overflow-y-auto pr-2 font-mono text-xs">
              {recent.map((e) => (
                <li key={e.id} className="grid grid-cols-[70px_170px_1fr] gap-2 border-b border-line/50 py-1">
                  <span className="text-muted">{new Date(e.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className={`font-bold ${EVENT_COLOR[e.type] ?? "text-muted"}`}>{e.type}</span>
                  <span className="truncate text-muted" title={fmtData(e.data)}>
                    {e.mission ? `[${e.mission}] ` : ""}
                    {fmtData(e.data)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
      <div className="text-center">
        <Link href="/block" className="btn btn-ghost">
          Back to the block
        </Link>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <GameShell>
      <Insights />
    </GameShell>
  );
}
