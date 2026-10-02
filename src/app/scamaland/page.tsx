"use client";

import Link from "next/link";
import GameShell from "@/components/GameShell";
import {
  Entry,
  GetOut,
  ScamalandComplete,
  SharkBank,
  SharkResult,
  TooGoodResult,
  TooGoodToBeTrue,
} from "@/features/scamaland/scenes";
import { useGame } from "@/game/store";

/** Scamaland, USA: a separate world with its own look (Brief §18–25). */
function Scamaland() {
  const locked = useGame((s) => !s.unlockedZones.includes("scamaland"));
  const scene = useGame((s) => s.scam.scene);
  const scamState = useGame((s) => s.scamState);

  if (locked) {
    return (
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-6xl">🚌🔒</div>
        <h1 className="font-display text-3xl text-pink">SCAMALAND IS LOCKED</h1>
        <p className="text-muted">Finish Hustle Block to unlock the bus to Scamaland, USA.</p>
        <Link href="/block" className="btn btn-primary">
          Back to my block
        </Link>
      </div>
    );
  }

  const body = {
    entry: <Entry />,
    m1_explore: <TooGoodToBeTrue />,
    m1_result: <TooGoodResult />,
    m2_contract: <SharkBank />,
    m2_result: <SharkResult />,
    m3_getout: <GetOut />,
    complete: <ScamalandComplete />,
  }[scene];

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-4 sm:px-4">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 text-sm">
        <Link href="/block" className="font-bold text-muted hover:text-ink">
          ← Bus home
        </Link>
        <div className="scam-font truncate font-bold text-pink">
          SCAMALAND, USA
          <span className="ml-2 hidden rounded bg-bg/60 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline" title="Engine state">
            {scamState}
          </span>
        </div>
      </div>
      <div key={scene} className="slide-up flex flex-1 flex-col">
        {body}
      </div>
    </div>
  );
}

export default function ScamalandPage() {
  return (
    <GameShell className="scamaland">
      <Scamaland />
    </GameShell>
  );
}
