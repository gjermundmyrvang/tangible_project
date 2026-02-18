export type Node = {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  size?: "sm" | "md" | "lg";
};
export type Link = {
  from: string;
  to: string;
};

export const nodes: Node[] = [
  {
    id: "pulse",
    label: "Pulse",
    sub: "rhythm • energy • dynamic",
    x: 50,
    y: 52,
    size: "lg",
  },

  {
    id: "balance",
    label: "Balance",
    sub: "stable • contractions • release",
    x: 22,
    y: 35,
  },
  {
    id: "signals",
    label: "Signals",
    sub: "interruptions • response",
    x: 78,
    y: 32,
  },
  {
    id: "time",
    label: "Time",
    sub: "tempo • cycles • repetition",
    x: 70,
    y: 72,
  },
  {
    id: "light",
    label: "Light",
    sub: "glow • flicker • attention",
    x: 28,
    y: 74,
  },

  {
    id: "sound",
    label: "Sound",
    sub: "beat • bass • vibration",
    x: 12,
    y: 58,
    size: "sm",
  },
  {
    id: "haptics",
    label: "Haptics",
    sub: "touch • vibration • texture",
    x: 88,
    y: 55,
    size: "sm",
  },
];

export const links: Link[] = [
  { from: "pulse", to: "balance" },
  { from: "pulse", to: "signals" },
  { from: "pulse", to: "time" },
  { from: "pulse", to: "light" },
  { from: "pulse", to: "sound" },
  { from: "pulse", to: "haptics" },
  { from: "signals", to: "time" },
  { from: "balance", to: "signals" },
];
