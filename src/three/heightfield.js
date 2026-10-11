import { feature } from 'topojson-client'
import landTopo from 'world-atlas/land-50m.json'
import { EXTENT, MAP_W, MAP_H, HEIGHT_SCALE } from '../data/geo.js'

// Risoluzione della griglia di elevazione (e della texture dipinta)
export const GW = 1400
export const GH = Math.round((GW * MAP_H) / MAP_W)

// ---------- rumore ----------
function hash(x, y) {
  let h = x * 374761393 + y * 668265263
  h = (h ^ (h >>> 13)) * 1274126177
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}
function smooth(t) {
  return t * t * (3 - 2 * t)
}
function vnoise(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = smooth(x - xi)
  const yf = smooth(y - yi)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf
}
function fbm(x, y, oct = 5) {
  let v = 0
  let amp = 0.5
  let f = 1
  for (let i = 0; i < oct; i++) {
    v += amp * vnoise(x * f, y * f)
    f *= 2.03
    amp *= 0.5
  }
  return v
}
function ridged(x, y, oct = 5) {
  let v = 0
  let amp = 0.5
  let f = 1
  for (let i = 0; i < oct; i++) {
    const n = 1 - Math.abs(vnoise(x * f, y * f) * 2 - 1)
    v += amp * n * n
    f *= 2.1
    amp *= 0.5
  }
  return v
}

// ---------- orografia (ellissi in gradi: lon, lat, raggi, rotazione, altezza) ----------
const RANGES = [
  ['Alpi', 10, 46.3, 4.8, 1.1, -10, 0.95],
  ['Pirenei', 0.5, 42.7, 2.6, 0.45, 0, 0.6],
  ['Appennini', 13.5, 42.6, 4.2, 0.6, -42, 0.4],
  ['Dinarici', 18.3, 43.6, 4.2, 0.9, -35, 0.5],
  ['Balcani', 24.5, 42.5, 3, 0.8, 0, 0.45],
  ['Anatolia', 34, 39, 8, 2.4, 0, 0.5],
  ['Tauro', 33.5, 37.2, 5, 0.8, 12, 0.6],
  ['Ponto', 39, 40.6, 5, 0.7, 0, 0.6],
  ['Caucaso', 44.2, 42.7, 5.4, 0.9, -22, 1.15],
  ['Altopiano armeno', 43.5, 39.5, 3.2, 1.6, 0, 0.85],
  ['Ararat', 44.3, 39.7, 0.45, 0.45, 0, 1.3],
  ['Libano', 36, 34, 0.5, 1.5, 15, 0.35],
  ['Zagros', 49.5, 32, 9, 1.4, -36, 0.85],
  ['Alborz', 52, 36.3, 4.2, 0.6, 0, 0.95],
  ['Altopiano iranico', 57, 32, 7, 4, 0, 0.32],
  ['Hejaz', 41, 21, 1.2, 8, 20, 0.45],
  ['Yemen', 44, 15, 2, 1.5, 0, 0.55],
  ['Hindu Kush', 70, 35.8, 5.2, 1.2, 25, 1.3],
  ['Pamir', 73.5, 38.4, 2.6, 1.6, 0, 1.7],
  ['Karakorum', 76.5, 35.6, 3.2, 1, -30, 1.75],
  ['Tian Shan', 80, 42, 9, 1.4, 5, 1.2],
  ['Kunlun', 84, 36.2, 10, 1.2, -5, 1.4],
  ['Tibet', 87, 33, 11, 3.8, 0, 1.25],
  ['Himalaya', 85, 29.6, 11.5, 1, -15, 1.85],
  ['Hengduan', 99, 28, 1.6, 5, 0, 1.1],
  ['Qilian', 99, 38.5, 6, 1, -25, 1.1],
  ['Altai', 90, 48, 6, 1.5, -30, 0.95],
  ['Sayan', 97, 51.5, 6, 1.2, 10, 0.7],
  ['Khangai', 99, 47.5, 4, 1.5, 0, 0.6],
  ['Mongolia', 104, 46, 10, 4, 0, 0.32],
  ['Yunnan', 102, 25.5, 4, 3, 0, 0.5],
  ['Qinling', 108, 33.8, 5, 0.7, 0, 0.55],
  ['Taihang', 113.5, 37, 0.8, 4, 20, 0.45],
  ['Grande Khingan', 120, 47, 1.2, 6, 25, 0.45],
  ['Corea', 127.5, 38.5, 1.2, 3, -20, 0.4],
  ['Ghati', 75, 14, 0.6, 6, 10, 0.4],
  ['Deccan', 77, 18, 4, 4, 0, 0.18],
  ['Ceylon', 80.7, 7.2, 0.5, 0.5, 0, 0.5],
  ['Barisan', 101, -1, 9, 0.8, -48, 0.5],
  ['Annam', 107, 15, 1, 5, -30, 0.45],
  ['Arakan', 94, 21, 0.9, 5, 10, 0.5],
]

const DESERTS = [
  [83, 39, 7, 2],
  [105, 42.5, 10, 3],
  [46, 22, 9, 6],
  [56, 32.5, 4, 2.5],
  [59, 39.5, 5, 2],
  [64, 42.5, 4, 2],
  [15, 25, 25, 7],
  [71, 27, 3, 2],
  [39, 32.5, 4, 2.5],
  [93, 40.5, 4, 1.5],
]

function ellipse(lon, lat, cx, cy, rx, ry, rotDeg) {
  const r = (rotDeg * Math.PI) / 180
  const dx = lon - cx
  const dy = lat - cy
  const u = (dx * Math.cos(r) + dy * Math.sin(r)) / rx
  const v = (-dx * Math.sin(r) + dy * Math.cos(r)) / ry
  return Math.exp(-(u * u + v * v) * 1.6)
}

// ---------- maschera delle terre emerse (Natural Earth 1:50m) ----------
function rasterLand() {
  const canvas = document.createElement('canvas')
  canvas.width = GW
  canvas.height = GH
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, GW, GH)
  ctx.fillStyle = '#fff'
  const land = feature(landTopo, landTopo.objects.land)
  const px = (lon) => ((lon - EXTENT.lonMin) / (EXTENT.lonMax - EXTENT.lonMin)) * GW
  const py = (lat) => ((EXTENT.latMax - lat) / (EXTENT.latMax - EXTENT.latMin)) * GH
  const geoms = land.type === 'FeatureCollection' ? land.features.map((f) => f.geometry) : [land.geometry]
  const polys = geoms.flatMap((g) => (g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates]))
  ctx.beginPath()
  for (const poly of polys) {
    for (const ring of poly) {
      let prevLon = null
      ring.forEach(([lon, lat], i) => {
        if (i === 0 || (prevLon !== null && Math.abs(lon - prevLon) > 180)) ctx.moveTo(px(lon), py(lat))
        else ctx.lineTo(px(lon), py(lat))
        prevLon = lon
      })
      ctx.closePath()
    }
  }
  ctx.fill('evenodd')
  const data = ctx.getImageData(0, 0, GW, GH).data
  const mask = new Float32Array(GW * GH)
  for (let i = 0; i < GW * GH; i++) mask[i] = data[i * 4] / 255
  return mask
}

function boxBlur(src, w, h, r, passes = 3) {
  let a = Float32Array.from(src)
  let b = new Float32Array(a.length)
  const n = 2 * r + 1
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      let acc = 0
      const row = y * w
      for (let x = -r; x <= r; x++) acc += a[row + Math.min(w - 1, Math.max(0, x))]
      for (let x = 0; x < w; x++) {
        b[row + x] = acc / n
        acc += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)]
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0
      for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x]
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / n
        acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]
      }
    }
  }
  return a
}

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (t) => Math.min(1, Math.max(0, t))
const sstep = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}
function mix(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]
}
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)]

const C = {
  abyss: hex('#163a4a'),
  sea: hex('#24576a'),
  shallow: hex('#4f8a8e'),
  shore: hex('#c9b98a'),
  low: hex('#8f9d5c'),
  green: hex('#6f8a4c'),
  steppe: hex('#b0a46a'),
  desert: hex('#dcc28a'),
  high: hex('#a07d55'),
  rock: hex('#7b6149'),
  snow: hex('#f3efe4'),
}

// ---------- costruzione completa ----------
export function buildHeightfield() {
  const mask = rasterLand()
  const coast = boxBlur(mask, GW, GH, 3)
  const wide = boxBlur(mask, GW, GH, 14, 2)
  const heights = new Float32Array(GW * GH)
  const deserts = new Float32Array(GW * GH)
  const mount = new Float32Array(GW * GH)

  for (let j = 0; j < GH; j++) {
    const lat = EXTENT.latMax - (j / (GH - 1)) * (EXTENT.latMax - EXTENT.latMin)
    for (let i = 0; i < GW; i++) {
      const lon = EXTENT.lonMin + (i / (GW - 1)) * (EXTENT.lonMax - EXTENT.lonMin)
      const k = j * GW + i
      const m = coast[k]
      let ridge = 0
      for (const r of RANGES) {
        const reach = Math.max(r[3], r[4]) * 1.9
        if (Math.abs(lon - r[1]) > reach || Math.abs(lat - r[2]) > reach) continue
        const e = ellipse(lon, lat, r[1], r[2], r[3], r[4], r[5])
        if (e > 0.002) ridge = Math.max(ridge, e * r[6])
      }
      let des = 0
      for (const d of DESERTS) if (Math.abs(lon - d[0]) < d[2] * 1.9 && Math.abs(lat - d[1]) < d[3] * 1.9) des = Math.max(des, ellipse(lon, lat, d[0], d[1], d[2], d[3], 0))
      deserts[k] = des
      const landF = sstep(0.42, 0.62, m)
      const detail = fbm(lon * 0.35, lat * 0.35, 5)
      const rid = ridged(lon * 0.6 + 11, lat * 0.6 - 7, 5)
      const mountains = ridge * (0.45 + 0.9 * rid) * landF
      mount[k] = mountains
      const hills = (detail - 0.4) * 0.22 * landF
      const seabed = -0.25 - 0.55 * (1 - wide[k]) - fbm(lon * 0.2, lat * 0.2, 3) * 0.15
      const h = lerp(seabed, 0.06, sstep(0.25, 0.55, m)) + landF * 0.04 + Math.max(hills, -0.03) + mountains
      heights[k] = h * HEIGHT_SCALE
    }
  }

  // texture dipinta con ombreggiatura del rilievo (luce da nord-ovest, come nelle carte antiche)
  const tex = document.createElement('canvas')
  tex.width = GW
  tex.height = GH
  const tctx = tex.getContext('2d')
  const img = tctx.createImageData(GW, GH)
  const px = img.data
  const cell = MAP_W / GW
  for (let j = 0; j < GH; j++) {
    for (let i = 0; i < GW; i++) {
      const k = j * GW + i
      const h = heights[k] / HEIGHT_SCALE
      const hx = heights[j * GW + Math.min(GW - 1, i + 1)] - heights[j * GW + Math.max(0, i - 1)]
      const hy = heights[Math.min(GH - 1, j + 1) * GW + i] - heights[Math.max(0, j - 1) * GW + i]
      const shade = clamp01(0.62 + (-hx * 0.9 - hy * 0.9) / (cell * 2) * 0.55)
      let col
      if (h < 0.02) {
        const depth = clamp01(-h / 0.9)
        col = mix(C.shallow, C.sea, sstep(0.0, 0.35, depth))
        col = mix(col, C.abyss, sstep(0.4, 1, depth))
        const wave = fbm(i * 0.08, j * 0.08, 3)
        col = mix(col, C.shallow, (wave - 0.5) * 0.18)
      } else {
        const lat = EXTENT.latMax - (j / (GH - 1)) * (EXTENT.latMax - EXTENT.latMin)
        const n = fbm(i * 0.05 + 3, j * 0.05, 4)
        const humid = clamp01(0.55 + (lat < 30 && lat > 5 ? 0.15 : 0) - deserts[k] * 1.2 + (n - 0.5) * 0.6)
        col = mix(C.steppe, C.green, humid)
        col = mix(col, C.desert, sstep(0.25, 0.75, deserts[k]))
        col = mix(C.shore, col, sstep(0.02, 0.09, h))
        col = mix(col, C.high, sstep(0.3, 0.75, h))
        col = mix(col, C.rock, sstep(0.75, 1.15, h))
        col = mix(col, C.snow, sstep(1.15, 1.6, h + (n - 0.5) * 0.3))
        col = col.map((c) => c * (0.55 + shade * 0.75))
      }
      // grana della carta
      const g = (hash(i, j) - 0.5) * 10
      px[k * 4] = Math.min(255, col[0] + g)
      px[k * 4 + 1] = Math.min(255, col[1] + g)
      px[k * 4 + 2] = Math.min(255, col[2] + g * 0.8)
      px[k * 4 + 3] = 255
    }
  }
  tctx.putImageData(img, 0, 0)
  // linea di costa a inchiostro
  tctx.globalCompositeOperation = 'multiply'
  const ink = tctx.createImageData(GW, GH)
  for (let k = 0; k < GW * GH; k++) {
    const c = coast[k]
    const line = c > 0.3 && c < 0.6 ? 1 - Math.abs(c - 0.45) / 0.15 : 0
    const v = 255 - line * 110
    ink.data[k * 4] = v
    ink.data[k * 4 + 1] = v * 0.95
    ink.data[k * 4 + 2] = v * 0.88
    ink.data[k * 4 + 3] = 255
  }
  const inkCanvas = document.createElement('canvas')
  inkCanvas.width = GW
  inkCanvas.height = GH
  inkCanvas.getContext('2d').putImageData(ink, 0, 0)
  tctx.drawImage(inkCanvas, 0, 0)
  tctx.globalCompositeOperation = 'source-over'

  return { heights, texture: tex, landMask: mask }
}

let cache = null
export function getHeightfield() {
  if (!cache) cache = buildHeightfield()
  return cache
}

// quota del terreno (in unità di scena) a una data longitudine/latitudine
export function heightAt(lon, lat) {
  const { heights } = getHeightfield()
  const fx = ((lon - EXTENT.lonMin) / (EXTENT.lonMax - EXTENT.lonMin)) * (GW - 1)
  const fy = ((EXTENT.latMax - lat) / (EXTENT.latMax - EXTENT.latMin)) * (GH - 1)
  const x0 = Math.max(0, Math.min(GW - 2, Math.floor(fx)))
  const y0 = Math.max(0, Math.min(GH - 2, Math.floor(fy)))
  const tx = clamp01(fx - x0)
  const ty = clamp01(fy - y0)
  const a = heights[y0 * GW + x0]
  const b = heights[y0 * GW + x0 + 1]
  const c = heights[(y0 + 1) * GW + x0]
  const d = heights[(y0 + 1) * GW + x0 + 1]
  return lerp(lerp(a, b, tx), lerp(c, d, tx), ty)
}
