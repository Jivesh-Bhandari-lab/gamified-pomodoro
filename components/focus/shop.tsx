"use client"

import { Check, Coins, Lock } from "lucide-react"
import { RARITY_STYLES, SHOP_ITEMS, type ShopItem } from "@/lib/game-data"

type ShopProps = {
  points: number
  owned: string[]
  equippedTitle: string | null
  onPurchase: (item: ShopItem) => void
  onEquip: (id: string | null) => void
}

export function Shop({ points, owned, equippedTitle, onPurchase, onEquip }: ShopProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-white">Reward Vault</h2>
          <p className="text-xs text-slate-400">Spend points on titles &amp; badges</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5">
          <Coins className="h-4 w-4 text-amber-300" />
          <span className="text-sm font-bold tabular-nums text-amber-200">
            {points.toLocaleString()}
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {SHOP_ITEMS.map((item) => {
          const isOwned = owned.includes(item.id)
          const canAfford = points >= item.cost
          const rarity = RARITY_STYLES[item.rarity]
          const isEquipped = equippedTitle === item.id

          return (
            <li
              key={item.id}
              className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 ring-1 backdrop-blur transition ${rarity.ring} ${
                isOwned ? rarity.glow : ""
              }`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-900/60 text-2xl">
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-white">{item.name}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${rarity.text}`}>
                    {rarity.label}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-slate-400">{item.description}</p>
              </div>

              <div className="shrink-0">
                {isOwned ? (
                  item.kind === "title" ? (
                    <button
                      onClick={() => onEquip(isEquipped ? null : item.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                        isEquipped
                          ? "bg-white/15 text-white"
                          : "bg-emerald-500/90 text-emerald-950 hover:bg-emerald-400"
                      }`}
                    >
                      {isEquipped ? "Equipped" : "Equip"}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                      <Check className="h-3.5 w-3.5" /> Owned
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => onPurchase(item)}
                    disabled={!canAfford}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                      canAfford
                        ? "bg-gradient-to-r from-amber-300 to-yellow-500 text-amber-950 hover:brightness-110"
                        : "cursor-not-allowed bg-slate-800 text-slate-500"
                    }`}
                  >
                    {canAfford ? (
                      <Coins className="h-3.5 w-3.5" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                    {item.cost.toLocaleString()}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
