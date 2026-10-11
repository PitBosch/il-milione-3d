import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sampleAt } from './world.js'
import { travelStore, live } from '../store.js'

// ---------- materiali condivisi ----------
const M = {
  wood: new THREE.MeshStandardMaterial({ color: '#6b3f22', roughness: 0.8 }),
  woodDark: new THREE.MeshStandardMaterial({ color: '#43260f', roughness: 0.85 }),
  rope: new THREE.MeshStandardMaterial({ color: '#2a1a0e' }),
  skin: new THREE.MeshStandardMaterial({ color: '#d9a77c', roughness: 0.7 }),
  camel: new THREE.MeshStandardMaterial({ color: '#c49a5e', roughness: 0.9 }),
  camelDark: new THREE.MeshStandardMaterial({ color: '#8f6a3b', roughness: 0.9 }),
  cloth: new THREE.MeshStandardMaterial({ color: '#8e2a22', roughness: 0.8 }),
  gold: new THREE.MeshStandardMaterial({ color: '#c9a04a', roughness: 0.35, metalness: 0.7 }),
}

// I tre viaggiatori: Marco in rosso veneziano, Niccolò in blu, Maffeo in verde
const PEOPLE = {
  marco: { robe: '#a3271f', hat: '#5b1410', hatType: 'cap' },
  niccolo: { robe: '#1f3f6b', hat: '#e9dcc0', hatType: 'turban' },
  maffeo: { robe: '#2f5a33', hat: '#3b2a17', hatType: 'hood' },
}

function Person({ who, walking = false, phase = 0, scale = 1 }) {
  const ref = useRef()
  const p = PEOPLE[who]
  const robe = useMemo(() => new THREE.MeshStandardMaterial({ color: p.robe, roughness: 0.75 }), [p])
  const hat = useMemo(() => new THREE.MeshStandardMaterial({ color: p.hat, roughness: 0.7 }), [p])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime * 7 + phase
    const moving = walking && travelStore.get().moving
    ref.current.position.y = moving ? Math.abs(Math.sin(t)) * 0.05 : 0
    ref.current.rotation.z = moving ? Math.sin(t) * 0.06 : 0
  })
  return (
    <group ref={ref} scale={scale}>
      <mesh material={robe} position={[0, 0.26, 0]}>
        <coneGeometry args={[0.15, 0.52, 10]} />
      </mesh>
      <mesh material={robe} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.08, 10, 8]} />
      </mesh>
      <mesh material={M.skin} position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.075, 12, 10]} />
      </mesh>
      {p.hatType === 'cap' && (
        <mesh material={hat} position={[0, 0.67, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.08, 10]} />
        </mesh>
      )}
      {p.hatType === 'turban' && (
        <mesh material={hat} position={[0, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.035, 8, 14]} />
        </mesh>
      )}
      {p.hatType === 'hood' && (
        <mesh material={hat} position={[0, 0.68, 0]}>
          <coneGeometry args={[0.085, 0.16, 10]} />
        </mesh>
      )}
      {who === 'marco' && (
        <mesh material={M.woodDark} position={[0.14, 0.32, 0.06]} rotation={[0, 0, -0.12]}>
          <cylinderGeometry args={[0.012, 0.012, 0.7, 5]} />
        </mesh>
      )}
    </group>
  )
}

function Camel({ rider, phase = 0 }) {
  const legs = useRef([])
  const neck = useRef()
  useFrame(({ clock }) => {
    const moving = travelStore.get().moving
    const t = clock.elapsedTime * 5 + phase
    legs.current.forEach((l, i) => {
      if (l) l.rotation.z = moving ? Math.sin(t + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)) * 0.45 : 0
    })
    if (neck.current) neck.current.rotation.z = 0.6 + (moving ? Math.sin(t * 2) * 0.05 : Math.sin(clock.elapsedTime) * 0.04)
  })
  const legPos = [
    [0.22, 0.05],
    [0.22, -0.05],
    [-0.22, 0.05],
    [-0.22, -0.05],
  ]
  return (
    <group>
      <mesh material={M.camel} position={[0, 0.55, 0]} scale={[0.42, 0.2, 0.17]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh material={M.camel} position={[-0.02, 0.73, 0]} scale={[0.17, 0.14, 0.12]}>
        <sphereGeometry args={[1, 12, 10]} />
      </mesh>
      <group ref={neck} position={[0.36, 0.6, 0]}>
        <mesh material={M.camel} position={[0.13, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.07, 0.3, 8]} />
        </mesh>
        <mesh material={M.camelDark} position={[0.3, -0.02, 0]} rotation={[0, 0, -0.9]}>
          <boxGeometry args={[0.1, 0.18, 0.09]} />
        </mesh>
      </group>
      {legPos.map(([x, z], i) => (
        <group key={i} position={[x, 0.45, z]} ref={(el) => (legs.current[i] = el)}>
          <mesh material={M.camelDark} position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.028, 0.022, 0.45, 6]} />
          </mesh>
        </group>
      ))}
      {/* sella e drappo */}
      <mesh material={M.cloth} position={[-0.02, 0.8, 0]}>
        <boxGeometry args={[0.28, 0.04, 0.3]} />
      </mesh>
      <mesh material={M.gold} position={[-0.3, 0.6, 0]}>
        <boxGeometry args={[0.14, 0.14, 0.32]} />
      </mesh>
      {rider && (
        <group position={[-0.02, 0.78, 0]}>
          <Person who={rider} scale={0.85} />
        </group>
      )}
    </group>
  )
}

function sailTexture() {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#efe2c2'
  g.fillRect(0, 0, 128, 128)
  g.fillStyle = '#a3271f'
  g.fillRect(0, 0, 128, 16)
  g.fillRect(0, 112, 128, 16)
  g.beginPath()
  g.arc(64, 64, 26, 0, Math.PI * 2)
  g.fillStyle = '#b8892f'
  g.fill()
  g.fillStyle = '#a3271f'
  g.font = 'bold 34px serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText('✠', 64, 66)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function Ship() {
  const flag = useRef()
  const sail = useRef()
  const { hull, sailGeo, sailMat, flagGeo, base } = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-1.0, 0.38)
    s.lineTo(-0.95, -0.05)
    s.quadraticCurveTo(-0.7, -0.32, -0.3, -0.32)
    s.lineTo(0.55, -0.32)
    s.quadraticCurveTo(0.95, -0.25, 1.2, 0.42)
    s.lineTo(1.0, 0.3)
    s.lineTo(-1.0, 0.38)
    const hull = new THREE.ExtrudeGeometry(s, { depth: 0.46, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 2 })
    hull.translate(0, 0, -0.23)
    const sailGeo = new THREE.PlaneGeometry(1.15, 1.0, 10, 8)
    const pos = sailGeo.attributes.position
    const base = Float32Array.from(pos.array)
    const flagGeo = new THREE.PlaneGeometry(0.4, 0.22, 8, 2)
    flagGeo.translate(0.2, 0, 0)
    const sailMat = new THREE.MeshStandardMaterial({ map: sailTexture(), side: THREE.DoubleSide, roughness: 0.9 })
    return { hull, sailGeo, sailMat, flagGeo, base }
  }, [])
  const flagBase = useMemo(() => Float32Array.from(flagGeo.attributes.position.array), [flagGeo])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // vela gonfiata dal vento
    const pos = sailGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3]
      const y = base[i * 3 + 1]
      const belly = Math.cos((x / 1.15) * Math.PI) * Math.cos((y / 1.0) * Math.PI * 0.5)
      pos.setZ(i, belly * (0.22 + Math.sin(t * 1.7) * 0.03))
    }
    pos.needsUpdate = true
    const fp = flagGeo.attributes.position
    for (let i = 0; i < fp.count; i++) {
      const x = flagBase[i * 3]
      fp.setZ(i, Math.sin(x * 12 - t * 8) * 0.04 * x * 2.5)
    }
    fp.needsUpdate = true
  })

  return (
    <group>
      <mesh geometry={hull} material={M.wood} />
      <mesh material={M.woodDark} position={[0.05, 0.43, 0]}>
        <boxGeometry args={[1.9, 0.05, 0.5]} />
      </mesh>
      {/* castello di poppa */}
      <mesh material={M.wood} position={[-0.78, 0.6, 0]}>
        <boxGeometry args={[0.42, 0.32, 0.56]} />
      </mesh>
      <mesh material={M.gold} position={[-0.78, 0.77, 0]}>
        <boxGeometry args={[0.46, 0.03, 0.6]} />
      </mesh>
      {/* albero, pennone, vela */}
      <mesh material={M.woodDark} position={[0.15, 1.25, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 1.7, 8]} />
      </mesh>
      <mesh material={M.woodDark} position={[0.15, 1.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.3, 6]} />
      </mesh>
      <mesh ref={sail} geometry={sailGeo} material={sailMat} position={[0.2, 1.33, 0]} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={flagGeo} position={[0.15, 2.13, 0]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#a3271f" side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={flag} material={M.rope} position={[0.62, 0.95, 0]} rotation={[0, 0, 0.75]}>
        <cylinderGeometry args={[0.006, 0.006, 1.5, 3]} />
      </mesh>
      {/* i tre Polo a bordo */}
      <group position={[0.65, 0.45, 0.1]} scale={0.7}>
        <Person who="marco" />
      </group>
      <group position={[-0.35, 0.45, -0.12]} scale={0.7}>
        <Person who="niccolo" />
      </group>
      <group position={[-0.3, 0.45, 0.14]} scale={0.7}>
        <Person who="maffeo" />
      </group>
    </group>
  )
}

const tmp = new THREE.Vector3()
const tmp2 = new THREE.Vector3()

function headingAt(line, u, eps) {
  sampleAt(line, Math.max(0, u - eps), tmp)
  sampleAt(line, Math.min(1, u + eps), tmp2)
  return Math.atan2(-(tmp2.z - tmp.z), tmp2.x - tmp.x)
}

// Gestisce l'avanzamento del viaggio verso la tappa scelta e posiziona nave e carovana.
export default function Travelers({ world, targetU, onArrive, scale = 0.62 }) {
  const ship = useRef()
  const caravan = useRef()
  const members = useRef([])
  const u = useRef(live.u)
  const shipVis = useRef(world.modeAt(live.u) === 'sea' ? 1 : 0)
  const arrivedFor = useRef(null)
  const startDelta = useRef(0)

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const target = targetU
    const delta = target - u.current
    if (Math.abs(delta) > 1e-5 && arrivedFor.current === target) arrivedFor.current = null
    if (startDelta.current === 0 || Math.sign(delta) !== Math.sign(startDelta.current)) startDelta.current = delta
    // ogni spostamento dura al più ~6 secondi, con accelerazione e frenata morbide
    const total = world.main.total
    const minSpeed = 9 / total
    const speed = Math.max(minSpeed, Math.abs(startDelta.current) / 5.5)
    const ease = Math.min(1, Math.abs(delta) / (speed * 0.9) + 0.08)
    const step = Math.sign(delta) * Math.min(Math.abs(delta), speed * ease * dt)
    u.current += step
    const moving = Math.abs(delta) > 1e-4
    if (!moving && arrivedFor.current !== target) {
      u.current = target
      arrivedFor.current = target
      startDelta.current = 0
      onArrive?.()
    }
    live.u = u.current

    const mode = world.modeAt(u.current)
    travelStore.set({ progress: u.current, mode, year: world.yearAt(u.current), moving })

    // dissolvenza tra nave e carovana nei porti
    shipVis.current += ((mode === 'sea' ? 1 : 0) - shipVis.current) * Math.min(1, dt * 5)
    const t = state.clock.elapsedTime
    const dir = Math.sign(delta) || 1
    const eps = 0.25 / total

    if (ship.current) {
      sampleAt(world.main, u.current, tmp)
      const s = shipVis.current * scale
      ship.current.visible = s > 0.02
      ship.current.scale.setScalar(Math.max(s, 0.001))
      ship.current.position.set(tmp.x, tmp.y - 0.05 + Math.sin(t * 1.6) * 0.03, tmp.z)
      const h = headingAt(world.main, u.current, eps) + (dir < 0 ? Math.PI : 0)
      ship.current.rotation.set(Math.sin(t * 1.3) * 0.05, h, Math.sin(t * 1.1) * 0.03)
    }
    if (caravan.current) {
      const s = (1 - shipVis.current) * scale
      caravan.current.visible = s > 0.02
      members.current.forEach((m, i) => {
        if (!m) return
        const back = (i * 0.75 * scale) / total
        const uu = Math.min(1, Math.max(0, u.current - back * dir))
        sampleAt(world.main, uu, tmp)
        m.position.set(tmp.x, tmp.y - 0.12, tmp.z)
        m.scale.setScalar(Math.max(s, 0.001))
        m.rotation.y = headingAt(world.main, uu, eps) + (dir < 0 ? Math.PI : 0)
      })
    }
  })

  return (
    <>
      <group ref={ship}>
        <Ship />
      </group>
      <group ref={caravan}>
        <group ref={(el) => (members.current[0] = el)}>
          <Person who="marco" walking phase={0} />
        </group>
        <group ref={(el) => (members.current[1] = el)}>
          <Camel rider="niccolo" phase={1} />
        </group>
        <group ref={(el) => (members.current[2] = el)}>
          <Camel rider="maffeo" phase={2.2} />
        </group>
        <group ref={(el) => (members.current[3] = el)}>
          <Camel phase={3.1} />
        </group>
      </group>
    </>
  )
}
