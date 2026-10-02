"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { CAST, RESIDENTS } from "@/game/content";
import { useGameReady } from "@/game/hooks";
import { useGame } from "@/game/store";

/** Screen 01 — Welcome. Get the student into the world immediately (Brief §4). */
export default function Welcome() {
  const ready = useGameReady();
  const avatar = useGame((s) => s.avatar);
  const demo = useGame((s) => s.demo);
  const router = useRouter();
  const returning = ready && avatar !== null && !demo;

  const start = () => {
    if (demo) useGame.getState().resetGame();
    router.push(returning ? "/block" : "/create");
  };

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* skyline */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#3b2a8a_0%,transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 flex h-56 items-end gap-2 px-4 opacity-60">
          {[40, 70, 55, 90, 62, 80, 48, 75, 58, 85, 50, 66].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-lg bg-panel-2" style={{ height: `${h}%` }}>
              <div className="grid grid-cols-2 gap-1 p-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-2 rounded-sm" style={{ background: (i + j) % 3 ? "#ffd23f55" : "#5ee7ff33" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 px-4 py-10 text-center">
        <div className="slide-up">
          <div className="mb-2 text-xs font-black tracking-[0.3em] text-muted">FINSTACK IQ PRESENTS</div>
          <h1 className="font-display text-6xl leading-none text-lime drop-shadow-[0_6px_0_#4b7d00] sm:text-8xl">
            MONEY
            <br />
            MUVZ
          </h1>
          <p className="mt-4 font-display text-lg tracking-widest text-gold sm:text-xl">CREATE · EARN · OWN</p>
        </div>

        <div className="flex items-end justify-center gap-1 sm:gap-4">
          <Avatar avatar={RESIDENTS[2]} size={110} mood="idle" className="hidden sm:inline-block" />
          <Avatar avatar={CAST.penny.look} size={130} mood="thinking" />
          <Avatar avatar={avatar && !demo ? avatar : CAST.benny.look} size={170} mood="celebrate" />
          <Avatar avatar={CAST.dee.look} size={130} mood="idle" />
          <Avatar avatar={RESIDENTS[1]} size={110} mood="walk" className="hidden sm:inline-block" />
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <button type="button" className="btn btn-primary glow w-full py-5 font-display text-2xl" onClick={start} disabled={!ready}>
            {returning ? "BACK TO THE BLOCK" : "START MUVMENT"}
          </button>
          <Link href="/join" className="btn btn-ghost w-full">
            I HAVE A JOIN CODE
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-muted">
          <Link href="/demo" className="hover:text-gold">
            ▶ Investor demo
          </Link>
          <Link href="/teacher" className="hover:text-cyan">
            Teacher mode
          </Link>
        </div>
      </div>
    </main>
  );
}
