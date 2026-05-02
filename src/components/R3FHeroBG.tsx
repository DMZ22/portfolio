import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function StarField({ count = 1800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const red = new THREE.Color('#ff2447')
    const blue = new THREE.Color('#2c5bff')
    const bone = new THREE.Color('#ebe6db')
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.4
      const t = Math.random()
      const c = t < 0.7 ? red : t < 0.9 ? bone : blue
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    mouse.current.x += (target.current.x - mouse.current.x) * 0.04
    mouse.current.y += (target.current.y - mouse.current.y) * 0.04
    ref.current.rotation.y += delta * 0.04
    ref.current.rotation.x = mouse.current.y * 0.25
    ref.current.rotation.z = mouse.current.x * 0.18
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function Rings() {
  const g1 = useRef<THREE.Mesh>(null!)
  const g2 = useRef<THREE.Mesh>(null!)
  const g3 = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    if (g1.current) { g1.current.rotation.x += delta * 0.25; g1.current.rotation.z += delta * 0.1 }
    if (g2.current) { g2.current.rotation.y += delta * 0.2; g2.current.rotation.x += delta * 0.05 }
    if (g3.current) { g3.current.rotation.z += delta * 0.15; g3.current.rotation.x -= delta * 0.08 }
  })
  return (
    <group>
      <mesh ref={g1}>
        <torusGeometry args={[2.4, 0.008, 16, 128]} />
        <meshBasicMaterial color="#ff2447" transparent opacity={0.55} />
      </mesh>
      <mesh ref={g2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.2, 0.005, 16, 128]} />
        <meshBasicMaterial color="#2c5bff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={g3} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[4.2, 0.004, 16, 128]} />
        <meshBasicMaterial color="#ebe6db" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

function Scene() {
  const { size } = useThree()
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ff2447" />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#2c5bff" />
      <Rings />
      <StarField count={size.width < 768 ? 900 : 1800} />
    </>
  )
}

export default function R3FHeroBG() {
  return (
    <div className="absolute inset-0">
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.6]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
