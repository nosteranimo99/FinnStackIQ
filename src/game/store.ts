"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  BIKE_PRICE,
  COURT_CONTRIBUTION,
  HEADPHONES_PRICE,
  ITEMS,
  JOBS,
  MURAL_PRICE,
  PAYDAY,
  RED_FLAGS,
  RETURN_FEE,
  SNACK_PACK_PRICE,
  SNEAKER_PRICE,
  STARTING_UPS,
  ZONES,
} from "./content";
import { useFx } from "./fx";
import { playCue, type Cue } from "./sound";
import type {
  Avatar,
  EventType,
  GameData,
  GameEvent,
  HustleScene,
  HustleState,
  ItemId,
  JobId,
  MissionId,
  PlayerState,
  RecoveryPath,
  RedFlagId,
  ScamalandState,
  ScamScene,
  ShopChoice,
  ZoneId,
} from "./types";

const MAX_EVENTS = 400;
export const STORAGE_KEY = "money-muvz:v1";

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/** Each Hustle Block scene maps onto the spec's explicit HustleState + PlayerState (§28). */
export const HUSTLE_SCENE_STATES: Record<HustleScene, [HustleState, PlayerState]> = {
  briefing: ["HUSTLE_AVAILABLE", "MISSION_AVAILABLE"],
  hub: ["JOB_SELECTION", "MISSION_ACTIVE"],
  job: ["JOB_ACTIVE", "INTERACTION"],
  job_done: ["JOB_COMPLETE", "REWARD"],
  shop: ["SPENDING_AVAILABLE", "DECISION_MOMENT"],
  shop_result: ["SPENDING_AVAILABLE", "CONSEQUENCE"],
  offer: ["SPENDING_AVAILABLE", "DECISION_MOMENT"],
  down: ["SPENDING_COMPLETE", "CONSEQUENCE"],
  recovery: ["SPENDING_COMPLETE", "RECOVERY"],
  court: ["RIPPLE_AVAILABLE", "DECISION_MOMENT"],
  transform: ["WORLD_TRANSFORMATION", "REWARD"],
  court_result: ["RIPPLE_DECISION", "CONSEQUENCE"],
  next_move: ["RIPPLE_DECISION", "DECISION_MOMENT"],
  complete: ["HUSTLE_COMPLETE", "MISSION_COMPLETE"],
};

export const SCAM_SCENE_STATES: Record<ScamScene, [ScamalandState, PlayerState]> = {
  entry: ["SCAMALAND_ENTRY", "MISSION_AVAILABLE"],
  m1_explore: ["MISSION_ACTIVE", "MISSION_ACTIVE"],
  m1_result: ["CONSEQUENCE", "CONSEQUENCE"],
  m2_contract: ["OPPORTUNITY_DECISION", "DECISION_MOMENT"],
  m2_result: ["CONSEQUENCE", "CONSEQUENCE"],
  m3_getout: ["RECOVERY", "RECOVERY"],
  complete: ["SCAMALAND_COMPLETE", "MISSION_COMPLETE"],
};

export function freshGame(): GameData {
  return {
    v: 1,
    playerId: uid(),
    sessionId: uid(),
    playerState: "NEW_PLAYER",
    hustleState: "HUSTLE_LOCKED",
    scamState: "SCAMALAND_LOCKED",
    avatar: null,
    ups: STARTING_UPS,
    stack: 0,
    ripple: 0,
    streak: 0,
    lastStreakDay: null,
    completedMissions: [],
    activeMission: null,
    jobsDone: { delivery: 0, shop: 0, flyer: 0, ref: 0, sweep: 0 },
    activeJob: null,
    collection: [],
    unlockedZones: [],
    world: { courtRestored: false, lightsOn: false, muralPainted: false, activeNpcs: 1 },
    hustle: {
      scene: "briefing",
      shopChoice: null,
      bikeOutcome: null,
      hasBike: false,
      downTriggered: false,
      downAmount: 0,
      recoveryPath: null,
      recovered: false,
      courtChoice: null,
      finalMove: null,
      goalJar: 0,
      jobReturn: "mission",
    },
    scam: {
      scene: "entry",
      inspected: [],
      m1Decision: null,
      m1Recovered: false,
      contractRevealed: [],
      m2Decision: null,
      m3Done: [],
      m3Slips: 0,
    },
    scamRadar: [],
    ledger: { earned: 0, spent: 0, given: 0 },
    classCode: null,
    muted: false,
    demo: false,
    events: [],
  };
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export const HUSTLE_JOBS: JobId[] = ["delivery", "shop", "flyer"];
export const coreJobsDone = (g: GameData) => HUSTLE_JOBS.filter((j) => g.jobsDone[j] > 0).length;
export const jobReward = (g: GameData, job: JobId) => (job === "delivery" && g.hustle.hasBike ? JOBS.delivery.reward * 2 : JOBS[job].reward);
export const progressPct = (g: GameData) => Math.round((g.completedMissions.length / 7) * 100);

interface Actions {
  // session + meta
  ensureSession: () => void;
  endSession: () => void;
  toggleMute: () => void;
  cue: (cue: Cue) => void;
  loadState: (data: GameData) => void;
  resetGame: () => void;
  joinClass: (code: string) => void;
  createAvatar: (avatar: Avatar) => void;
  updateAvatar: (patch: Partial<Avatar>) => void;
  enterZone: (zone: ZoneId) => void;
  returnToHub: () => void;
  // hustle block
  beginHustle: () => void;
  selectJob: (job: JobId) => void;
  finishJob: () => void;
  continueAfterJob: () => void;
  chooseShop: (choice: ShopChoice) => void;
  showOffer: () => void;
  tryBuyBike: () => void;
  passBike: () => void;
  startRecovery: () => void;
  chooseRecovery: (path: RecoveryPath) => void;
  chooseCourt: (choice: "keep" | "invest" | "earn-first") => void;
  finishCourt: () => void;
  commitNextMove: (move: { goal: number; block: number; keep: number }) => void;
  // scamaland
  enterScamaland: () => void;
  beginScamaland: () => void;
  inspect: (hotspot: string, flag?: RedFlagId) => void;
  scamDecide: (decision: "proceed" | "walk-away" | "report") => void;
  scamRecover: () => void;
  finishScamMission1: () => void;
  revealClause: (clause: string, flag?: RedFlagId) => void;
  sharkDecide: (decision: "sign" | "walk-away" | "ask-adult") => void;
  finishScamMission2: () => void;
  getOutAction: (action: string, good: boolean) => void;
}

export type GameStore = GameData & Actions;

export const useGame = create<GameStore>()(
  persist(
    (set, get) => {
      // ---- low-level helpers (not exposed) ----
      const fx = useFx.getState;

      const track = (type: EventType, data?: GameEvent["data"], mission?: MissionId | null) => {
        const g = get();
        const ev: GameEvent = {
          id: uid(),
          t: Date.now(),
          type,
          sessionId: g.sessionId,
          mission: mission === undefined ? g.activeMission : mission,
          data,
        };
        set({ events: [...g.events, ev].slice(-MAX_EVENTS) });
      };

      const cue = (c: Cue) => playCue(c, get().muted);

      const earn = (amount: number, source: string) => {
        if (amount <= 0) return;
        set((s) => ({ ups: s.ups + amount, ledger: { ...s.ledger, earned: s.ledger.earned + amount } }));
        track("money_earned", { amount, source, balance: get().ups });
        fx().push({ kind: "ups", text: `+$${amount} UP$` });
        cue("earn");
      };

      const spend = (amount: number, item: string, community = false) => {
        if (amount <= 0) return;
        set((s) => ({
          ups: s.ups - amount,
          ledger: {
            ...s.ledger,
            spent: s.ledger.spent + amount,
            given: s.ledger.given + (community ? amount : 0),
          },
        }));
        track("money_spent", { amount, item, community, balance: get().ups });
        fx().push({ kind: "ups", text: `-$${amount} UP$` });
      };

      const addStack = (amount: number, reason: string) => {
        if (amount <= 0) return;
        set((s) => ({ stack: s.stack + amount }));
        track("stack_changed", { delta: amount, reason, stack: get().stack });
        fx().push({ kind: "stack", text: `+${amount} STACK` });
        cue("stack");
      };

      const addRipple = (amount: number, reason: string) => {
        if (amount <= 0) return;
        set((s) => ({ ripple: s.ripple + amount }));
        track("ripple_changed", { delta: amount, reason, ripple: get().ripple });
        fx().push({ kind: "ripple", text: `+${amount} RIPPLE` });
        cue("ripple");
      };

      const down = (amount: number, reason: string) => {
        track("down_triggered", { amount, reason });
        fx().push({ kind: "down", text: `-$${amount} DOWN$` });
        cue("down");
      };

      const unlockItem = (id: ItemId) => {
        if (get().collection.includes(id)) return;
        set((s) => ({ collection: [...s.collection, id] }));
        track("item_unlocked", { item: id, category: ITEMS[id].category });
        fx().push({ kind: "unlock", text: `${ITEMS[id].icon} Unlocked: ${ITEMS[id].name}` });
        cue("unlock");
      };

      const unlockZone = (id: ZoneId) => {
        if (get().unlockedZones.includes(id)) return;
        set((s) => ({ unlockedZones: [...s.unlockedZones, id] }));
        track("zone_unlocked", { zone: id });
      };

      const startMission = (id: MissionId) => {
        set({ activeMission: id });
        track("mission_started", { mission: id }, id);
        cue("mission");
      };

      const completeMission = (id: MissionId) => {
        const g = get();
        if (g.completedMissions.includes(id)) return;
        const today = dayKey(new Date());
        const yesterday = dayKey(new Date(Date.now() - 86_400_000));
        let streak = g.streak;
        if (g.lastStreakDay !== today) streak = g.lastStreakDay === yesterday ? g.streak + 1 : 1;
        set({ completedMissions: [...g.completedMissions, id], activeMission: null, streak, lastStreakDay: today });
        track("mission_completed", { mission: id, streak }, id);
        addStack(10, `completed ${id}`);
        cue("complete");
      };

      const hustleScene = (scene: HustleScene) => {
        const [hustleState, playerState] = HUSTLE_SCENE_STATES[scene];
        set((s) => ({ hustle: { ...s.hustle, scene }, hustleState, playerState }));
      };

      const scamScene = (scene: ScamScene) => {
        const [scamState, playerState] = SCAM_SCENE_STATES[scene];
        set((s) => ({ scam: { ...s.scam, scene }, scamState, playerState }));
      };

      const restoreCourt = (reason: string) => {
        set((s) => ({ world: { ...s.world, courtRestored: true, lightsOn: true, activeNpcs: 5 } }));
        track("world_state_changed", { change: "court_restored", reason });
        unlockItem("court-lights");
        unlockItem("badge-ripple-maker");
        cue("transform");
      };

      const finishMission2 = () => {
        completeMission("make-your-move");
        startMission("block-needs-you");
        hustleScene("court");
      };

      const recoveryDone = (how: string) => {
        const g = get();
        if (!g.hustle.downTriggered || g.hustle.recovered) return;
        set((s) => ({ hustle: { ...s.hustle, recovered: true } }));
        track("recovery_completed", { how });
        unlockItem("badge-comeback");
        cue("recovery");
      };

      return {
        ...freshGame(),

        ensureSession: () => {
          if (typeof window === "undefined") return;
          try {
            if (sessionStorage.getItem("mm-session") === get().sessionId) return;
            const sessionId = uid();
            sessionStorage.setItem("mm-session", sessionId);
            set({ sessionId });
          } catch {
            set({ sessionId: uid() });
          }
          track("session_started", { returning: get().avatar !== null, demo: get().demo });
        },
        endSession: () => track("session_ended", { ups: get().ups, stack: get().stack, ripple: get().ripple }),
        toggleMute: () => set((s) => ({ muted: !s.muted })),
        cue,
        loadState: (data) => set({ ...data }),
        resetGame: () => {
          set({ ...freshGame() });
          try {
            sessionStorage.removeItem("mm-session");
          } catch {}
        },
        joinClass: (code) => {
          set({ classCode: code.toUpperCase() });
          track("choice_made", { choice: "joined_class", code: code.toUpperCase() }, null);
        },
        createAvatar: (avatar) => {
          const first = get().avatar === null;
          set({ avatar });
          if (!first) return;
          set({ playerState: "AVATAR_CREATED", hustleState: "HUSTLE_AVAILABLE" });
          track("avatar_created", { hair: avatar.hair, outfit: avatar.outfit, accessory: avatar.accessory }, null);
          unlockZone("hustle-block");
          set({ playerState: "IN_HUB" });
        },
        updateAvatar: (patch) => {
          const a = get().avatar;
          if (a) set({ avatar: { ...a, ...patch } });
        },
        enterZone: (zone) => {
          track("zone_entered", { zone }, null);
          if (zone === "hustle-block" && get().hustleState === "HUSTLE_LOCKED") set({ hustleState: "HUSTLE_AVAILABLE" });
        },
        returnToHub: () => set({ playerState: "RETURN_TO_HUB" }),

        // ---------------- Hustle Block ----------------
        beginHustle: () => {
          startMission("find-a-hustle");
          set((s) => ({ hustle: { ...s.hustle, jobReturn: "mission" } }));
          hustleScene("hub");
        },
        selectJob: (job) => {
          set({ activeJob: job });
          track("job_selected", { job, reward: jobReward(get(), job), effort: JOBS[job].effort });
          hustleScene("job");
        },
        finishJob: () => {
          const g = get();
          const job = g.activeJob;
          if (!job) return;
          const reward = jobReward(g, job);
          set((s) => ({ jobsDone: { ...s.jobsDone, [job]: s.jobsDone[job] + 1 } }));
          track("job_completed", { job, reward });
          earn(reward, job);
          addStack(3, "finished a job");
          if (job === "sweep") addRipple(5, "cleaned the court");
          hustleScene("job_done");
        },
        continueAfterJob: () => {
          const g = get();
          set({ activeJob: null });
          switch (g.hustle.jobReturn) {
            case "mission":
              if (!g.completedMissions.includes("find-a-hustle") && coreJobsDone(g) >= 2) {
                completeMission("find-a-hustle");
                unlockItem("hustle-runners");
                unlockItem("badge-first-hustle");
                startMission("make-your-move");
                hustleScene("shop");
              } else hustleScene("hub");
              return;
            case "recovery":
              hustleScene(g.ups >= BIKE_PRICE ? "offer" : "recovery");
              return;
            case "court":
              hustleScene("court");
              return;
            default:
              hustleScene("hub");
          }
        },
        chooseShop: (choice) => {
          set((s) => ({ hustle: { ...s.hustle, shopChoice: choice } }));
          track("choice_made", { decision: "corner_shop", choice, balance: get().ups });
          if (choice === "buy-now") {
            spend(SNEAKER_PRICE, "drop-sneakers");
            unlockItem("drop-sneakers");
          } else if (choice === "hold") {
            addStack(8, "held onto money");
          } else {
            spend(SNACK_PACK_PRICE, "snack-pack-for-cleanup-crew", true);
            addRipple(10, "fed the cleanup crew");
          }
          hustleScene("shop_result");
        },
        showOffer: () => hustleScene("offer"),
        tryBuyBike: () => {
          const g = get();
          if (g.ups >= BIKE_PRICE) {
            spend(BIKE_PRICE, "delivery-bike");
            set((s) => ({ hustle: { ...s.hustle, hasBike: true, bikeOutcome: "bought" } }));
            track("choice_made", { decision: "bike_offer", choice: "bought" });
            addStack(15, "invested in earning power");
            recoveryDone("earned_back_and_bought");
            finishMission2();
            return;
          }
          const shortfall = BIKE_PRICE - g.ups;
          set((s) => ({ hustle: { ...s.hustle, downTriggered: true, downAmount: shortfall } }));
          track("choice_made", { decision: "bike_offer", choice: "tried_short", shortfall });
          down(shortfall, "not enough UP$ for the delivery bike");
          hustleScene("down");
        },
        passBike: () => {
          set((s) => ({ hustle: { ...s.hustle, bikeOutcome: "passed" } }));
          track("choice_made", { decision: "bike_offer", choice: "passed" });
          recoveryDone("passed_on_offer");
          finishMission2();
        },
        startRecovery: () => {
          track("recovery_started", { shortfall: get().hustle.downAmount });
          hustleScene("recovery");
        },
        chooseRecovery: (path) => {
          set((s) => ({ hustle: { ...s.hustle, recoveryPath: path } }));
          track("choice_made", { decision: "recovery", choice: path });
          switch (path) {
            case "job":
              set((s) => ({ hustle: { ...s.hustle, jobReturn: "recovery" } }));
              hustleScene("hub");
              return;
            case "community":
              set((s) => ({ hustle: { ...s.hustle, jobReturn: "recovery" } }));
              get().selectJob("sweep");
              return;
            case "return": {
              const refund = SNEAKER_PRICE - RETURN_FEE;
              set((s) => ({
                ups: s.ups + refund,
                collection: s.collection.filter((i) => i !== "drop-sneakers"),
                avatar: s.avatar && s.avatar.shoes === "drop-sneakers" ? { ...s.avatar, shoes: "hightops" } : s.avatar,
                ledger: { ...s.ledger, spent: s.ledger.spent - refund },
              }));
              track("money_earned", { amount: refund, source: "returned_sneakers", fee: RETURN_FEE, balance: get().ups });
              fx().push({ kind: "ups", text: `+$${refund} UP$ back` });
              cue("recovery");
              hustleScene("offer");
              return;
            }
            case "change-plan":
              set((s) => ({ hustle: { ...s.hustle, bikeOutcome: "passed" } }));
              addStack(5, "adjusted the plan");
              recoveryDone("changed_plan");
              finishMission2();
              return;
            case "wait":
              set((s) => ({ hustle: { ...s.hustle, bikeOutcome: "postponed" } }));
              recoveryDone("waited_for_next_opportunity");
              finishMission2();
              return;
          }
        },
        chooseCourt: (choice) => {
          track("choice_made", { decision: "block_court", choice, balance: get().ups });
          if (choice === "earn-first") {
            set((s) => ({ hustle: { ...s.hustle, jobReturn: "court" } }));
            hustleScene("hub");
            return;
          }
          set((s) => ({ hustle: { ...s.hustle, courtChoice: choice } }));
          if (choice === "invest" && get().ups >= COURT_CONTRIBUTION) {
            spend(COURT_CONTRIBUTION, "block-court-repair", true);
            addRipple(25, "restored the Block Court");
            restoreCourt("player_contribution");
            hustleScene("transform");
            return;
          }
          hustleScene("court_result");
        },
        finishCourt: () => {
          completeMission("block-needs-you");
          startMission("your-next-move");
          earn(PAYDAY, "weekly_payday");
          set((s) => ({ hustle: { ...s.hustle, jobReturn: "mission" } }));
          hustleScene("next_move");
        },
        commitNextMove: ({ goal, block, keep }) => {
          set((s) => ({ hustle: { ...s.hustle, finalMove: { goal, block, keep } } }));
          track("choice_made", { decision: "your_next_move", goal, block, keep, balance: get().ups });
          if (goal >= HEADPHONES_PRICE) {
            spend(HEADPHONES_PRICE, "studio-headphones");
            unlockItem("studio-headphones");
          } else if (goal > 0) {
            set((s) => ({ hustle: { ...s.hustle, goalJar: goal } }));
            addStack(goal, "saved toward goal");
          }
          if (block > 0) {
            spend(block, get().world.courtRestored ? "block-mural" : "block-court-repair", true);
            addRipple(block * 2, "invested in the block");
            if (block >= MURAL_PRICE) {
              if (get().world.courtRestored) {
                set((s) => ({ world: { ...s.world, muralPainted: true, activeNpcs: s.world.activeNpcs + 1 } }));
                track("world_state_changed", { change: "mural_painted" });
                unlockItem("block-mural");
                cue("transform");
              } else restoreCourt("final_move");
            }
          }
          if (keep > 0) addStack(keep, "kept money");
          completeMission("your-next-move");
          unlockItem("block-pack");
          unlockItem("badge-made-movz");
          unlockZone("scamaland");
          set({ scamState: "SCAMALAND_ENTRY" });
          hustleScene("complete");
          cue("unlock");
        },

        // ---------------- Scamaland ----------------
        enterScamaland: () => {
          track("scamland_entered", {}, null);
          track("zone_entered", { zone: "scamaland" }, null);
          cue("zone");
          if (get().scam.scene === "entry") scamScene("entry");
        },
        beginScamaland: () => {
          startMission("too-good-to-be-true");
          scamScene("m1_explore");
          cue("scam-warning");
        },
        inspect: (hotspot, flag) => {
          const g = get();
          if (!g.scam.inspected.includes(hotspot)) {
            set((s) => ({ scam: { ...s.scam, inspected: [...s.scam.inspected, hotspot] }, scamState: "CLUE_DISCOVERED" }));
            track("clue_discovered", { clue: hotspot });
          }
          if (flag && !get().scamRadar.includes(flag)) {
            set((s) => ({ scamRadar: [...s.scamRadar, flag], scamState: "RED_FLAG_ADDED" }));
            track("red_flag_collected", { flag, total: get().scamRadar.length });
            fx().push({ kind: "toast", text: `🚩 Red flag: ${RED_FLAGS[flag].name}` });
            cue("red-flag");
          }
        },
        scamDecide: (decision) => {
          const g = get();
          set((s) => ({ scam: { ...s.scam, m1Decision: decision } }));
          track("scam_decision_made", { mission: "too-good-to-be-true", decision, flags: g.scamRadar.length, clues: g.scam.inspected.length });
          if (decision === "proceed") {
            const fee = Math.min(10, g.ups);
            spend(fee, "starter-kit-fee");
            down(10, "paid an upfront fee to a fake opportunity");
          } else {
            addStack(10, "walked away from a scam");
            if (decision === "report") addRipple(10, "reported a scam to protect others");
          }
          scamScene("m1_result");
        },
        scamRecover: () => {
          track("recovery_started", { mission: "too-good-to-be-true" });
          set((s) => ({ scam: { ...s.scam, m1Recovered: true } }));
          track("scam_recovery_completed", { mission: "too-good-to-be-true", action: "reported_and_told_adult" });
          track("recovery_completed", { how: "reported_and_told_adult" });
          addRipple(5, "reported the booth");
          cue("recovery");
        },
        finishScamMission1: () => {
          completeMission("too-good-to-be-true");
          unlockItem("badge-scam-spotter");
          startMission("shark-bank");
          scamScene("m2_contract");
        },
        revealClause: (clause, flag) => {
          if (!get().scam.contractRevealed.includes(clause)) {
            set((s) => ({ scam: { ...s.scam, contractRevealed: [...s.scam.contractRevealed, clause] } }));
            track("clue_discovered", { clue: clause, mission: "shark-bank" });
            cue("tap");
          }
          if (flag) get().inspect(`contract-${clause}`, flag);
        },
        sharkDecide: (decision) => {
          set((s) => ({ scam: { ...s.scam, m2Decision: decision } }));
          track("scam_decision_made", { mission: "shark-bank", decision, clausesRead: get().scam.contractRevealed.length });
          if (decision === "sign") down(70, "signed a $100 loan that costs $170 in 2 weeks");
          else {
            addStack(10, "avoided predatory loan");
            unlockItem("badge-shark-proof");
          }
          scamScene("m2_result");
        },
        finishScamMission2: () => {
          completeMission("shark-bank");
          startMission("get-out");
          track("recovery_started", { mission: "get-out" });
          scamScene("m3_getout");
        },
        getOutAction: (action, good) => {
          const g = get();
          if (!good) {
            set((s) => ({ scam: { ...s.scam, m3Slips: s.scam.m3Slips + 1 } }));
            track("choice_made", { decision: "get_out", choice: action, safe: false });
            down(15, `risky move: ${action}`);
            return;
          }
          if (g.scam.m3Done.includes(action)) return;
          const m3Done = [...g.scam.m3Done, action];
          set((s) => ({ scam: { ...s.scam, m3Done } }));
          track("choice_made", { decision: "get_out", choice: action, safe: true });
          cue("recovery");
          if (m3Done.length >= 5) {
            track("scam_recovery_completed", { mission: "get-out", slips: get().scam.m3Slips });
            track("recovery_completed", { how: "get_out_sequence" });
            addRipple(10, "reported a scam");
            completeMission("get-out");
            unlockItem("badge-got-out");
            scamScene("complete");
          }
        },
      };
    },
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      version: 1,
      partialize: (s) => {
        // Persist data only, never functions.
        const data: Partial<GameStore> = {};
        for (const [k, v] of Object.entries(s)) if (typeof v !== "function") (data as Record<string, unknown>)[k] = v;
        return data as GameData;
      },
    },
  ),
);

export const zoneDef = (id: ZoneId) => ZONES.find((z) => z.id === id);
