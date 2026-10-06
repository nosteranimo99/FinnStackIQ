"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { buildDemoState, DEMO_AVATAR } from "@/game/demo";
import { useGameReady } from "@/game/hooks";
import { useGame } from "@/game/store";

const STORY: { step: string; what: string; where: string }[] = [
  { step: "CREATE", what: "Nova, a finished avatar with earned gear", where: "My Block" },
  { step: "EARN", what: "Mission 1 done: two mini-jobs, UP$ earned", where: "Hustle Hub" },
  { step: "CHOOSE", what: "Corner Shop: cop the sneakers, hold, or help the crew", where: "Mission 2" },
  { step: "CONSEQUENCE", what: "Go for Dee's bike after spending. DOWN$ shows what happened", where: "Mission 2" },
  { step: "ADAPT", what: "Five ways to recover. No dead ends", where: "Recovery" },
  { step: "BUILD", what: "Chip in on the Block Court", where: "Mission 3" },
  { step: "IMPACT", what: "The court lights up, neighbors return, RIPPLE climbs", where: "World transformation" },
  { step: "PROGRESS", what: "Unlocks, collection, streak, zone map", where: "HUD + Collection" },
  { step: "PROTECT", what: "Scamaland is already open. Collect red flags, beat the Shark", where: "Bus stop" },
  { step: "DATA", what: "Every move is an event, rolled into behavior signals", where: "Behavior data" },
  { step: "AI", what: "Rule-based preview of how the next mission would adapt", where: "Behavior data" },
];

/** Investor Demo Mode (Brief §38–39): one click, never an empty world. */
export default function DemoPage() {
  const ready = useGameReady();
  const router = useRouter();

  const play = (href = "/block") => {
    useGame.getState().loadState(buildDemoState());
    useGame.getState().cue("zone");
    router.push(href);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Link href="/" className="text-sm font-bold text-muted hover:text-ink">
        ← Money Muvz
      </Link>
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="text-xs font-black tracking-[0.3em] text-gold">FinStack IQ · Investor demo</div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            A FINANCIAL-LIFE GAME, <span className="text-lime">NOT A QUIZ.</span>
          </h1>
          <p className="mt-2 max-w-xl text-muted">Loads a populated mid-game save on this device: avatar, UP$, STACK, RIPPLE, a completed mission, an earned cosmetic, locked zones, Scamaland, and behavior data. Seeded data only. No accounts, no real money.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary glow px-8 py-5 font-display text-2xl" onClick={() => play()} disabled={!ready}>
              ▶ PLAY DEMO
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => play("/scamaland")} disabled={!ready}>
              Jump to Scamaland
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => play("/insights")} disabled={!ready}>
              Behavior data
            </button>
            <Link href="/teacher" className="btn btn-ghost">
              Teacher dashboard
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <Avatar avatar={DEMO_AVATAR} size={240} mood="celebrate" />
        </div>
      </div>

      <section className="panel p-5">
        <h2 className="mb-4 font-display text-xl">THE DEMO STORY</h2>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {STORY.map((s, i) => (
            <li key={s.step} className="flex gap-3 rounded-xl bg-bg/50 p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime font-display text-sm text-bg">{i + 1}</span>
              <div>
                <div className="font-display text-sm text-lime">{s.step}</div>
                <div className="text-sm font-semibold">{s.what}</div>
                <div className="text-xs text-muted">{s.where}</div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-center text-sm text-muted">
          Tip: in Mission 2, buy the sneakers first. That&apos;s the fastest path to a DOWN$ and a recovery.
        </p>
      </section>
    </main>
  );
}
