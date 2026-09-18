"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react"
import { TimerRing } from "./timer-ring"

const FOCUS_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

type Mode = "focus" | "break"

type PomodoroTimerProps = {
  onFocusComplete: (minutes: number) => void
  onBreakComplete: () => void
}

function format(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function PomodoroTimer({ onFocusComplete, onBreakComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>("focus")
  const [remaining, setRemaining] = useState(FOCUS_SECONDS)
  const [running, setRunning] = useState(false)
  const [justFinished, setJustFinished] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const switchMode = useCallback(
    (next: Mode) => {
      clear()
      setRunning(false)
      setMode(next)
      setRemaining(next === "focus" ? FOCUS_SECONDS : BREAK_SECONDS)
    },
    [clear],
  )

  const handleComplete = useCallback(() => {
    clear()
    setRunning(false)
    setJustFinished(true)
    window.setTimeout(() => setJustFinished(false), 900)

    if (mode === "focus") {
      onFocusComplete(25)
      switchMode("break")
    } else {
      onBreakComplete()
      switchMode("focus")
    }
  }, [clear, mode, onBreakComplete, onFocusComplete, switchMode])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) return 0
        return r - 1
      })
    }, 1000)
    return () => clear()
  }, [running, clear])

  useEffect(() => {
    if (remaining === 0 && running) {
      handleComplete()
    }
  }, [remaining, running, handleComplete])

  const progress = remaining / total

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode toggle */}
      <div className="flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
        {(["focus", "break"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-all ${
              mode === m
                ? m === "focus"
                  ? "bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-lg shadow-fuchsia-500/30"
                  : "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-900 shadow-lg shadow-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {m === "focus" ? "Focus 25" : "Break 5"}
          </button>
        ))}
      </div>

      <div className={justFinished ? "animate-pulse" : ""}>
        <TimerRing
          progress={progress}
          mode={mode}
          timeLabel={format(remaining)}
          phaseLabel={mode === "focus" ? "Deep Focus" : "Recover"}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => switchMode(mode)}
          aria-label="Reset timer"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? "Pause timer" : "Start timer"}
          className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition active:scale-95 ${
            mode === "focus"
              ? "bg-gradient-to-br from-fuchsia-500 to-indigo-600 shadow-fuchsia-500/40"
              : "bg-gradient-to-br from-cyan-400 to-sky-600 shadow-cyan-500/40"
          }`}
        >
          {running ? <Pause className="h-8 w-8" /> : <Play className="ml-1 h-8 w-8" />}
        </button>

        <button
          onClick={handleComplete}
          aria-label="Skip to complete"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      <p className="max-w-xs text-center text-xs text-slate-500">
        {mode === "focus"
          ? "Complete a focus session to earn 100 Focus Points and XP."
          : "Finish your break to claim a small +20 point bonus."}
      </p>
    </div>
  )
}
