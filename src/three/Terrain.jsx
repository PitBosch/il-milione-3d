import { useMemo } from 'react'
import * as THREE from 'three'
import { GW, GH } from './heightfield.js'
import { MAP_W, MAP_H } from '../data/geo.js'

const SEG_X = 700
const SEG_Z = Math.round((SEG_X * MAP_H) / MAP_W)

export default function Terrain({ hf }) {
  const { geometry, texture } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(MAP_W, MAP_H, SEG_X, SEG_Z)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position
    for (let iz = 0; iz <= SEG_Z; iz++) {
      for (let ix = 0; ix <= SEG_X; ix++) {
        const v = iz * (SEG_X + 1) + ix
        const gx = Math.round((ix / SEG_X) * (GW - 1))
        const gy = Math.round((iz / SEG_Z) * (GH - 1))
        pos.setY(v, hf.heights[gy * GW + gx])
      }
    }
    geo.computeVertexNormals()
    const tex = new THREE.CanvasTexture(hf.texture)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return { geometry: geo, texture: tex }
  }, [hf])

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial map={texture} roughness={0.95} metalness={0} />
      </mesh>
      <MapFrame />
    </group>
  )
}

// cornice di legno e oro attorno alla carta, appoggiata su un grande tavolo scuro
function MapFrame() {
  const t = 1.2
  const y = -0.6
  const wood = <meshStandardMaterial color="#3a2414" roughness={0.7} />
  const gold = <meshStandardMaterial color="#b88a3b" roughness={0.35} metalness={0.7} />
  return (
    <group>
      {[
        [0, y, -MAP_H / 2 - t / 2, MAP_W + 2 * t, t],
        [0, y, MAP_H / 2 + t / 2, MAP_W + 2 * t, t],
      ].map(([x, yy, z, w, d], i) => (
        <group key={'h' + i}>
          <mesh position={[x, yy, z]}>
            <boxGeometry args={[w, 1.6, d]} />
            {wood}
          </mesh>
          <mesh position={[x, yy + 0.82, z]}>
            <boxGeometry args={[w, 0.06, 0.25]} />
            {gold}
          </mesh>
        </group>
      ))}
      {[
        [-MAP_W / 2 - t / 2, y, 0, t, MAP_H],
        [MAP_W / 2 + t / 2, y, 0, t, MAP_H],
      ].map(([x, yy, z, w, d], i) => (
        <group key={'v' + i}>
          <mesh position={[x, yy, z]}>
            <boxGeometry args={[w, 1.6, d]} />
            {wood}
          </mesh>
          <mesh position={[x, yy + 0.82, z]}>
            <boxGeometry args={[0.25, 0.06, d]} />
            {gold}
          </mesh>
        </group>
      ))}
      <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[MAP_W * 4, MAP_H * 6]} />
        <meshStandardMaterial color="#20150d" roughness={0.9} />
      </mesh>
    </group>
  )
}
