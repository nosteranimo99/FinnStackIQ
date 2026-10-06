// Tiny synthesized sound kit (Web Audio, no asset files) so the game ships light on school Chromebooks.
// Every cue maps to a row in the Build Brief §27 sound table.

export type Cue =
  | "mission"
  | "earn"
  | "stack"
  | "ripple"
  | "down"
  | "recovery"
  | "unlock"
  | "zone"
  | "scam-warning"
  | "red-flag"
  | "complete"
  | "transform"
  | "tap";

type Note = [freq: number, start: number, dur: number, type?: OscillatorType, gain?: number];

const CUES: Record<Cue, Note[]> = {
  mission: [
    [392, 0, 0.09, "square", 0.05],
    [523, 0.09, 0.09, "square", 0.05],
    [784, 0.18, 0.16, "square", 0.05],
  ],
  earn: [
    [988, 0, 0.07, "square", 0.05],
    [1319, 0.07, 0.18, "square", 0.05],
  ],
  stack: [
    [440, 0, 0.08, "triangle", 0.08],
    [554, 0.08, 0.08, "triangle", 0.08],
    [659, 0.16, 0.14, "triangle", 0.08],
  ],
  ripple: [
    [660, 0, 0.5, "sine", 0.06],
    [880, 0.12, 0.5, "sine", 0.05],
    [1320, 0.24, 0.6, "sine", 0.04],
  ],
  down: [
    [220, 0, 0.18, "triangle", 0.08],
    [175, 0.18, 0.3, "triangle", 0.08],
  ],
  recovery: [
    [330, 0, 0.1, "triangle", 0.07],
    [440, 0.1, 0.1, "triangle", 0.07],
    [660, 0.2, 0.22, "triangle", 0.07],
  ],
  unlock: [
    [523, 0, 0.08, "square", 0.04],
    [659, 0.08, 0.08, "square", 0.04],
    [784, 0.16, 0.08, "square", 0.04],
    [1047, 0.24, 0.25, "square", 0.04],
  ],
  zone: [
    [294, 0, 0.2, "sawtooth", 0.03],
    [440, 0.2, 0.2, "sawtooth", 0.03],
    [587, 0.4, 0.4, "sawtooth", 0.03],
  ],
  "scam-warning": [
    [740, 0, 0.12, "sine", 0.04],
    [740, 0.2, 0.12, "sine", 0.04],
  ],
  "red-flag": [
    [880, 0, 0.08, "square", 0.04],
    [660, 0.09, 0.08, "square", 0.04],
    [880, 0.18, 0.12, "square", 0.04],
  ],
  complete: [
    [523, 0, 0.1, "square", 0.05],
    [659, 0.1, 0.1, "square", 0.05],
    [784, 0.2, 0.1, "square", 0.05],
    [1047, 0.3, 0.12, "square", 0.05],
    [784, 0.42, 0.08, "square", 0.05],
    [1047, 0.5, 0.35, "square", 0.05],
  ],
  transform: [
    [196, 0, 1.2, "sine", 0.07],
    [294, 0.2, 1.1, "sine", 0.06],
    [392, 0.4, 1.0, "sine", 0.05],
    [587, 0.6, 0.9, "sine", 0.04],
    [784, 0.8, 0.8, "sine", 0.03],
  ],
  tap: [[660, 0, 0.04, "square", 0.025]],
};

let ctx: AudioContext | null = null;

export function playCue(cue: Cue, muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    for (const [freq, start, dur, type = "sine", gain = 0.05] of CUES[cue]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(gain, now + start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    }
  } catch {
    // Sound is optional; never let audio break play.
  }
}
