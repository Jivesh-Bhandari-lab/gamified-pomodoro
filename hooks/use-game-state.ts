"use client"

import { useCallback, useEffect, useState } from "react"

export type GameState = {
  points: number // spendable Focus Points
  xp: number // total lifetime XP (never spent) -> drives level
  sessionsCompleted: number
  totalFocusMinutes: number
  streak: number
  lastSessionDay: string | null
  owned: string[] // shop item ids
  equippedTitle: string | null
}

const STORAGE_KEY = "focusquest.state.v1"

const DEFAULT_STATE: GameState = {
  points: 0,
  xp: 0,
  sessionsCompleted: 0,
  totalFocusMinutes: 0,
  streak: 0,
  lastSessionDay: null,
  owned: [],
  equippedTitle: null,
}

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

function isYesterday(prev: string, today: string): boolean {
  const p = new Date(prev + "T00:00:00")
  const t = new Date(today + "T00:00:00")
  const diff = (t.getTime() - p.getTime()) / 86_400_000
  return diff === 1
}

export function useGameState() {
  const [state, setState] = useState<GameState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setState({ ...DEFAULT_STATE, ...JSON.parse(raw) })
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota / privacy mode
    }
  }, [state, hydrated])

  const completeFocusSession = useCallback((minutes: number, reward: number) => {
    setState((prev) => {
      const today = dayKey()
      let streak = prev.streak
      if (prev.lastSessionDay === today) {
        // already counted today, keep streak
        streak = prev.streak || 1
      } else if (prev.lastSessionDay && isYesterday(prev.lastSessionDay, today)) {
        streak = prev.streak + 1
      } else {
        streak = 1
      }
      return {
        ...prev,
        points: prev.points + reward,
        xp: prev.xp + reward,
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalFocusMinutes: prev.totalFocusMinutes + minutes,
        streak,
        lastSessionDay: today,
      }
    })
  }, [])

  const awardBreak = useCallback((reward: number) => {
    setState((prev) => ({
      ...prev,
      points: prev.points + reward,
      xp: prev.xp + reward,
    }))
  }, [])

  const purchase = useCallback((itemId: string, cost: number): boolean => {
    let ok = false
    setState((prev) => {
      if (prev.owned.includes(itemId) || prev.points < cost) return prev
      ok = true
      return { ...prev, points: prev.points - cost, owned: [...prev.owned, itemId] }
    })
    return ok
  }, [])

  const equipTitle = useCallback((itemId: string | null) => {
    setState((prev) => ({ ...prev, equippedTitle: itemId }))
  }, [])

  const reset = useCallback(() => setState(DEFAULT_STATE), [])

  return {
    state,
    hydrated,
    completeFocusSession,
    awardBreak,
    purchase,
    equipTitle,
    reset,
  }
}
