import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Terrain from './Terrain.jsx'
import Water from './Water.jsx'
import { MainRoute, Branches } from './Route.jsx'
import { StopMarkers, RegionLabels } from './Markers.jsx'
import Travelers from './Travelers.jsx'
import CameraRig from './CameraRig.jsx'
import Clouds from './Clouds.jsx'

export default function Scene({ world, selectedId, onSelect, targetU, onArrive, focus, focusKey, follow, showLabels }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [-30, 60, 45], fov: 42, near: 0.1, far: 600 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.98 }}
      onPointerMissed={() => (document.body.style.cursor = '')}
    >
      <color attach="background" args={['#1a120c']} />
      <fog attach="fog" args={['#1a120c', 90, 230]} />
      <hemisphereLight args={['#fff1d6', '#3b2a1a', 0.85]} />
      <directionalLight position={[-40, 60, -30]} intensity={1.7} color="#fff0d6" />
      <directionalLight position={[50, 30, 40]} intensity={0.35} color="#9fb7d9" />

      <Terrain hf={world.hf} />
      <Water hf={world.hf} />
      <MainRoute world={world} />
      <Branches world={world} selectedId={selectedId} />
      <StopMarkers world={world} selectedId={selectedId} onSelect={onSelect} />
      {showLabels && <RegionLabels />}
      <Travelers world={world} targetU={targetU} onArrive={onArrive} />
      <Clouds />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={140}
        maxPolarAngle={1.3}
        screenSpacePanning={false}
      />
      <CameraRig world={world} focus={focus} focusKey={focusKey} follow={follow} />
    </Canvas>
  )
}
