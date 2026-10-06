"use client";

import { create } from "zustand";
import type { Cue } from "./sound";

// Ephemeral, non-persisted feedback layer: floating "+$8 UP$" chips, ripple bursts, toasts.
// The game store pushes here whenever a meter moves so the HUD can animate it.

export type FxKind = "ups" | "stack" | "ripple" | "down" | "toast" | "unlock";

export interface Fx {
  id: number;
  kind: FxKind;
  text: string;
  cue?: Cue;
}

interface FxStore {
  items: Fx[];
  push: (fx: Omit<Fx, "id">) => void;
  remove: (id: number) => void;
}

let nextId = 1;

export const useFx = create<FxStore>((set) => ({
  items: [],
  push: (fx) => {
    const id = nextId++;
    set((s) => ({ items: [...s.items.slice(-6), { ...fx, id }] }));
    setTimeout(() => set((s) => ({ items: s.items.filter((i) => i.id !== id) })), fx.kind === "toast" || fx.kind === "unlock" ? 2600 : 1600);
  },
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));
