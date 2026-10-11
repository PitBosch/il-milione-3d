import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { live } from '../store.js'

const vertex = `
  varying float vAlong;
  void main() {
    vAlong = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Tracciato principale: oro brunito per il tratto già percorso, rosso cinabro tratteggiato per quello da percorrere.
const mainFragment = `
  uniform float uProgress;
  uniform float uTime;
  uniform float uLength;
  varying float vAlong;
  void main() {
    vec3 done = vec3(0.93, 0.72, 0.30);
    vec3 todo = vec3(0.62, 0.13, 0.10);
    float traveled = step(vAlong, uProgress);
    float dash = fract(vAlong * uLength / 0.9 - uTime * 0.25);
    if (traveled < 0.5 && dash > 0.6) discard;
    float glow = traveled * (0.75 + 0.25 * sin(vAlong * uLength * 0.8 - uTime * 3.0));
    vec3 col = mix(todo, done * (0.85 + 0.3 * glow), traveled);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

const branchFragment = `
  uniform float uTime;
  uniform float uLength;
  uniform vec3 uColor;
  uniform float uActive;
  varying float vAlong;
  void main() {
    float dash = fract(vAlong * uLength / 0.5 - uTime * 0.4);
    if (dash > 0.45) discard;
    gl_FragColor = vec4(uColor * (0.8 + uActive * 0.6), 1.0);
    #include <colorspace_fragment>
  }
`

export function MainRoute({ world }) {
  const mat = useRef()
  const geometry = useMemo(
    () => new THREE.TubeGeometry(world.main.curve, world.main.points.length * 2, 0.075, 6, false),
    [world]
  )
  const uniforms = useMemo(
    () => ({ uProgress: { value: 0 }, uTime: { value: 0 }, uLength: { value: world.main.total } }),
    [world]
  )
  useFrame((_, dt) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value += dt
    mat.current.uniforms.uProgress.value = live.u
  })
  return (
    <mesh geometry={geometry} renderOrder={2}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={mainFragment} />
    </mesh>
  )
}

const BRANCH_COLORS = { descritto: '#7d5a9e', missione: '#3f8a73' }

export function Branches({ world, selectedId }) {
  return world.branches.map((b) => <Branch key={b.stop} branch={b} active={selectedId === b.stop} />)
}

function Branch({ branch, active }) {
  const mat = useRef()
  const geometry = useMemo(
    () => new THREE.TubeGeometry(branch.line.curve, branch.line.points.length * 2, 0.05, 5, false),
    [branch]
  )
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLength: { value: branch.line.total },
      uColor: { value: new THREE.Color(BRANCH_COLORS[branch.kind]) },
      uActive: { value: 0 },
    }),
    [branch]
  )
  useFrame((_, dt) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value += dt
    const u = mat.current.uniforms.uActive
    u.value += ((active ? 1 : 0) - u.value) * Math.min(1, dt * 4)
  })
  return (
    <mesh geometry={geometry} renderOrder={2}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={branchFragment} />
    </mesh>
  )
}
