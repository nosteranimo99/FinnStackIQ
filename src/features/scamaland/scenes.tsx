"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import Avatar from "@/components/Avatar";
import DownPanel from "@/components/DownPanel";
import Speech from "@/components/Speech";
import { RED_FLAG_ORDER, RED_FLAGS } from "@/game/content";
import { useGame } from "@/game/store";
import type { RedFlagId } from "@/game/types";

// Scamaland teaches RECOGNIZE → STOP → VERIFY → PROTECT → REPORT → RECOVER.
// It never shows how to run a scam (Brief §25).

function Stage({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">{children}</div>;
}

export function ScamRadar({ compact = false }: { compact?: boolean }) {
  const radar = useGame((s) => s.scamRadar);
  return (
    <div className="rounded-2xl border-2 border-pink/50 bg-[#1a0b2a]/90 p-3" aria-label={`Scam Radar: ${radar.length} of ${RED_FLAG_ORDER.length} red flags collected`}>
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-pink/60 bg-[radial-gradient(circle,#ff5fa222,#1a0b2a)]">
          <div className="radar-sweep absolute inset-0 origin-center bg-[conic-gradient(from_0deg,#ff5fa288,transparent_25%)]" />
          {radar.map((f, i) => (
            <span key={f} className="absolute h-2 w-2 rounded-full bg-gold" style={{ left: `${50 + 32 * Math.cos(i * 0.9)}%`, top: `${50 + 32 * Math.sin(i * 0.9)}%` }} />
          ))}
        </div>
        <div>
          <div className="scam-font text-xs font-black tracking-widest text-pink">SCAM RADAR</div>
          <div className="font-display text-xl">
            {radar.length}/{RED_FLAG_ORDER.length} <span className="text-sm">red flags</span>
          </div>
        </div>
      </div>
      {!compact && (
        <ul className="mt-3 grid gap-1">
          {RED_FLAG_ORDER.map((id) => {
            const got = radar.includes(id);
            return (
              <li key={id} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm ${got ? "bg-pink/15 font-bold" : "text-muted"}`}>
                <span aria-hidden>{got ? "🚩" : "▫️"}</span>
                {got ? RED_FLAGS[id].name : "???"}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Entry() {
  const begin = useGame((s) => s.beginScamaland);
  const avatar = useGame((s) => s.avatar)!;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), 900);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <Stage>
      <div className="pointer-events-none fixed inset-0 z-30 bg-[linear-gradient(180deg,#2a2156,#100d22)] fade-in" style={{ animationDirection: "reverse", animationDuration: "900ms", animationFillMode: "forwards" }} />
      <div className="sign-drop mx-auto mt-4 w-full max-w-2xl rounded-3xl border-8 border-gold bg-[repeating-linear-gradient(90deg,#ff5fa2_0_30px,#ff3d8a_30px_60px)] px-4 py-6 text-center shadow-[0_0_60px_#ff5fa288]">
        <div className="font-display text-4xl text-ink drop-shadow-[0_4px_0_#7a0f45] sm:text-6xl">SCAMALAND, USA</div>
        <div className="scam-font mt-2 text-lg font-black tracking-widest text-gold">ENTER AT YOUR OWN RISK.</div>
      </div>
      {shown && (
        <>
          <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-3">
              <Speech who="vera">I&apos;m Vera. Everything here looks shiny. Not everything here is real.</Speech>
              <Speech who="vera">Here&apos;s your Scam Radar. Look closely at stuff. When something&apos;s off, it lights up.</Speech>
            </div>
            <div className="flex justify-center">
              <Avatar avatar={avatar} size={170} mood="thinking" />
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm">
            <ScamRadar compact />
          </div>
          <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={begin}>
            WALK IN →
          </button>
        </>
      )}
    </Stage>
  );
}

// ---------------- Mission 1: Too Good to Be True ----------------

interface Hotspot {
  id: string;
  flag?: RedFlagId;
  label: string;
  look: ReactNode;
  finding: string;
  className: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "billboard",
    flag: "guaranteed",
    label: "Giant billboard",
    look: <span className="font-display text-lg text-gold">💰 GUARANTEED MONEY! $500 TODAY!</span>,
    finding: "Tiny print at the bottom: \"results not typical.\" Nobody can promise money with zero risk.",
    className: "bg-[#2a0f3d] border-gold",
  },
  {
    id: "promoter",
    flag: "pressure",
    label: "Flexx, the promoter",
    look: <span className="font-black">📱 Flexx: &quot;ACT NOW!! Only 3 spots left 🔥&quot;</span>,
    finding: "You watch Flexx say \"only 3 spots left\" to every single person who walks by.",
    className: "bg-[#3a0f2a] border-pink",
  },
  {
    id: "booth",
    flag: "upfront",
    label: "Starter kit booth",
    look: <span className="font-black">🎪 SEND MONEY FIRST! $10 STARTER KIT</span>,
    finding: "You pay before you get anything. You peek in a starter kit box. It's empty.",
    className: "bg-[#3d2a0f] border-orange",
  },
  {
    id: "briefcase",
    flag: "secrecy",
    label: "Locked briefcase",
    look: <span className="font-black">💼 SECRET SYSTEM! 🤫 Don&apos;t tell your parents</span>,
    finding: "A sticker says \"Keep this between us.\" Real opportunities don't need to hide from adults.",
    className: "bg-[#1f1f3d] border-violet",
  },
  {
    id: "certificate",
    flag: "fake-authority",
    label: "Framed certificate",
    look: <span className="font-black">🎓 Dr. Cash, Certified Money Expert™</span>,
    finding: "The ink is still wet. It came out of the print kiosk next door five minutes ago.",
    className: "bg-[#0f2a3d] border-cyan",
  },
  {
    id: "phone",
    flag: "links",
    label: "Phone pop-up",
    look: <span className="font-black">📲 YOU&apos;VE BEEN SELECTED! Claim: bit.ly/fr33-ca$h</span>,
    finding: "The link doesn't go to any real company. You didn't enter anything to get \"selected.\"",
    className: "bg-[#0f3d2a] border-teal",
  },
  {
    id: "clipboard",
    flag: "personal-info",
    label: "Sign-up clipboard",
    look: <span className="font-black">📋 Sign up: name, address, school, parent&apos;s bank login</span>,
    finding: "Why would a $500 offer need your parent's bank login? Your info is worth money to them.",
    className: "bg-[#2a2a0f] border-lime",
  },
  {
    id: "newspaper",
    label: "Newspaper on a bench",
    look: <span className="font-black">📰 Local news: Teen saves for 6 months, buys a bike</span>,
    finding: "Not a scam. Just a reminder: real money usually takes real time.",
    className: "bg-[#24243a] border-line",
  },
];

export function TooGoodToBeTrue() {
  const g = useGame();
  const avatar = g.avatar!;
  const [open, setOpen] = useState<string | null>(null);
  const inspected = g.scam.inspected;
  const openSpot = HOTSPOTS.find((h) => h.id === open);

  const look = (h: Hotspot) => {
    setOpen(h.id);
    g.inspect(h.id, h.flag);
  };

  return (
    <Stage>
      <div className="text-center">
        <div className="scam-font text-xs font-black tracking-[0.25em] text-pink">SCAMALAND · MISSION 1 · TOO GOOD TO BE TRUE</div>
        <h2 className="font-display text-3xl sm:text-4xl">Someone says you can make $500 today.</h2>
        <p className="mt-1 font-semibold text-muted">Walk around. Tap anything that looks interesting. Then make your move.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {HOTSPOTS.map((h, i) => {
              const seen = inspected.includes(h.id);
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => look(h)}
                  className={`relative min-h-28 rounded-2xl border-2 p-3 text-left text-sm transition hover:-translate-y-1 ${h.className} ${seen ? "opacity-80" : "wobble"}`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                  aria-label={`Inspect: ${h.label}${seen ? " (inspected)" : ""}`}
                >
                  {h.look}
                  {seen && <span className="absolute -right-2 -top-2 rounded-full bg-ink px-1.5 text-xs text-bg">{h.flag ? "🚩" : "✓"}</span>}
                </button>
              );
            })}
          </div>
          {openSpot && (
            <div className="panel pop-in flex items-start gap-3 border-pink/60 p-4" role="status">
              <span className="text-2xl">{openSpot.flag ? "🔍🚩" : "🔍"}</span>
              <div className="flex-1">
                <div className="text-xs font-black tracking-widest text-pink">{openSpot.flag ? `RED FLAG: ${RED_FLAGS[openSpot.flag].name.toUpperCase()}` : "CLUE"}</div>
                <div className="font-semibold">{openSpot.finding}</div>
              </div>
              <button type="button" className="text-muted hover:text-ink" onClick={() => setOpen(null)} aria-label="Close">
                ✕
              </button>
            </div>
          )}
          <div className="flex items-end gap-3">
            <Avatar avatar={avatar} size={130} mood={openSpot ? "interact" : "thinking"} />
            <Speech who="vera">
              {inspected.length === 0
                ? "Take a look around before you decide anything."
                : g.scamRadar.length < 3
                  ? "Your radar's picking stuff up. Keep looking."
                  : "That's a lot of red flags in one place…"}
            </Speech>
          </div>
        </div>
        <ScamRadar />
      </div>
      <div className="panel p-4">
        <div className="mb-3 text-center font-display text-2xl text-gold">MAKE YOUR MOVE</div>
        <div className="grid gap-2 sm:grid-cols-4">
          <button type="button" className="btn btn-ghost flex-col py-4" onClick={() => g.scamDecide("proceed")}>
            <span className="font-display">💸 Pay $10, get $500</span>
            <span className="text-xs text-muted">Buy the starter kit</span>
          </button>
          <button
            type="button"
            className="btn btn-ghost flex-col py-4"
            onClick={() => {
              const next = HOTSPOTS.find((h) => !inspected.includes(h.id));
              if (next) look(next);
            }}
            disabled={inspected.length === HOTSPOTS.length}
          >
            <span className="font-display">🔍 Investigate more</span>
            <span className="text-xs text-muted">{HOTSPOTS.length - inspected.length} things left to check</span>
          </button>
          <button type="button" className="btn btn-ghost flex-col py-4" onClick={() => g.scamDecide("walk-away")}>
            <span className="font-display">🚶 Walk away</span>
            <span className="text-xs text-muted">Keep your money</span>
          </button>
          <button type="button" className="btn btn-primary flex-col py-4" onClick={() => g.scamDecide("report")}>
            <span className="font-display">📣 Report it</span>
            <span className="text-xs text-bg/70">Walk away and warn others</span>
          </button>
        </div>
      </div>
    </Stage>
  );
}

export function TooGoodResult() {
  const g = useGame();
  const avatar = g.avatar!;
  const d = g.scam.m1Decision;
  const flags = g.scamRadar;
  if (d === "proceed") {
    return (
      <Stage>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={160} mood={g.scam.m1Recovered ? "recovery" : "disappointed"} />
        </div>
        <DownPanel
          amount={10}
          what="You paid $10 for the starter kit. The booth packed up and left. No $500."
          why="Guaranteed money, pay first, act now: that's how this kind of scam works."
          next="Stop, protect yourself, and report it so it doesn't happen to the next person."
        >
          {g.scam.m1Recovered ? (
            <Speech who="vera">You can&apos;t always get the money back. But reporting it protects the next person. That&apos;s a real move.</Speech>
          ) : (
            <button type="button" className="btn btn-primary w-full" onClick={g.scamRecover}>
              📣 Report the booth + tell a trusted adult
            </button>
          )}
        </DownPanel>
        {g.scam.m1Recovered && (
          <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.finishScamMission1}>
            KEEP GOING →
          </button>
        )}
      </Stage>
    );
  }
  return (
    <Stage>
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar avatar={avatar} size={180} mood="celebrate" />
        <h2 className="font-display text-3xl">{d === "report" ? "REPORTED. BOOTH SHUT DOWN." : "YOU WALKED AWAY."}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="panel p-4">
          <div className="mb-2 text-xs font-black tracking-widest text-lime">WHAT YOU AVOIDED</div>
          <ul className="space-y-1 font-semibold">
            <li>💸 Losing $10 on an empty &quot;starter kit&quot;</li>
            <li>📋 Your info on a scammer&apos;s list</li>
            <li>🕳️ $0 of the &quot;$500&quot; ever showing up</li>
            {d === "report" && <li>🛡️ The next kid getting tricked</li>}
          </ul>
        </div>
        <div className="panel p-4">
          <div className="mb-2 text-xs font-black tracking-widest text-pink">RED FLAGS YOU SPOTTED</div>
          {flags.length ? (
            <ul className="space-y-1 text-sm">
              {flags.map((f) => (
                <li key={f}>
                  🚩 <span className="font-bold">{RED_FLAGS[f].name}</span> · <span className="text-muted">{RED_FLAGS[f].tell}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">You trusted your gut before you even looked. Next time, check what tipped you off.</p>
          )}
        </div>
      </div>
      <Speech who="vera" mood="celebrate">
        {d === "report" ? "Reporting it helps everybody. That's RIPPLE in Scamaland." : "If it sounds too good to be true, you just proved it probably is."}
      </Speech>
      <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.finishScamMission1}>
        KEEP GOING →
      </button>
    </Stage>
  );
}

// ---------------- Mission 2: The Shark Bank ----------------

const CLAUSES: { id: string; label: string; detail: string; flag?: RedFlagId; pay?: number }[] = [
  { id: "amount", label: "Amount you get", detail: "$100 cash, today." },
  { id: "fee", label: "Processing fee", detail: "$20, due right now before you get the cash.", flag: "upfront", pay: 20 },
  { id: "repay", label: "Pay back", detail: "$150 in 14 days.", pay: 150 },
  { id: "late", label: "Late fee", detail: "$15 for every week you're late." },
  { id: "rollover", label: "Can't pay?", detail: "We'll \"roll it over\" for another $25 fee. Then you still owe the $150." },
  { id: "phone", label: "Collateral", detail: "We hold your phone until you pay." },
  { id: "deadline", label: "Offer ends", detail: "In 10 minutes! Sign now!", flag: "pressure" },
];

export function SharkBank() {
  const g = useGame();
  const avatar = g.avatar!;
  const revealed = g.scam.contractRevealed;
  const pay = CLAUSES.filter((c) => revealed.includes(c.id) && c.pay).reduce((a, c) => a + (c.pay ?? 0), 0);
  return (
    <Stage>
      <div className="text-center">
        <div className="scam-font text-xs font-black tracking-[0.25em] text-pink">SCAMALAND · MISSION 2 · THE SHARK BANK</div>
        <h2 className="font-display text-3xl sm:text-4xl">&quot;Need $100? Easy!&quot;</h2>
      </div>
      <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
        <Speech who="sal" mood="interact">
          Need $100? Easy! No credit check, no questions. Just sign right here, friend. 🦈
        </Speech>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={150} mood="thinking" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-2xl bg-[#f6efe0] p-4 text-bg shadow-xl">
          <div className="scam-font mb-1 text-center text-lg font-black">SHARK BANK LOAN AGREEMENT</div>
          <div className="mb-3 text-center text-xs font-bold text-bg/60">Tap each line to read it.</div>
          <ul className="space-y-2">
            {CLAUSES.map((c) => {
              const open = revealed.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => g.revealClause(c.id, c.flag)}
                    className={`flex w-full flex-wrap items-baseline justify-between gap-2 rounded-lg border-2 border-dashed px-3 py-2 text-left transition ${open ? "border-bg/20 bg-white" : "border-bg/30 hover:bg-white/60"}`}
                    aria-expanded={open}
                  >
                    <span className="scam-font font-black">{c.label}</span>
                    <span className={`scam-font text-sm font-bold ${open ? "" : "blur-[5px] select-none"}`}>{open ? c.detail : "xxxxxxxx xxxxx xxxxxx"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="scam-font mt-3 text-[10px] text-bg/50">Signature: ______________________</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="panel p-4">
            <div className="text-xs font-black tracking-widest text-muted">THE MATH (SO FAR)</div>
            <div className="mt-2 space-y-2">
              <div>
                <div className="flex justify-between text-sm font-bold">
                  <span>You get</span>
                  <span className="text-lime">$100</span>
                </div>
                <div className="h-3 rounded-full bg-lime" style={{ width: `${(100 / 170) * 100}%` }} />
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold">
                  <span>You pay</span>
                  <span className="text-orange">${pay || "?"}</span>
                </div>
                <div className="h-3 rounded-full bg-orange transition-all duration-500" style={{ width: `${Math.max(4, (pay / 170) * 100)}%` }} />
              </div>
              {pay >= 170 && <div className="pop-in text-sm font-bold text-orange">That&apos;s $70 extra to borrow $100 for two weeks.</div>}
            </div>
            <div className="mt-2 text-xs text-muted">
              Lines read: {revealed.length}/{CLAUSES.length}
            </div>
          </div>
          <ScamRadar compact />
        </div>
      </div>
      <div className="panel p-4">
        <div className="mb-3 text-center font-display text-2xl text-gold">MAKE YOUR MOVE</div>
        <div className="grid gap-2 sm:grid-cols-3">
          <button type="button" className="btn btn-ghost flex-col py-4" onClick={() => g.sharkDecide("sign")}>
            <span className="font-display">✍️ Sign it</span>
            <span className="text-xs text-muted">Take the $100</span>
          </button>
          <button type="button" className="btn btn-ghost flex-col py-4" onClick={() => g.sharkDecide("walk-away")}>
            <span className="font-display">🚶 Walk away</span>
            <span className="text-xs text-muted">No deal</span>
          </button>
          <button type="button" className="btn btn-primary flex-col py-4" onClick={() => g.sharkDecide("ask-adult")}>
            <span className="font-display">🧑‍🏫 Ask a trusted adult</span>
            <span className="text-xs text-bg/70">Check before you sign</span>
          </button>
        </div>
      </div>
    </Stage>
  );
}

export function SharkResult() {
  const g = useGame();
  const avatar = g.avatar!;
  const d = g.scam.m2Decision;
  if (d === "sign") {
    return (
      <Stage>
        <div className="flex justify-center">
          <Avatar avatar={avatar} size={160} mood="disappointed" />
        </div>
        <DownPanel
          amount={70}
          what="Two weeks later, you owe $150. You already paid a $20 fee. You only got $100."
          why="Upfront fees and a short deadline made a $100 loan cost $170. And Sal is holding your phone."
          next="Time to get out of this. You can."
        />
        <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.finishScamMission2}>
          GET OUT →
        </button>
      </Stage>
    );
  }
  return (
    <Stage>
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar avatar={avatar} size={170} mood="celebrate" />
        <h2 className="font-display text-3xl">NO DEAL. PHONE STAYS IN YOUR POCKET.</h2>
      </div>
      <Speech who="vera">
        {d === "ask-adult"
          ? "Smart. A trusted adult would point you to a credit union or saving up first. Way cheaper than $70 extra."
          : "You read the fine print and walked. That's how you beat the Shark."}
      </Speech>
      <div className="panel p-4 text-center font-semibold">
        <span className="text-orange">But your cousin Jay wasn&apos;t so lucky.</span> He signed with Shark Bank and now they&apos;re blowing up his phone. He needs your help.
      </div>
      <button type="button" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl" onClick={g.finishScamMission2}>
        HELP JAY GET OUT →
      </button>
    </Stage>
  );
}

// ---------------- Mission 3: Get Out ----------------

const PATH = ["RECOGNIZE", "STOP", "VERIFY", "PROTECT", "REPORT", "RECOVER"];

const ACTIONS: { id: string; good: boolean; icon: string; title: string; sub: string; why?: string }[] = [
  { id: "pay-fee", good: false, icon: "💸", title: "Pay one more fee", sub: "They say it'll \"unlock\" everything.", why: "Scammers keep inventing new fees. Paying more just feeds them." },
  { id: "stop", good: true, icon: "🛑", title: "Stop the transaction", sub: "No more payments. Cancel what's pending." },
  { id: "send-password", good: false, icon: "🔑", title: "Send the password", sub: "Maybe then they'll stop texting?", why: "A password lets them into the account. Real companies never ask for it by text." },
  { id: "protect", good: true, icon: "🔐", title: "Protect your info", sub: "Change passwords. Never share codes." },
  { id: "help", good: true, icon: "🧑‍🏫", title: "Seek help", sub: "Tell a trusted adult. Verify with the real bank." },
  { id: "secret", good: false, icon: "🙈", title: "Keep it secret", sub: "Hope it just goes away.", why: "Secrecy is what scammers count on. Hiding it gives them more time." },
  { id: "report", good: true, icon: "📣", title: "Report the problem", sub: "Report the number and the business." },
  { id: "recover", good: true, icon: "♻️", title: "Recover where possible", sub: "With an adult, dispute charges and block the number." },
];

export function GetOut() {
  const g = useGame();
  const avatar = g.avatar!;
  const done = g.scam.m3Done;
  const [slip, setSlip] = useState<(typeof ACTIONS)[number] | null>(null);
  const yours = g.scam.m2Decision === "sign";
  const lit = 1 + done.length;
  return (
    <Stage>
      <div className="text-center">
        <div className="scam-font text-xs font-black tracking-[0.25em] text-pink">SCAMALAND · MISSION 3</div>
        <h2 className="font-display text-4xl text-lime sm:text-5xl">GET OUT</h2>
      </div>
      <div className="panel flex flex-col items-center gap-3 p-4 sm:flex-row">
        <div className="text-5xl">📱</div>
        <div className="flex-1">
          <div className="rounded-2xl rounded-bl-sm bg-[#2b1240] px-3 py-2 text-sm font-bold">
            {yours
              ? "SHARK BANK: Payment late!! Send $25 rollover fee + your bank password to set up autopay or we keep the phone."
              : "SHARK BANK → Jay: Payment late!! Send $25 rollover fee + your bank password to set up autopay."}
          </div>
          <div className="mt-1 text-xs text-muted">{yours ? "Your situation" : "Jay's situation"} · Each safe move lights up the path.</div>
        </div>
        <Avatar avatar={avatar} size={110} mood={slip ? "disappointed" : done.length ? "recovery" : "thinking"} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {PATH.map((p, i) => (
          <div key={p} className="flex items-center gap-1">
            <span className={`rounded-lg px-2 py-1 font-display text-xs transition ${i < lit ? "bg-lime text-bg pop-in" : "bg-panel-2 text-muted"}`}>{p}</span>
            {i < PATH.length - 1 && <span className="text-muted">→</span>}
          </div>
        ))}
      </div>
      {slip && (
        <DownPanel amount={15} what={`You tried "${slip.title.toLowerCase()}." It made things worse.`} why={slip.why ?? ""} next="Shake it off. Pick a safer move.">
          <button type="button" className="btn btn-ghost w-full" onClick={() => setSlip(null)}>
            Got it. Try another move
          </button>
        </DownPanel>
      )}
      {!slip && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((a) => {
            const isDone = done.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                disabled={isDone}
                onClick={() => {
                  g.getOutAction(a.id, a.good);
                  if (!a.good) setSlip(a);
                }}
                className={`flex min-h-28 flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition ${isDone ? "border-lime bg-lime/15" : "border-line bg-panel-2 hover:-translate-y-1"}`}
              >
                <span className="text-2xl">{isDone ? "✅" : a.icon}</span>
                <span className="font-display leading-tight">{a.title}</span>
                <span className="text-xs font-semibold text-muted">{a.sub}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className="text-center text-sm font-bold text-muted">{done.length}/5 safe moves</div>
    </Stage>
  );
}

export function ScamalandComplete() {
  const g = useGame();
  const avatar = g.avatar!;
  return (
    <Stage>
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar avatar={avatar} size={200} mood="celebrate" />
        <h2 className="font-display text-5xl text-lime pop-in">YOU GOT OUT.</h2>
        <div className="flex flex-wrap justify-center gap-1">
          {PATH.map((p) => (
            <span key={p} className="rounded-lg bg-lime px-2 py-1 font-display text-xs text-bg">
              {p}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ScamRadar />
        <div className="panel flex flex-col gap-2 p-4">
          <div className="text-xs font-black tracking-widest text-muted">YOU KNOW WHAT TO LOOK FOR</div>
          <ul className="space-y-1 text-sm">
            <li>🎪 Too Good to Be True: {g.scam.m1Decision === "proceed" ? "paid, then reported it" : g.scam.m1Decision === "report" ? "reported it" : "walked away"}</li>
            <li>🦈 Shark Bank: {g.scam.m2Decision === "sign" ? "signed, then got out" : g.scam.m2Decision === "ask-adult" ? "asked a trusted adult" : "walked away"}</li>
            <li>🛡️ Get Out: 5 safe moves{g.scam.m3Slips ? `, ${g.scam.m3Slips} risky one${g.scam.m3Slips > 1 ? "s" : ""} along the way` : ""}</li>
          </ul>
          <Speech who="vera" mood="celebrate">
            Scamaland&apos;s still out there. Now you know how to walk through it.
          </Speech>
        </div>
      </div>
      <Link href="/block" className="btn btn-primary mx-auto w-full max-w-sm py-4 font-display text-xl">
        BUS BACK TO THE BLOCK →
      </Link>
    </Stage>
  );
}
