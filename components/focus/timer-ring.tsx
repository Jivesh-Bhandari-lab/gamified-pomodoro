"use client"

type TimerRingProps = {
  progress: number // 0..1 remaining
  mode: "focus" | "break"
  timeLabel: string
  phaseLabel: string
}

export function TimerRing({ progress, mode, timeLabel, phaseLabel }: TimerRingProps) {
  const size = 280
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = circumference * progress

  const gradientId = mode === "focus" ? "focusGrad" : "breakGrad"

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`absolute h-56 w-56 rounded-full blur-3xl transition-colors duration-700 ${
          mode === "focus" ? "bg-fuchsia-600/20" : "bg-cyan-500/20"
        }`}
        aria-hidden="true"
      />
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${phaseLabel}, ${timeLabel} remaining`}>
        <defs>
          <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="breakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={`mb-1 text-xs font-semibold uppercase tracking-[0.25em] ${
            mode === "focus" ? "text-fuchsia-300" : "text-cyan-300"
          }`}
        >
          {phaseLabel}
        </span>
        <span className="font-mono text-6xl font-bold tabular-nums text-white drop-shadow-[0_2px_12px_rgba(168,85,247,0.4)]">
          {timeLabel}
        </span>
      </div>
    </div>
  )
}
