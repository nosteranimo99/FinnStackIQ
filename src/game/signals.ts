import type { GameData, GameEvent } from "./types";

// Behavior signals (Build Brief §31) derived purely from the event log.
// No AI runs here: this is the ACTION → DECISION → OUTCOME → BEHAVIOR SIGNAL foundation
// a future personalization layer would read.

export type Level = "none" | "low" | "medium" | "high";

export interface Signal {
  id: string;
  group: "financial" | "gameplay";
  label: string;
  level: Level;
  value: string;
  evidence: string;
}

export interface Adaptation {
  trigger: string;
  next: string;
  active: boolean;
}

const count = (events: GameEvent[], pred: (e: GameEvent) => boolean) => events.filter(pred).length;
const choice = (e: GameEvent, decision: string, c?: string) =>
  e.type === "choice_made" && e.data?.decision === decision && (c === undefined || e.data?.choice === c);

const level = (n: number, med: number, high: number): Level => (n <= 0 ? "none" : n >= high ? "high" : n >= med ? "medium" : "low");

export function deriveSignals(g: GameData): Signal[] {
  const ev = g.events;

  const impulsive =
    count(ev, (e) => choice(e, "corner_shop", "buy-now")) +
    count(ev, (e) => choice(e, "bike_offer", "tried_short")) +
    count(ev, (e) => e.type === "scam_decision_made" && (e.data?.decision === "proceed" || e.data?.decision === "sign"));
  const saving =
    count(ev, (e) => choice(e, "corner_shop", "hold")) +
    count(ev, (e) => e.type === "stack_changed" && (e.data?.reason === "kept money" || e.data?.reason === "saved toward goal"));
  const downs = count(ev, (e) => e.type === "down_triggered");
  const overspendDowns = count(ev, (e) => e.type === "down_triggered" && String(e.data?.reason ?? "").includes("UP$"));
  const recoveries = count(ev, (e) => e.type === "recovery_completed");
  const jobs = count(ev, (e) => e.type === "job_completed");
  const extraEarning =
    Math.max(0, jobs - 2) + count(ev, (e) => choice(e, "recovery", "job") || choice(e, "block_court", "earn-first"));
  const community = count(ev, (e) => e.type === "ripple_changed");
  const scamDecisions = ev.filter((e) => e.type === "scam_decision_made");
  const safeScam = scamDecisions.filter((e) => e.data?.decision !== "proceed" && e.data?.decision !== "sign").length;
  const missionsAfterDown = (() => {
    const firstDown = ev.find((e) => e.type === "down_triggered");
    return firstDown ? count(ev, (e) => e.type === "mission_completed" && e.t >= firstDown.t) : 0;
  })();

  const clues = count(ev, (e) => e.type === "clue_discovered");
  const zones = new Set(ev.filter((e) => e.type === "zone_entered").map((e) => e.data?.zone)).size;
  const repeatJobs = Object.values(g.jobsDone).filter((n) => n > 1).length;
  const started = new Set(ev.filter((e) => e.type === "mission_started").map((e) => e.mission));
  const abandoned = [...started].filter((m) => m && !g.completedMissions.includes(m) && m !== g.activeMission).length;
  const sessions = new Set(ev.filter((e) => e.type === "session_started").map((e) => e.sessionId)).size;
  const jobCounts = ev
    .filter((e) => e.type === "job_selected")
    .reduce<Record<string, number>>((acc, e) => ({ ...acc, [String(e.data?.job)]: (acc[String(e.data?.job)] ?? 0) + 1 }), {});
  const favorite = Object.entries(jobCounts).sort((a, b) => b[1] - a[1])[0];

  // Hesitation: average seconds from a mission starting to the first decision inside it.
  const waits: number[] = [];
  for (const s of ev.filter((e) => e.type === "mission_started")) {
    const d = ev.find((e) => (e.type === "choice_made" || e.type === "scam_decision_made") && e.t > s.t && e.mission === s.mission);
    if (d) waits.push((d.t - s.t) / 1000);
  }
  const avgWait = waits.length ? Math.round(waits.reduce((a, b) => a + b, 0) / waits.length) : 0;

  return [
    { id: "impulsive", group: "financial", label: "Impulsive spending", level: level(impulsive, 1, 3), value: `${impulsive} quick buys`, evidence: "Bought on the spot, tried to buy short, or took a risky offer." },
    { id: "saving", group: "financial", label: "Saving tendency", level: level(saving, 1, 3), value: `${saving} saving moves`, evidence: "Held money, kept UP$, or set money aside for a goal." },
    { id: "overspend", group: "financial", label: "Repeated overspending", level: level(overspendDowns, 2, 3), value: `${overspendDowns} shortfalls`, evidence: "Came up short on UP$ after spending." },
    { id: "recovery", group: "financial", label: "Recovery behavior", level: downs === 0 ? "none" : level(recoveries, 1, Math.max(2, downs)), value: `${recoveries}/${downs} DOWN$ recovered`, evidence: "Took action after a consequence instead of quitting." },
    { id: "earn-more", group: "financial", label: "Willingness to earn more", level: level(extraEarning, 1, 3), value: `${extraEarning} extra hustles`, evidence: "Chose to work for it: extra jobs or 'earn more first'." },
    { id: "community", group: "financial", label: "Community-oriented choices", level: level(community, 2, 4), value: `${community} RIPPLE moves`, evidence: "Spent or acted in ways that helped the block." },
    { id: "risk", group: "financial", label: "Risk sensitivity", level: scamDecisions.length === 0 ? "none" : safeScam === scamDecisions.length ? "high" : safeScam > 0 ? "medium" : "low", value: `${safeScam}/${scamDecisions.length} safe scam calls`, evidence: "Walked away, reported, or asked an adult." },
    { id: "persistence", group: "financial", label: "Persistence", level: level(missionsAfterDown, 1, 3), value: `${missionsAfterDown} missions after a DOWN$`, evidence: "Kept going after things went sideways." },
    { id: "exploration", group: "gameplay", label: "Exploration", level: level(clues + zones, 4, 9), value: `${clues} clues · ${zones} zones`, evidence: "Inspected objects and visited places." },
    { id: "hesitation", group: "gameplay", label: "Hesitation", level: waits.length === 0 ? "none" : avgWait > 90 ? "high" : avgWait > 30 ? "medium" : "low", value: waits.length ? `${avgWait}s avg to decide` : "no decisions yet", evidence: "Time between a mission starting and the first move." },
    { id: "attempts", group: "gameplay", label: "Repeated attempts", level: level(repeatJobs, 1, 2), value: `${repeatJobs} jobs replayed`, evidence: "Came back to the same activity." },
    { id: "completion", group: "gameplay", label: "Mission completion", level: level(g.completedMissions.length, 2, 5), value: `${g.completedMissions.length}/7 missions`, evidence: "Missions finished end to end." },
    { id: "abandonment", group: "gameplay", label: "Abandonment", level: level(abandoned, 1, 2), value: `${abandoned} missions left open`, evidence: "Started but not finished." },
    { id: "return", group: "gameplay", label: "Return frequency", level: level(sessions, 2, 4), value: `${sessions} sessions`, evidence: "Came back to the block." },
    { id: "preferred", group: "gameplay", label: "Preferred activity", level: favorite ? "medium" : "none", value: favorite ? `${favorite[0]} (${favorite[1]}x)` : "none yet", evidence: "Most-picked mini-job." },
  ];
}

/** Brief §32 examples, evaluated as plain rules. A future AI layer replaces these. */
export function deriveAdaptations(signals: Signal[], g: GameData): Adaptation[] {
  const s = Object.fromEntries(signals.map((x) => [x.id, x]));
  const atLeast = (id: string, lv: Level) => ["none", "low", "medium", "high"].indexOf(s[id].level) >= ["none", "low", "medium", "high"].indexOf(lv);
  const scamCalls = g.events.filter((e) => e.type === "scam_decision_made");
  return [
    {
      trigger: "Repeatedly overspends",
      next: "Smaller budget with a stronger tradeoff in the next mission.",
      active: atLeast("impulsive", "medium") || atLeast("overspend", "medium"),
    },
    {
      trigger: "Consistently saves",
      next: "A larger financial decision with more on the line.",
      active: atLeast("saving", "medium"),
    },
    {
      trigger: "Skips community opportunities",
      next: "A mission where personal and community outcomes are connected.",
      active: g.completedMissions.includes("block-needs-you") && !atLeast("community", "medium"),
    },
    {
      trigger: "Struggles with scam recognition",
      next: "Slower Scamaland mission with extra environmental clues.",
      active: scamCalls.some((e) => e.data?.decision === "proceed" || e.data?.decision === "sign" || Number(e.data?.flags ?? 7) < 3),
    },
  ];
}
