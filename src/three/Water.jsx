import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GW, GH } from './heightfield.js'
import { MAP_W, MAP_H } from '../data/geo.js'

// Mare stilizzato: trasparenza e colore dipendono dalla profondità del fondale,
// con linee di costa incise che si muovono lentamente, come nelle carte nautiche antiche.
export default function Water({ hf }) {
  const mat = useRef()
  const uniforms = useMemo(() => {
    // quote codificate in 8 bit (h ∈ [-2, 2]) per funzionare anche su GPU mobili senza texture float filtrabili
    const data = new Uint8Array(GW * GH)
    for (let i = 0; i < data.length; i++) data[i] = Math.max(0, Math.min(255, Math.round(((hf.heights[i] + 2) / 4) * 255)))
    const tex = new THREE.DataTexture(data, GW, GH, THREE.RedFormat, THREE.UnsignedByteType)
    tex.unpackAlignment = 1
    tex.flipY = false
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.needsUpdate = true
    return {
      uHeight: { value: tex },
      uTime: { value: 0 },
      uShallow: { value: new THREE.Color('#5d9a98') },
      uDeep: { value: new THREE.Color('#123848') },
      uInk: { value: new THREE.Color('#e9dcb5') },
    }
  }, [hf])

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} renderOrder={1}>
      <planeGeometry args={[MAP_W, MAP_H, 1, 1]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uHeight;
          uniform float uTime;
          uniform vec3 uShallow;
          uniform vec3 uDeep;
          uniform vec3 uInk;
          varying vec2 vUv;
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
          }
          void main() {
            // la texture delle quote ha la riga 0 a nord: uv.y del piano cresce verso nord
            float h = texture2D(uHeight, vec2(vUv.x, 1.0 - vUv.y)).r * 4.0 - 2.0;
            if (h > 0.03) discard;
            float depth = clamp(-h / 1.4, 0.0, 1.0);
            vec3 col = mix(uShallow, uDeep, smoothstep(0.0, 0.7, depth));
            vec2 p = vUv * vec2(150.0, 80.0);
            float n = noise(p * 0.8 + vec2(uTime * 0.15, uTime * 0.05)) * 0.5 + noise(p * 2.3 - vec2(uTime * 0.2, 0.0)) * 0.5;
            col += (n - 0.5) * 0.07;
            // linee di costa incise
            float band = sin(depth * 70.0 - uTime * 0.8 + n * 2.0);
            float line = smoothstep(0.92, 1.0, band) * (1.0 - smoothstep(0.05, 0.35, depth));
            col = mix(col, uInk, line * 0.35);
            // scintillio
            float glint = smoothstep(0.82, 0.95, noise(p * 3.0 + uTime * 0.4));
            col += glint * 0.06;
            float alpha = mix(0.35, 0.82, smoothstep(0.0, 0.35, depth));
            alpha *= smoothstep(0.03, -0.02, h);
            gl_FragColor = vec4(col, alpha);
            #include <colorspace_fragment>
          }
        `}
      />
    </mesh>
  )
}
