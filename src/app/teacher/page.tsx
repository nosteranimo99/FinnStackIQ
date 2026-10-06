"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { SEEDED_CLASS, seededStudents, useTeacher, type MockStudent } from "@/game/classroom";
import { MISSIONS } from "@/game/content";
import { useGameReady, useTeacherReady } from "@/game/hooks";
import { useGame } from "@/game/store";

const SEEDED = seededStudents();

function ago(mins: number) {
  if (mins < 60) return `${mins}m ago`;
  if (mins < 60 * 24) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

/** Teacher Mode (Brief §35–37): create a class, get a join code, see progress. No grades, no rankings. */
function Teacher() {
  const classes = useTeacher((s) => s.classes);
  const createClass = useTeacher((s) => s.createClass);
  const g = useGame();
  const [selected, setSelected] = useState(SEEDED_CLASS.code);
  const [name, setName] = useState("");
  const [fresh, setFresh] = useState<string | null>(null);
  const all = [SEEDED_CLASS, ...classes];
  const room = all.find((c) => c.code === selected) ?? SEEDED_CLASS;

  const live: MockStudent | null =
    g.avatar && g.classCode === room.code
      ? {
          id: "live",
          name: `${g.avatar.name} (this device)`,
          completed: g.completedMissions,
          ups: g.ups,
          stack: g.stack,
          ripple: g.ripple,
          downs: g.events.filter((e) => e.type === "down_triggered").length,
          recoveries: g.events.filter((e) => e.type === "recovery_completed").length,
          enteredScamaland: g.events.some((e) => e.type === "scamland_entered"),
          redFlags: g.scamRadar.length,
          lastActiveMins: 0,
          live: true,
        }
      : null;
  const students = [...(room.seeded ? SEEDED : []), ...(live ? [live] : [])].sort((a, b) => a.name.localeCompare(b.name));
  const hustleDone = students.filter((s) => s.completed.includes("your-next-move")).length;
  const scam = students.filter((s) => s.enteredScamaland).length;
  const sum = (k: "stack" | "ripple" | "ups") => students.reduce((a, s) => a + s[k], 0);
  const plays = MISSIONS.map((m) => ({ m, n: students.filter((s) => s.completed.includes(m.id)).length })).sort((a, b) => b.n - a.n);
  const maxPlays = Math.max(1, ...plays.map((p) => p.n));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const c = createClass(name.trim());
    setSelected(c.code);
    setFresh(c.code);
    setName("");
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-6 sm:px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/" className="text-sm font-bold text-muted hover:text-ink">
            ← Money Muvz
          </Link>
          <h1 className="font-display text-3xl text-cyan sm:text-4xl">TEACHER MODE</h1>
          <p className="text-muted">Lightweight beta. No grades, no rankings. Classes are stored in this browser for the demo.</p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[1fr_320px]">
        <div className="panel flex flex-wrap items-center gap-2 p-4">
          <span className="text-xs font-black tracking-widest text-muted">CLASS</span>
          {all.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelected(c.code)}
              className={`max-w-full rounded-xl border-2 px-3 py-2 text-left text-sm font-bold ${selected === c.code ? "border-cyan bg-cyan/10" : "border-line"}`}
            >
              {c.name}
              <span className="ml-2 font-mono text-xs text-cyan">{c.code}</span>
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="panel flex flex-col gap-2 p-4">
          <label htmlFor="cls" className="text-xs font-black tracking-widest text-muted">
            CREATE CLASS
          </label>
          <div className="flex gap-2">
            <input id="cls" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 6th Grade · Period 2" maxLength={40} className="min-h-11 flex-1 rounded-xl border-2 border-line bg-bg px-3 font-semibold outline-none focus:border-cyan" />
            <button type="submit" className="btn btn-primary min-h-11 px-4 py-2" disabled={!name.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>

      {fresh && fresh === room.code && (
        <div className="panel pop-in flex flex-col items-center gap-1 border-cyan p-6 text-center">
          <div className="text-xs font-black tracking-widest text-muted">JOIN CODE FOR {room.name.toUpperCase()}</div>
          <div className="font-display text-6xl tracking-[0.3em] text-cyan">{room.code}</div>
          <div className="text-muted">Students go to Money Muvz → I HAVE A JOIN CODE. No email needed.</div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-4">
          <div className="text-xs font-black tracking-widest text-muted">CLASS PROGRESS</div>
          <div className="font-display text-3xl">{students.length} students</div>
          <div className="text-sm font-semibold text-muted">
            {hustleDone} completed Hustle Block · {scam} entered Scamaland
          </div>
        </div>
        <div className="panel p-4">
          <div className="text-xs font-black tracking-widest text-muted">CLASS STACK</div>
          <div className="font-display text-3xl text-violet">{sum("stack").toLocaleString()}</div>
          <div className="text-sm font-semibold text-muted">avg {students.length ? Math.round(sum("stack") / students.length) : 0} per student</div>
        </div>
        <div className="panel p-4">
          <div className="text-xs font-black tracking-widest text-muted">CLASS RIPPLE</div>
          <div className="font-display text-3xl text-cyan">{sum("ripple").toLocaleString()}</div>
          <div className="text-sm font-semibold text-muted">community impact, all together</div>
        </div>
        <div className="panel p-4">
          <div className="text-xs font-black tracking-widest text-muted">MOST PLAYED MISSIONS</div>
          <ul className="mt-1 space-y-1">
            {plays.slice(0, 4).map(({ m, n }) => (
              <li key={m.id} className="text-xs">
                <div className="flex justify-between font-bold">
                  <span className="truncate">{m.title}</span>
                  <span>{n}</span>
                </div>
                <div className="h-1.5 rounded-full bg-bg">
                  <div className="h-full rounded-full bg-lime" style={{ width: `${(n / maxPlays) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-display text-lg">STUDENTS</h2>
          <span className="text-xs text-muted">Alphabetical · {room.seeded ? "mock students" : "students who joined on this device"}</span>
        </div>
        {students.length === 0 ? (
          <p className="px-4 pb-6 text-muted">
            No students yet. Share the code <span className="font-mono font-bold text-cyan">{room.code}</span>. In this demo, a student who joins from this same browser shows up here live.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-bg/60 text-left text-xs font-black tracking-widest text-muted">
                <tr>
                  <th className="px-4 py-2">STUDENT</th>
                  <th className="px-2 py-2">MISSION PROGRESS</th>
                  <th className="px-2 py-2 text-right">UP$</th>
                  <th className="px-2 py-2 text-right">STACK</th>
                  <th className="px-2 py-2 text-right">RIPPLE</th>
                  <th className="px-2 py-2 text-right">DONE</th>
                  <th className="px-4 py-2">ACTIVITY</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className={`border-t border-line/60 ${s.live ? "bg-lime/10" : ""}`}>
                    <td className="px-4 py-2 font-bold">
                      {s.name} {s.live && <span className="ml-1 rounded bg-lime px-1 text-[10px] font-black text-bg">LIVE</span>}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex gap-1">
                        {MISSIONS.map((m) => (
                          <span
                            key={m.id}
                            title={m.title}
                            className={`h-3 w-5 rounded-sm ${s.completed.includes(m.id) ? (m.world === "hustle" ? "bg-lime" : "bg-pink") : "bg-bg"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right font-mono">${s.ups}</td>
                    <td className="px-2 py-2 text-right font-mono text-violet">{s.stack}</td>
                    <td className="px-2 py-2 text-right font-mono text-cyan">{s.ripple}</td>
                    <td className="px-2 py-2 text-right font-mono">{s.completed.length}/7</td>
                    <td className="px-4 py-2 text-xs text-muted">
                      {s.downs} DOWN$ · {s.recoveries} recovered · {s.redFlags} red flags · {s.live ? "now" : ago(s.lastActiveMins)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex gap-4 px-4 py-3 text-xs text-muted">
          <span>
            <span className="mr-1 inline-block h-2 w-3 rounded-sm bg-lime" />
            Hustle Block missions
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-3 rounded-sm bg-pink" />
            Scamaland missions
          </span>
        </div>
      </section>
    </div>
  );
}

export default function TeacherPage() {
  const a = useGameReady();
  const b = useTeacherReady();
  if (!a || !b) return <div className="flex min-h-dvh items-center justify-center font-display text-cyan">Loading…</div>;
  return <Teacher />;
}
