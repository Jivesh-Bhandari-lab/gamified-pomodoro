"use client"

import { useEffect, useRef, useState } from "react"
import { Store, Timer as TimerIcon, Trophy } from "lucide-react"
import { useGameState } from "@/hooks/use-game-state"
import {
  BREAK_REWARD,
  FOCUS_REWARD,
  SHOP_ITEMS,
  type ShopItem,
  levelFromXp,
} from "@/lib/game-data"
import { PomodoroTimer } from "./pomodoro-timer"
import { LevelBar } from "./level-bar"
import { Scoreboard } from "./scoreboard"
import { Shop } from "./shop"

type Tab = "timer" | "shop"
type Toast = { id: number; text: string; tone: "point" | "level" | "buy" }

export function FocusQuestApp() {
  const {
    state,
    hydrated,
    completeFocusSession,
    awardBreak,
    purchase,
    equipTitle,
  } = useGameState()

  const [tab, setTab] = useState<Tab>("timer")
  const [toasts, setToasts] = useState<Toast[]>([])
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const prevLevel = useRef<number | null>(null)

  const lvl = levelFromXp(state.xp)
  const equippedItem = SHOP_ITEMS.find((i) => i.id === state.equippedTitle) ?? null

  function pushToast(text: string, tone: Toast["tone"]) {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text, tone }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 2400)
  }

  // Detect level ups.
  useEffect(() => {
    if (!hydrated) return
    if (prevLevel.current === null) {
      prevLevel.current = lvl.level
      return
    }
    if (lvl.level > prevLevel.current) {
      setLevelUp(lvl.level)
      window.setTimeout(() => setLevelUp(null), 2600)
    }
    prevLevel.current = lvl.level
  }, [lvl.level, hydrated])

  function handleFocusComplete(minutes: number) {
    completeFocusSession(minutes, FOCUS_REWARD)
    pushToast(`+${FOCUS_REWARD} Focus Points!`, "point")
  }

  function handleBreakComplete() {
    awardBreak(BREAK_REWARD)
    pushToast(`+${BREAK_REWARD} bonus for resting`, "point")
  }

  function handlePurchase(item: ShopItem) {
    const ok = purchase(item.id, item.cost)
    if (ok) {
      pushToast(`Unlocked ${item.name}!`, "buy")
      if (item.kind === "title") equipTitle(item.id)
    }
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-slate-950 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-fuchsia-700/20 blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-indigo-700/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-72 -translate-x-1/2 rounded-full bg-cyan-700/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 pb-2 pt-6">
        <div>
          <h1 className="bg-gradient-to-r from-fuchsia-300 via-purple-300 to-indigo-300 bg-clip-text text-xl font-black tracking-tight text-transparent">
            FocusQuest
          </h1>
          <p className="text-[11px] font-medium text-slate-400">
            {equippedItem ? (
              <span className="text-amber-300">
                {equippedItem.icon} {equippedItem.name}
              </span>
            ) : (
              "Turn focus into a game"
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5">
          <Trophy className="h-4 w-4 text-amber-300" />
          <span className="text-sm font-bold tabular-nums text-amber-200">
            {hydrated ? state.points.toLocaleString() : "—"}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-5 pb-28 pt-2">
        {tab === "timer" ? (
          <div className="flex flex-col gap-5">
            <LevelBar
              level={lvl.level}
              intoLevel={lvl.intoLevel}
              span={lvl.span}
              progress={lvl.progress}
            />
            <div className="py-2">
              <PomodoroTimer
                onFocusComplete={handleFocusComplete}
                onBreakComplete={handleBreakComplete}
              />
            </div>
            <Scoreboard
              points={state.points}
              sessions={state.sessionsCompleted}
              minutes={state.totalFocusMinutes}
              streak={state.streak}
            />
          </div>
        ) : (
          <Shop
            points={state.points}
            owned={state.owned}
            equippedTitle={state.equippedTitle}
            onPurchase={handlePurchase}
            onEquip={equipTitle}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="absolute inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-white/10 bg-slate-950/80 px-6 pb-6 pt-3 backdrop-blur-xl">
        <div className="flex items-center justify-around">
          <NavButton
            active={tab === "timer"}
            onClick={() => setTab("timer")}
            icon={<TimerIcon className="h-5 w-5" />}
            label="Timer"
          />
          <NavButton
            active={tab === "shop"}
            onClick={() => setTab("shop")}
            icon={<Store className="h-5 w-5" />}
            label="Vault"
          />
        </div>
      </nav>

      {/* Toasts */}
      <div className="pointer-events-none absolute inset-x-0 top-20 z-30 flex flex-col items-center gap-2 px-5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-in fade-in slide-in-from-top-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg backdrop-blur ${
              t.tone === "buy"
                ? "bg-emerald-500/90 text-emerald-950"
                : "bg-gradient-to-r from-amber-300 to-yellow-500 text-amber-950"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>

      {/* Level up celebration */}
      {levelUp !== null && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <div className="animate-in zoom-in-50 fade-in relative flex flex-col items-center gap-3 rounded-3xl border border-amber-400/40 bg-slate-900/90 px-10 py-8 shadow-[0_0_60px_-10px_rgba(251,191,36,0.6)]">
            <span className="text-5xl">🎉</span>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
              Level Up
            </p>
            <p className="bg-gradient-to-r from-amber-300 to-fuchsia-400 bg-clip-text text-4xl font-black text-transparent">
              Level {levelUp}
            </p>
            <p className="text-sm text-slate-400">Keep the momentum going!</p>
          </div>
        </div>
      )}
    </div>
  )
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl px-6 py-1.5 text-[11px] font-semibold transition ${
        active ? "text-white" : "text-slate-500 hover:text-slate-300"
      }`}
    >
      <span
        className={`transition ${
          active
            ? "text-fuchsia-300 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)]"
            : ""
        }`}
      >
        {icon}
      </span>
      {label}
    </button>
  )
}
