import type { ReactNode } from "react";
import { CAST, type CastId } from "@/game/content";
import type { AvatarMood } from "@/game/types";
import Avatar from "./Avatar";

/** An NPC line: portrait + speech bubble. Characters react, they don't lecture. */
export default function Speech({
  who,
  children,
  mood = "idle",
  className = "",
}: {
  who: CastId;
  children: ReactNode;
  mood?: AvatarMood;
  className?: string;
}) {
  const c = CAST[who];
  const scam = c.world === "scamaland";
  return (
    <div className={`flex items-end gap-3 slide-up ${className}`}>
      <div className="shrink-0">
        <Avatar avatar={c.look} size={92} mood={mood} label={c.name} />
      </div>
      <div
        className={`relative mb-4 rounded-2xl rounded-bl-sm px-4 py-3 text-base leading-snug shadow-lg ${
          scam ? "bg-[#2b1240] text-ink border border-pink/60" : "bg-ink text-bg"
        }`}
      >
        <div className={`mb-0.5 text-xs font-black uppercase tracking-wider ${scam ? "text-pink" : "text-violet"}`}>
          {c.name} <span className="font-semibold normal-case opacity-70">· {c.role}</span>
        </div>
        <div className="font-semibold">{children}</div>
      </div>
    </div>
  );
}
