"use client";

import { useId } from "react";
import type { StudyVariant } from "@/data/assets";

type Row = {
  y: number;
  count: number;
  w: number;
  h: number;
  d: number;
  gap: number;
  litEvery: number;
};

type Scene = {
  skyTop: string;
  skyMid: string;
  glow: number;
  glowX: string;
  rows: Row[];
  mountains?: boolean;
  dunes?: boolean;
  crane?: boolean;
  factory?: boolean;
  plan?: boolean;
  mep?: boolean;
  towers?: boolean;
  link?: boolean;
  liftModule?: boolean;
};

const scenes: Record<StudyVariant, Scene> = {
  hero: {
    skyTop: "#7a4a3a",
    skyMid: "#241816",
    glow: 0.42,
    glowX: "72%",
    rows: [
      { y: 360, count: 14, w: 58, h: 24, d: 8, gap: 6, litEvery: 3 },
      { y: 430, count: 11, w: 80, h: 34, d: 12, gap: 8, litEvery: 2 },
      { y: 520, count: 8, w: 112, h: 48, d: 16, gap: 12, litEvery: 2 },
      { y: 640, count: 5, w: 160, h: 78, d: 22, gap: 16, litEvery: 2 },
    ],
  },
  housing: {
    skyTop: "#6a4034",
    skyMid: "#1c1412",
    glow: 0.34,
    glowX: "62%",
    rows: [
      { y: 150, count: 8, w: 86, h: 34, d: 12, gap: 10, litEvery: 2 },
      { y: 250, count: 5, w: 140, h: 56, d: 16, gap: 16, litEvery: 2 },
      { y: 380, count: 4, w: 176, h: 78, d: 22, gap: 18, litEvery: 2 },
    ],
  },
  village: {
    skyTop: "#3a2a32",
    skyMid: "#141114",
    glow: 0.3,
    glowX: "50%",
    rows: [
      { y: 470, count: 14, w: 52, h: 20, d: 7, gap: 4, litEvery: 2 },
      { y: 520, count: 12, w: 64, h: 26, d: 9, gap: 5, litEvery: 2 },
      { y: 580, count: 10, w: 80, h: 34, d: 11, gap: 6, litEvery: 1 },
      { y: 660, count: 8, w: 104, h: 48, d: 14, gap: 8, litEvery: 2 },
      { y: 760, count: 6, w: 132, h: 64, d: 18, gap: 10, litEvery: 2 },
    ],
  },
  turaif: {
    skyTop: "#8a5a40",
    skyMid: "#1c1410",
    glow: 0.18,
    glowX: "72%",
    dunes: true,
    rows: [
      { y: 640, count: 5, w: 110, h: 42, d: 14, gap: 22, litEvery: 2 },
      { y: 740, count: 3, w: 160, h: 70, d: 20, gap: 36, litEvery: 1 },
    ],
  },
  trojena: {
    skyTop: "#2c3c46",
    skyMid: "#12161a",
    glow: 0.14,
    glowX: "40%",
    mountains: true,
    rows: [
      { y: 650, count: 6, w: 100, h: 40, d: 14, gap: 12, litEvery: 2 },
      { y: 748, count: 4, w: 150, h: 68, d: 20, gap: 16, litEvery: 2 },
    ],
  },
  rig: {
    skyTop: "#1a1c1e",
    skyMid: "#101010",
    glow: 0.22,
    glowX: "78%",
    crane: true,
    rows: [{ y: 660, count: 8, w: 108, h: 48, d: 14, gap: 8, litEvery: 3 }],
  },
  build: {
    skyTop: "#3a302c",
    skyMid: "#141210",
    glow: 0.28,
    glowX: "62%",
    liftModule: true,
    rows: [
      { y: 580, count: 8, w: 90, h: 40, d: 14, gap: 10, litEvery: 3 },
      { y: 690, count: 5, w: 140, h: 64, d: 18, gap: 14, litEvery: 2 },
    ],
  },
  workers: {
    skyTop: "#2a2422",
    skyMid: "#141312",
    glow: 0.2,
    glowX: "50%",
    factory: true,
    rows: [],
  },
  factory: {
    skyTop: "#322824",
    skyMid: "#141210",
    glow: 0.22,
    glowX: "80%",
    factory: true,
    rows: [],
  },
  design: {
    skyTop: "#2c2826",
    skyMid: "#121110",
    glow: 0.18,
    glowX: "20%",
    factory: true,
    rows: [],
  },
  operate: {
    skyTop: "#1a1918",
    skyMid: "#121110",
    glow: 0.16,
    glowX: "70%",
    plan: true,
    rows: [],
  },
  facilities: {
    skyTop: "#1c1a19",
    skyMid: "#121110",
    glow: 0.2,
    glowX: "30%",
    plan: true,
    rows: [],
  },
  mep: {
    skyTop: "#16181a",
    skyMid: "#101112",
    glow: 0.18,
    glowX: "60%",
    mep: true,
    rows: [],
  },
  "real-estate": {
    skyTop: "#3a2e34",
    skyMid: "#141114",
    glow: 0.26,
    glowX: "55%",
    towers: true,
    rows: [],
  },
  partner: {
    skyTop: "#241c1c",
    skyMid: "#121010",
    glow: 0.24,
    glowX: "50%",
    link: true,
    rows: [],
  },
  investment: {
    skyTop: "#1c1a18",
    skyMid: "#10100e",
    glow: 0.16,
    glowX: "40%",
    link: true,
    rows: [],
  },
};

function rowModules(row: Row) {
  const total = row.count * row.w + (row.count - 1) * row.gap;
  const start = (1440 - total) / 2;
  return Array.from({ length: row.count }, (_, index) => ({
    x: start + index * (row.w + row.gap),
    y: row.y,
    w: row.w,
    h: row.h,
    d: row.d,
    lit: index % row.litEvery === 0,
    accent: index === Math.floor(row.count / 2),
  }));
}

function Module({
  x,
  y,
  w,
  h,
  d,
  lit,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  d: number;
  lit: boolean;
  accent: boolean;
}) {
  const lift = d * 0.7;
  return (
    <g>
      <polygon
        points={`${x},${y} ${x + w},${y} ${x + w + d},${y - lift} ${x + d},${y - lift}`}
        fill="#5c554f"
      />
      <polygon
        points={`${x + w},${y} ${x + w + d},${y - lift} ${x + w + d},${y + h - lift} ${x + w},${y + h}`}
        fill="#171615"
      />
      <rect x={x} y={y} width={w} height={h} fill="#2c2927" />
      <rect x={x} y={y} width={w} height="2" fill="#8a8178" />
      <rect
        x={x + 8}
        y={y + h * 0.4}
        width={Math.max(8, w - 16)}
        height={Math.max(3, h * 0.1)}
        fill={lit ? "#f6f4f1" : "#141312"}
        opacity={lit ? 0.88 : 1}
      />
      {accent ? <rect x={x} y={y + h - 3} width={w} height="3" fill="#d71932" /> : null}
    </g>
  );
}

export function ModularStudy({
  variant,
  alt,
}: {
  variant: StudyVariant;
  alt: string;
}) {
  const uid = useId().replace(/:/g, "");
  const scene = scenes[variant];
  const sky = `${uid}-sky`;
  const glow = `${uid}-glow`;
  const vignette = `${uid}-vignette`;

  return (
    <div role="img" aria-label={alt} className="grain relative h-full w-full overflow-hidden bg-charcoal">
      <svg viewBox="0 0 1440 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={scene.skyTop} />
            <stop offset="48%" stopColor={scene.skyMid} />
            <stop offset="100%" stopColor="#100e0d" />
          </linearGradient>
          <radialGradient id={glow} cx={scene.glowX} cy="38%" r="42%">
            <stop offset="0%" stopColor="#d71932" stopOpacity={scene.glow} />
            <stop offset="100%" stopColor="#d71932" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={vignette} cx="50%" cy="45%" r="70%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill={`url(#${sky})`} />
        <rect width="1440" height="900" fill={`url(#${glow})`} data-layer="glow" />
        {scene.mountains ? (
          <g fill="#243038">
            <polygon points="0,620 180,390 340,560 520,300 760,590 980,340 1220,560 1440,420 1440,900 0,900" opacity="0.95" />
            <polygon points="80,640 260,470 420,620 640,430 860,640" fill="#314049" />
          </g>
        ) : null}
        {scene.dunes ? (
          <g>
            <ellipse cx="420" cy="700" rx="520" ry="90" fill="#3a2a22" />
            <ellipse cx="1080" cy="730" rx="480" ry="80" fill="#2a1e1a" />
          </g>
        ) : null}
        {scene.factory ? <Factory /> : null}
        {scene.plan ? <Plan /> : null}
        {scene.mep ? <Mep /> : null}
        {scene.towers ? <Towers /> : null}
        {scene.link ? <LinkFrames /> : null}
        {!scene.factory && !scene.plan && !scene.mep && !scene.towers && !scene.link ? (
          <g data-layer="camp">
            <polygon points="0,640 1440,560 1440,900 0,900" fill="#1a1614" />
            {Array.from({ length: 8 }, (_, index) => (
              <line
                key={index}
                x1={80 - index * 40}
                y1={600 + index * 38}
                x2={1360 + index * 40}
                y2={600 + index * 38}
                stroke="rgba(246,244,241,0.08)"
              />
            ))}
            {scene.rows.map((row, rowIndex) => (
              <g key={row.y} data-layer={rowIndex === scene.rows.length - 1 ? "fore" : "mid"}>
                {rowModules(row).map((module) => (
                  <Module key={`${module.x}-${module.y}`} {...module} />
                ))}
              </g>
            ))}
            {scene.liftModule ? (
              <g transform="translate(-40 -70)">
                <rect x="760" y="560" width="140" height="64" fill="none" stroke="#d71932" strokeWidth="2" />
              </g>
            ) : null}
            {scene.crane ? (
              <g stroke="#f6f4f1" strokeWidth="2" fill="none" opacity="0.8">
                <line x1="1180" y1="220" x2="1180" y2="700" />
                <line x1="1180" y1="250" x2="1360" y2="250" />
                <line x1="1280" y1="250" x2="1280" y2="470" stroke="#d71932" />
              </g>
            ) : null}
            <g stroke="#d71932" strokeWidth="1.4" fill="none">
              <line x1="78" y1="430" x2="78" y2="820" />
              <line x1="68" y1="430" x2="88" y2="430" />
              <line x1="68" y1="820" x2="88" y2="820" />
            </g>
          </g>
        ) : null}
        <rect width="1440" height="900" fill={`url(#${vignette})`} />
      </svg>
    </div>
  );
}

function Factory() {
  const bays = Array.from({ length: 12 }, (_, index) => 140 + index * 96);
  return (
    <g>
      <polygon points="80,470 1360,430 1360,820 80,820" fill="#241f1d" />
      {bays.map((x) => (
        <g key={x}>
          <polygon points={`${x},470 ${x + 70},470 ${x + 86},430 ${x + 16},430`} fill="#3a342f" />
          <rect x={x} y="500" width="78" height="250" fill="#2a2624" />
          <rect x={x + 14} y="560" width="18" height="28" fill={x % 192 === 140 ? "#f6f4f1" : "#141312"} opacity="0.85" />
          <rect x={x + 42} y="560" width="18" height="28" fill="#141312" />
        </g>
      ))}
      <line x1="80" y1="760" x2="1360" y2="760" stroke="#d71932" strokeWidth="2" />
    </g>
  );
}

function Plan() {
  const rooms = [
    [160, 180, 420, 260],
    [600, 180, 300, 180],
    [920, 180, 340, 260],
    [160, 460, 280, 240],
    [460, 460, 440, 240],
    [920, 460, 340, 240],
  ];
  return (
    <g fill="none" stroke="rgba(246,244,241,0.45)" strokeWidth="1.5">
      <rect x="120" y="140" width="1180" height="620" />
      {rooms.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
      ))}
      <path d="M200 300 H760 V560 H1100" stroke="#d71932" strokeWidth="2.5" />
      <circle cx="200" cy="300" r="5" fill="#d71932" stroke="none" />
      <circle cx="1100" cy="560" r="5" fill="#d71932" stroke="none" />
    </g>
  );
}

function Mep() {
  return (
    <g fill="none" stroke="rgba(246,244,241,0.4)" strokeWidth="1.5">
      <rect x="160" y="160" width="1120" height="580" />
      <path d="M220 250 H700 V430 H1180" />
      <path d="M220 520 H520 V360 H900 V640 H1220" />
      <path d="M360 250 V700" stroke="#d71932" strokeWidth="2.5" />
      {[220, 520, 700, 900, 1180].map((x) => (
        <circle key={x} cx={x} cy={x > 900 ? 430 : 250} r="8" />
      ))}
      <circle cx="360" cy="250" r="8" fill="#d71932" stroke="none" />
      <circle cx="360" cy="700" r="8" fill="#d71932" stroke="none" />
    </g>
  );
}

function Towers() {
  const towers = [
    { x: 360, floors: 5, w: 150, h: 70 },
    { x: 620, floors: 8, w: 170, h: 62 },
    { x: 900, floors: 4, w: 150, h: 74 },
  ];
  return (
    <g>
      <line x1="180" y1="780" x2="1260" y2="780" stroke="rgba(246,244,241,0.25)" />
      {towers.map((tower) =>
        Array.from({ length: tower.floors }, (_, floor) => {
          const y = 760 - (floor + 1) * (tower.h + 8);
          return (
            <g key={`${tower.x}-${floor}`}>
              <rect x={tower.x} y={y} width={tower.w} height={tower.h} fill="#2a2628" />
              <rect x={tower.x + 12} y={y + tower.h * 0.4} width={tower.w - 24} height="6" fill={floor % 2 === 0 ? "#f6f4f1" : "#141214"} opacity="0.8" />
            </g>
          );
        }),
      )}
      <rect x="620" y="168" width="170" height="6" fill="#d71932" />
    </g>
  );
}

function LinkFrames() {
  return (
    <g fill="none" strokeWidth="1.5">
      <rect x="280" y="220" width="520" height="420" stroke="rgba(246,244,241,0.55)" />
      <rect x="640" y="300" width="520" height="420" stroke="rgba(246,244,241,0.35)" />
      <path d="M540 430 H860" stroke="#d71932" strokeWidth="2" />
      <circle cx="540" cy="430" r="5" fill="#d71932" stroke="none" />
      <circle cx="860" cy="430" r="5" fill="#d71932" stroke="none" />
    </g>
  );
}
