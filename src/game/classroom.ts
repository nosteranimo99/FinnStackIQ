"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MissionId } from "./types";

// Teacher Mode (Brief §35–37). Deliberately lightweight: classes live in this browser for the demo,
// and the seeded class is mock data. No grading, no rankings.

export interface ClassRoom {
  code: string;
  name: string;
  createdAt: number;
  seeded?: boolean;
}

export interface MockStudent {
  id: string;
  name: string;
  completed: MissionId[];
  ups: number;
  stack: number;
  ripple: number;
  downs: number;
  recoveries: number;
  enteredScamaland: boolean;
  redFlags: number;
  lastActiveMins: number;
  live?: boolean;
}

export const SEEDED_CLASS: ClassRoom = { code: "MUVZ7A", name: "Ms. Rivera · 7th Grade, Period 3", createdAt: 0, seeded: true };

const NAMES = [
  "Amari", "Bella", "Carlos", "Destiny", "Eli", "Fatima", "Gabe", "Hana", "Isaiah", "Jada", "Kenji", "Luna",
  "Malik", "Nia", "Omar", "Priya", "Quinn", "Rosa", "Sam", "Tasha", "Uriel", "Vivian", "Wes", "Zoe",
];

const HUSTLE: MissionId[] = ["find-a-hustle", "make-your-move", "block-needs-you", "your-next-move"];
const SCAM: MissionId[] = ["too-good-to-be-true", "shark-bank", "get-out"];

// Deterministic PRNG so the seeded class looks the same on every load.
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededStudents(): MockStudent[] {
  const rand = mulberry32(7);
  // Exactly 18 finished Hustle Block and 11 entered Scamaland, matching the brief's example card.
  return NAMES.map((name, idx) => {
    const finishedHustle = idx < 18;
    const hustleDone = finishedHustle ? 4 : Math.floor(rand() * 4);
    const entered = idx < 11;
    const scamDone = entered ? 1 + Math.floor(rand() * 3) : 0;
    const completed = [...HUSTLE.slice(0, hustleDone), ...SCAM.slice(0, scamDone)];
    const downs = Math.floor(rand() * 3);
    return {
      id: `s${idx}`,
      name: `${name} ${String.fromCharCode(65 + Math.floor(rand() * 26))}.`,
      completed,
      ups: 5 + Math.floor(rand() * 40),
      stack: 15 + completed.length * 12 + Math.floor(rand() * 20),
      ripple: Math.floor(rand() * (hustleDone >= 3 ? 60 : 15)),
      downs,
      recoveries: Math.min(downs, Math.floor(rand() * 3)),
      enteredScamaland: entered,
      redFlags: entered ? 2 + Math.floor(rand() * 6) : 0,
      lastActiveMins: Math.floor(rand() * 60 * 48),
    };
  });
}

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface TeacherStore {
  classes: ClassRoom[];
  createClass: (name: string) => ClassRoom;
}

export const useTeacher = create<TeacherStore>()(
  persist(
    (set) => ({
      classes: [],
      createClass: (name) => {
        const room = { code: makeCode(), name, createdAt: Date.now() };
        set((s) => ({ classes: [...s.classes, room] }));
        return room;
      },
    }),
    { name: "money-muvz:teacher", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

export function findClass(code: string, classes: ClassRoom[]): ClassRoom | undefined {
  const c = code.trim().toUpperCase();
  if (c === SEEDED_CLASS.code) return SEEDED_CLASS;
  return classes.find((k) => k.code === c);
}
