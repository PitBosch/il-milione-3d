// Rotta storica del viaggio dei Polo (1271–1295), ricostruita sulle tappe del Milione
// e sugli studi moderni. Ogni punto è [longitudine, latitudine, etichetta?].
// Le etichette "stop:<id>" collegano il punto alla tappa omonima in chapters.js;
// le altre etichette sono punti di raccordo (servono anche come innesto delle diramazioni).

const ADRIATICO_GIU = [
  [13.2, 44.6], [14.8, 43.4], [17.2, 41.8], [18.8, 40.2], [19.6, 39.0], [20.6, 37.6], [21.3, 36.6],
]
const PERSIA_ANDATA = [
  [46.29, 38.08, 'tabriz1'], [48.5, 36.7], [50.3, 35.0, 'saveh'], [51.4, 33.98, 'kashan'],
  [54.36, 31.9, 'yazd'], [57.08, 30.28, 'kerman1'],
]

export const LEGS = [
  {
    mode: 'sea', year: 1271,
    pts: [
      [12.33, 45.44, 'stop:venezia'], ...ADRIATICO_GIU,
      [22.6, 36.05], [24.5, 35.85], [26.6, 35.55], [28.6, 35.2], [30.8, 34.6], [33.0, 33.8], [34.6, 33.15],
      [35.0, 32.95, 'acri1'],
    ],
  },
  {
    mode: 'land', year: 1271,
    pts: [[35.0, 32.95], [35.2, 32.45], [35.23, 31.78, 'stop:gerusalemme'], [35.25, 32.45], [35.07, 32.92, 'stop:acri']],
  },
  {
    mode: 'sea', year: 1271,
    pts: [[35.07, 32.92], [34.75, 33.6], [35.3, 34.8], [35.55, 35.8], [35.75, 36.45], [35.78, 36.8, 'stop:laiazzo']],
  },
  {
    mode: 'land', year: 1272,
    pts: [
      [35.78, 36.8], [36.6, 37.6], [37.0, 39.75, 'sivas'], [39.5, 39.75, 'erzincan'], [41.27, 39.9, 'erzurum'],
      [43.2, 39.95, 'stop:armenia'], ...PERSIA_ANDATA,
      [56.6, 27.15, 'stop:hormuz'], [57.08, 30.28, 'kerman2'], [57.0, 33.6, 'tunocain'], [59.6, 36.3],
      [62.5, 36.6], [65.75, 36.66], [66.9, 36.76, 'balkh'], [69.5, 36.73],
      [70.58, 37.12, 'stop:badakhshan'], [72.5, 36.9], [73.8, 37.6, 'stop:pamir'], [75.2, 38.8],
      [75.99, 39.47, 'kashgar'], [77.24, 38.41, 'yarkand'], [79.92, 37.11, 'khotan'], [81.67, 36.86],
      [85.53, 38.14, 'cherchen'], [88.5, 39.2, 'stop:lop'], [91.5, 39.8], [94.66, 40.14, 'saciu'],
      [98.5, 39.73], [100.45, 38.93, 'campiciu'], [102.64, 37.93], [106.27, 38.47], [110.5, 40.9],
      [113.5, 41.8], [116.18, 42.36, 'stop:ciandu'], [116.3, 41.0], [116.39, 39.9, 'stop:pechino'],
      [117.2, 39.1], [116.6, 36.7], [118.2, 34.4], [119.4, 32.4, 'yangzhou'], [120.3, 31.4],
      [120.15, 30.27, 'stop:chinsai'], [119.8, 28.7], [119.3, 26.08], [118.6, 24.9, 'stop:zaiton'],
    ],
  },
  {
    mode: 'sea', year: 1291,
    pts: [
      [118.6, 24.9], [118.9, 24.3], [116.8, 22.4], [113.9, 20.6], [112.3, 18.2], [110.2, 15.2],
      [109.6, 12.6, 'ciamba'], [108.6, 10.0], [105.8, 7.2], [104.6, 3.5], [104.2, 1.2], [103.2, 1.6],
      [101.6, 2.6], [100.2, 3.7], [98.6, 4.6], [97.1, 5.45, 'stop:indonesia'], [95.2, 6.2], [91.0, 6.8],
      [86.0, 6.9], [82.4, 6.4], [80.6, 5.7], [79.7, 6.9, 'stop:ceylon'], [78.0, 7.4], [77.2, 7.6],
      [76.2, 9.3, 'malabar'], [75.3, 11.8], [74.3, 14.5], [73.0, 18.8], [70.0, 21.8], [67.6, 23.6],
      [63.5, 25.0], [59.5, 25.4], [57.4, 26.0], [56.6, 27.1, 'hormuz2'],
    ],
  },
  {
    mode: 'land', year: 1293,
    pts: [
      [56.6, 27.1], [57.08, 30.28], [54.36, 31.9], [51.4, 33.98], [50.3, 35.0], [48.5, 36.7],
      [46.29, 38.08, 'tabriz2'], [43.6, 39.6], [41.27, 39.9], [40.6, 40.55], [39.72, 41.0, 'stop:trebisonda'],
    ],
  },
  {
    mode: 'sea', year: 1295,
    pts: [
      [39.72, 41.0], [37.5, 41.55], [34.0, 42.1], [31.0, 41.6], [29.3, 41.3], [28.97, 41.0, 'costantinopoli'],
      [28.3, 40.75], [26.6, 40.25], [25.9, 39.6], [24.9, 38.2], [24.2, 37.0], [23.0, 36.2],
      ...ADRIATICO_GIU.slice().reverse(), [12.33, 45.44, 'stop:venezia1295'],
    ],
  },
  {
    mode: 'sea', year: 1298,
    pts: [
      [12.33, 45.44], [13.2, 44.6], [14.8, 43.4], [16.3, 42.85], [16.95, 42.9, 'curzola'], [17.2, 41.8],
      [18.8, 40.2], [18.5, 39.6], [17.3, 39.0], [16.6, 38.4], [15.75, 37.95], [15.62, 38.2], [15.2, 38.8],
      [13.6, 40.0], [12.0, 40.9], [10.6, 42.4], [9.8, 43.5], [9.2, 44.15], [8.93, 44.38, 'stop:genova'],
    ],
  },
]

// Diramazioni: luoghi che il Milione descrive ma che probabilmente Marco non toccò
// sul percorso principale, oppure missioni compiute al servizio del Gran Cane.
export const BRANCHES = [
  { stop: 'baudac', from: 'tabriz1', kind: 'descritto', pts: [[46.29, 38.08], [43.13, 36.34], [44.36, 33.31]] },
  { stop: 'mulehet', from: 'saveh', kind: 'descritto', pts: [[50.3, 35.0], [50.58, 36.44]] },
  { stop: 'samarcanda', from: 'kashgar', kind: 'descritto', pts: [[75.99, 39.47], [73.0, 40.6], [68.8, 40.1], [66.97, 39.65]] },
  {
    stop: 'tibet', from: 'stop:pechino', kind: 'missione',
    pts: [[116.39, 39.9], [114.5, 38.0], [108.94, 34.34], [107.0, 33.1], [104.07, 30.67], [101.2, 30.4], [100.2, 26.9], [100.2, 25.6]],
    markerAt: [101.2, 30.4],
  },
  { stop: 'liaodong', from: 'stop:pechino', kind: 'missione', pts: [[116.39, 39.9], [118.9, 40.0], [121.2, 41.1], [122.8, 41.6]] },
]

// Nomi medievali (dal Milione) disegnati sulla carta
export const REGION_LABELS = [
  { text: 'Mare Mediterraneo', lon: 19, lat: 34.5, size: 1 },
  { text: 'Mare Maggiore', lon: 34.5, lat: 43.2, size: 0.8 },
  { text: 'Mare di Baccù', lon: 51, lat: 41.5, size: 0.7 },
  { text: 'Turcomania', lon: 33, lat: 38.4, size: 0.7 },
  { text: 'Persia', lon: 55, lat: 33.5, size: 1.1 },
  { text: 'Arabia', lon: 44, lat: 23, size: 0.9 },
  { text: 'Tartaria', lon: 78, lat: 47, size: 1.2 },
  { text: 'Pamier', lon: 72.2, lat: 39.4, size: 0.6 },
  { text: 'Deserto di Lop', lon: 87, lat: 41, size: 0.65 },
  { text: 'Tebet', lon: 88, lat: 31.5, size: 0.9 },
  { text: 'Catai', lon: 112, lat: 37, size: 1.2 },
  { text: 'Mangi', lon: 113, lat: 27.5, size: 1.1 },
  { text: 'India', lon: 78, lat: 21, size: 1.2 },
  { text: "Mare d'India", lon: 67, lat: 10, size: 1 },
  { text: 'Mare di Cin', lon: 117, lat: 15, size: 1 },
  { text: 'Giava la Minore', lon: 101.5, lat: -2.5, size: 0.7 },
  { text: 'Ciamba', lon: 107.5, lat: 14.5, size: 0.6 },
]

// Città di raccordo segnate in piccolo sulla carta
export const MINOR_PLACES = [
  { name: 'Tauris', lon: 46.29, lat: 38.08 },
  { name: 'Chermain', lon: 57.08, lat: 30.28 },
  { name: 'Balac', lon: 66.9, lat: 36.76 },
  { name: 'Cascar', lon: 75.99, lat: 39.47 },
  { name: 'Cotam', lon: 79.92, lat: 37.11 },
  { name: 'Saciu', lon: 94.66, lat: 40.14 },
  { name: 'Campiciu', lon: 100.45, lat: 38.93 },
  { name: 'Costantinopoli', lon: 28.97, lat: 41.01 },
  { name: 'Curzola', lon: 16.95, lat: 42.95 },
  { name: 'Maabar', lon: 79.2, lat: 10.6 },
  { name: 'Caragian', lon: 100.2, lat: 25.6 },
]

// ---------- campionamento della rotta ----------
const STEP = 0.35

function densify(pts) {
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    const [a0, a1] = pts[i]
    const [b0, b1] = pts[i + 1]
    const d = Math.hypot(b0 - a0, b1 - a1)
    const n = Math.max(1, Math.ceil(d / STEP))
    for (let k = 0; k < n; k++) out.push({ lon: a0 + ((b0 - a0) * k) / n, lat: a1 + ((b1 - a1) * k) / n, label: k === 0 ? pts[i][2] : undefined })
  }
  const last = pts[pts.length - 1]
  out.push({ lon: last[0], lat: last[1], label: last[2] })
  return out
}

// Restituisce i campioni della rotta principale con modalità (mare/terra) e anno.
export function buildRouteSamples() {
  const samples = []
  for (const leg of LEGS) {
    const d = densify(leg.pts)
    d.forEach((s, i) => {
      if (samples.length && i === 0) {
        const prev = samples[samples.length - 1]
        if (!prev.label && s.label) prev.label = s.label
        return
      }
      samples.push({ ...s, mode: leg.mode, year: leg.year })
    })
  }
  return samples
}

export function densifyBranch(pts) {
  return densify(pts)
}
