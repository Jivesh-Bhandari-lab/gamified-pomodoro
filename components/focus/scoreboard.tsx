"use client"

import { Coins, Flame, Target, Timer } from "lucide-react"

type ScoreboardProps = {
  points: number
  sessions: number
  minutes: number
  streak: number
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>{icon}</div>
      <span className="mt-1 text-lg font-bold tabular-nums text-white">{value}</span>
      <span className="text-[11px] font-medium text-slate-400">{label}</span>
    </div>
  )
}

export function Scoreboard({ points, sessions, minutes, streak }: ScoreboardProps) {
  const hours = Math.floor(minutes / 60)
  const focusLabel = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={<Coins className="h-4 w-4 text-amber-950" />}
        label="Focus Points"
        value={points.toLocaleString()}
        accent="bg-gradient-to-br from-amber-300 to-yellow-500"
      />
      <StatCard
        icon={<Flame className="h-4 w-4 text-orange-950" />}
        label="Day Streak"
        value={`${streak}`}
        accent="bg-gradient-to-br from-orange-400 to-red-500"
      />
      <StatCard
        icon={<Target className="h-4 w-4 text-fuchsia-950" />}
        label="Sessions"
        value={`${sessions}`}
        accent="bg-gradient-to-br from-fuchsia-400 to-purple-500"
      />
      <StatCard
        icon={<Timer className="h-4 w-4 text-cyan-950" />}
        label="Focused Time"
        value={focusLabel}
        accent="bg-gradient-to-br from-cyan-300 to-sky-500"
      />
    </div>
  )
}
