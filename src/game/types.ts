// Core types for the Money Muvz game engine.
// State names mirror the Developer Build Brief §28 so the engine can be audited against the spec.

export type PlayerState =
  | "NEW_PLAYER"
  | "AVATAR_CREATED"
  | "IN_HUB"
  | "MISSION_AVAILABLE"
  | "MISSION_ACTIVE"
  | "INTERACTION"
  | "DECISION_MOMENT"
  | "CONSEQUENCE"
  | "RECOVERY"
  | "MISSION_COMPLETE"
  | "REWARD"
  | "ZONE_UNLOCKED"
  | "RETURN_TO_HUB";

export type HustleState =
  | "HUSTLE_LOCKED"
  | "HUSTLE_AVAILABLE"
  | "JOB_SELECTION"
  | "JOB_ACTIVE"
  | "JOB_COMPLETE"
  | "SPENDING_AVAILABLE"
  | "SPENDING_COMPLETE"
  | "RIPPLE_AVAILABLE"
  | "RIPPLE_DECISION"
  | "WORLD_TRANSFORMATION"
  | "HUSTLE_COMPLETE";

export type ScamalandState =
  | "SCAMALAND_LOCKED"
  | "SCAMALAND_ENTRY"
  | "MISSION_ACTIVE"
  | "CLUE_DISCOVERED"
  | "RED_FLAG_ADDED"
  | "OPPORTUNITY_DECISION"
  | "CONSEQUENCE"
  | "RECOVERY"
  | "SCAMALAND_COMPLETE";

/** Fine-grained scene inside Hustle Block. Each scene maps to a HustleState + PlayerState. */
export type HustleScene =
  | "briefing" // Mission 1 intro
  | "hub" // Hustle Hub job boards
  | "job" // a mini-job is running
  | "job_done"
  | "shop" // Mission 2: Corner Shop, make your move
  | "shop_result" // consequence of the shop move
  | "offer" // new opportunity appears (delivery bike)
  | "down" // DOWN$ panel
  | "recovery" // "You've got a problem. What are you gonna do?"
  | "court" // Mission 3: The Block Needs You
  | "transform" // world transformation
  | "court_result"
  | "next_move" // Mission 4
  | "complete"; // YOU MADE MOVZ

export type ScamScene =
  | "entry"
  | "m1_explore"
  | "m1_result"
  | "m2_contract"
  | "m2_result"
  | "m3_getout"
  | "complete";

export type MissionId =
  | "find-a-hustle"
  | "make-your-move"
  | "block-needs-you"
  | "your-next-move"
  | "too-good-to-be-true"
  | "shark-bank"
  | "get-out";

export type JobId = "delivery" | "shop" | "flyer" | "ref" | "sweep";

export type ZoneId =
  | "hustle-block"
  | "the-jar"
  | "market-tower"
  | "founders-lab"
  | "city-hall"
  | "boardroom"
  | "the-tank"
  | "ripple-center"
  | "scamaland";

export type RedFlagId =
  | "guaranteed"
  | "pressure"
  | "upfront"
  | "secrecy"
  | "fake-authority"
  | "links"
  | "personal-info";

export type ItemCategory = "sneakers" | "headphones" | "backpacks" | "neighborhood" | "badges";

export type ItemId =
  | "drop-sneakers"
  | "hustle-runners"
  | "studio-headphones"
  | "block-pack"
  | "court-lights"
  | "block-mural"
  | "badge-first-hustle"
  | "badge-comeback"
  | "badge-ripple-maker"
  | "badge-made-movz"
  | "badge-scam-spotter"
  | "badge-shark-proof"
  | "badge-got-out";

export type Skin = "s1" | "s2" | "s3" | "s4" | "s5" | "s6";
export type Hair = "fade" | "puffs" | "braids" | "curls" | "bun" | "locs";
export type HairColor = "black" | "brown" | "blonde" | "auburn" | "blue" | "pink";
export type Outfit = "hoodie" | "jersey" | "jacket" | "tee";
export type Shoes = "hightops" | "runners" | "slides" | "drop-sneakers" | "hustle-runners";
export type Accessory = "none" | "cap" | "glasses" | "beanie" | "headphones" | "backpack";

export interface Avatar {
  name: string;
  skin: Skin;
  hair: Hair;
  hairColor: HairColor;
  outfit: Outfit;
  outfitColor: string;
  shoes: Shoes;
  accessory: Accessory;
}

export type AvatarMood =
  | "idle"
  | "walk"
  | "run"
  | "celebrate"
  | "disappointed"
  | "thinking"
  | "interact"
  | "recovery"
  | "unlock";

export interface WorldState {
  courtRestored: boolean;
  lightsOn: boolean;
  muralPainted: boolean;
  /** NPCs hanging out on the block; grows as the neighborhood improves. */
  activeNpcs: number;
}

export type ShopChoice = "buy-now" | "hold" | "mix";
export type RecoveryPath = "job" | "return" | "change-plan" | "community" | "wait";

export interface HustleProgress {
  scene: HustleScene;
  shopChoice: ShopChoice | null;
  bikeOutcome: "bought" | "passed" | "postponed" | null;
  hasBike: boolean;
  downTriggered: boolean;
  /** Shortfall shown on the DOWN$ panel. */
  downAmount: number;
  recoveryPath: RecoveryPath | null;
  recovered: boolean;
  courtChoice: "keep" | "invest" | null;
  finalMove: { goal: number; block: number; keep: number } | null;
  goalJar: number;
  /** Where the player goes after finishing a job. */
  jobReturn: "mission" | "recovery" | "court" | "free";
}

export interface ScamProgress {
  scene: ScamScene;
  inspected: string[];
  m1Decision: "proceed" | "walk-away" | "report" | null;
  m1Recovered: boolean;
  contractRevealed: string[];
  m2Decision: "sign" | "walk-away" | "ask-adult" | null;
  m3Done: string[];
  m3Slips: number;
}

export type EventType =
  | "session_started"
  | "avatar_created"
  | "zone_entered"
  | "mission_started"
  | "mission_completed"
  | "job_selected"
  | "job_completed"
  | "money_earned"
  | "money_spent"
  | "choice_made"
  | "down_triggered"
  | "recovery_started"
  | "recovery_completed"
  | "stack_changed"
  | "ripple_changed"
  | "world_state_changed"
  | "item_unlocked"
  | "zone_unlocked"
  | "scamland_entered"
  | "clue_discovered"
  | "red_flag_collected"
  | "scam_decision_made"
  | "scam_recovery_completed"
  | "session_ended";

export interface GameEvent {
  id: string;
  t: number;
  type: EventType;
  sessionId: string;
  mission?: MissionId | null;
  data?: Record<string, string | number | boolean | null>;
}

export interface GameData {
  v: 1;
  playerId: string;
  sessionId: string;
  playerState: PlayerState;
  hustleState: HustleState;
  scamState: ScamalandState;
  avatar: Avatar | null;
  ups: number;
  stack: number;
  ripple: number;
  streak: number;
  lastStreakDay: string | null;
  completedMissions: MissionId[];
  activeMission: MissionId | null;
  jobsDone: Record<JobId, number>;
  activeJob: JobId | null;
  collection: ItemId[];
  unlockedZones: ZoneId[];
  world: WorldState;
  hustle: HustleProgress;
  scam: ScamProgress;
  scamRadar: RedFlagId[];
  ledger: { earned: number; spent: number; given: number };
  classCode: string | null;
  muted: boolean;
  demo: boolean;
  events: GameEvent[];
}
