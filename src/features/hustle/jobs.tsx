"use client";

import { useEffect, useState, type ComponentType } from "react";
import Avatar from "@/components/Avatar";
import { Court } from "@/components/BlockScene";
import { JOBS } from "@/game/content";
import { useGame } from "@/game/store";
import type { Avatar as AvatarT, JobId } from "@/game/types";

// Mini-jobs (Brief §10). Each one is a short physical task that feels different:
// quick and light, sorting and careful, long and spread out. The player is choosing
// time vs effort vs reward, not answering a question about earning.

interface GameProps {
  avatar: AvatarT;
  onDone: () => void;
}

function Progress({ value, total, label }: { value: number; total: number; label: string }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs font-black tracking-widest text-muted">
        <span>{label}</span>
        <span>
          {value}/{total}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-bg">
        <div className="h-full rounded-full bg-lime transition-all duration-300" style={{ width: `${(value / total) * 100}%` }} />
      </div>
    </div>
  );
}

function DeliveryRun({ avatar, onDone }: GameProps) {
  const cue = useGame((s) => s.cue);
  // 0 = pick up, 1..3 = checkpoints, 4 = deliver, 5 = done
  const [step, setStep] = useState(0);
  const stops = [8, 30, 52, 74, 92];
  const pos = stops[Math.min(step, 4)];
  const advance = (target: number) => {
    if (step !== target) return;
    cue("tap");
    const next = step + 1;
    setStep(next);
    if (next === 5) window.setTimeout(onDone, 500);
  };
  const instruction = ["Tap the package to pick it up.", "Run! Tap the glowing marker.", "Keep going!", "Almost there!", "Tap the door to deliver.", "Delivered!"][step];
  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={step} total={5} label="DELIVERY RUN" />
      <p className="text-center font-display text-lg">{instruction}</p>
      <div className="relative h-56 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(180deg,#2a2156_0%,#2a2156_60%,#3b3570_60%)]">
        <div className="absolute inset-x-0 top-[66%] flex justify-around opacity-50">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-1 w-6 rounded bg-gold" />
          ))}
        </div>
        {step === 0 && (
          <button type="button" onClick={() => advance(0)} className="absolute bottom-10 left-[3%] z-10 rounded-xl text-5xl glow" aria-label="Pick up the package">
            📦
          </button>
        )}
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => advance(i)}
            disabled={step !== i}
            aria-label={`Checkpoint ${i}`}
            className={`absolute bottom-6 h-12 w-12 -translate-x-1/2 rounded-full border-4 font-display text-bg transition ${
              step === i ? "glow border-lime bg-lime" : step > i ? "border-lime/40 bg-lime/30" : "border-line bg-panel-2"
            }`}
            style={{ left: `${stops[i]}%` }}
          >
            {i}
          </button>
        ))}
        <button
          type="button"
          onClick={() => advance(4)}
          disabled={step !== 4}
          aria-label="Deliver to the door"
          className={`absolute bottom-4 right-[2%] flex h-28 w-16 flex-col items-center justify-end rounded-t-lg border-4 bg-[#3a2a1a] pb-2 text-2xl ${step === 4 ? "glow border-lime" : "border-[#5a4030]"}`}
        >
          {step >= 5 ? "📦" : "🚪"}
        </button>
        <div className="pointer-events-none absolute bottom-2 -translate-x-1/2 transition-[left] duration-500 ease-out" style={{ left: `${pos}%` }}>
          {step >= 1 && step < 5 && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl">📦</div>}
          <Avatar avatar={avatar} size={110} mood={step >= 5 ? "celebrate" : step >= 1 ? "run" : "idle"} />
        </div>
      </div>
    </div>
  );
}

const SHOP_ITEMS = [
  { id: "chips", icon: "🍟", shelf: "snacks" },
  { id: "juice", icon: "🧃", shelf: "drinks" },
  { id: "soap", icon: "🧼", shelf: "home" },
  { id: "cookies", icon: "🍪", shelf: "snacks" },
  { id: "water", icon: "💧", shelf: "drinks" },
  { id: "tissue", icon: "🧻", shelf: "home" },
] as const;

const SHELVES = [
  { id: "snacks", label: "SNACKS", color: "#ff8a3d" },
  { id: "drinks", label: "DRINKS", color: "#5ee7ff" },
  { id: "home", label: "HOME", color: "#a58bff" },
] as const;

function ShopAssist({ avatar, onDone }: GameProps) {
  const cue = useGame((s) => s.cue);
  const [placed, setPlaced] = useState<string[]>([]);
  const [held, setHeld] = useState<string | null>(null);
  const [miss, setMiss] = useState<string | null>(null);
  const done = placed.length === SHOP_ITEMS.length;

  const drop = (shelf: string) => {
    if (!held) return;
    const item = SHOP_ITEMS.find((i) => i.id === held)!;
    if (item.shelf !== shelf) {
      setMiss(shelf);
      window.setTimeout(() => setMiss(null), 450);
      return;
    }
    cue("tap");
    const next = [...placed, held];
    setPlaced(next);
    setHeld(null);
    if (next.length === SHOP_ITEMS.length) window.setTimeout(onDone, 600);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={placed.length} total={SHOP_ITEMS.length} label="SHOP ASSIST" />
      <p className="text-center font-display text-lg">{done ? "Shelves look fresh!" : held ? "Now tap the right shelf." : "Tap an item in the box."}</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-3 gap-2">
          {SHELVES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => drop(s.id)}
              className={`flex min-h-36 flex-col rounded-xl border-4 bg-panel-2 p-2 transition ${held ? "border-dashed" : ""} ${miss === s.id ? "shake" : ""}`}
              style={{ borderColor: s.color }}
              aria-label={`${s.label} shelf`}
            >
              <div className="rounded px-1 font-display text-xs text-bg" style={{ background: s.color }}>
                {s.label}
              </div>
              <div className="flex flex-1 flex-wrap content-start justify-center gap-1 pt-2 text-3xl">
                {placed
                  .map((p) => SHOP_ITEMS.find((i) => i.id === p)!)
                  .filter((i) => i.shelf === s.id)
                  .map((i) => (
                    <span key={i.id} className="pop-in">
                      {i.icon}
                    </span>
                  ))}
              </div>
            </button>
          ))}
        </div>
        <div className="flex items-end justify-center">
          <Avatar avatar={avatar} size={130} mood={done ? "celebrate" : held ? "interact" : "thinking"} />
        </div>
      </div>
      <div className="rounded-2xl border-2 border-dashed border-[#8a6a40] bg-[#3a2a1a] p-3">
        <div className="mb-2 text-xs font-black tracking-widest text-gold">DELIVERY BOX</div>
        <div className="flex flex-wrap justify-center gap-2">
          {SHOP_ITEMS.filter((i) => !placed.includes(i.id)).map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => {
                setHeld(i.id);
                cue("tap");
              }}
              aria-label={`Pick up ${i.id}`}
              aria-pressed={held === i.id}
              className={`h-16 w-16 rounded-xl text-4xl transition ${held === i.id ? "glow -translate-y-2 bg-lime/20" : "bg-[#4a3a2a]"}`}
            >
              {i.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlyerRun({ avatar, onDone }: GameProps) {
  const cue = useGame((s) => s.cue);
  const [hit, setHit] = useState<number[]>([]);
  const [barked, setBarked] = useState<number[]>([]);
  const DOORS = 8;
  const dogDoors = [2, 6];
  const tap = (i: number) => {
    if (hit.includes(i)) return;
    if (dogDoors.includes(i) && !barked.includes(i)) {
      setBarked([...barked, i]);
      return;
    }
    cue("tap");
    const next = [...hit, i];
    setHit(next);
    if (next.length === DOORS) window.setTimeout(onDone, 600);
  };
  const colors = ["#ff5fa2", "#5ee7ff", "#ffd23f", "#a58bff", "#ff8a3d", "#3ce0b0", "#b8ff3c", "#f4f4f8"];
  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={hit.length} total={DOORS} label="FLYER RUN" />
      <p className="text-center font-display text-lg">{hit.length === DOORS ? "Every door covered!" : "Hit every door on the block."}</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {Array.from({ length: DOORS }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            aria-label={`House ${i + 1}${hit.includes(i) ? ", flyer delivered" : ""}`}
            className={`relative flex h-28 flex-col items-center justify-end rounded-t-2xl border-2 border-line pb-1 transition hover:-translate-y-0.5 sm:h-32`}
            style={{ background: `${colors[i]}33` }}
          >
            <div className="absolute top-2 h-3 w-10 rounded-sm" style={{ background: colors[i] }} />
            <div className="flex h-14 w-10 items-center justify-center rounded-t-md bg-[#3a2a1a] text-xl">
              {hit.includes(i) ? <span className="pop-in">📰</span> : barked.includes(i) ? <span className="shake">🐕</span> : ""}
            </div>
            {barked.includes(i) && !hit.includes(i) && <div className="absolute -top-3 rounded bg-ink px-1 text-[10px] font-black text-bg">WOOF! tap again</div>}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <Avatar avatar={avatar} size={110} mood={hit.length === DOORS ? "celebrate" : "run"} />
      </div>
    </div>
  );
}

function RefGame({ avatar, onDone }: GameProps) {
  const cue = useGame((s) => s.cue);
  const world = useGame((s) => s.world);
  const [score, setScore] = useState(0);
  const [ball, setBall] = useState({ x: 30, y: 40, k: 0 });
  const GOAL = 6;
  useEffect(() => {
    if (score >= GOAL) return;
    const id = window.setInterval(() => setBall((b) => ({ x: 10 + Math.random() * 75, y: 25 + Math.random() * 45, k: b.k + 1 })), 1100);
    return () => window.clearInterval(id);
  }, [score]);
  const tap = () => {
    cue("tap");
    const next = score + 1;
    setScore(next);
    setBall((b) => ({ x: 10 + Math.random() * 75, y: 25 + Math.random() * 45, k: b.k + 1 }));
    if (next === GOAL) window.setTimeout(onDone, 500);
  };
  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={score} total={GOAL} label="KEEP SCORE" />
      <p className="text-center font-display text-lg">Tap the ball every time someone scores.</p>
      <div className="relative h-64">
        <Court world={world} className="absolute inset-0" showNpcs />
        {score < GOAL && (
          <button key={ball.k} type="button" onClick={tap} className="pop-in absolute text-5xl" style={{ left: `${ball.x}%`, top: `${ball.y}%` }} aria-label="Score">
            🏀
          </button>
        )}
      </div>
      <div className="flex justify-center">
        <Avatar avatar={avatar} size={100} mood={score >= GOAL ? "celebrate" : "interact"} />
      </div>
    </div>
  );
}

const TRASH = [
  { icon: "🥤", x: 15, y: 30 },
  { icon: "📄", x: 70, y: 55 },
  { icon: "🍂", x: 40, y: 70 },
  { icon: "🧃", x: 82, y: 32 },
  { icon: "🍟", x: 28, y: 58 },
  { icon: "📦", x: 58, y: 40 },
];

function SweepGame({ avatar, onDone }: GameProps) {
  const cue = useGame((s) => s.cue);
  const world = useGame((s) => s.world);
  const [gone, setGone] = useState<number[]>([]);
  const tap = (i: number) => {
    cue("tap");
    const next = [...gone, i];
    setGone(next);
    if (next.length === TRASH.length) window.setTimeout(onDone, 500);
  };
  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={gone.length} total={TRASH.length} label="COURT CLEANUP" />
      <p className="text-center font-display text-lg">Tap the trash to clean up the court.</p>
      <div className="relative h-64">
        <Court world={world} className="absolute inset-0" showNpcs={false} />
        {TRASH.map((t, i) =>
          gone.includes(i) ? null : (
            <button key={i} type="button" onClick={() => tap(i)} className="absolute text-4xl transition hover:scale-110" style={{ left: `${t.x}%`, top: `${t.y}%` }} aria-label="Pick up trash">
              {t.icon}
            </button>
          ),
        )}
      </div>
      <div className="flex justify-center">
        <Avatar avatar={avatar} size={100} mood={gone.length === TRASH.length ? "celebrate" : "interact"} />
      </div>
    </div>
  );
}

const GAMES: Record<JobId, ComponentType<GameProps>> = {
  delivery: DeliveryRun,
  shop: ShopAssist,
  flyer: FlyerRun,
  ref: RefGame,
  sweep: SweepGame,
};

export function JobRunner({ job, avatar, onDone }: { job: JobId } & GameProps) {
  const Game = GAMES[job];
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
      <div className="text-xs font-black tracking-widest text-lime">
        {JOBS[job].icon} ON THE JOB · {JOBS[job].name.toUpperCase()}
      </div>
      <Game avatar={avatar} onDone={onDone} />
    </div>
  );
}
