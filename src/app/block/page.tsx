"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { Court, Storefront } from "@/components/BlockScene";
import GameShell from "@/components/GameShell";
import { MISSIONS, RED_FLAG_ORDER, RESIDENTS, ZONES } from "@/game/content";
import { useGame } from "@/game/store";
import type { MissionId } from "@/game/types";

/** Screen 03 — My Block: the persistent home screen and world map (Brief §3, §6, §41). */
function MyBlock() {
  const g = useGame();
  const router = useRouter();
  const [walkingTo, setWalkingTo] = useState<number | null>(null);
  const avatar = g.avatar!;
  const hustleDone = g.hustleState === "HUSTLE_COMPLETE";
  const scamOpen = g.unlockedZones.includes("scamaland");
  const nextHustle = MISSIONS.find((m) => m.world === "hustle" && !g.completedMissions.includes(m.id));
  const nextScam = MISSIONS.find((m) => m.world === "scamaland" && !g.completedMissions.includes(m.id));

  const walk = (slot: number, href: string, before?: () => void) => {
    if (walkingTo !== null) return;
    setWalkingTo(slot);
    g.cue("tap");
    window.setTimeout(() => {
      before?.();
      router.push(href);
    }, 750);
  };

  const enterHustle = () => walk(0, "/hustle", () => useGame.getState().enterZone("hustle-block"));
  const enterScam = () => walk(2, "/scamaland", () => useGame.getState().enterScamaland());
  const extras = g.world.activeNpcs;
  const avatarLeft = walkingTo === null ? 50 : walkingTo === 0 ? 17 : walkingTo === 1 ? 50 : 88;
  const missionLabel = (id: MissionId) => MISSIONS.find((m) => m.id === id)!;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-3 py-4 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-xs font-black tracking-[0.25em] text-muted">MY BLOCK</div>
          <h1 className="font-display text-3xl sm:text-4xl">
            WHAT&apos;S THE <span className="text-lime">MUV</span>, {avatar.name.toUpperCase()}?
          </h1>
        </div>
        {g.classCode && <div className="rounded-full bg-panel-2 px-3 py-1 text-xs font-bold text-muted">Class {g.classCode}</div>}
      </div>

      {/* Mission call-to-action */}
      <div className="panel flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {nextHustle ? (
          <>
            <div>
              <div className="text-xs font-black tracking-widest text-lime">
                HUSTLE BLOCK · MISSION {nextHustle.number}
              </div>
              <div className="font-display text-xl">{nextHustle.title.toUpperCase()}</div>
              <div className="text-muted">{nextHustle.tagline}</div>
            </div>
            <button type="button" className="btn btn-primary glow shrink-0 font-display text-lg" onClick={enterHustle}>
              {g.activeMission ? "KEEP MUVIN' →" : "LET'S GO →"}
            </button>
          </>
        ) : scamOpen && nextScam ? (
          <>
            <div>
              <div className="text-xs font-black tracking-widest text-pink">SCAMALAND, USA · MISSION {nextScam.number}</div>
              <div className="font-display text-xl">{nextScam.title.toUpperCase()}</div>
              <div className="text-muted">{nextScam.tagline}</div>
            </div>
            <button type="button" className="btn btn-primary glow shrink-0 font-display text-lg" onClick={enterScam}>
              TAKE THE BUS →
            </button>
          </>
        ) : (
          <div>
            <div className="text-xs font-black tracking-widest text-gold">ALL BETA MISSIONS COMPLETE</div>
            <div className="font-display text-xl">THE BLOCK REMEMBERS YOUR MOVES.</div>
            <div className="text-muted">Next up: The Jar (SAVE). Coming soon.</div>
          </div>
        )}
      </div>

      {/* The street */}
      <section aria-label="Hustle Block street" className="relative overflow-hidden rounded-3xl border border-line">
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{ background: g.world.lightsOn ? "linear-gradient(180deg,#3b2a8a 0%,#7a3f8f 55%,#ff8a3d 100%)" : "linear-gradient(180deg,#15122e 0%,#2a2156 70%,#3b2a6a 100%)" }}
        />
        <div className="relative grid grid-cols-3 gap-2 px-2 pt-6 sm:gap-4 sm:px-6">
          <button type="button" onClick={enterHustle} className="group h-40 text-left transition-transform hover:-translate-y-1 sm:h-52" aria-label="Enter Hustle Block: the Hustle Hub">
            <Storefront name="HUSTLE HUB" sign="JOBS!" color="#b8ff3c" icon="💸" />
          </button>
          <button type="button" onClick={enterHustle} className="h-40 transition-transform hover:-translate-y-1 sm:h-52" aria-label="Enter Hustle Block: the Block Court">
            <Court world={g.world} className="h-full" showNpcs={false} />
          </button>
          <button type="button" onClick={enterHustle} className="h-40 text-left transition-transform hover:-translate-y-1 sm:h-52" aria-label="Enter Hustle Block: the Corner Shop">
            <Storefront name="CORNER SHOP" sign="NEW DROP" color="#ffd23f" icon="🏪" />
          </button>
        </div>
        {/* sidewalk */}
        <div className="relative h-36 border-t-4 border-[#5a5290] bg-[#2b2650] sm:h-40">
          <div className="absolute inset-x-0 top-1/2 flex justify-around opacity-40">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-1 w-10 rounded bg-gold" />
            ))}
          </div>
          {RESIDENTS.slice(0, Math.min(RESIDENTS.length, extras)).map((r, i) => (
            <div key={r.name} className="absolute bottom-3 fade-in" style={{ left: `${[6, 30, 64, 76, 90][i]}%`, animationDelay: `${i * 0.2}s` }}>
              <Avatar avatar={r} size={78} mood={i % 3 === 0 ? "walk" : "idle"} flip={i % 2 === 1} label={`${r.name}, block resident`} />
            </div>
          ))}
          <div className="absolute bottom-2 -translate-x-1/2 transition-[left] duration-700 ease-in-out" style={{ left: `${avatarLeft}%` }}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-lime px-2 py-0.5 text-[10px] font-black text-bg">YOU</div>
            <Avatar avatar={avatar} size={120} mood={walkingTo !== null ? "walk" : "idle"} flip={walkingTo === 0} />
          </div>
        </div>
      </section>

      {/* World map */}
      <section aria-label="The city">
        <h2 className="mb-3 font-display text-xl">THE CITY</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ZONES.map((z) => {
            const playable = z.id === "hustle-block";
            return (
              <button
                key={z.id}
                type="button"
                disabled={!playable}
                onClick={playable ? enterHustle : undefined}
                className={`h-36 text-left ${playable ? "transition-transform hover:-translate-y-1" : "cursor-default"}`}
                aria-label={playable ? `${z.name}, ${z.theme}. Playable.` : `${z.name}, ${z.theme}. Coming soon.`}
              >
                <div className="flex h-full flex-col">
                  <Storefront name={z.name.toUpperCase()} color={z.color} icon={z.icon} locked={!playable} />
                  <div className="rounded-b-xl px-2 py-1 text-center text-[10px] font-black tracking-widest" style={{ background: playable ? z.color : "#2a2556", color: playable ? "#12101f" : "#b3aed6" }}>
                    {z.theme} {playable && (hustleDone ? "· DONE ✓" : "· PLAYABLE")}
                  </div>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            onClick={scamOpen ? enterScam : undefined}
            disabled={!scamOpen}
            className={`scamaland relative h-36 overflow-hidden rounded-2xl border-2 border-pink/60 p-3 text-left ${scamOpen ? "glow transition-transform hover:-translate-y-1" : ""}`}
            aria-label={scamOpen ? "Bus to Scamaland, USA. Separate world. Open." : "Bus to Scamaland, USA. Finish Hustle Block to unlock."}
          >
            <div className="scam-font text-[10px] font-black tracking-widest text-gold">🚌 BUS STOP</div>
            <div className="font-display text-lg leading-tight text-pink">SCAMALAND, USA</div>
            <div className="mt-1 text-[11px] font-bold text-ink/80">FINANCIAL SAFETY · SEPARATE WORLD</div>
            <div className="absolute bottom-2 left-3 right-3 text-[11px] font-black">
              {scamOpen ? (g.scamState === "SCAMALAND_COMPLETE" ? <span className="text-lime">DONE ✓</span> : <span className="text-lime">BOARD THE BUS →</span>) : <span className="text-muted">🔒 Finish Hustle Block</span>}
            </div>
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/collection" className="panel p-4 hover:border-lime">
          <div className="text-xs font-black tracking-widest text-muted">MUVZ COLLECTION</div>
          <div className="font-display text-2xl">{g.collection.length} / 13</div>
          <div className="text-sm text-muted">Gear and badges you earned</div>
        </Link>
        <div className="panel p-4">
          <div className="text-xs font-black tracking-widest text-muted">SCAM RADAR</div>
          <div className="font-display text-2xl text-pink">
            {g.scamRadar.length} / {RED_FLAG_ORDER.length}
          </div>
          <div className="text-sm text-muted">Red flags you know how to spot</div>
        </div>
        <div className="panel p-4">
          <div className="text-xs font-black tracking-widest text-muted">MISSIONS</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {MISSIONS.map((m) => (
              <span
                key={m.id}
                title={missionLabel(m.id).title}
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${g.completedMissions.includes(m.id) ? (m.world === "hustle" ? "bg-lime text-bg" : "bg-pink text-bg") : "bg-panel-2 text-muted"}`}
              >
                {m.world === "hustle" ? "HB" : "SL"}
                {m.number}
              </span>
            ))}
          </div>
          <div className="mt-1 text-sm text-muted">{g.completedMissions.length} of 7 done</div>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-4 pb-4 text-xs text-muted">
        <Link href="/create" className="hover:text-ink">
          Edit my Muv
        </Link>
        <Link href="/insights" className="hover:text-ink">
          My moves (data)
        </Link>
        <button
          type="button"
          className="hover:text-orange"
          onClick={() => {
            if (window.confirm("Start over? This clears your progress on this device.")) {
              useGame.getState().resetGame();
              router.push("/");
            }
          }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}

export default function BlockPage() {
  return (
    <GameShell>
      <MyBlock />
    </GameShell>
  );
}
