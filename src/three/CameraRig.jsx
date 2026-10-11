import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { MAP_W, MAP_H } from '../data/geo.js'
import { sampleAt } from './world.js'
import { live } from '../store.js'

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const tmp = new THREE.Vector3()

// Volo della camera verso la tappa scelta; in modalità "segui" accompagna la carovana.
export default function CameraRig({ world, focus, focusKey, distance = 17, follow }) {
  const controls = useThree((s) => s.controls)
  const camera = useThree((s) => s.camera)
  const anim = useRef(null)

  useEffect(() => {
    if (controls) controls.target.set(-30, 0, -5)
  }, [controls])

  useEffect(() => {
    if (!controls || !focus) return
    const dir = camera.position.clone().sub(controls.target)
    const sph = new THREE.Spherical().setFromVector3(dir)
    sph.radius = distance
    sph.phi = THREE.MathUtils.clamp(sph.phi, 0.55, 0.95)
    const toTarget = focus.clone()
    const toCam = toTarget.clone().add(new THREE.Vector3().setFromSpherical(sph))
    anim.current = {
      t: 0,
      dur: 2.2,
      fromTarget: controls.target.clone(),
      toTarget,
      fromCam: camera.position.clone(),
      toCam,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey, controls])

  useFrame((_, dt) => {
    if (!controls) return
    const a = anim.current
    if (a) {
      a.t = Math.min(1, a.t + dt / a.dur)
      const k = ease(a.t)
      controls.target.lerpVectors(a.fromTarget, a.toTarget, k)
      camera.position.lerpVectors(a.fromCam, a.toCam, k)
      // arco: la camera si alza a metà volo per mostrare il paesaggio
      camera.position.y += Math.sin(k * Math.PI) * a.fromTarget.distanceTo(a.toTarget) * 0.18
      if (a.t >= 1) anim.current = null
    } else if (follow) {
      sampleAt(world.main, live.u, tmp)
      const d = tmp.sub(controls.target).multiplyScalar(Math.min(1, dt * 2.5))
      controls.target.add(d)
      camera.position.add(d)
    }
    // la camera resta sopra la carta
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -MAP_W / 2, MAP_W / 2)
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, -MAP_H / 2, MAP_H / 2)
    controls.update()
  })
  return null
}
