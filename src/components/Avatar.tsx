import { HAIR_COLORS, SKIN_TONES } from "@/game/content";
import type { Avatar as AvatarT, AvatarMood } from "@/game/types";

// One SVG renderer for the player's Muv and every NPC, so the cast shares a single art system.
// Animation states are CSS classes (see globals.css): idle, walk, run, celebrate, disappointed,
// thinking, interact, recovery, unlock.

interface Props {
  avatar: AvatarT;
  mood?: AvatarMood;
  size?: number;
  className?: string;
  flip?: boolean;
  label?: string;
}

const PANTS = "#2a2a48";

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function Hair({ a }: { a: AvatarT }) {
  const c = HAIR_COLORS[a.hairColor];
  const cap = <path d="M31 42 C31 22 69 22 69 42 C66 32 58 28 50 28 C42 28 34 32 31 42 Z" fill={c} />;
  switch (a.hair) {
    case "fade":
      return <path d="M32 38 C32 22 68 22 68 38 L66 34 C60 29 40 29 34 34 Z" fill={c} />;
    case "puffs":
      return (
        <g fill={c}>
          <circle cx="31" cy="27" r="11" />
          <circle cx="69" cy="27" r="11" />
          {cap}
        </g>
      );
    case "braids":
      return (
        <g fill={c}>
          {cap}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle cx="31" cy={46 + i * 7} r="3.6" />
              <circle cx="69" cy={46 + i * 7} r="3.6" />
            </g>
          ))}
        </g>
      );
    case "curls":
      return (
        <g fill={c}>
          {[
            [33, 34], [37, 26], [44, 21], [50, 20], [56, 21], [63, 26], [67, 34], [40, 30], [60, 30], [50, 26],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6.5" />
          ))}
        </g>
      );
    case "bun":
      return (
        <g fill={c}>
          <circle cx="50" cy="17" r="9" />
          {cap}
        </g>
      );
    case "locs":
      return (
        <g fill={c}>
          {cap}
          {[30, 35, 65, 70].map((x, i) => (
            <rect key={i} x={x - 2.5} y="34" width="5" height={i % 2 ? 30 : 26} rx="2.5" />
          ))}
        </g>
      );
  }
}

function Face({ mood }: { mood: AvatarMood }) {
  const eyeY = 44;
  const eyes =
    mood === "celebrate" || mood === "unlock" ? (
      <g stroke="#1b1b22" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M40 45 Q43 41 46 45" />
        <path d="M54 45 Q57 41 60 45" />
      </g>
    ) : (
      <g fill="#1b1b22">
        <ellipse cx="43" cy={eyeY} rx="2.3" ry={mood === "disappointed" ? 1.6 : 2.6} />
        <ellipse cx="57" cy={eyeY} rx="2.3" ry={mood === "disappointed" ? 1.6 : 2.6} />
        <circle cx="43.8" cy={eyeY - 0.8} r="0.7" fill="#fff" />
        <circle cx="57.8" cy={eyeY - 0.8} r="0.7" fill="#fff" />
      </g>
    );
  let mouth = <path d="M44 51 Q50 55 56 51" stroke="#1b1b22" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
  if (mood === "celebrate" || mood === "unlock") mouth = <path d="M43 50 Q50 58 57 50 Z" fill="#1b1b22" />;
  if (mood === "disappointed") mouth = <path d="M45 54 Q50 50 55 54" stroke="#1b1b22" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
  if (mood === "thinking") mouth = <path d="M46 52 L54 51" stroke="#1b1b22" strokeWidth="1.8" strokeLinecap="round" />;
  if (mood === "run" || mood === "interact") mouth = <ellipse cx="50" cy="52" rx="2.6" ry="2" fill="#1b1b22" />;
  return (
    <g>
      {eyes}
      {mood === "disappointed" && (
        <g stroke="#1b1b22" strokeWidth="1.4" strokeLinecap="round">
          <path d="M39 39 L45 40.5" />
          <path d="M61 39 L55 40.5" />
        </g>
      )}
      {mouth}
    </g>
  );
}

function Shoe({ a, x }: { a: AvatarT; x: number }) {
  switch (a.shoes) {
    case "hightops":
      return (
        <g>
          <rect x={x - 1} y="134" width="14" height="10" rx="2" fill="#f4f4f8" />
          <rect x={x - 2} y="141" width="17" height="6" rx="3" fill="#f4f4f8" stroke="#d7d7e2" />
          <rect x={x - 1} y="137" width="14" height="2.5" fill={a.outfitColor} />
        </g>
      );
    case "runners":
      return (
        <g>
          <path d={`M${x - 2} 147 L${x - 2} 140 Q${x + 4} 137 ${x + 9} 140 L${x + 16} 143 L${x + 16} 147 Z`} fill={a.outfitColor} />
          <rect x={x - 2} y="145" width="18" height="3" rx="1.5" fill="#fff" />
        </g>
      );
    case "slides":
      return (
        <g>
          <rect x={x - 2} y="145" width="17" height="3.5" rx="1.75" fill="#333" />
          <rect x={x} y="140" width="12" height="5" rx="2" fill={a.outfitColor} />
        </g>
      );
    case "drop-sneakers":
      return (
        <g>
          <path d={`M${x - 2} 147 L${x - 2} 137 Q${x + 5} 134 ${x + 10} 139 L${x + 16} 142 L${x + 16} 147 Z`} fill="#ff5fa2" />
          <path d={`M${x} 141 L${x + 12} 143`} stroke="#ffd23f" strokeWidth="2" />
          <rect x={x - 2} y="145" width="18" height="3.5" rx="1.75" fill="#ffd23f" />
        </g>
      );
    case "hustle-runners":
      return (
        <g>
          <path d={`M${x - 2} 147 L${x - 2} 139 Q${x + 4} 136 ${x + 9} 139 L${x + 16} 142 L${x + 16} 147 Z`} fill="#b8ff3c" />
          <path d={`M${x + 3} 139 L${x + 6} 142 L${x + 4} 142 L${x + 7} 146`} stroke="#12101f" strokeWidth="1.3" fill="none" />
          <rect x={x - 2} y="145" width="18" height="3" rx="1.5" fill="#12101f" />
        </g>
      );
  }
}

function Torso({ a, skin }: { a: AvatarT; skin: string }) {
  const c = a.outfitColor;
  const dark = shade(c, -45);
  return (
    <g>
      {a.outfit === "hoodie" && <path d="M38 62 Q50 72 62 62 L62 66 Q50 76 38 66 Z" fill={dark} />}
      <rect x="31" y="62" width="38" height="46" rx="11" fill={c} />
      {a.outfit === "hoodie" && (
        <g>
          <rect x="38" y="88" width="24" height="10" rx="4" fill={dark} />
          <line x1="46" y1="68" x2="46" y2="80" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="54" y1="68" x2="54" y2="80" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
      {a.outfit === "jersey" && (
        <g>
          <path d="M42 62 Q50 72 58 62" fill={skin} />
          <rect x="31" y="100" width="38" height="4" fill={dark} />
          <text x="50" y="92" textAnchor="middle" fontSize="16" fontWeight="900" fill={dark} fontFamily="system-ui">
            7
          </text>
        </g>
      )}
      {a.outfit === "jacket" && (
        <g>
          <path d="M42 62 L50 74 L58 62" fill="#f4f4f8" />
          <line x1="50" y1="74" x2="50" y2="108" stroke={dark} strokeWidth="2" />
          <path d="M42 62 L47 78 L40 70 Z M58 62 L53 78 L60 70 Z" fill={dark} />
        </g>
      )}
      {a.outfit === "tee" && (
        <g>
          <path d="M43 62 Q50 68 57 62" fill={skin} />
          <circle cx="50" cy="84" r="6" fill="none" stroke={dark} strokeWidth="2.5" />
          <path d="M47 84 L50 80 L53 84" stroke={dark} strokeWidth="2" fill="none" />
        </g>
      )}
    </g>
  );
}

function Accessory({ a }: { a: AvatarT }) {
  const c = a.accessory;
  if (c === "cap")
    return (
      <g>
        <path d="M30 36 C30 18 70 18 70 36 Z" fill={shade(a.outfitColor, -30)} />
        <rect x="47" y="21" width="6" height="3" rx="1.5" fill="#fff" opacity="0.7" />
        <path d="M60 34 Q74 33 80 37 L60 38 Z" fill={shade(a.outfitColor, -55)} />
      </g>
    );
  if (c === "beanie")
    return (
      <g>
        <path d="M30 37 C30 15 70 15 70 37 Z" fill={a.outfitColor === "#24243a" ? "#ff5fa2" : "#24243a"} />
        <rect x="29" y="32" width="42" height="7" rx="3.5" fill={shade(a.outfitColor, -20)} />
        <circle cx="50" cy="14" r="4" fill="#f4f4f8" />
      </g>
    );
  if (c === "glasses")
    return (
      <g fill="none" stroke="#12101f" strokeWidth="1.8">
        <rect x="37" y="40" width="11" height="8" rx="3" fill="rgba(94,231,255,0.25)" />
        <rect x="52" y="40" width="11" height="8" rx="3" fill="rgba(94,231,255,0.25)" />
        <line x1="48" y1="43" x2="52" y2="43" />
      </g>
    );
  if (c === "headphones")
    return (
      <g>
        <path d="M29 44 C29 16 71 16 71 44" fill="none" stroke="#12101f" strokeWidth="4" />
        <rect x="25" y="38" width="9" height="14" rx="4" fill="#ff5fa2" />
        <rect x="66" y="38" width="9" height="14" rx="4" fill="#ff5fa2" />
      </g>
    );
  return null;
}

export default function Avatar({ avatar: a, mood = "idle", size = 160, className = "", flip, label }: Props) {
  const skin = SKIN_TONES[a.skin];
  const sleeve = a.outfit === "jersey" ? skin : a.outfitColor;
  return (
    <div
      className={`pointer-events-none relative inline-block ${className}`}
      style={{ width: (size * 100) / 170, height: size }}
      role="img"
      aria-label={label ?? `${a.name || "Your Muv"} (${mood})`}
    >
      {mood === "thinking" && (
        <div className="absolute -right-3 -top-2 z-10 rounded-full bg-white px-2 py-0.5 text-sm font-black text-bg pop-in">?</div>
      )}
      {(mood === "celebrate" || mood === "unlock") && (
        <div className="pointer-events-none absolute inset-x-0 -top-3 z-10 flex justify-center gap-3 text-lg">
          <span className="bounce-soft">✨</span>
          <span className="bounce-soft" style={{ animationDelay: "0.3s" }}>
            ✨
          </span>
        </div>
      )}
      <svg viewBox="0 0 100 170" width="100%" height="100%" className={`muv muv-${mood}`} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
        <ellipse cx="50" cy="160" rx="24" ry="4" fill="rgba(0,0,0,0.35)" />
        {a.accessory === "backpack" && (
          <g>
            <rect x="24" y="66" width="52" height="38" rx="10" fill="#3ce0b0" stroke="#1f8f6e" strokeWidth="2" />
          </g>
        )}
        {/* legs (with shoes so they swing together) */}
        <g className="leg-l">
          <rect x="37" y="104" width="11" height="38" rx="4" fill={PANTS} />
          <Shoe a={a} x={36} />
        </g>
        <g className="leg-r">
          <rect x="52" y="104" width="11" height="38" rx="4" fill={PANTS} />
          <Shoe a={a} x={51} />
        </g>
        {/* arms */}
        <g className="arm-l">
          <rect x="23" y="65" width="10" height="36" rx="5" fill={sleeve} />
          <circle cx="28" cy="102" r="5" fill={skin} />
        </g>
        <g className="arm-r">
          <rect x="67" y="65" width="10" height="36" rx="5" fill={sleeve} />
          <circle cx="72" cy="102" r="5" fill={skin} />
        </g>
        <rect x="45" y="56" width="10" height="9" fill={skin} />
        <Torso a={a} skin={skin} />
        {a.accessory === "backpack" && (
          <g stroke="#1f8f6e" strokeWidth="3">
            <line x1="36" y1="63" x2="38" y2="95" />
            <line x1="64" y1="63" x2="62" y2="95" />
          </g>
        )}
        {/* head */}
        <circle cx="31" cy="45" r="4" fill={skin} />
        <circle cx="69" cy="45" r="4" fill={skin} />
        <circle cx="50" cy="42" r="19" fill={skin} />
        <Hair a={a} />
        <Face mood={mood} />
        <circle cx="38" cy="50" r="2.5" fill="#ff5fa2" opacity="0.25" />
        <circle cx="62" cy="50" r="2.5" fill="#ff5fa2" opacity="0.25" />
        <Accessory a={a} />
      </svg>
    </div>
  );
}
