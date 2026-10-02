"use client";

import Link from "next/link";
import GameShell from "@/components/GameShell";
import { JobRunner } from "@/features/hustle/jobs";
import {
  BikeOffer,
  Briefing,
  CornerShop,
  CourtResult,
  CourtScene,
  DownScene,
  HustleComplete,
  Hub,
  JobDone,
  NextMove,
  Recovery,
  ShopResult,
  Transform,
} from "@/features/hustle/scenes";
import { missionById } from "@/game/content";
import { useGame } from "@/game/store";

/** Hustle Block: the flagship playable zone. The mission engine's current scene picks the screen. */
function HustleBlock() {
  const scene = useGame((s) => s.hustle.scene);
  const activeJob = useGame((s) => s.activeJob);
  const avatar = useGame((s) => s.avatar)!;
  const finishJob = useGame((s) => s.finishJob);
  const activeMission = useGame((s) => s.activeMission);
  const hustleState = useGame((s) => s.hustleState);
  const m = activeMission ? missionById(activeMission) : null;

  let body;
  switch (scene) {
    case "briefing":
      body = <Briefing />;
      break;
    case "hub":
      body = <Hub />;
      break;
    case "job":
      body = activeJob ? <JobRunner key={activeJob} job={activeJob} avatar={avatar} onDone={finishJob} /> : <Hub />;
      break;
    case "job_done":
      body = <JobDone />;
      break;
    case "shop":
      body = <CornerShop />;
      break;
    case "shop_result":
      body = <ShopResult />;
      break;
    case "offer":
      body = <BikeOffer />;
      break;
    case "down":
      body = <DownScene />;
      break;
    case "recovery":
      body = <Recovery />;
      break;
    case "court":
      body = <CourtScene />;
      break;
    case "transform":
      body = <Transform />;
      break;
    case "court_result":
      body = <CourtResult />;
      break;
    case "next_move":
      body = <NextMove />;
      break;
    case "complete":
      body = <HustleComplete />;
      break;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-3 py-4 sm:px-4">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2 text-sm">
        <Link href="/block" className="font-bold text-muted hover:text-ink">
          ← My Block
        </Link>
        <div className="truncate text-right font-bold text-muted">
          <span className="text-lime">HUSTLE BLOCK</span>
          {m && m.world === "hustle" && ` · M${m.number} ${m.title}`}
          <span className="ml-2 hidden rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline" title="Engine state">
            {hustleState}
          </span>
        </div>
      </div>
      <div key={scene} className="slide-up flex flex-1 flex-col">
        {body}
      </div>
    </div>
  );
}

export default function HustlePage() {
  return (
    <GameShell>
      <HustleBlock />
    </GameShell>
  );
}
