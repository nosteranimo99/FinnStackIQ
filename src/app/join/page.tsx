"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import GameShell from "@/components/GameShell";
import { findClass, SEEDED_CLASS, useTeacher } from "@/game/classroom";
import { useTeacherReady } from "@/game/hooks";
import { useGame } from "@/game/store";

/** Student Join (Brief §36): a 6-character class code, no email. */
function Join() {
  useTeacherReady();
  const classes = useTeacher((s) => s.classes);
  const router = useRouter();
  const hasAvatar = useGame((s) => s.avatar !== null && !s.demo);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const room = findClass(code, classes);
    if (!room) {
      setError("Can't find that class. Double-check the code with your teacher.");
      return;
    }
    const g = useGame.getState();
    if (g.demo) g.resetGame();
    useGame.getState().joinClass(room.code);
    useGame.getState().cue("unlock");
    setJoined(room.name);
    window.setTimeout(() => router.push(hasAvatar ? "/block" : "/create"), 1100);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10">
      <Link href="/" className="text-sm font-bold text-muted hover:text-ink">
        ← Back
      </Link>
      <h1 className="font-display text-4xl text-lime">JOIN YOUR CLASS</h1>
      {joined ? (
        <div className="panel pop-in p-6 text-center">
          <div className="text-4xl">🎉</div>
          <div className="mt-2 font-display text-xl">You&apos;re in!</div>
          <div className="text-muted">{joined}</div>
        </div>
      ) : (
        <form onSubmit={submit} className="panel flex flex-col gap-4 p-6">
          <label htmlFor="code" className="text-sm font-bold text-muted">
            Enter the 6-character code from your teacher
          </label>
          <input
            id="code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6));
              setError(null);
            }}
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="ABC123"
            className={`min-h-16 rounded-2xl border-2 bg-bg text-center font-display text-4xl tracking-[0.35em] outline-none focus:border-lime ${error ? "border-orange shake" : "border-line"}`}
            aria-invalid={!!error}
            aria-describedby="code-help"
          />
          {error && <p className="font-semibold text-orange">{error}</p>}
          <button type="submit" className="btn btn-primary w-full font-display text-xl" disabled={code.length !== 6}>
            JOIN
          </button>
          <p id="code-help" className="text-center text-xs text-muted">
            No email needed. Demo class code: <span className="font-bold text-ink">{SEEDED_CLASS.code}</span>
          </p>
        </form>
      )}
    </div>
  );
}

export default function JoinPage() {
  return (
    <GameShell requireAvatar={false} hud={false}>
      <Join />
    </GameShell>
  );
}
