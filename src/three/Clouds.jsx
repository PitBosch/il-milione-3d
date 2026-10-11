import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MAP_W, MAP_H } from '../data/geo.js'

function cloudTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  for (let i = 0; i < 7; i++) {
    const x = 34 + Math.random() * 60
    const y = 50 + Math.random() * 28
    const r = 22 + Math.random() * 18
    const grd = g.createRadialGradient(x, y, 0, x, y, r)
    grd.addColorStop(0, 'rgba(255,248,232,0.55)')
    grd.addColorStop(1, 'rgba(255,248,232,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 128, 128)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Nuvole leggere che scorrono sopra la carta, da ovest verso est
export default function Clouds({ count = 16 }) {
  const group = useRef()
  const items = useMemo(() => {
    const tex = cloudTexture()
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * MAP_W,
      z: (Math.random() - 0.5) * MAP_H,
      y: 7 + Math.random() * 5,
      s: 8 + Math.random() * 10,
      v: 0.4 + Math.random() * 0.6,
      mat: new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.5 + Math.random() * 0.3 }),
    }))
  }, [count])
  useFrame((_, dt) => {
    group.current?.children.forEach((sp, i) => {
      sp.position.x += items[i].v * dt
      if (sp.position.x > MAP_W / 2 + 10) sp.position.x = -MAP_W / 2 - 10
    })
  })
  return (
    <group ref={group}>
      {items.map((c, i) => (
        <sprite key={i} material={c.mat} position={[c.x, c.y, c.z]} scale={[c.s, c.s * 0.55, 1]} />
      ))}
    </group>
  )
}
