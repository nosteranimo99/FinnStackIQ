"use client";

import { useFx, type FxKind } from "@/game/fx";

const STYLE: Record<FxKind, string> = {
  ups: "bg-gold text-bg",
  stack: "bg-violet text-bg",
  ripple: "bg-cyan text-bg",
  down: "bg-orange text-bg",
  toast: "bg-pink text-bg",
  unlock: "bg-lime text-bg",
};

/** Floating reward chips: "UP$ flies into wallet", meters pop, ripples expand (Brief §26). */
export default function FxLayer() {
  const items = useFx((s) => s.items);
  const floats = items.filter((i) => i.kind !== "toast" && i.kind !== "unlock");
  const toasts = items.filter((i) => i.kind === "toast" || i.kind === "unlock").slice(-3);
  const rippling = items.some((i) => i.kind === "ripple");
  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-live="polite">
      {rippling && (
        <div className="absolute left-1/2 top-1/2">
          <div className="ripple-ring" />
          <div className="ripple-ring" style={{ animationDelay: "0.4s" }} />
        </div>
      )}
      <div className="absolute left-1/2 top-24 w-0">
        {floats.map((f, i) => (
          <div
            key={f.id}
            className={`fx-float absolute left-0 whitespace-nowrap rounded-full px-4 py-1.5 font-display text-lg shadow-lg ${STYLE[f.kind]}`}
            style={{ top: i * 8 }}
          >
            {f.text}
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div key={t.id} className={`pop-in rounded-2xl px-5 py-3 text-center font-bold shadow-xl ${STYLE[t.kind]}`}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
