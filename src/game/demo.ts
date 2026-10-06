import { freshGame } from "./store";
import type { Avatar, EventType, GameData, GameEvent, MissionId } from "./types";

// Investor Demo Mode (Brief §38): never open to an empty world.
// Builds a mid-game save: avatar done, Mission 1 complete, cosmetic earned, the block populated,
// Scamaland open, and a believable event history for the behavioral dashboard.
// The player lands right before "Make Your Move" so the CHOOSE → CONSEQUENCE beat can be played live.

export const DEMO_AVATAR: Avatar = {
  name: "Nova",
  skin: "s4",
  hair: "braids",
  hairColor: "black",
  outfit: "hoodie",
  outfitColor: "#b8ff3c",
  shoes: "hustle-runners",
  accessory: "cap",
};

export function buildDemoState(): GameData {
  const base = freshGame();
  const now = Date.now();
  const s1 = "demo-s1";
  const s2 = "demo-s2";
  const s3 = "demo-s3";
  let i = 0;
  const ev = (minsAgo: number, sessionId: string, type: EventType, data?: GameEvent["data"], mission: MissionId | null = null): GameEvent => ({
    id: `demo-${i++}`,
    t: now - minsAgo * 60_000,
    type,
    sessionId,
    mission,
    data,
  });

  const events: GameEvent[] = [
    ev(2900, s1, "session_started", { returning: false }),
    ev(2899, s1, "avatar_created", { hair: "braids", outfit: "hoodie", accessory: "cap" }),
    ev(2899, s1, "zone_unlocked", { zone: "hustle-block" }),
    ev(2898, s1, "zone_entered", { zone: "hustle-block" }),
    ev(2897, s1, "mission_started", { mission: "find-a-hustle" }, "find-a-hustle"),
    ev(2896, s1, "job_selected", { job: "delivery", reward: 8, effort: "Low" }, "find-a-hustle"),
    ev(2895, s1, "job_completed", { job: "delivery", reward: 8 }, "find-a-hustle"),
    ev(2895, s1, "money_earned", { amount: 8, source: "delivery", balance: 28 }, "find-a-hustle"),
    ev(2895, s1, "stack_changed", { delta: 3, reason: "finished a job", stack: 3 }, "find-a-hustle"),
    ev(2893, s1, "session_ended", { ups: 28 }),
    ev(1460, s2, "session_started", { returning: true }),
    ev(1459, s2, "zone_entered", { zone: "hustle-block" }),
    ev(1458, s2, "job_selected", { job: "flyer", reward: 15, effort: "High" }, "find-a-hustle"),
    ev(1456, s2, "job_completed", { job: "flyer", reward: 15 }, "find-a-hustle"),
    ev(1456, s2, "money_earned", { amount: 15, source: "flyer", balance: 43 }, "find-a-hustle"),
    ev(1456, s2, "stack_changed", { delta: 3, reason: "finished a job", stack: 6 }, "find-a-hustle"),
    ev(1455, s2, "mission_completed", { mission: "find-a-hustle", streak: 1 }, "find-a-hustle"),
    ev(1455, s2, "stack_changed", { delta: 10, reason: "completed find-a-hustle", stack: 16 }, "find-a-hustle"),
    ev(1455, s2, "item_unlocked", { item: "hustle-runners", category: "sneakers" }),
    ev(1455, s2, "item_unlocked", { item: "badge-first-hustle", category: "badges" }),
    ev(1452, s2, "job_selected", { job: "sweep", reward: 6, effort: "Low" }),
    ev(1451, s2, "job_completed", { job: "sweep", reward: 6 }),
    ev(1451, s2, "money_earned", { amount: 6, source: "sweep", balance: 49 }),
    ev(1451, s2, "ripple_changed", { delta: 5, reason: "cleaned the court", ripple: 5 }),
    ev(1450, s2, "money_spent", { amount: 6, item: "court-snacks", community: true, balance: 43 }),
    ev(1450, s2, "ripple_changed", { delta: 5, reason: "shared snacks at the court", ripple: 10 }),
    ev(1449, s2, "session_ended", { ups: 43 }),
    ev(1, s3, "session_started", { returning: true, demo: true }),
    ev(1, s3, "mission_started", { mission: "make-your-move" }, "make-your-move"),
  ];

  return {
    ...base,
    sessionId: s3,
    demo: true,
    playerState: "DECISION_MOMENT",
    hustleState: "SPENDING_AVAILABLE",
    scamState: "SCAMALAND_ENTRY",
    avatar: DEMO_AVATAR,
    ups: 43,
    stack: 19,
    ripple: 10,
    streak: 2,
    lastStreakDay: null,
    completedMissions: ["find-a-hustle"],
    activeMission: "make-your-move",
    jobsDone: { delivery: 1, shop: 0, flyer: 1, ref: 0, sweep: 1 },
    collection: ["hustle-runners", "badge-first-hustle"],
    unlockedZones: ["hustle-block", "scamaland"],
    world: { courtRestored: false, lightsOn: false, muralPainted: false, activeNpcs: 3 },
    hustle: { ...base.hustle, scene: "shop", jobReturn: "mission" },
    ledger: { earned: 29, spent: 6, given: 6 },
    classCode: "MUVZ7A",
    events,
  };
}
