"use client";

import Avatar from "@/components/Avatar";
import GameShell from "@/components/GameShell";
import { COLLECTION_CATEGORIES, ITEMS } from "@/game/content";
import { useGame } from "@/game/store";
import type { ItemId } from "@/game/types";

/** The Muvz Collection (Brief §44): earned in play, never bought with real money. */
function Collection() {
  const g = useGame();
  const avatar = g.avatar!;
  const all = Object.values(ITEMS);
  const owned = (id: ItemId) => g.collection.includes(id);

  const equip = (id: ItemId) => {
    const e = ITEMS[id].equip;
    if (!e) return;
    if (e.slot === "shoes") g.updateAvatar({ shoes: avatar.shoes === e.value ? "hightops" : e.value });
    else g.updateAvatar({ accessory: avatar.accessory === e.value ? "none" : e.value });
    g.cue("unlock");
  };
  const isEquipped = (id: ItemId) => {
    const e = ITEMS[id].equip;
    return !!e && (e.slot === "shoes" ? avatar.shoes === e.value : avatar.accessory === e.value);
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-3 py-6 sm:px-4 md:grid-cols-[260px_1fr]">
      <div className="flex flex-col items-center gap-3 md:sticky md:top-24 md:self-start">
        <h1 className="font-display text-3xl text-lime">MUVZ COLLECTION</h1>
        <Avatar avatar={avatar} size={240} mood="idle" />
        <div className="panel w-full p-4 text-center">
          <div className="text-xs font-black tracking-widest text-muted">COLLECTED</div>
          <div className="font-display text-4xl">
            {g.collection.length}
            <span className="text-xl text-muted">/{all.length}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-bg">
            <div className="meter-fill h-full rounded-full bg-lime" style={{ width: `${(g.collection.length / all.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {COLLECTION_CATEGORIES.map((cat) => {
          const items = all.filter((i) => i.category === cat.id);
          return (
            <section key={cat.id}>
              <h2 className="mb-2 font-display text-lg">
                {cat.label.toUpperCase()}{" "}
                <span className="text-sm text-muted">
                  {items.filter((i) => owned(i.id)).length}/{items.length}
                </span>
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((i) => {
                  const has = owned(i.id);
                  return (
                    <div key={i.id} className={`panel flex flex-col items-center gap-1 p-4 text-center ${has ? "" : "opacity-50"}`}>
                      <div className={`text-5xl ${has ? "" : "grayscale"}`} aria-hidden>
                        {has ? i.icon : "❔"}
                      </div>
                      <div className="font-bold leading-tight">{has ? i.name : "Locked"}</div>
                      <div className="text-xs text-muted">{i.how}</div>
                      {has && i.equip && (
                        <button type="button" onClick={() => equip(i.id)} className={`btn mt-1 min-h-9 px-3 py-1 text-sm ${isEquipped(i.id) ? "btn-primary" : "btn-ghost"}`}>
                          {isEquipped(i.id) ? "Equipped ✓" : "Equip"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        <p className="text-center text-sm text-muted">Every item is earned by playing. No real money, ever.</p>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  return (
    <GameShell>
      <Collection />
    </GameShell>
  );
}
