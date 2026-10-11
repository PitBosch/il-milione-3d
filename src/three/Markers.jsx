import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { project } from '../data/geo.js'
import { heightAt } from './heightfield.js'
import { REGION_LABELS, MINOR_PLACES } from '../data/route.js'

const KIND_COLOR = { rotta: '#a3271f', descritto: '#6c4a8e', missione: '#2f7a63' }

export function StopMarkers({ world, selectedId, onSelect }) {
  return (
    <>
      {/* segnaposto vuoto: con drei 10 / React 19 il primo <Html> montato nella scena può restare vuoto */}
      <Html>
        <span />
      </Html>
      {world.stops.map((s, i) => (
        <StopMarker key={s.id} stop={s} index={i + 1} selected={selectedId === s.id} onSelect={onSelect} />
      ))}
    </>
  )
}

function StopMarker({ stop, index, selected, onSelect }) {
  const seal = useRef()
  const [hover, setHover] = useState(false)
  const c = stop.chapter
  const color = c.kind === 'ricerca' ? '#8a6a2b' : KIND_COLOR[c.placement]
  const top = stop.marker.y + 0.9
  useFrame(({ clock }) => {
    if (!seal.current) return
    const t = clock.elapsedTime
    const s = selected ? 1.35 + Math.sin(t * 4) * 0.08 : hover ? 1.2 : 1
    seal.current.scale.setScalar(s)
    seal.current.rotation.y = t * 0.8
  })
  return (
    <group position={[stop.marker.x, 0, stop.marker.z]}>
      {/* asta e sigillo */}
      <mesh position={[0, stop.marker.y + 0.45, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 6]} />
        <meshStandardMaterial color="#2b1d12" />
      </mesh>
      <mesh
        ref={seal}
        position={[0, top, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(stop.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = ''
        }}
      >
        <cylinderGeometry args={[0.28, 0.28, 0.09, 20]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} emissive={color} emissiveIntensity={selected ? 0.5 : 0.15} />
      </mesh>
      <Html position={[0, top + 0.35, 0]} center zIndexRange={[20, 0]}>
        <div style={c.labelLift ? { transform: `translateY(${-c.labelLift * 30}px)` } : undefined}>
        <button
          className={`map-label ${selected ? 'is-selected' : ''} kind-${c.kind} place-${c.placement}`}
          onClick={() => onSelect(stop.id)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <span className="map-label__num">{index}</span>
          <span className="map-label__name">{c.title}</span>
          {(hover || selected) && <span className="map-label__year">{c.yearLabel}</span>}
        </button>
        </div>
      </Html>
    </group>
  )
}

export function RegionLabels() {
  return (
    <>
      {REGION_LABELS.map((r) => {
        const [x, z] = project(r.lon, r.lat)
        const y = Math.max(heightAt(r.lon, r.lat), 0) + 0.6
        return (
          <Html key={r.text} position={[x, y, z]} center zIndexRange={[5, 0]} pointerEvents="none">
            <div className="region-label" style={{ fontSize: `${Math.round(r.size * 15)}px` }}>
              {r.text}
            </div>
          </Html>
        )
      })}
      {MINOR_PLACES.map((p) => {
        const [x, z] = project(p.lon, p.lat)
        const y = Math.max(heightAt(p.lon, p.lat), 0) + 0.25
        return (
          <Html key={p.name} position={[x, y, z]} center zIndexRange={[6, 0]} pointerEvents="none">
            <div className="minor-label">
              <i />
              {p.name}
            </div>
          </Html>
        )
      })}
    </>
  )
}
