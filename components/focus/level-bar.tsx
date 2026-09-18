"use client"

import { Sparkles } from "lucide-react"

type LevelBarProps = {
  level: number
  intoLevel: number
  span: number
  progress: number
}

export function LevelBar({ level, intoLevel, span, progress }: LevelBarProps) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-slate-900 shadow-lg shadow-amber-500/30">
            {level}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">Level {level}</p>
            <p className="text-[11px] text-slate-400">Focus Adventurer</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-amber-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="tabular-nums">
            {Math.round(intoLevel)} / {span} XP
          </span>
        </div>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-indigo-500 transition-[width] duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(3, progress * 100))}%` }}
        >
          <div className="absolute inset-0 animate-pulse rounded-full bg-white/20" />
        </div>
      </div>
      <p className="mt-2 text-right text-[11px] text-slate-500">
        {Math.max(0, span - Math.round(intoLevel))} XP to Level {level + 1}
      </p>
    </div>
  )
}
