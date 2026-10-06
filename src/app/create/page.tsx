"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import Avatar from "@/components/Avatar";
import GameShell from "@/components/GameShell";
import {
  ACCESSORY_OPTIONS,
  DEFAULT_AVATAR,
  HAIR_COLORS,
  HAIRSTYLES,
  OUTFIT_COLORS,
  OUTFITS,
  SHOE_OPTIONS,
  SKIN_TONES,
} from "@/game/content";
import { useGame } from "@/game/store";
import type { Avatar as AvatarT, AvatarMood } from "@/game/types";

const NAME_IDEAS = ["Nova", "Jaz", "Kobe", "Remi", "Zuri", "Ace", "Milo", "Sky", "Dani", "Rio", "Jules", "Max"];

function Chip({ active, onClick, children, locked, label }: { active: boolean; onClick: () => void; children: ReactNode; locked?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      aria-pressed={active}
      aria-label={label}
      className={`min-h-11 rounded-xl border-2 px-3 py-2 text-sm font-bold transition ${
        active ? "border-lime bg-lime/15 text-lime" : "border-line bg-panel-2 text-ink hover:border-muted"
      } ${locked ? "opacity-40" : ""}`}
    >
      {children}
      {locked && " 🔒"}
    </button>
  );
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-black tracking-widest text-muted">{title}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function Creator() {
  const router = useRouter();
  const existing = useGame((s) => s.avatar);
  const collection = useGame((s) => s.collection);
  const createAvatar = useGame((s) => s.createAvatar);
  const cue = useGame((s) => s.cue);
  const [a, setA] = useState<AvatarT>(existing ?? DEFAULT_AVATAR);
  const [mood, setMood] = useState<AvatarMood>("idle");
  const [leaving, setLeaving] = useState(false);

  const set = (patch: Partial<AvatarT>) => {
    setA((prev) => ({ ...prev, ...patch }));
    setMood("celebrate");
    cue("tap");
    window.setTimeout(() => setMood("idle"), 700);
  };

  const go = () => {
    const name = a.name.trim() || NAME_IDEAS[Math.floor(Math.random() * NAME_IDEAS.length)];
    createAvatar({ ...a, name });
    setLeaving(true);
    setMood("run");
    cue("unlock");
    window.setTimeout(() => router.push("/block"), 900);
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 md:grid-cols-[1fr_1.2fr] md:py-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="font-display text-3xl text-lime sm:text-4xl">{existing ? "EDIT YOUR MUV" : "CREATE YOUR MUV"}</h1>
        <div
          className="relative flex h-80 w-full max-w-xs items-end justify-center rounded-[2rem] bg-[radial-gradient(circle_at_50%_70%,#3b2a8a,transparent_70%)] transition-transform duration-700"
          style={leaving ? { transform: "translateX(120%)" } : undefined}
        >
          <Avatar avatar={a} size={280} mood={mood} />
        </div>
        <div className="flex flex-wrap justify-center gap-1.5" aria-label="Preview animations">
          {(["idle", "walk", "run", "celebrate", "thinking", "disappointed", "interact"] as AvatarMood[]).map((m) => (
            <button key={m} type="button" onClick={() => setMood(m)} className={`rounded-lg px-2 py-1 text-xs font-bold ${mood === m ? "bg-panel-2 text-lime" : "text-muted"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="panel flex flex-col gap-5 p-5">
        <section>
          <label htmlFor="muv-name" className="mb-2 block text-xs font-black tracking-widest text-muted">
            NAME YOUR MUV
          </label>
          <div className="flex gap-2">
            <input
              id="muv-name"
              value={a.name}
              maxLength={14}
              onChange={(e) => setA((p) => ({ ...p, name: e.target.value.replace(/[^\w .'-]/g, "") }))}
              placeholder="Type a name"
              className="min-h-12 min-w-0 flex-1 rounded-xl border-2 border-line bg-bg px-4 text-lg font-bold outline-none focus:border-lime"
              autoComplete="off"
            />
            <button type="button" className="btn btn-ghost px-3" onClick={() => set({ name: NAME_IDEAS[Math.floor(Math.random() * NAME_IDEAS.length)] })} aria-label="Random name">
              🎲
            </button>
          </div>
        </section>

        <Row title="SKIN">
          {Object.entries(SKIN_TONES).map(([id, c]) => (
            <button
              key={id}
              type="button"
              aria-label={`Skin tone ${id.slice(1)}`}
              aria-pressed={a.skin === id}
              onClick={() => set({ skin: id as AvatarT["skin"] })}
              className={`h-11 w-11 rounded-full border-4 ${a.skin === id ? "border-lime" : "border-transparent"}`}
              style={{ background: c }}
            />
          ))}
        </Row>

        <Row title="HAIRSTYLE">
          {HAIRSTYLES.map((h) => (
            <Chip key={h.id} active={a.hair === h.id} onClick={() => set({ hair: h.id })}>
              {h.label}
            </Chip>
          ))}
        </Row>

        <Row title="HAIR COLOR">
          {Object.entries(HAIR_COLORS).map(([id, c]) => (
            <button
              key={id}
              type="button"
              aria-label={`Hair color ${id}`}
              aria-pressed={a.hairColor === id}
              onClick={() => set({ hairColor: id as AvatarT["hairColor"] })}
              className={`h-11 w-11 rounded-full border-4 ${a.hairColor === id ? "border-lime" : "border-transparent"}`}
              style={{ background: c }}
            />
          ))}
        </Row>

        <Row title="OUTFIT">
          {OUTFITS.map((o) => (
            <Chip key={o.id} active={a.outfit === o.id} onClick={() => set({ outfit: o.id })}>
              {o.label}
            </Chip>
          ))}
          <div className="flex w-full flex-wrap gap-2 pt-1">
            {OUTFIT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Outfit color ${c}`}
                aria-pressed={a.outfitColor === c}
                onClick={() => set({ outfitColor: c })}
                className={`h-9 w-9 rounded-lg border-4 ${a.outfitColor === c ? "border-lime" : "border-transparent"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </Row>

        <Row title="SHOES">
          {SHOE_OPTIONS.map((s) => (
            <Chip key={s.id} active={a.shoes === s.id} onClick={() => set({ shoes: s.id })} locked={!!s.requires && !collection.includes(s.requires)}>
              {s.label}
            </Chip>
          ))}
        </Row>

        <Row title="ACCESSORY">
          {ACCESSORY_OPTIONS.map((s) => (
            <Chip key={s.id} active={a.accessory === s.id} onClick={() => set({ accessory: s.id })} locked={!!s.requires && !collection.includes(s.requires)}>
              {s.label}
            </Chip>
          ))}
        </Row>

        <button type="button" className="btn btn-primary mt-2 w-full py-4 font-display text-xl" onClick={go} disabled={leaving}>
          {existing ? "SAVE MY MUV" : "LET'S MUV →"}
        </button>
        <p className="-mt-2 text-center text-xs text-muted">🔒 Locked gear is earned in the game. Never bought with real money.</p>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <GameShell requireAvatar={false} hud={false}>
      <Creator />
    </GameShell>
  );
}
