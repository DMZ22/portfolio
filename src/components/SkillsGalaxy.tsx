import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

const skills = [
  { label: 'Python', weight: 1 },
  { label: 'TypeScript', weight: 1 },
  { label: 'SQL', weight: 0.95 },
  { label: 'Django', weight: 0.95 },
  { label: 'FastAPI', weight: 0.9 },
  { label: 'React', weight: 0.95 },
  { label: 'Next.js', weight: 0.8 },
  { label: 'Node.js', weight: 0.8 },
  { label: 'PyTorch', weight: 0.9 },
  { label: 'TensorFlow', weight: 0.8 },
  { label: 'scikit-learn', weight: 0.85 },
  { label: 'XGBoost', weight: 0.85 },
  { label: 'LightGBM', weight: 0.75 },
  { label: 'LSTM', weight: 0.8 },
  { label: 'CNN', weight: 0.75 },
  { label: 'OpenCV', weight: 0.75 },
  { label: 'PostgreSQL', weight: 0.85 },
  { label: 'Redis', weight: 0.7 },
  { label: 'Docker', weight: 0.85 },
  { label: 'Azure', weight: 0.8 },
  { label: 'Streamlit', weight: 0.75 },
  { label: 'Tailwind', weight: 0.8 },
  { label: 'Framer Motion', weight: 0.75 },
  { label: 'Three.js', weight: 0.7 },
  { label: 'Gemini', weight: 0.75 },
  { label: 'GitHub', weight: 0.9 },
]

/** Procedural soft circle texture for points — avoids square sprites */
function useSoftPointTexture() {
  return useMemo(() => {
    const size = 128
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0.0, 'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.5)')
    g.addColorStop(1.0, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/** Dawn sky gradient background — wine/crimson/amber/gold (top → bottom) */
function useDawnSkyTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 4
    c.height = 1024
    const ctx = c.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, 0, 1024)
    g.addColorStop(0.00, '#0a0414') // deep night at zenith
    g.addColorStop(0.12, '#1a0a24') // dusky indigo
    g.addColorStop(0.28, '#3a1030') // wine
    g.addColorStop(0.45, '#6e1b3a') // deep rose
    g.addColorStop(0.62, '#b83a34') // warm crimson
    g.addColorStop(0.78, '#e26a2c') // ember orange
    g.addColorStop(0.90, '#f4a04a') // amber
    g.addColorStop(1.00, '#ffd9a0') // horizon gold
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 4, 1024)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.mapping = THREE.EquirectangularReflectionMapping
    return tex
  }, [])
}

/** Procedural radial corona texture for sun rays */
function useCoronaTexture() {
  return useMemo(() => {
    const size = 512
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0.0, 'rgba(255,240,210,1)')
    g.addColorStop(0.05, 'rgba(255,180,100,0.85)')
    g.addColorStop(0.22, 'rgba(255,90,40,0.3)')
    g.addColorStop(0.5, 'rgba(120,20,10,0.08)')
    g.addColorStop(1.0, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/** Horizontal anamorphic lens streak texture */
function useStreakTexture() {
  return useMemo(() => {
    const w = 1024, h = 64
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    const ctx = c.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0.0, 'rgba(255,200,140,0)')
    g.addColorStop(0.5, 'rgba(255,240,220,1)')
    g.addColorStop(1.0, 'rgba(255,200,140,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    // vertical soft falloff
    const g2 = ctx.createLinearGradient(0, 0, 0, h)
    g2.addColorStop(0.0, 'rgba(0,0,0,0)')
    g2.addColorStop(0.5, 'rgba(0,0,0,0.6)')
    g2.addColorStop(1.0, 'rgba(0,0,0,0)')
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = g2
    ctx.fillRect(0, 0, w, h)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/** One star layer — per-vertex color for spectral class */
function StarsLayer({
  count, radius, size, intensity = 1,
}: {
  count: number
  radius: number
  size: number
  intensity?: number
}) {
  const pointsRef = useRef<THREE.Points>(null!)
  const texture = useSoftPointTexture()

  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = radius * (0.85 + Math.random() * 0.3)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      // spectral tint — mostly white/bone, some blue-giants, yellow, red
      const t = Math.random()
      let r2 = 1, g2 = 1, b2 = 0.96
      if (t < 0.55)       { r2 = 1.00; g2 = 1.00; b2 = 0.95 }  // white
      else if (t < 0.78)  { r2 = 0.76; g2 = 0.85; b2 = 1.00 }  // blue
      else if (t < 0.92)  { r2 = 1.00; g2 = 0.84; b2 = 0.55 }  // yellow/gold
      else                { r2 = 1.00; g2 = 0.42; b2 = 0.30 }  // red
      colors[i * 3]     = r2 * intensity
      colors[i * 3 + 1] = g2 * intensity
      colors[i * 3 + 2] = b2 * intensity
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [count, radius, intensity])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.003
  })

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        size={size}
        sizeAttenuation
        vertexColors
        map={texture}
        alphaMap={texture}
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Foreground dust motes drifting near camera */
function Dust({ count = 250 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const tex = useSoftPointTexture()
  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 + 2
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [count])
  useFrame((state, d) => {
    if (!ref.current) return
    ref.current.rotation.y += d * 0.01
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.2
  })
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        color="#ffd9b0"
        map={tex}
        alphaMap={tex}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/** Occasional shooting star — a thin bright streak that fades */
function ShootingStars() {
  const ref = useRef<THREE.Group>(null!)
  type Shot = { life: number; max: number; from: THREE.Vector3; dir: THREE.Vector3 }
  const shots = useRef<Shot[]>([])

  useFrame((_, d) => {
    if (!ref.current) return
    // maybe spawn
    if (Math.random() < 0.012 && shots.current.length < 2) {
      const r = 9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const from = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      )
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
      ).normalize()
      shots.current.push({ life: 0, max: 1.0, from, dir })
    }
    // step
    for (const s of shots.current) s.life += d
    shots.current = shots.current.filter((s) => s.life < s.max)
    // rebuild children
    while (ref.current.children.length > shots.current.length) {
      ref.current.remove(ref.current.children[0])
    }
    while (ref.current.children.length < shots.current.length) {
      const g = new THREE.Group()
      const mat = new THREE.LineBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending,
      })
      const buf = new THREE.BufferGeometry()
      buf.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
      const line = new THREE.Line(buf, mat)
      g.add(line)
      ref.current.add(g)
    }
    shots.current.forEach((s, i) => {
      const g = ref.current.children[i] as THREE.Group
      const line = g.children[0] as THREE.Line
      const t = s.life / s.max
      const head = s.from.clone().add(s.dir.clone().multiplyScalar(s.life * 7))
      const tail = head.clone().sub(s.dir.clone().multiplyScalar(0.7))
      const pos = line.geometry.attributes.position as THREE.BufferAttribute
      pos.setXYZ(0, head.x, head.y, head.z)
      pos.setXYZ(1, tail.x, tail.y, tail.z)
      pos.needsUpdate = true
      ;(line.material as THREE.LineBasicMaterial).opacity = 1 - t
    })
  })

  return <group ref={ref} />
}

/** Central glowing sun with corona, lens streak, and radial rays */
function Sun() {
  const core = useRef<THREE.Mesh>(null!)
  const wire = useRef<THREE.Mesh>(null!)
  const halo1 = useRef<THREE.Mesh>(null!)
  const corona = useRef<THREE.Sprite>(null!)
  const streak = useRef<THREE.Sprite>(null!)
  const rayGroup = useRef<THREE.Group>(null!)
  const coronaTex = useCoronaTexture()
  const streakTex = useStreakTexture()

  useFrame((state, d) => {
    const t = state.clock.elapsedTime
    if (core.current) {
      core.current.rotation.y += d * 0.35
      core.current.rotation.x += d * 0.18
      core.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.035)
    }
    if (wire.current) {
      wire.current.rotation.y -= d * 0.15
      wire.current.rotation.z += d * 0.08
    }
    if (halo1.current) {
      const mat = halo1.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.32 + Math.sin(t * 1.1) * 0.08
    }
    if (corona.current) {
      const s = 5.2 + Math.sin(t * 0.9) * 0.3
      corona.current.scale.set(s, s, 1)
      ;(corona.current.material as THREE.SpriteMaterial).opacity = 0.85 + Math.sin(t * 1.3) * 0.1
    }
    if (streak.current) {
      const s = 10 + Math.sin(t * 2) * 0.4
      streak.current.scale.set(s, 0.18, 1)
      ;(streak.current.material as THREE.SpriteMaterial).opacity = 0.55 + Math.sin(t * 1.7) * 0.15
    }
    if (rayGroup.current) {
      rayGroup.current.rotation.z = t * 0.08
      rayGroup.current.children.forEach((m, i) => {
        const mat = (m as THREE.Sprite).material as THREE.SpriteMaterial
        mat.opacity = 0.15 + Math.sin(t * (0.8 + i * 0.3) + i) * 0.08
      })
    }
  })

  return (
    <group>
      {/* solid inner core */}
      <mesh ref={core}>
        <sphereGeometry args={[0.75, 48, 48]} />
        <meshStandardMaterial
          color="#ff6b3a"
          emissive="#ff3d1a"
          emissiveIntensity={2.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {/* wireframe plasma skin */}
      <mesh ref={wire}>
        <sphereGeometry args={[0.82, 24, 24]} />
        <meshBasicMaterial color="#ffb87a" wireframe transparent opacity={0.35} />
      </mesh>
      {/* additive halo sphere */}
      <mesh ref={halo1}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          color="#ff6a2a"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* big billboarded corona glow */}
      <sprite ref={corona} scale={[5, 5, 1]}>
        <spriteMaterial
          map={coronaTex}
          color="#ffd9a8"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      {/* horizontal anamorphic lens streak */}
      <sprite ref={streak} scale={[10, 0.18, 1]}>
        <spriteMaterial
          map={streakTex}
          color="#ffe6be"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      {/* radial sun rays — 6 sprites rotating */}
      <group ref={rayGroup}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI
          return (
            <sprite
              key={i}
              scale={[8, 0.08, 1]}
              position={[0, 0, 0]}
              rotation={[0, 0, angle]}
            >
              <spriteMaterial
                map={streakTex}
                color="#ffd0a0"
                transparent
                opacity={0.18}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )
        })}
      </group>
    </group>
  )
}

/** Elongated, soft nebulae — drifting slowly */
function Nebula() {
  const g = useRef<THREE.Group>(null!)
  useFrame((_, d) => { if (g.current) g.current.rotation.y += d * 0.008 })
  const tex = useSoftPointTexture()
  const clouds = useMemo(() => {
    const palette = ['#2c5bff', '#6b2ec9', '#ff2447', '#1e3a8a', '#4c1d95', '#8b1e44']
    return Array.from({ length: 10 }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 10,
        -10 - Math.random() * 10,
      ] as [number, number, number],
      color: palette[i % palette.length],
      scale: [
        3 + Math.random() * 4,
        2 + Math.random() * 2,
        2 + Math.random() * 3,
      ] as [number, number, number],
      opacity: 0.08 + Math.random() * 0.07,
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
    }))
  }, [])
  return (
    <group ref={g}>
      {clouds.map((c, i) => (
        <sprite key={i} position={c.pos} scale={[c.scale[0], c.scale[1], 1]}>
          <spriteMaterial
            map={tex}
            color={c.color}
            transparent
            opacity={c.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  )
}

/** Faint orbit rings */
function OrbitRings() {
  const g = useRef<THREE.Group>(null!)
  useFrame((_, d) => { if (g.current) g.current.rotation.y += d * 0.03 })
  return (
    <group ref={g}>
      {[2.7, 3.3, 3.9, 4.5, 5.1].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + (i - 2) * 0.18, 0, i * 0.15]}>
          <torusGeometry args={[r, 0.002, 12, 200]} />
          <meshBasicMaterial
            color="#ebe6db"
            transparent
            opacity={0.14 - i * 0.015}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Orbiting skill atom — glowing star + label */
function Atom({ label, seed }: { label: string; seed: number }) {
  const ref = useRef<THREE.Group>(null!)
  const sphere = useRef<THREE.Mesh>(null!)
  const glow = useRef<THREE.Sprite>(null!)
  const [hover, setHover] = useState(false)
  const tex = useSoftPointTexture()

  const { radius, speed, tilt, phase, size, spectrum } = useMemo(() => {
    const r = 2.9 + ((seed * 37) % 28) / 14
    const s = 0.12 + ((seed * 7) % 10) / 45
    const t = ((seed * 13) % 360) * (Math.PI / 180)
    const p = ((seed * 53) % 360) * (Math.PI / 180)
    const sz = 0.045 + ((seed * 17) % 10) / 300
    // spectrum per atom for variety (blue/white/yellow/red)
    const palette: [string, string][] = [
      ['#ffffff', '#fff1e0'], // white star
      ['#bcd6ff', '#8ab1ff'], // blue
      ['#ffd888', '#ffb64a'], // yellow
      ['#ffb38a', '#ff7044'], // orange
    ]
    const sp = palette[seed % palette.length]
    return { radius: r, speed: s, tilt: t, phase: p, size: sz, spectrum: sp }
  }, [seed])

  useFrame((state) => {
    if (!ref.current) return
    const a = state.clock.elapsedTime * speed + phase
    ref.current.position.x = Math.cos(a) * radius
    ref.current.position.z = Math.sin(a) * radius
    ref.current.position.y = Math.sin(a * 1.15 + tilt) * Math.sin(tilt) * radius * 0.45
    ref.current.lookAt(0, 0, 0)
    if (sphere.current) {
      const pulse = 0.7 + Math.sin(state.clock.elapsedTime * 2.2 + seed) * 0.3
      ;(sphere.current.material as THREE.MeshStandardMaterial).emissiveIntensity = hover ? 2.8 : pulse
    }
    if (glow.current) {
      const gmat = glow.current.material as THREE.SpriteMaterial
      gmat.opacity = hover ? 0.9 : 0.42 + Math.sin(state.clock.elapsedTime * 2 + seed) * 0.08
    }
  })

  const hoverColor = '#ff2447'
  return (
    <group ref={ref}>
      {/* soft billboarded halo (real star glow) */}
      <sprite ref={glow} scale={hover ? size * 12 : size * 7}>
        <spriteMaterial
          map={tex}
          color={hover ? hoverColor : spectrum[1]}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      {/* core */}
      <mesh
        ref={sphere}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = '' }}
      >
        <sphereGeometry args={[size, 20, 20]} />
        <meshStandardMaterial
          color={hover ? hoverColor : spectrum[0]}
          emissive={hover ? hoverColor : spectrum[0]}
          emissiveIntensity={hover ? 2.4 : 1}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>
      <Billboard>
        <Text
          position={[0, size + 0.15, 0]}
          fontSize={hover ? 0.2 : 0.15}
          color={hover ? hoverColor : '#ebe6db'}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.006}
          outlineColor="#02030a"
        >
          {label}
        </Text>
      </Billboard>
    </group>
  )
}

function Cluster() {
  const group = useRef<THREE.Group>(null!)
  const target = useRef({ x: 0, y: 0 })
  const curr = useRef({ x: 0, y: 0 })

  useFrame((state, d) => {
    if (!group.current) return
    group.current.rotation.y += d * 0.05
    const m = state.pointer
    target.current.x = m.x * 0.25
    target.current.y = m.y * 0.15
    curr.current.x += (target.current.x - curr.current.x) * 0.04
    curr.current.y += (target.current.y - curr.current.y) * 0.04
    group.current.rotation.x = curr.current.y
    group.current.rotation.z = curr.current.x * 0.3
  })

  return (
    <group ref={group}>
      <Sun />
      <OrbitRings />
      {skills.map((s, i) => (
        <Atom key={s.label} label={s.label} seed={i + 1} />
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#02030a']} />
      <fog attach="fog" args={['#02030a', 10, 26]} />

      <ambientLight intensity={0.18} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#ff6b3a" distance={14} decay={2} />
      <pointLight position={[8, 5, 4]} intensity={0.5} color="#2c5bff" />
      <pointLight position={[-8, -4, 2]} intensity={0.35} color="#6b2ec9" />

      {/* four layers of realistic stars */}
      <StarsLayer count={5500} radius={55} size={0.05} intensity={1} />
      <StarsLayer count={900}  radius={40} size={0.12} intensity={1} />
      <StarsLayer count={180}  radius={30} size={0.28} intensity={1.1} />
      <StarsLayer count={28}   radius={22} size={0.7}  intensity={1.3} />

      <Nebula />
      <Dust />
      <ShootingStars />
      <Cluster />
    </>
  )
}

export default function SkillsGalaxy() {
  return (
    <section id="galaxy" className="relative border-t border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-neo-red"
          >
            § 03.5 — Constellation
          </motion.p>
          <h2 className="mt-3 font-display text-5xl md:text-7xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
            The <span className="font-serif italic text-neo-red">stack</span> in orbit.
          </h2>
          <p className="mt-5 max-w-xl text-bone/70 text-sm md:text-base leading-relaxed">
            A little solar system of the tools I reach for most. Move your cursor
            to tilt the view; hover any star to light it up. Catch a shooting
            star if you're lucky.
          </p>
        </div>

        <div className="relative h-[72vh] min-h-[560px] rounded-lg border border-white/10 bg-[#02030a] overflow-hidden">
          <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, 1.5, 9], fov: 55 }}
            dpr={[1, 1.8]}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>

          {/* space vignette — deep dark edges */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 45%, rgba(2,3,10,0.7) 100%)',
            }}
          />
          {/* thin scanline tint for film feel */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px)',
            }}
          />

          <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
            {skills.length} stars · hover to ignite
          </div>
          <div className="pointer-events-none absolute top-3 right-4 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/40">
            SECTOR-01 · live feed
          </div>
        </div>
      </div>
    </section>
  )
}
