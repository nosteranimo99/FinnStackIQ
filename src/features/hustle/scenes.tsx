"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import Avatar from "@/components/Avatar";
import { Court, Storefront } from "@/components/BlockScene";
import DownPanel from "@/components/DownPanel";
import Speech from "@/components/Speech";
import {
  BIKE_PRICE,
  COURT_CONTRIBUTION,
  HEADPHONES_PRICE,
  ITEMS,
  JOBS,
  MURAL_PRICE,
  RETURN_FEE,
  SNACK_PACK_PRICE,
  SNEAKER_PRICE,
} from "@/game/content";
import { coreJobsDone, HUSTLE_JOBS, jobReward, useGame } from "@/game/store";
import type { JobId, RecoveryPath } from "@/game/types";

function Stage({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">{children}</div>;
}

function Title({ kicker, children, color = "text-lime" }: { kicker?: string; children: ReactNode; color?: string }) {
  return (
    <div className="text-center slide-up">
      {kicker && <div className={`text-xs font-black tracking-[0.25em] ${color}`}>{kicker}</div>}
      <h2 className="font-display text-3xl leading-tight sm:text-4xl">{children}</h2>
    </div>
  );
}

function Move({ onClick, disabled, title, sub, icon, tone = "ghost" }: { onClick: () => void; disabled?: boolean; title: string; sub?: string; icon?: string; tone?: "ghost" | "primary" }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`btn ${tone === "primary" ? "btn-primary" : "btn-ghost"} h-full w-full flex-col items-start gap-1 px-4 py-4 text-left`}>
      <span className="flex items-center gap-2 font-display text-lg leading-tight">
        {icon && <span aria-hidden>{icon}</span>}
        {title}
      </span>
      {sub && <span className={`text-sm font-semibold ${tone === "primary" ? "text-bg/80" : "text-muted"}`}>{sub}</span>}
    </button>
  );
}

// ---------------- Mission 1 ----------------

export function Briefing() {
  const begin = useGame((s) => s.beginHustle);
  const avatar = useGame((s) => s.avatar)!;
  const ups = useGame((s) => s.ups);
  return (
    <Stage>
      <Title kicker="HUSTLE BLOCK · MISSION 1">MAKE YOUR MUV</Title>
      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <Speech who="benny">Welcome to the Block. Around here, money doesn&apos;t just show up. You make moves.</Speech>
          <Speech who="penny" mood="thinking">
            You&apos;ve got ${ups}. Let&apos;s see what you do with it.
          </Speech>
        </div>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={200} mood="idle" />
        </div>
      </div>
      <div className="panel p-4 text-center">
        <div className="text-xs font-black tracking-widest text-gold">OBJECTIVE</div>
        <div className="text-lg font-bold">Head to the Hustle Hub and earn enough UP$ to make your first real move.</div>
      </div>
      <button type="button" className="btn btn-primary glow mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={begin}>
        WALK TO THE HUSTLE HUB →
      </button>
    </Stage>
  );
}

function EffortBars({ level }: { level: "Low" | "Medium" | "High" }) {
  const n = level === "Low" ? 1 : level === "Medium" ? 2 : 3;
  return (
    <span className="inline-flex gap-0.5" aria-label={`Effort ${level}`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`h-3 w-2 rounded-sm ${i <= n ? "bg-orange" : "bg-bg"}`} />
      ))}
    </span>
  );
}

export function Hub() {
  const g = useGame();
  const avatar = g.avatar!;
  const jobs: JobId[] = g.world.courtRestored ? [...HUSTLE_JOBS, "ref"] : HUSTLE_JOBS;
  const done = coreJobsDone(g);
  const mode = g.hustle.jobReturn;
  const line =
    mode === "recovery"
      ? "Need to make some UP$ back? Work's always here. Pick one."
      : mode === "court"
        ? "Want a little more cash before you decide on the court? Pick a gig."
        : g.completedMissions.includes("find-a-hustle")
          ? "Back for more? Respect."
          : "Three gigs on the board. Different work, different pay. Your call.";
  return (
    <Stage>
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <Speech who="dee">{line}</Speech>
        </div>
        {mode === "mission" && !g.completedMissions.includes("find-a-hustle") && (
          <div className="panel shrink-0 px-4 py-3">
            <div className="text-xs font-black tracking-widest text-gold">OBJECTIVE</div>
            <div className="font-bold">Finish 2 hustles</div>
            <div className="mt-1 flex gap-1">
              {[0, 1].map((i) => (
                <span key={i} className={`h-3 w-10 rounded-full ${i < done ? "bg-lime" : "bg-bg"}`} />
              ))}
            </div>
          </div>
        )}
        {mode === "recovery" && (
          <div className="panel shrink-0 px-4 py-3">
            <div className="text-xs font-black tracking-widest text-gold">GOAL</div>
            <div className="font-bold">
              Get to ${BIKE_PRICE} for the bike (you have ${g.ups})
            </div>
          </div>
        )}
      </div>

      <div className="relative rounded-3xl border border-line bg-[linear-gradient(180deg,#2a2156,#1d1940)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-display text-xl text-lime">💸 HUSTLE HUB · JOB BOARD</div>
          <div className="hidden sm:block">
            <Avatar avatar={avatar} size={90} mood="thinking" />
          </div>
        </div>
        <div className={`grid gap-3 ${jobs.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
          {jobs.map((id, i) => {
            const j = JOBS[id];
            const reward = jobReward(g, id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => g.selectJob(id)}
                className="group relative flex flex-col gap-2 rounded-2xl border-2 border-[#d9c79a] bg-[#f3e6c4] p-4 text-left text-bg shadow-[0_6px_0_#a8956a] transition hover:-translate-y-1"
                style={{ transform: `rotate(${[-1.5, 1, -0.5, 1.5][i]}deg)` }}
                aria-label={`${j.name}: earn $${reward}, effort ${j.effort}, time ${j.time}`}
              >
                <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-pink shadow" aria-hidden />
                <span className="text-4xl">{j.icon}</span>
                <span className="font-display text-lg leading-tight">{j.name.toUpperCase()}</span>
                <span className="text-sm font-semibold text-bg/70">{j.pitch}</span>
                <span className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-display text-2xl text-[#2f7d00]">+${reward}</span>
                  {g.jobsDone[id] > 0 && <span className="rounded bg-bg px-1.5 py-0.5 text-[10px] font-black text-lime">DONE ×{g.jobsDone[id]}</span>}
                </span>
                <span className="flex items-center justify-between text-xs font-bold text-bg/70">
                  <span className="flex items-center gap-1">
                    EFFORT <EffortBars level={j.effort} />
                  </span>
                  <span>⏱ {j.time}</span>
                </span>
                {id === "delivery" && g.hustle.hasBike && <span className="text-xs font-black text-[#2f7d00]">🚲 Bike bonus ×2</span>}
              </button>
            );
          })}
        </div>
      </div>
    </Stage>
  );
}

export function JobDone() {
  const g = useGame();
  const job = g.activeJob;
  const avatar = g.avatar!;
  if (!job) return null;
  const reward = jobReward(g, job);
  const finishingMission = g.hustle.jobReturn === "mission" && !g.completedMissions.includes("find-a-hustle") && coreJobsDone(g) >= 2;
  return (
    <Stage>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="relative">
          <Avatar avatar={avatar} size={200} mood="celebrate" />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="fx-float absolute left-1/2 top-1/3 text-3xl" style={{ animationDelay: `${i * 0.12}s`, marginLeft: (i - 2) * 26 }} aria-hidden>
              🪙
            </span>
          ))}
        </div>
        <div className="font-display text-5xl text-gold pop-in">+${reward} UP$</div>
        <div className="text-lg font-bold text-muted">
          {JOBS[job].name} done. You&apos;ve got <span className="text-gold">${g.ups}</span> now.
        </div>
      </div>
      <Speech who="dee" mood="celebrate">
        {job === "sweep"
          ? "Court's looking better. People noticed. Here's a little something."
          : job === "flyer"
            ? "Every door? That's real work. You earned every dollar."
            : job === "shop"
              ? "Mr. Ray says the shelves never looked this good."
              : job === "ref"
                ? "Fair calls all game. The block trusts you."
                : "Fast and clean. That's how you run a delivery."}
      </Speech>
      <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.continueAfterJob}>
        {finishingMission ? "FINISH MISSION →" : "KEEP MUVIN' →"}
      </button>
    </Stage>
  );
}

// ---------------- Mission 2 ----------------

export function CornerShop() {
  const g = useGame();
  const avatar = g.avatar!;
  const justFinished = g.completedMissions.includes("find-a-hustle");
  return (
    <Stage>
      {justFinished && g.collection.includes("hustle-runners") && g.hustle.shopChoice === null && (
        <div className="panel pop-in mx-auto flex items-center gap-3 px-4 py-2 text-sm font-bold">
          <span className="text-2xl">⚡</span> Mission 1 complete. You unlocked Hustle Runners. Equip them in your Collection.
        </div>
      )}
      <Title kicker={`HUSTLE BLOCK · MISSION 2`}>You have ${g.ups}. Make your next move.</Title>
      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <Speech who="ray">Fresh drop just landed. Whole block&apos;s been asking about these.</Speech>
          <Speech who="penny" mood="thinking">
            Interesting… you&apos;ve got options.
          </Speech>
        </div>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={180} mood="thinking" />
        </div>
      </div>
      <div className="rounded-3xl border-2 border-gold/50 bg-[linear-gradient(180deg,#2a2156,#1d1940)] p-4">
        <div className="mb-3 font-display text-xl text-gold">🏪 CORNER SHOP · MAKE YOUR MOVE</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-2xl bg-panel-2 p-3">
            <div className="flex h-24 items-center justify-center rounded-xl bg-[radial-gradient(circle,#ff5fa255,transparent)] text-6xl wobble">👟</div>
            <div className="font-display">FRESH DROP SNEAKERS</div>
            <div className="text-sm text-muted">Limited colorway. Everyone will see them.</div>
            <Move icon="🛍️" title={`Cop them · $${SNEAKER_PRICE}`} onClick={() => g.chooseShop("buy-now")} disabled={g.ups < SNEAKER_PRICE} />
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-panel-2 p-3">
            <div className="flex h-24 items-center justify-center rounded-xl bg-[radial-gradient(circle,#ffd23f44,transparent)] text-6xl">👛</div>
            <div className="font-display">YOUR WALLET</div>
            <div className="text-sm text-muted">Walk out with your ${g.ups}. Keep your options open.</div>
            <Move icon="✋" title="Hold onto it" onClick={() => g.chooseShop("hold")} />
          </div>
          <div className="flex flex-col gap-2 rounded-2xl bg-panel-2 p-3">
            <div className="flex h-24 items-center justify-center rounded-xl bg-[radial-gradient(circle,#5ee7ff44,transparent)] text-6xl">🧃</div>
            <div className="font-display">SNACK PACK FOR THE CREW</div>
            <div className="text-sm text-muted">Neighbors are cleaning up the court today. Fuel them up.</div>
            <Move icon="🤝" title={`Hook up the crew · $${SNACK_PACK_PRICE}`} onClick={() => g.chooseShop("mix")} />
          </div>
        </div>
      </div>
    </Stage>
  );
}

export function ShopResult() {
  const g = useGame();
  const avatar = g.avatar!;
  const c = g.hustle.shopChoice;
  return (
    <Stage>
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar avatar={c === "buy-now" ? { ...avatar, shoes: "drop-sneakers" } : avatar} size={210} mood="celebrate" />
        <div className="font-display text-3xl">
          {c === "buy-now" ? "FRESH DROPS SECURED 👟" : c === "hold" ? `YOU KEPT YOUR $${g.ups}` : "THE CREW IS FUELED UP 🧃"}
        </div>
        <div className="text-lg text-muted">
          {c === "buy-now" ? `They look clean. You have $${g.ups} left.` : c === "hold" ? "Nothing new in your bag. Nothing gone either." : `The court cleanup is moving faster. You have $${g.ups} left.`}
        </div>
      </div>
      {c === "buy-now" ? (
        <Speech who="benny" mood="celebrate">
          Those are hard. Okay, let&apos;s see what&apos;s next out there…
        </Speech>
      ) : c === "hold" ? (
        <Speech who="penny">Let&apos;s see what happens.</Speech>
      ) : (
        <Speech who="benny" mood="celebrate">
          You just made a ripple. Watch how that spreads.
        </Speech>
      )}
      <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.showOffer}>
        WALK BACK OUTSIDE →
      </button>
    </Stage>
  );
}

export function BikeOffer() {
  const g = useGame();
  const avatar = g.avatar!;
  const comingBack = g.hustle.downTriggered;
  return (
    <Stage>
      <Title kicker="NEW OPPORTUNITY" color="text-cyan">
        Dee is selling a delivery bike
      </Title>
      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
        <Speech who="dee" mood="interact">
          {comingBack
            ? `Still want the bike? It's yours for $${BIKE_PRICE}.`
            : `Yo! Perfect timing. I'm selling my old delivery bike. $${BIKE_PRICE}. With it, Delivery Runs pay double. Opportunities like this don't wait long.`}
        </Speech>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={170} mood="thinking" />
        </div>
      </div>
      <div className="panel mx-auto flex w-full max-w-xl flex-col items-center gap-3 p-5 text-center">
        <div className="text-7xl bounce-soft">🚲</div>
        <div className="font-display text-2xl">DELIVERY BIKE · ${BIKE_PRICE}</div>
        <div className="flex items-center gap-2 text-lg font-bold">
          Delivery Run: <span className="text-muted line-through">${JOBS.delivery.reward}</span> → <span className="text-lime">${JOBS.delivery.reward * 2}</span> every run
        </div>
        <div className="text-sm text-muted">
          You have <span className="font-bold text-gold">${g.ups}</span> UP$
        </div>
        <div className="grid w-full gap-2 sm:grid-cols-2">
          <Move tone="primary" icon="🚲" title="Grab the bike" sub={`Pay $${BIKE_PRICE}`} onClick={g.tryBuyBike} />
          <Move icon="👋" title="Pass" sub="Not this time" onClick={g.passBike} />
        </div>
      </div>
    </Stage>
  );
}

export function DownScene() {
  const g = useGame();
  const avatar = g.avatar!;
  const amount = g.hustle.downAmount;
  return (
    <Stage>
      <div className="flex justify-center">
        <Avatar avatar={avatar} size={170} mood="disappointed" />
      </div>
      <DownPanel
        amount={amount}
        what={`You went for the bike, but you're $${amount} short.`}
        why={
          g.hustle.shopChoice === "buy-now"
            ? `The sneakers took $${SNEAKER_PRICE}. That left less money for the next opportunity.`
            : "Your UP$ was already spent somewhere else, so you couldn't take this one."
        }
        next="Find another way to recover."
      >
        <Speech who="benny">That move felt good. But now you&apos;ve got fewer options.</Speech>
      </DownPanel>
      <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.startRecovery}>
        FIGURE IT OUT →
      </button>
    </Stage>
  );
}

export function Recovery() {
  const g = useGame();
  const avatar = g.avatar!;
  const short = Math.max(0, BIKE_PRICE - g.ups);
  const hasSneakers = g.collection.includes("drop-sneakers");
  const opts: { id: RecoveryPath; icon: string; title: string; sub: string; show: boolean }[] = [
    { id: "job", icon: "💼", title: "Take another mini-job", sub: "Head back to the Hustle Hub and earn it.", show: true },
    { id: "return", icon: "↩️", title: "Return the sneakers", sub: `Mr. Ray takes them back. Keeps a $${RETURN_FEE} restock fee.`, show: hasSneakers },
    { id: "community", icon: "🧹", title: "Do a community task", sub: `Clean up the court. Dee pays $${JOBS.sweep.reward}. The block notices.`, show: true },
    { id: "change-plan", icon: "🔀", title: "Change the plan", sub: "Skip the bike for now. Keep what you have.", show: true },
    { id: "wait", icon: "⏳", title: "Wait for the next opportunity", sub: "Dee says another bike will come around.", show: true },
  ];
  return (
    <Stage>
      <Title kicker="RECOVERY" color="text-orange">
        You&apos;ve got a problem. What are you gonna do?
      </Title>
      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <Speech who="penny" mood="thinking">
            You might have another move.
          </Speech>
          <div className="panel px-4 py-3 text-center font-bold">
            You have <span className="text-gold">${g.ups}</span>. The bike is ${BIKE_PRICE}.{" "}
            {short > 0 ? <span className="text-orange">${short} short.</span> : <span className="text-lime">You can afford it now.</span>}
          </div>
        </div>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={170} mood="thinking" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {opts
          .filter((o) => o.show)
          .map((o) => (
            <Move key={o.id} icon={o.icon} title={o.title} sub={o.sub} onClick={() => g.chooseRecovery(o.id)} />
          ))}
      </div>
      <p className="text-center text-sm font-semibold text-muted">One decision doesn&apos;t define your future.</p>
    </Stage>
  );
}

// ---------------- Mission 3 ----------------

export function CourtScene() {
  const g = useGame();
  const avatar = g.avatar!;
  return (
    <Stage>
      {g.completedMissions.includes("make-your-move") && g.hustle.courtChoice === null && g.hustle.jobReturn !== "court" && (
        <div className="panel pop-in mx-auto px-4 py-2 text-sm font-bold">✅ Mission 2 complete.</div>
      )}
      <Title kicker="HUSTLE BLOCK · MISSION 3" color="text-cyan">
        THE BLOCK NEEDS YOU
      </Title>
      <Court world={g.world} className="h-56 sm:h-64" />
      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <Speech who="benny">The Block Court&apos;s been busted for months. Lights out, nets gone. Kids got nowhere to hoop.</Speech>
          <div className="panel flex items-center gap-3 px-4 py-3">
            <span className="text-3xl">📋</span>
            <div>
              <div className="font-display">FIX THE COURT</div>
              <div className="text-sm text-muted">Neighbors are chipping in to fix the lights and hoops. Each share is ${COURT_CONTRIBUTION}.</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={160} mood="thinking" />
        </div>
      </div>
      <div className="text-center font-display text-2xl text-lime">MAKE YOUR MOVE</div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Move icon="🔒" title="Keep everything" sub={`Hold on to your $${g.ups}.`} onClick={() => g.chooseCourt("keep")} />
        <Move
          tone="primary"
          icon="🏀"
          title={`Invest $${COURT_CONTRIBUTION} in the Block`}
          sub={g.ups >= COURT_CONTRIBUTION ? "Help bring the court back." : `You have $${g.ups}. Earn more first?`}
          onClick={() => g.chooseCourt("invest")}
          disabled={g.ups < COURT_CONTRIBUTION}
        />
        <Move icon="💼" title="Earn more first" sub="Hit the Hustle Hub, then decide." onClick={() => g.chooseCourt("earn-first")} />
      </div>
    </Stage>
  );
}

export function Transform() {
  const g = useGame();
  const avatar = g.avatar!;
  const [after, setAfter] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setAfter(true), 1200);
    return () => window.clearTimeout(t);
  }, []);
  const before = { courtRestored: false, lightsOn: false, muralPainted: false, activeNpcs: 0 };
  return (
    <Stage>
      <Title kicker="WORLD TRANSFORMATION" color="text-cyan">
        {after ? "THE COURT IS BACK" : "Watch the block…"}
      </Title>
      <div className="relative">
        <Court world={after ? g.world : before} className="h-64 sm:h-80" npcSize={120} />
        {after && (
          <div className="pointer-events-none absolute inset-0">
            <div className="ripple-ring" />
            <div className="ripple-ring" style={{ animationDelay: "0.5s" }} />
          </div>
        )}
      </div>
      {after && (
        <>
          <div className="pop-in rounded-2xl bg-cyan px-4 py-3 text-center font-display text-xl text-bg sm:text-2xl">THIS CHANGED BECAUSE OF WHAT YOU DID.</div>
          <ul className="grid gap-2 sm:grid-cols-4">
            {["💡 Lights turned on", "🏀 Court fixed up", "👋 Neighbors are back", "🆕 New gig: Ref the Pickup Game"].map((t, i) => (
              <li key={t} className="panel slide-up px-3 py-2 text-center text-sm font-bold" style={{ animationDelay: `${i * 0.15}s` }}>
                {t}
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-center gap-4">
            <Avatar avatar={avatar} size={150} mood="celebrate" />
            <Speech who="benny" mood="celebrate">
              Look at that. Your money did that.
            </Speech>
          </div>
          <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.finishCourt}>
            KEEP MUVIN&apos; →
          </button>
        </>
      )}
    </Stage>
  );
}

export function CourtResult() {
  const g = useGame();
  const avatar = g.avatar!;
  return (
    <Stage>
      <Title kicker="LATER THAT WEEK" color="text-muted">
        The court is still dark
      </Title>
      <Court world={g.world} className="h-56" />
      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <Speech who="penny" mood="thinking">
            Interesting choice… You kept your ${g.ups}.
          </Speech>
          <Speech who="benny">Nobody&apos;s mad. But the block stays the same unless somebody moves. You might get another shot.</Speech>
        </div>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={150} mood="idle" />
        </div>
      </div>
      <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.finishCourt}>
        KEEP MUVIN&apos; →
      </button>
    </Stage>
  );
}

// ---------------- Mission 4 ----------------

function Jar({ icon, title, amount, color, note, onMinus, onPlus, canMinus, canPlus, target }: { icon: string; title: string; amount: number; color: string; note: string; onMinus?: () => void; onPlus?: () => void; canMinus?: boolean; canPlus?: boolean; target?: number }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-panel-2 p-4 text-center">
      <div className="text-4xl">{icon}</div>
      <div className="font-display text-sm leading-tight">{title}</div>
      <div className="relative flex h-32 w-24 items-end overflow-hidden rounded-b-3xl rounded-t-lg border-4 border-white/30 bg-bg/60">
        <div className="w-full transition-all duration-300" style={{ height: `${Math.min(100, target ? (amount / target) * 100 : Math.min(100, amount * 3))}%`, background: color }} />
        <div className="absolute inset-0 flex items-center justify-center font-display text-2xl drop-shadow">${amount}</div>
      </div>
      {onMinus && onPlus && (
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost h-11 w-14 px-0" onClick={onMinus} disabled={!canMinus} aria-label={`Take $5 out of ${title}`}>
            −$5
          </button>
          <button type="button" className="btn btn-ghost h-11 w-14 px-0" onClick={onPlus} disabled={!canPlus} aria-label={`Put $5 into ${title}`}>
            +$5
          </button>
        </div>
      )}
      <div className="text-xs font-semibold text-muted">{note}</div>
    </div>
  );
}

export function NextMove() {
  const g = useGame();
  const avatar = g.avatar!;
  const [goal, setGoal] = useState(0);
  const [block, setBlock] = useState(0);
  const keep = g.ups - goal - block;
  const restored = g.world.courtRestored;
  const step = (cur: number, set: (n: number) => void, delta: number, cap: number) => {
    const next = cur + delta;
    if (next < 0 || next > cap) return;
    if (delta > 0 && keep < delta) return;
    set(next);
    g.cue("tap");
  };
  return (
    <Stage>
      {g.completedMissions.includes("block-needs-you") && <div className="panel pop-in mx-auto px-4 py-2 text-sm font-bold">✅ Mission 3 complete. 💰 Payday: Dee paid you $10 for the week.</div>}
      <Title kicker="HUSTLE BLOCK · FINAL MISSION">YOUR NEXT MOVE</Title>
      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <Speech who="benny">
            You&apos;ve got ${g.ups}. Those studio headphones you want are ${HEADPHONES_PRICE}.{" "}
            {restored ? `And the block's raising money to paint a mural on the court.` : `And the court still needs fixing.`} Can&apos;t do everything. What&apos;s the move?
          </Speech>
        </div>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={150} mood="thinking" />
        </div>
      </div>
      <div className="panel p-4">
        <div className="mb-3 text-center text-sm font-bold text-muted">Split your ${g.ups} between your goal, the block, and what you keep.</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Jar
            icon="🎧"
            title={`PERSONAL GOAL · HEADPHONES $${HEADPHONES_PRICE}`}
            amount={goal}
            target={HEADPHONES_PRICE}
            color="var(--pink)"
            note={goal >= HEADPHONES_PRICE ? "Fully funded. They're yours." : goal > 0 ? `Saved toward them. $${HEADPHONES_PRICE - goal} to go.` : "Nothing toward the goal yet."}
            onMinus={() => step(goal, setGoal, -5, HEADPHONES_PRICE)}
            onPlus={() => step(goal, setGoal, 5, HEADPHONES_PRICE)}
            canMinus={goal > 0}
            canPlus={goal < HEADPHONES_PRICE && keep >= 5}
          />
          <Jar
            icon={restored ? "🎨" : "🏀"}
            title={restored ? `THE BLOCK · MURAL $${MURAL_PRICE}` : `THE BLOCK · FIX THE COURT $${COURT_CONTRIBUTION}`}
            amount={block}
            target={MURAL_PRICE}
            color="var(--cyan)"
            note={block >= MURAL_PRICE ? (restored ? "The mural gets painted." : "The court gets fixed.") : block > 0 ? "Helps a little. RIPPLE goes up." : "Nothing to the block."}
            onMinus={() => step(block, setBlock, -5, g.ups)}
            onPlus={() => step(block, setBlock, 5, g.ups)}
            canMinus={block > 0}
            canPlus={keep >= 5}
          />
          <Jar icon="🫙" title="KEEP IT" amount={keep} color="var(--violet)" note="Stays in your UP$. Builds your STACK." />
        </div>
      </div>
      <button type="button" className="btn btn-primary glow mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={() => g.commitNextMove({ goal, block, keep })}>
        MAKE YOUR MOVE
      </button>
    </Stage>
  );
}

export function HustleComplete() {
  const g = useGame();
  const avatar = g.avatar!;
  const fm = g.hustle.finalMove;
  const unlocked = g.collection.filter((i) => ["block-pack", "badge-made-movz", "studio-headphones", "block-mural", "court-lights", "badge-comeback", "hustle-runners"].includes(i));
  const rows: [string, string][] = [
    ["Earned", `$${g.ledger.earned} UP$`],
    ["Spent", `$${g.ledger.spent} UP$`],
    ["Kept", `$${g.ups} UP$`],
    ["Goal jar", g.hustle.goalJar ? `$${g.hustle.goalJar} set aside for headphones` : g.collection.includes("studio-headphones") ? "Headphones bought" : "Nothing set aside"],
    ["Hit a DOWN$?", g.hustle.downTriggered ? `Yes (−$${g.hustle.downAmount})` : "No"],
    ["Recovered?", g.hustle.downTriggered ? (g.hustle.recovered ? "Yes" : "Not yet") : "No DOWN$ to recover from"],
    ["RIPPLE created", `${g.ripple}`],
    ["Final move", fm ? `$${fm.goal} goal · $${fm.block} block · $${fm.keep} kept` : "—"],
  ];
  return (
    <Stage>
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar avatar={avatar} size={210} mood="celebrate" />
        <h2 className="font-display text-5xl text-lime pop-in sm:text-6xl">YOU MADE MOVZ.</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["UP$ EARNED", `$${g.ledger.earned}`, "text-gold"],
          ["STACK", `${g.stack}`, "text-violet"],
          ["RIPPLE", `${g.ripple}`, "text-cyan"],
          ["MISSIONS", "4/4", "text-lime"],
        ].map(([k, v, c]) => (
          <div key={k} className="panel slide-up p-4 text-center">
            <div className="text-xs font-black tracking-widest text-muted">{k}</div>
            <div className={`font-display text-3xl ${c}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="panel p-4">
          <div className="mb-2 text-xs font-black tracking-widest text-muted">YOUR MOVES</div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-bold text-muted">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="panel p-4">
          <div className="mb-2 text-xs font-black tracking-widest text-muted">UNLOCKED</div>
          <div className="flex flex-wrap gap-2">
            {unlocked.map((i) => (
              <span key={i} className="pop-in rounded-xl bg-panel-2 px-3 py-2 text-sm font-bold">
                {ITEMS[i].icon} {ITEMS[i].name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-cyan/10 px-4 py-3 text-center font-display text-xl text-cyan">THE BLOCK REMEMBERS YOUR MOVES.</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-40">
          <Storefront name="NEXT: THE JAR · SAVE" color="#5ee7ff" icon="🫙" locked />
        </div>
        <Link href="/scamaland" onClick={() => useGame.getState().enterScamaland()} className="scamaland glow flex h-40 flex-col justify-center rounded-2xl border-2 border-pink p-4 text-center">
          <div className="scam-font text-xs font-black tracking-widest text-gold">🚌 NEW WORLD UNLOCKED</div>
          <div className="font-display text-2xl text-pink">SCAMALAND, USA</div>
          <div className="font-bold">Board the bus →</div>
        </Link>
      </div>
      <Link href="/block" className="btn btn-ghost mx-auto">
        Back to my block
      </Link>
    </Stage>
  );
}
