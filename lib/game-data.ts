export type ShopItem = {
  id: string
  name: string
  description: string
  cost: number
  icon: string
  kind: "title" | "badge"
  rarity: "common" | "rare" | "epic" | "legendary"
}

// Points awarded per completed focus session.
export const FOCUS_REWARD = 100
// Small bonus for completing a break honestly.
export const BREAK_REWARD = 20

// XP needed grows each level. Returns cumulative XP to REACH a given level.
export function xpForLevel(level: number): number {
  // Level 1 starts at 0. Each level costs 250 * level XP.
  let total = 0
  for (let i = 1; i < level; i++) {
    total += 250 * i
  }
  return total
}

export function levelFromXp(xp: number): {
  level: number
  currentLevelXp: number
  nextLevelXp: number
  intoLevel: number
  span: number
  progress: number
} {
  let level = 1
  while (xp >= xpForLevel(level + 1)) {
    level++
  }
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  const span = nextLevelXp - currentLevelXp
  const intoLevel = xp - currentLevelXp
  return {
    level,
    currentLevelXp,
    nextLevelXp,
    intoLevel,
    span,
    progress: span > 0 ? intoLevel / span : 1,
  }
}

export const RARITY_STYLES: Record<
  ShopItem["rarity"],
  { ring: string; text: string; glow: string; label: string }
> = {
  common: {
    ring: "ring-slate-500/40",
    text: "text-slate-300",
    glow: "shadow-[0_0_20px_-6px_rgba(148,163,184,0.6)]",
    label: "Common",
  },
  rare: {
    ring: "ring-cyan-400/50",
    text: "text-cyan-300",
    glow: "shadow-[0_0_22px_-4px_rgba(34,211,238,0.7)]",
    label: "Rare",
  },
  epic: {
    ring: "ring-fuchsia-400/50",
    text: "text-fuchsia-300",
    glow: "shadow-[0_0_24px_-4px_rgba(232,121,249,0.75)]",
    label: "Epic",
  },
  legendary: {
    ring: "ring-amber-400/60",
    text: "text-amber-300",
    glow: "shadow-[0_0_28px_-3px_rgba(251,191,36,0.85)]",
    label: "Legendary",
  },
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "sprout",
    name: "Focus Sprout",
    description: "Your very first badge. Everyone starts somewhere.",
    cost: 150,
    icon: "🌱",
    kind: "badge",
    rarity: "common",
  },
  {
    id: "apprentice",
    name: "Apprentice of Time",
    description: "A title for those learning to tame the clock.",
    cost: 300,
    icon: "⏳",
    kind: "title",
    rarity: "common",
  },
  {
    id: "ember",
    name: "Ember Keeper",
    description: "Keep the spark of focus alive, session after session.",
    cost: 600,
    icon: "🔥",
    kind: "badge",
    rarity: "rare",
  },
  {
    id: "tactician",
    name: "Tactician",
    description: "A title earned by masters of the 25/5 rhythm.",
    cost: 900,
    icon: "🧭",
    kind: "title",
    rarity: "rare",
  },
  {
    id: "crystal",
    name: "Crystal Mind",
    description: "Clarity forged from deep, unbroken concentration.",
    cost: 1400,
    icon: "💎",
    kind: "badge",
    rarity: "epic",
  },
  {
    id: "archmage",
    name: "Archmage of Focus",
    description: "A prestigious title for the relentlessly productive.",
    cost: 2200,
    icon: "🔮",
    kind: "title",
    rarity: "epic",
  },
  {
    id: "phoenix",
    name: "Phoenix Ascendant",
    description: "Rise again from every distraction, stronger than before.",
    cost: 3500,
    icon: "🦅",
    kind: "badge",
    rarity: "legendary",
  },
  {
    id: "timelord",
    name: "Lord of the Hours",
    description: "The ultimate title. Time itself bends to your will.",
    cost: 6000,
    icon: "👑",
    kind: "title",
    rarity: "legendary",
  },
]
