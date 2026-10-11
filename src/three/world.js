import * as THREE from 'three'
import { getHeightfield, heightAt } from './heightfield.js'
import { project } from '../data/geo.js'
import { buildRouteSamples, BRANCHES, densifyBranch } from '../data/route.js'
import { CHAPTERS } from '../data/chapters.js'

export const SEA_Y = 0.16
const LAND_OFFSET = 0.14

function toVec(lon, lat, mode) {
  const [x, z] = project(lon, lat)
  if (mode === 'sea') return new THREE.Vector3(x, SEA_Y, z)
  // il tracciato di terra resta sopra il rilievo, anche nei passi più stretti
  let h = heightAt(lon, lat)
  h = Math.max(h, heightAt(lon + 0.15, lat), heightAt(lon - 0.15, lat), heightAt(lon, lat + 0.15), heightAt(lon, lat - 0.15))
  return new THREE.Vector3(x, Math.max(h, 0.05) + LAND_OFFSET, z)
}

function polyline(points) {
  const cum = [0]
  for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + points[i].distanceTo(points[i - 1]))
  const total = cum[cum.length - 1]
  return { points, cum, total, frac: cum.map((c) => c / total) }
}

// posizione lungo una polilinea alla frazione u (0..1)
export function sampleAt(line, u, out = new THREE.Vector3()) {
  const d = Math.min(1, Math.max(0, u)) * line.total
  let lo = 0
  let hi = line.cum.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (line.cum[mid] <= d) lo = mid
    else hi = mid
  }
  const seg = line.cum[hi] - line.cum[lo] || 1
  return out.lerpVectors(line.points[lo], line.points[hi], (d - line.cum[lo]) / seg)
}

export function indexAt(line, u) {
  const d = Math.min(1, Math.max(0, u)) * line.total
  let lo = 0
  let hi = line.cum.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (line.cum[mid] <= d) lo = mid
    else hi = mid
  }
  return lo
}

export function buildWorld() {
  const hf = getHeightfield()
  const samples = buildRouteSamples()
  // ammorbidisce i passaggi mare/terra nei porti
  const pts = samples.map((s) => toVec(s.lon, s.lat, s.mode))
  const main = polyline(pts)
  main.samples = samples
  main.curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')

  const labelU = {}
  samples.forEach((s, i) => {
    if (s.label && labelU[s.label] === undefined) labelU[s.label] = main.frac[i]
  })

  const branches = BRANCHES.map((b) => {
    const d = densifyBranch(b.pts)
    const bp = d.map((s) => toVec(s.lon, s.lat, 'land'))
    const line = polyline(bp)
    line.curve = new THREE.CatmullRomCurve3(bp, false, 'centripetal')
    return { ...b, line, junctionU: labelU[b.from] }
  })

  const stops = CHAPTERS.map((c) => {
    const branch = branches.find((b) => b.stop === c.id)
    const [lon, lat] = c.coords
    const pos = toVec(lon, lat, 'land')
    const [x, z] = project(lon, lat)
    const ground = Math.max(heightAt(lon, lat), SEA_Y)
    return {
      id: c.id,
      chapter: c,
      u: branch ? branch.junctionU : labelU['stop:' + c.id],
      branch: branch || null,
      pos,
      marker: new THREE.Vector3(x, ground, z),
    }
  })
  stops.forEach((s) => {
    if (s.u === undefined) console.warn('Tappa senza posizione sulla rotta:', s.id)
  })

  // anni lungo la rotta, per l'indicatore cronologico
  const yearKeys = stops
    .filter((s) => !s.branch)
    .map((s) => ({ u: s.u, year: s.chapter.year }))
    .sort((a, b) => a.u - b.u)

  function yearAt(u) {
    if (u <= yearKeys[0].u) return yearKeys[0].year
    for (let i = 1; i < yearKeys.length; i++) {
      const a = yearKeys[i - 1]
      const b = yearKeys[i]
      if (u <= b.u) return Math.round(a.year + ((b.year - a.year) * (u - a.u)) / (b.u - a.u || 1))
    }
    return yearKeys[yearKeys.length - 1].year
  }

  function modeAt(u) {
    return samples[indexAt(main, u)].mode
  }

  return { hf, main, branches, stops, labelU, yearAt, modeAt }
}
