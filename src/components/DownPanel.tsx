import type { ReactNode } from "react";

/**
 * DOWN$ is a consequence indicator, not a second currency (Brief §8):
 * consequence + explanation + recovery. Never shame, never a dead end.
 */
export default function DownPanel({
  amount,
  what,
  why,
  next,
  children,
}: {
  amount: number;
  what: string;
  why: string;
  next: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel mx-auto w-full max-w-xl overflow-hidden pop-in" role="status">
      <div className="flex items-center justify-between bg-orange/15 px-5 py-4">
        <div className="font-display text-3xl text-orange shake">−${amount} DOWN$</div>
        <div className="text-3xl" aria-hidden>
          📉
        </div>
      </div>
      <dl className="space-y-3 px-5 py-4">
        <div>
          <dt className="text-xs font-black tracking-wider text-orange">WHAT HAPPENED</dt>
          <dd className="text-lg font-semibold">{what}</dd>
        </div>
        <div>
          <dt className="text-xs font-black tracking-wider text-gold">WHY</dt>
          <dd className="text-lg font-semibold">{why}</dd>
        </div>
        <div>
          <dt className="text-xs font-black tracking-wider text-lime">WHAT NEXT</dt>
          <dd className="text-lg font-semibold">{next}</dd>
        </div>
      </dl>
      {children && <div className="border-t border-line px-5 py-4">{children}</div>}
    </div>
  );
}
