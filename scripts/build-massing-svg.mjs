#!/usr/bin/env node
/**
 * G Park · massing illustration generator.
 *
 * Builds accurate architectural SVG illustrations of the complex from the
 * Bar Orian floor plates (lot 22, May-2026 set, verified by pixel overlay
 * of the seven plates which share one 1:200 frame):
 *
 *   1. src/components/site/illustrations/massing-axon.svg
 *      Isometric view of the whole complex from the south-west — the
 *      courtyard in front, the 15-floor tower (26.1 × 33.6 m) with its
 *      setbacks at floors 8 / 14 / 15 on the right, the north boutique
 *      strip (63.3 × 11.8 m, rounded street corners) as the backdrop and
 *      the west boutique slab (13.3 × 36.6 m) on the left. All balconies
 *      recessed flush in the building line — the project has no
 *      cantilevered balconies anywhere.
 *
 *   2. src/components/site/illustrations/building-form.svg
 *      Straight-on elevation diagram: west-slab street facade next to the
 *      tower's stepped north profile, shared ground line, floor ticks and
 *      tier callouts.
 *
 *   3. public/images/illustrations/tower-card.svg
 *      Text-free tower-only axonometric for use as an <img> card.
 *
 * Verified geometry (lot ≈ 69.1 × 62.3 m, normalized 0-100 per axis):
 *   north strip nx 4.3-95.5, ny 6.4-25.3, corners r≈6 m; floor 7 set back.
 *   west slab  nx 4.3-23.7, ny 41.3-100; 4 recessed 12 m² niches on the
 *              west face (2.9 m deep); floor 7 set back with west terraces.
 *   tower      nx 58.0-95.1, ny 41.5-95.3 (26.1 × 33.6 m):
 *              2-7 widest plate (mid-W/E notches, south light slot,
 *              recessed corner niches), 8-13 W/E faces pull in 2.0 m
 *              (floor-8 corner roof terraces 39/47 m²), 14 ≈ 14.6 m
 *              centered bar (wrap terraces), 15 ≈ 10 × 24.5 m west bar +
 *              114 m² east roof terrace.
 *   Floor heights are assumptions (no sections in the set): GF 4.2, typ 3.2.
 *
 * Usage: node scripts/build-massing-svg.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/* ───────────────────────── palette (site tokens) ───────────────────────── */
const INK = '#2C2A24'
const BRONZE_DEEP = '#9F7E54'
const SAGE = '#2A3B32'
const MIST = '#6F6A60'

const WALL_LIT = '#F8F3E9'   // south faces — sun side
const WALL_SHD = '#E5DCCB'   // west faces — shaded
const ROOF = '#FCFAF4'
const GROUND = '#EDE8DD'

/* ───────────────────────── projection ─────────────────────────
 * World: e = metres east, s = metres south, h = metres up.
 * Viewer at the SOUTH-WEST (the courtyard side), 30° axonometric:
 *   sx = (e + s)·cos30 · SC      east → right-up, south → right-down
 *   sy = (s − e)·sin30 · SC − h·SC
 * Visible faces: south (n=(0,1)) and west (n=(-1,0)).
 */
const SC = 7.4
const COS30 = Math.cos(Math.PI / 6)
const AX = COS30 * SC          // shared x factor
const AY = 0.5 * SC            // shared y factor

let OX = 0, OY = 0
const P = (e, s, h = 0) => [
  +((e + s) * AX + OX).toFixed(2),
  +((s - e) * AY - h * SC + OY).toFixed(2),
]
const pts = (arr) => arr.map(([x, y]) => `${x},${y}`).join(' ')

/* ───────────────────────── svg helpers ───────────────────────── */
const tag = (name, attrs, children = '') => {
  const a = Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')
  return children ? `<${name} ${a}>${children}</${name}>` : `<${name} ${a}/>`
}
const poly = (p, fill, stroke = INK, sw = 1.1, extra = {}) =>
  tag('polygon', { points: pts(p), fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round', ...extra })
const line = ([x1, y1], [x2, y2], stroke = INK, sw = 0.7, extra = {}) =>
  tag('line', { x1, y1, x2, y2, stroke, 'stroke-width': sw, 'stroke-linecap': 'round', ...extra })
const text = (x, y, str, { size = 15, fill = SAGE, anchor = 'middle', weight = 500, family = "'Heebo','Inter',sans-serif" } = {}) =>
  tag('text', {
    x: +(+x).toFixed(1), y: +(+y).toFixed(1), fill, 'font-size': size, 'text-anchor': anchor,
    'font-weight': weight, 'font-family': family,
  }, str)

const dedupe = (fp) => fp.filter((p, i) => {
  const q = fp[(i + fp.length - 1) % fp.length]
  return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.05
})

/* footprints are wound CLOCKWISE in plan (e→right, s→down):
   outward normal of edge a→b is (dy, -dx). */
function outNormal(a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  return [dy / len, -dx / len]
}
/* visible from the SW: faces whose normal points west and/or south */
const visible = (n) => n[0] - n[1] < -0.05

const centroid = (fp) => fp
  .reduce((acc, p) => [acc[0] + p[0] / fp.length, acc[1] + p[1] / fp.length], [0, 0])
const inset = (fp, d) => {
  const c = centroid(fp)
  return fp.map(([e, s]) => {
    const dx = e - c[0], dy = s - c[1]
    const len = Math.hypot(dx, dy) || 1
    return [e - (dx / len) * d, s - (dy / len) * d]
  })
}

function arc(ce, cs, r, a0, a1, steps = 7) {
  const out = []
  for (let i = 0; i <= steps; i++) {
    const a = a0 + ((a1 - a0) * i) / steps
    out.push([ce + r * Math.cos(a), cs + r * Math.sin(a)])
  }
  return out
}

function findEdge(fp, pred) {
  let best = -1, bestLen = 0
  for (let i = 0; i < fp.length; i++) {
    const a = fp[i], b = fp[(i + 1) % fp.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (pred(a, b) && len > bestLen) { best = i; bestLen = len }
  }
  return best
}

/* ───────────────────────── prism renderer ───────────────────────── */
function prism(fp0, h0, h1, opts = {}) {
  const fp = dedupe(fp0)
  const {
    floors = [],
    bays = [],           // {edge, from, to, floors:[h...], floorH} recessed balconies
    joints = [],         // {edge, at} building separation lines
    glazing = true,
    shadow = h0 === 0,
    roofHatch = null,    // [[e0,s0,e1,s1], ...] terrace hatches on the roof
    parapet = true,
    lineW = 1.1,
  } = opts
  const out = []

  if (shadow) {
    const k = (h1 - h0) * 0.5
    const sh = fp.map(([e, s]) => [e + k * 0.8, s - k * 0.36])
    out.push(poly(sh.map((p) => P(p[0], p[1], 0)), SAGE, 'none', 0, { opacity: 0.08 }))
  }

  const n = fp.length
  for (let i = 0; i < n; i++) {
    const a = fp[i], b = fp[(i + 1) % n]
    const nor = outNormal(a, b)
    if (!visible(nor)) continue
    const lit = nor[1] > Math.abs(nor[0]) * 0.4   // south-facing → lit
    const A0 = P(a[0], a[1], h0), B0 = P(b[0], b[1], h0)
    const A1 = P(a[0], a[1], h1), B1 = P(b[0], b[1], h1)
    out.push(poly([A0, B0, B1, A1], lit ? WALL_LIT : WALL_SHD, INK, lineW))

    const edgeLen = Math.hypot(b[0] - a[0], b[1] - a[1])
    const lerp = (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

    for (const bay of bays) {
      if (bay.edge !== i) continue
      const t0 = Math.max(0, bay.from / edgeLen), t1 = Math.min(1, bay.to / edgeLen)
      if (t1 <= t0) continue
      const p0 = lerp(t0), p1 = lerp(t1)
      const bf = bay.floors
      const lo = Math.min(...bf), hi = Math.min(Math.max(...bf) + (bay.floorH ?? 3.2), h1)
      out.push(poly([P(p0[0], p0[1], lo), P(p1[0], p1[1], lo), P(p1[0], p1[1], hi), P(p0[0], p0[1], hi)], INK, 'none', 0, { opacity: 0.07 }))
      for (const fh of bf) {
        for (const rh of [0.45, 0.75, 1.05]) {
          out.push(line(P(p0[0], p0[1], fh + rh), P(p1[0], p1[1], fh + rh), BRONZE_DEEP, 0.6, { opacity: 0.9 }))
        }
        out.push(line(P(p0[0], p0[1], fh), P(p1[0], p1[1], fh), INK, 1.15, { opacity: 0.55 }))
      }
    }

    for (const j of joints) {
      if (j.edge !== i) continue
      const pj = lerp(j.at / edgeLen)
      out.push(line(P(pj[0], pj[1], h0), P(pj[0], pj[1], h1), INK, 0.85, { opacity: 0.5 }))
    }

    for (const fh of floors) {
      if (fh <= h0 + 0.05 || fh >= h1 - 0.05) continue
      out.push(line(P(a[0], a[1], fh), P(b[0], b[1], fh), INK, 0.75, { opacity: 0.4 }))
    }

    if (glazing && edgeLen > 6) {
      const step = 3.6
      for (let d = step; d < edgeLen - 0.5; d += step) {
        const g = lerp(d / edgeLen)
        out.push(line(P(g[0], g[1], h0 + 0.4), P(g[0], g[1], h1 - 0.5), INK, 0.45, { opacity: 0.13 }))
      }
    }
  }

  out.push(poly(fp.map((p) => P(p[0], p[1], h1)), ROOF, INK, lineW))
  if (parapet) {
    out.push(poly(inset(fp, 0.8).map((p) => P(p[0], p[1], h1)), 'none', INK, 0.55, { opacity: 0.4 }))
  }
  if (roofHatch) for (const zone of roofHatch) out.push(...hatch(zone, h1))
  return out.join('\n')
}

function hatch([e0, s0, e1, s1], h, gap = 1.0) {
  const out = []
  for (let s = s0 + gap / 2; s < s1; s += gap) {
    out.push(line(P(e0 + 0.12, s, h), P(e1 - 0.12, s, h), INK, 0.5, { opacity: 0.3 }))
  }
  return out
}

function tree(e, s, r = 2.4, seed = 1) {
  const [cx, cy] = P(e, s, 0)
  const rr = r * SC * 0.9
  const lobes = []
  const k = 5 + (seed % 3)
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2 + seed
    const lr = rr * (0.55 + 0.14 * Math.sin(seed * 3 + i * 2.1))
    lobes.push(tag('circle', {
      cx: +(cx + Math.cos(a) * rr * 0.32).toFixed(1),
      cy: +(cy + Math.sin(a) * rr * 0.22 - rr * 0.05).toFixed(1),
      r: +lr.toFixed(1),
      fill: SAGE, opacity: 0.07,
      stroke: SAGE, 'stroke-width': 0.65, 'stroke-opacity': 0.4,
    }))
  }
  lobes.push(tag('circle', { cx, cy, r: 1.2, fill: SAGE, opacity: 0.55 }))
  return lobes.join('')
}

/* Label placement uses anchor='middle' with an explicit centre offset —
   geometric and immune to RTL text-anchor semantics. */
function callout(from, dx, dy, str, sub, { size = 15.5 } = {}) {
  const tx = from[0] + dx, ty = from[1] + dy
  const dir = dx >= 0 ? 1 : -1
  const ex = tx + dir * 22
  const cx = ex + dir * 92
  const out = [
    tag('circle', { cx: from[0], cy: from[1], r: 2.4, fill: BRONZE_DEEP }),
    tag('polyline', {
      points: pts([from, [tx, ty], [ex, ty]]),
      fill: 'none', stroke: BRONZE_DEEP, 'stroke-width': 0.95, opacity: 0.9,
    }),
    text(cx, ty + 4.5, str, { anchor: 'middle', size, weight: 600 }),
  ]
  if (sub) out.push(text(cx, ty + 22, sub, { anchor: 'middle', size: size - 3.5, fill: MIST, weight: 400 }))
  return out.join('\n')
}

/* ═════════════════════════ geometry (metres) ═════════════════════════ */
const UX = 0.689, UY = 0.623            // normalized lot unit → metres
const nx = (v) => +(v * UX).toFixed(2)
const ny = (v) => +(v * UY).toFixed(2)

const GF = 4.2, FL = 3.2
const lv = (n) => GF + n * FL
const BTQ_MAIN = lv(5)                  // 20.2 — boutique floors G..6
const BTQ_TOP = lv(6)                   // 23.4 — boutique PH roof = tower setback datum
const T2_TOP = lv(12)                   // 42.6
const T3_TOP = lv(13)                   // 45.8
const T4_TOP = lv(14)                   // 49.0
const towerFloors = Array.from({ length: 13 }, (_, i) => lv(i))
const btqFloors = Array.from({ length: 5 }, (_, i) => lv(i))
const t1Bal = btqFloors.concat([BTQ_MAIN])                        // balconies 2..7
const hi5 = [lv(7), lv(8), lv(9), lv(10), lv(11)]                 // slabs of 9..13

/* ── north strip — 3 buildings, rounded street corners ── */
const NSe0 = nx(4.3), NSe1 = nx(95.5), NSs0 = ny(6.4), NSs1 = ny(25.3), NSr = 6.2
const northStrip = dedupe([
  [NSe0, NSs1],
  [NSe0, NSs0 + NSr],
  ...arc(NSe0 + NSr, NSs0 + NSr, NSr, Math.PI, Math.PI * 1.5),
  [NSe1 - NSr, NSs0],
  ...arc(NSe1 - NSr, NSs0 + NSr, NSr, Math.PI * 1.5, Math.PI * 2),
  [NSe1, NSs1],
])
const NSTRIP_SOUTH = findEdge(northStrip, (a, b) =>
  Math.abs(a[1] - NSs1) < 0.01 && Math.abs(b[1] - NSs1) < 0.01)

/* floor-7 set-back mass of the strip */
const ns7e0 = nx(10.2), ns7e1 = nx(87.5), ns7s0 = ny(9.8), ns7r = 3.2
const northStrip7 = dedupe([
  [ns7e0, NSs1],
  [ns7e0, ns7s0 + ns7r],
  ...arc(ns7e0 + ns7r, ns7s0 + ns7r, ns7r, Math.PI, Math.PI * 1.5, 4),
  [ns7e1 - ns7r, ns7s0],
  ...arc(ns7e1 - ns7r, ns7s0 + ns7r, ns7r, Math.PI * 1.5, Math.PI * 2, 4),
  [ns7e1, NSs1],
])

/* ── west slab — 2 buildings ── */
const WSe0 = nx(4.3), WSe1 = nx(23.7), WSs0 = ny(41.3), WSs1 = ny(100)
const westSlab = [[WSe0, WSs0], [WSe1, WSs0], [WSe1, WSs1], [WSe0, WSs1]]
const westSlab7 = [[nx(8.6), ny(44.8)], [WSe1, ny(44.8)], [WSe1, ny(97.7)], [nx(8.6), ny(97.7)]]

/* ── tower ── */
const TE = nx(58.0), TS = ny(41.5)
const TWD = 26.1, TDP = 33.6
const T = (e, s) => [TE + e, TS + s]
const wNotchTop = ny(63.1) - ny(41.5)   // 13.46
const wNotchBot = ny(67.5) - ny(41.5)   // 16.20
/* floors 2-7 plate: prism with the mid-west notch. The south light-slot and
   the mid-east notch are rendered on the merged south facade instead. */
const tower1 = [
  T(0, 0), T(TWD, 0), T(TWD, TDP), T(0, TDP),
  T(0, wNotchBot), T(5.4, wNotchBot), T(5.4, wNotchTop), T(0, wNotchTop),
]
const tower2 = [T(2.0, 0), T(TWD - 2.0, 0), T(TWD - 2.0, TDP), T(2.0, TDP)]
const tower3 = [T(5.5, 3.8), T(20.1, 3.8), T(20.1, 28.1), T(5.5, 28.1)]
const tower4 = [T(5.5, 3.9), T(15.5, 3.9), T(15.5, 28.1), T(5.5, 28.1)]
/* tower1 edge map: 0 N · 1 E · 2 S(26.1→0) · 3 W-lower(33.6→16.2) ·
   4 notch-S-lip · 5 notch-back · 6 notch-N-lip · 7 W-upper(13.46→0) */

/* ═════════════════════════ 1 · site axonometric ═════════════════════════ */
function buildAxon({ withText = true, towerOnly = false } = {}) {
  OX = 0; OY = 0
  const probes = towerOnly
    ? [...tower1.map((p) => P(p[0], p[1], 0)), ...tower1.map((p) => P(p[0], p[1], T4_TOP)),
       P(TE + TWD + 8, TS + TDP, 0)]
    : [
        P(-8, -8, 0), P(76, -8, 0), P(76, 68, 0), P(-8, 68, 0),
        P(NSe1, NSs0, BTQ_TOP), P(NSe0, NSs1, 0),
        ...tower1.map((p) => P(p[0], p[1], T4_TOP)),
      ]
  const xs = probes.map((p) => p[0]), ys = probes.map((p) => p[1])
  const padL = withText && !towerOnly ? 250 : 30
  const padR = withText && !towerOnly ? 270 : 30
  const padT = withText && !towerOnly ? 56 : 28
  const padB = 46
  OX = padL - Math.min(...xs)
  OY = padT - Math.min(...ys)
  const W = Math.ceil(Math.max(...xs) - Math.min(...xs) + padL + padR)
  const H = Math.ceil(Math.max(...ys) - Math.min(...ys) + padT + padB)

  const g = []

  if (!towerOnly) {
    /* ground plate + street edges (north + west) */
    const lot = [[-1.5, -1.5], [70.5, -1.5], [70.5, 63.8], [-1.5, 63.8]]
    g.push(poly(lot.map((p) => P(p[0], p[1], 0)), GROUND, 'none', 0, { opacity: 0.85 }))
    g.push(tag('polyline', {
      points: pts([P(-7.5, -7), P(78, -7)]),
      fill: 'none', stroke: MIST, 'stroke-width': 0.9, opacity: 0.55, 'stroke-dasharray': '8 6',
    }))
    g.push(tag('polyline', {
      points: pts([P(-7, -7), P(-7, 70)]),
      fill: 'none', stroke: MIST, 'stroke-width': 0.9, opacity: 0.55, 'stroke-dasharray': '8 6',
    }))
    /* courtyard between the three masses */
    g.push(poly([P(WSe1 + 1.5, NSs1 + 2), P(TE - 1.5, NSs1 + 2), P(TE - 1.5, ny(95)), P(WSe1 + 1.5, ny(95))], SAGE, 'none', 0, { opacity: 0.05 }))
    /* north-street trees sit behind the strip — paint first */
    let seedN = 11
    for (let e = 8; e <= 62; e += 11) g.push(tree(e, -3.6, 2.2, seedN++))
  }

  /* ── north strip — farthest ── */
  if (!towerOnly) {
    g.push(prism(northStrip, 0, BTQ_MAIN, {
      floors: btqFloors,
      joints: [
        { edge: NSTRIP_SOUTH, at: NSe1 - nx(64.9) },
        { edge: NSTRIP_SOUTH, at: NSe1 - nx(34.9) },
      ],
    }))
    /* ground-floor commercial frontage on the courtyard face */
    for (let e = NSe0 + 1.6; e < NSe1 - 1.2; e += 1.9) {
      g.push(line(P(e, NSs1, 0.5), P(e, NSs1, 3.6), INK, 0.45, { opacity: 0.16 }))
    }
    g.push(line(P(NSe0 + 0.8, NSs1, 3.9), P(NSe1 - 0.8, NSs1, 3.9), INK, 0.7, { opacity: 0.35 }))
    g.push(prism(northStrip7, BTQ_MAIN, BTQ_TOP, { shadow: false, glazing: false }))
    g.push(...hatch([ns7e0, NSs0 + 1.6, ns7e1, ns7s0 - 0.1], BTQ_MAIN, 0.9))
    g.push(...hatch([NSe0 + 0.6, NSs0 + 2.4, ns7e0 - 0.1, NSs1 - 0.3], BTQ_MAIN, 0.9))
    g.push(...hatch([ns7e1 + 0.1, NSs0 + 2.4, NSe1 - 0.6, NSs1 - 0.3], BTQ_MAIN, 0.9))
  }

  /* ── tower ── */
  g.push(prism(tower1, 0, BTQ_TOP, {
    floors: towerFloors,
    bays: [
      /* west face: edge 3 runs s 33.6→16.2, edge 7 runs s 13.46→0 */
      { edge: 3, from: TDP - 30.2, to: TDP - 26.2, floors: t1Bal },   // W lower pair (lower)
      { edge: 3, from: TDP - 26.0, to: TDP - 22.0, floors: t1Bal },   // W lower pair (upper)
      { edge: 7, from: wNotchTop - 12.5, to: wNotchTop - 8.5, floors: t1Bal }, // W upper-mid
    ],
  }))
  /* floor-8 corner roof terraces on the tier-1 roof */
  g.push(...hatch([TE + 0.15, TS + 0.3, TE + 1.9, TS + 6.2], BTQ_TOP))
  g.push(...hatch([TE + 0.15, TS + 22.6, TE + 1.9, TS + 33.3], BTQ_TOP))
  g.push(...hatch([TE + TWD - 1.9, TS + 22.6, TE + TWD - 0.15, TS + 33.3], BTQ_TOP))

  g.push(prism(tower2, BTQ_TOP, T2_TOP, {
    floors: towerFloors, shadow: false,
    bays: [
      /* corner notches of floors 8-13: W face (edge 3 runs s 33.6→0) */
      { edge: 3, from: TDP - 27.2, to: TDP - 23.0, floors: hi5 },     // SW band (y 23.0-27.2)
      { edge: 3, from: TDP - 4.05, to: TDP - 0.2, floors: hi5 },      // NW band (y 0.2-4.05)
    ],
  }))

  /* merged south facade — the real S plane is continuous from ground to
     floor 13 over x 2.0-24.1 (only the 2 m side wings stop at floor 7).
     Painted over both tiers so the tower reads as ONE stepped mass. */
  {
    const fS = (x, h) => P(TE + x, TS + TDP, h)
    g.push(poly([fS(2.0, 0), fS(TWD - 2.0, 0), fS(TWD - 2.0, T2_TOP), fS(2.0, T2_TOP)], WALL_LIT, INK, 1.1))
    for (const fh of towerFloors) {
      g.push(line(fS(2.0, fh), fS(TWD - 2.0, fh), INK, 0.75, { opacity: 0.4 }))
    }
    /* glazing rhythm */
    for (let d = 5.6; d < TWD - 2.2; d += 3.6) {
      g.push(line(fS(d, 0.4), fS(d, T2_TOP - 0.5), INK, 0.45, { opacity: 0.13 }))
    }
    /* the 2.93 m light slot between the two south units — full-height recess */
    g.push(poly([fS(11.3, 0), fS(14.3, 0), fS(14.3, T2_TOP), fS(11.3, T2_TOP)], INK, 'none', 0, { opacity: 0.13 }))
    g.push(line(fS(11.3, 0), fS(11.3, T2_TOP), INK, 0.7, { opacity: 0.4 }))
    g.push(line(fS(14.3, 0), fS(14.3, T2_TOP), INK, 0.7, { opacity: 0.4 }))
    /* recessed corner balconies along the S facade (floors 2-13) */
    const sBal = towerFloors.slice(0, 12)
    for (const [x0, x1] of [[2.4, 5.5], [20.6, 23.7]]) {
      g.push(poly([fS(x0, GF), fS(x1, GF), fS(x1, T2_TOP - 0.1), fS(x0, T2_TOP - 0.1)], INK, 'none', 0, { opacity: 0.07 }))
      for (const fh of sBal) {
        for (const rh of [0.45, 0.75, 1.05]) {
          g.push(line(fS(x0, fh + rh), fS(x1, fh + rh), BRONZE_DEEP, 0.6, { opacity: 0.9 }))
        }
        g.push(line(fS(x0, fh), fS(x1, fh), INK, 1.15, { opacity: 0.55 }))
      }
    }
    /* ground-floor entrance hint */
    g.push(poly([fS(6.6, 0), fS(10.6, 0), fS(10.6, 3.4), fS(6.6, 3.4)], INK, 'none', 0, { opacity: 0.09 }))
  }
  /* floor-14 wrap terraces on the tier-2 roof */
  g.push(...hatch([TE + 2.2, TS + 0.3, TE + TWD - 2.2, TS + 3.6], T2_TOP, 1.1))
  g.push(...hatch([TE + 2.2, TS + 3.6, TE + 5.3, TS + 28.0], T2_TOP, 1.1))
  g.push(...hatch([TE + 2.2, TS + 28.3, TE + TWD - 2.2, TS + 33.3], T2_TOP, 1.1))

  g.push(prism(tower3, T2_TOP, T3_TOP, { shadow: false }))
  /* floor-15 east roof terrace on the tier-3 roof */
  g.push(...hatch([TE + 15.7, TS + 4.1, TE + 19.9, TS + 27.9], T3_TOP, 0.9))
  g.push(prism(tower4, T3_TOP, T4_TOP, { shadow: false }))

  if (!towerOnly) {
    /* ── west slab — closest. Edge map: 0 N · 1 E · 2 S · 3 W ── */
    g.push(prism(westSlab, 0, BTQ_MAIN, {
      floors: btqFloors,
      bays: [
        /* the 4 recessed 12 m² niches on the west street facade
           (edge 3 runs s 62.3→25.7; params measured from the SW vertex) */
        [ny(41.6), ny(48.2)], [ny(64.8), ny(71.5)], [ny(71.5), ny(78.2)], [ny(94.2), ny(99.7)],
      ].map(([s0, s1]) => ({ edge: 3, from: WSs1 - s1, to: WSs1 - s0, floors: btqFloors })),
      joints: [{ edge: 3, at: WSs1 - ny(71.5) }],
    }))
    g.push(prism(westSlab7, BTQ_MAIN, BTQ_TOP, { shadow: false, glazing: false }))
    g.push(...hatch([WSe0 + 0.15, ny(44.8), nx(8.6) - 0.15, ny(97.7)], BTQ_MAIN, 1.1))

    /* trees: west street (in front of the slab) + courtyard */
    let seed = 1
    for (let s = 28; s <= 60; s += 11) g.push(tree(-3.6, s, 2.2, seed++))
    for (const [e, s] of [[22, 22.5], [29, 21], [36, 22.3]]) g.push(tree(e, s, 2.4, seed++))
    for (const [e, s] of [[21, 32], [28, 40], [22, 48], [30, 55], [25, 60], [35, 33]]) g.push(tree(e, s, 2.8, seed++))
  }

  /* ── callouts ── */
  const ann = []
  if (withText && !towerOnly) {
    const seCorner = P(TE + TWD, TS + TDP, 0)   // tower's nearest vertical edge
    ann.push(callout(P(TE + 15.5, TS + 28.1, T4_TOP - 1.1), 116, -30, 'קומה 15 · מגה־פנטהאוז', 'דירה אחת בלבד · 185 מ״ר'))
    ann.push(callout(P(TE + 20.1, TS + 28.1, T3_TOP - 1.3), 102, 8, 'קומה 14 · דירות גג', 'מרפסות גג היקפיות'))
    ann.push(callout(P(TE + TWD - 2, TS + TDP, lv(9) - 1.4), 64, -2, 'קומות 9–13', 'מרפסות שקועות בקו הבניין'))
    ann.push(callout(P(TE + TWD - 0.7, TS + TDP - 10.4, BTQ_TOP + 0.4), 96, 30, 'קומה 8 · קומת הנסיגה', 'מרפסות גג 40–48 מ״ר'))
    ann.push(callout(P(TE + TWD, TS + TDP - 2, lv(2) - 1.2), 52, 46, 'המגדל · קומות 2–7', 'מרפסת 12 מ״ר לכל דירה'))
    ann.push(callout(P(NSe0 + 0.6, NSs0 + 3.4, BTQ_MAIN - 2.2), -68, -28, 'מרקמי צפוני · 3 בניינים', '7 קומות · פינות מעוגלות לרחוב'))
    ann.push(callout(P(WSe0, WSs1 - 2, lv(0)), -64, 60, 'מרקמי מערבי · 2 בניינים', '7 קומות · מרפסות בקו החזית'))

    const nax = W - 84, nay = H - 92
    ann.push(tag('g', { transform: `translate(${nax},${nay})` }, [
      tag('circle', { cx: 0, cy: 0, r: 17, fill: 'none', stroke: MIST, 'stroke-width': 0.8, opacity: 0.6 }),
      tag('g', { transform: 'rotate(-60)' },
        tag('polygon', { points: '0,-12 4.5,8 0,4 -4.5,8', fill: SAGE, opacity: 0.85 })),
      text(0, 34, 'צפון', { size: 11.5, fill: MIST, weight: 400 }),
    ].join('')))
  }

  /* card export sits on the dark Architecture section — opaque paper bg */
  const bg = towerOnly
    ? tag('rect', { x: 0, y: 0, width: W, height: H, fill: '#FAF7F0' })
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="איור אקסונומטרי מדויק של מתחם G Park מתוך תוכניות בר אוריין — מגדל מדורג, בנייני בוטיק ופינות מעוגלות">
${bg}<g>${g.join('\n')}</g>
<g>${ann.join('\n')}</g>
</svg>`
}

/* ═════════════════════════ 2 · elevation sheet ═════════════════════════ */
function buildElevation() {
  const S2 = 10.6
  const W = 1140, H = 700
  const GY = 590
  const X = (m) => +(m * S2).toFixed(1)
  const Y = (h) => +(GY - h * S2).toFixed(1)
  const slabW = WSs1 - WSs0          // 36.6 — west-slab street facade width
  const wsBays = [[ny(41.6), ny(48.2)], [ny(64.8), ny(71.5)], [ny(71.5), ny(78.2)], [ny(94.2), ny(99.7)]]
  const bx = 64
  const tx = 700
  const g = []

  for (let h = 0; h <= 52; h += 5) {
    g.push(line([48, Y(h)], [W - 56, Y(h)], INK, 0.4, { opacity: 0.06 }))
  }

  /* ── west slab · west (street) elevation ── */
  g.push(tag('rect', { x: bx, y: Y(BTQ_MAIN), width: X(slabW), height: GY - Y(BTQ_MAIN), fill: WALL_LIT, stroke: INK, 'stroke-width': 1.15 }))
  for (const fh of btqFloors) g.push(line([bx, Y(fh)], [bx + X(slabW), Y(fh)], INK, 0.7, { opacity: 0.38 }))
  for (const [s0, s1] of wsBays) {
    const u0 = X(s0 - WSs0), u1 = X(s1 - WSs0)
    g.push(tag('rect', { x: bx + u0, y: Y(BTQ_MAIN), width: u1 - u0, height: GY - Y(BTQ_MAIN), fill: INK, opacity: 0.06 }))
    for (const fh of btqFloors) for (const rh of [0.45, 0.75, 1.05])
      g.push(line([bx + u0, Y(fh + rh)], [bx + u1, Y(fh + rh)], BRONZE_DEEP, 0.6, { opacity: 0.85 }))
  }
  g.push(line([bx + X(ny(71.5) - WSs0), GY], [bx + X(ny(71.5) - WSs0), Y(BTQ_MAIN)], INK, 0.85, { opacity: 0.5 }))
  /* recessed floor-7 behind the roof-terrace railing */
  g.push(tag('rect', { x: bx + X(3.3), y: Y(BTQ_TOP), width: X(ny(97.7) - ny(44.8)), height: Y(BTQ_MAIN) - Y(BTQ_TOP), fill: WALL_SHD, stroke: INK, 'stroke-width': 1.0, opacity: 0.92 }))
  for (let xx = 0.4; xx < slabW - 0.2; xx += 0.75)
    g.push(line([bx + X(xx), Y(BTQ_MAIN)], [bx + X(xx), Y(BTQ_MAIN) - 5.5], INK, 0.5, { opacity: 0.45 }))
  g.push(line([bx, Y(BTQ_MAIN) - 6], [bx + X(slabW), Y(BTQ_MAIN) - 6], INK, 0.65, { opacity: 0.55 }))

  /* datum dash: boutique PH roof ↔ tower setback */
  g.push(line([bx - 14, Y(BTQ_TOP)], [tx + X(2.0), Y(BTQ_TOP)], BRONZE_DEEP, 0.85, { opacity: 0.5, 'stroke-dasharray': '6 5' }))
  g.push(text(bx + X(slabW) / 2, GY + 32, 'בנייני הבוטיק · 7 קומות', { size: 15 }))
  g.push(text(bx + X(slabW) / 2, GY + 52, 'קומה 7 נסוגה מקו הרחוב · גובה הגג = קו הנסיגה של המגדל', { size: 11.5, fill: MIST, weight: 400 }))

  /* ── tower · north elevation ── */
  const seg = (e0, e1, h0, h1) =>
    tag('rect', {
      x: +(tx + X(e0)).toFixed(1), y: Y(h1),
      width: +X(e1 - e0).toFixed(1), height: +(Y(h0) - Y(h1)).toFixed(1),
      fill: WALL_LIT, stroke: INK, 'stroke-width': 1.15,
    })
  g.push(seg(0, TWD, 0, BTQ_TOP))
  g.push(seg(2.0, TWD - 2.0, BTQ_TOP, T2_TOP))
  g.push(seg(5.5, 20.1, T2_TOP, T3_TOP))
  g.push(seg(5.5, 15.5, T3_TOP, T4_TOP))

  for (const fh of towerFloors) {
    if (fh >= T2_TOP) continue
    const w2 = fh >= BTQ_TOP - 0.01
    g.push(line([tx + X(w2 ? 2.0 : 0), Y(fh)], [tx + X(w2 ? TWD - 2 : TWD), Y(fh)], INK, 0.7, { opacity: 0.38 }))
  }
  for (const [r0, r1] of [[0, 4.0], [TWD - 4.0, TWD]]) {
    g.push(tag('rect', { x: tx + X(r0), y: Y(BTQ_TOP), width: X(r1 - r0), height: GY - Y(BTQ_TOP), fill: INK, opacity: 0.06 }))
    for (const fh of t1Bal) for (const rh of [0.45, 0.75, 1.05])
      g.push(line([tx + X(r0), Y(fh + rh)], [tx + X(r1), Y(fh + rh)], BRONZE_DEEP, 0.6, { opacity: 0.85 }))
  }
  for (const [r0, r1] of [[2.0, 6.5], [TWD - 6.5, TWD - 2.0]]) {
    g.push(tag('rect', { x: tx + X(r0), y: Y(T2_TOP), width: X(r1 - r0), height: Y(BTQ_TOP) - Y(T2_TOP), fill: INK, opacity: 0.06 }))
    for (const fh of hi5) for (const rh of [0.45, 0.75, 1.05])
      g.push(line([tx + X(r0), Y(fh + rh)], [tx + X(r1), Y(fh + rh)], BRONZE_DEEP, 0.6, { opacity: 0.85 }))
  }
  for (const [e0, e1, h] of [[0, 2.0, BTQ_TOP], [TWD - 2.0, TWD, BTQ_TOP], [2.0, 5.5, T2_TOP], [20.1, TWD - 2.0, T2_TOP], [15.5, 20.1, T3_TOP]]) {
    for (let xx = e0 + 0.35; xx < e1 - 0.15; xx += 0.62)
      g.push(line([tx + X(xx), Y(h)], [tx + X(xx), Y(h) - 5.5], INK, 0.5, { opacity: 0.45 }))
    g.push(line([tx + X(e0), Y(h) - 6], [tx + X(e1), Y(h) - 6], INK, 0.65, { opacity: 0.55 }))
  }

  /* ground line */
  g.push(line([40, GY], [W - 48, GY], INK, 1.5))
  for (let xx = 44; xx < W - 50; xx += 13) g.push(line([xx, GY], [xx - 7, GY + 7], INK, 0.5, { opacity: 0.4 }))

  /* floor ticks (right) */
  const fx = tx + X(TWD)
  for (const [h, t] of [[0, 'קרקע'], [lv(0), '2'], [lv(2), '4'], [lv(4), '6'], [lv(6), '8'], [lv(8), '10'], [lv(10), '12'], [lv(12), '14'], [lv(13), '15'], [T4_TOP, 'גג']]) {
    g.push(line([fx + 10, Y(h)], [fx + 22, Y(h)], MIST, 0.85))
    g.push(text(fx + 42, Y(h) + 4, String(t), { size: 11.5, fill: MIST, weight: 400, family: "'Inter','Heebo',sans-serif" }))
  }

  /* tier callouts — fixed slots in the gutter, centre-anchored (RTL-safe) */
  const tier = (slotY, attach, str, sub) => {
    const LX = tx - 36
    const out = [
      tag('circle', { cx: attach[0], cy: attach[1], r: 2.4, fill: BRONZE_DEEP }),
      tag('polyline', {
        points: pts([attach, [LX + 16, slotY], [LX + 4, slotY]]),
        fill: 'none', stroke: BRONZE_DEEP, 'stroke-width': 0.95, opacity: 0.9,
      }),
      text(LX - 96, slotY + 4.5, str, { anchor: 'middle', size: 15, weight: 600 }),
    ]
    if (sub) out.push(text(LX - 96, slotY + 22.5, sub, { anchor: 'middle', size: 11.5, fill: MIST, weight: 400 }))
    return out.join('\n')
  }
  g.push(tier(72, [tx + X(5.5), Y(T4_TOP - 1.6)], 'קומה 15 · מגה־פנטהאוז', '185 מ״ר · מרפסת גג 117 מ״ר'))
  g.push(tier(128, [tx + X(5.5), Y(T3_TOP - 1.6)], 'קומה 14 · דירות גג', 'מרפסות גג היקפיות'))
  g.push(tier(238, [tx + X(2.0), Y(lv(9) - 1.4)], 'קומות 9–13', 'מרפסות שקועות בקו הבניין'))
  g.push(tier(346, [tx + X(2.0), Y(BTQ_TOP + 1.5)], 'קומה 8 · קומת הנסיגה', 'מרפסות גג 40–48 מ״ר'))
  g.push(tier(474, [tx + X(0), Y(lv(2) - 1.4)], 'קומות 2–7', 'מרפסת 12 מ״ר לכל דירה'))

  g.push(text(tx + X(TWD) / 2, GY + 32, 'המגדל · 15 קומות', { size: 15 }))
  g.push(text(tx + X(TWD) / 2, GY + 52, 'חזית צפונית · קנה־מידה אחיד', { size: 11.5, fill: MIST, weight: 400 }))

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="דיאגרמת הצורה של המגדל ובנייני הבוטיק — נסיגות בקומות 8, 14 ו-15, מרפסות שקועות בקו הבניין">
<g>${g.join('\n')}</g>
</svg>`
}

/* ═════════════════════════ write outputs ═════════════════════════ */
const outDir = join(ROOT, 'src', 'components', 'site', 'illustrations')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'massing-axon.svg'), buildAxon({ withText: true }))
writeFileSync(join(outDir, 'building-form.svg'), buildElevation())

const cardDir = join(ROOT, 'public', 'images', 'illustrations')
mkdirSync(cardDir, { recursive: true })
writeFileSync(join(cardDir, 'tower-card.svg'), buildAxon({ withText: false, towerOnly: true }))

console.log('✓ massing-axon.svg, building-form.svg, tower-card.svg written')
