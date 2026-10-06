import { RESIDENTS } from "@/game/content";
import type { WorldState } from "@/game/types";
import Avatar from "./Avatar";

export function Storefront({
  name,
  sign,
  color,
  icon,
  locked,
  dim,
  className = "",
}: {
  name: string;
  sign?: string;
  color: string;
  icon: string;
  locked?: boolean;
  dim?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-t-2xl border-2 border-b-0 ${className}`} style={{ borderColor: locked ? "#3a347a" : color, background: "#211c4a" }}>
      <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-center font-display text-[11px] leading-tight sm:text-sm" style={{ background: locked ? "#2a2556" : color, color: locked ? "#b3aed6" : "#12101f" }}>
        <span aria-hidden>{icon}</span>
        <span className="truncate">{name}</span>
      </div>
      <div className={`grid flex-1 grid-cols-3 gap-1.5 p-2 ${dim ? "opacity-40" : ""}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-sm" style={{ background: locked ? "#2b2758" : i % 4 === 1 ? "#5ee7ff55" : "#ffd23f66" }} />
        ))}
      </div>
      <div className="mx-auto h-8 w-8 rounded-t-lg sm:h-10 sm:w-10" style={{ background: locked ? "#2b2758" : "#12101f" }} />
      {sign && (
        <div className="absolute right-1 top-9 rotate-6 rounded bg-ink px-1.5 py-0.5 text-[10px] font-black text-bg shadow">{sign}</div>
      )}
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/50 text-center">
          <div className="text-xl" aria-hidden>
            🔒
          </div>
          <div className="text-[10px] font-black tracking-widest text-muted">COMING SOON</div>
        </div>
      )}
    </div>
  );
}

/** The Block Court. Its look is driven entirely by world state, so it visibly remembers the player's moves. */
export function Court({ world, className = "", showNpcs = true, npcSize = 64 }: { world: WorldState; className?: string; showNpcs?: boolean; npcSize?: number }) {
  const lit = world.lightsOn;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-1000 ${className}`}
      style={{
        borderColor: lit ? "#3ce0b0" : "#3a347a",
        background: lit ? "linear-gradient(180deg,#1f4a6b 0%,#1b5a4a 100%)" : "linear-gradient(180deg,#1b1838 0%,#24213f 100%)",
      }}
      aria-label={lit ? "The Block Court, restored with lights on" : "The Block Court, run down and dark"}
      role="img"
    >
      {/* lights */}
      <div className="absolute inset-x-6 top-2 flex justify-between">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`h-3 w-8 rounded-full ${lit ? "flicker-on bg-gold shadow-[0_0_30px_10px_rgba(255,210,63,0.5)]" : "bg-[#3a3550]"}`} />
            <div className="h-12 w-1 bg-[#4a4570]" />
          </div>
        ))}
      </div>
      {/* mural */}
      {world.muralPainted && (
        <div className="absolute inset-x-[30%] top-3 flex h-10 items-center justify-center rounded-md bg-[linear-gradient(90deg,#ff5fa2,#ffd23f,#b8ff3c,#5ee7ff)] font-display text-[10px] text-bg pop-in">
          THE BLOCK
        </div>
      )}
      {/* court floor */}
      <div className="absolute inset-x-3 bottom-3 top-16 rounded-xl border-2" style={{ borderColor: lit ? "#ffffffaa" : "#ffffff22", background: lit ? "#d9773b" : "#4a3f3a" }}>
        <div className="absolute inset-y-0 left-1/2 w-0.5" style={{ background: lit ? "#fff" : "#ffffff22" }} />
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" style={{ borderColor: lit ? "#fff" : "#ffffff22" }} />
        {!world.courtRestored && (
          <>
            <div className="absolute left-[15%] top-[30%] text-lg" aria-hidden>
              🥤
            </div>
            <div className="absolute right-[20%] top-[55%] text-lg" aria-hidden>
              📄
            </div>
            <div className="absolute left-[40%] bottom-[10%] h-1 w-16 rotate-12 bg-[#2a2320]" />
          </>
        )}
      </div>
      {/* hoops */}
      {[0, 1].map((i) => (
        <div key={i} className={`absolute top-14 ${i ? "right-1" : "left-1"} flex flex-col items-center`}>
          <div className="h-6 w-8 rounded-sm border-2 border-white/70 bg-white/10" />
          <div className={`-mt-1 h-3 w-5 ${world.courtRestored ? "border-x-2 border-b-2 border-white/80" : ""}`} />
        </div>
      ))}
      {showNpcs && world.courtRestored && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
          {RESIDENTS.slice(0, Math.min(RESIDENTS.length, world.activeNpcs)).map((r, i) => (
            <div key={r.name} className="fade-in" style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
              <Avatar avatar={r} size={npcSize} mood={i % 2 ? "celebrate" : "walk"} label={`${r.name}, block resident`} />
            </div>
          ))}
        </div>
      )}
      <div className="absolute bottom-1 left-2 font-display text-[10px] tracking-widest text-white/70">BLOCK COURT</div>
    </div>
  );
}
