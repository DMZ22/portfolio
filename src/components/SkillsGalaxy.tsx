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

/** Deterministic PRNG so every visitor sees the same system */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type PlanetKind = 'gas' | 'rocky' | 'ice' | 'terra'

/** Procedural equirectangular planet texture — banded gas giants, cratered rock, streaked ice, living terra */
function makePlanetTexture(seed: number, kind: PlanetKind): THREE.CanvasTexture {
  const rng = mulberry32(seed * 7919 + 13)
  const W2 = 256, H2 = 128
  const c = document.createElement('canvas')
  c.width = W2; c.height = H2
  const ctx = c.getContext('2d')!

  const gasPalettes = [
    ['#c8a06a', '#8a5f3a', '#e6c79a', '#a2764a'], // jovian tan
    ['#7aa7ff', '#3c5fd0', '#a9c6ff', '#5b7fe8'], // neptunian blue
    ['#e8c39a', '#c98f5a', '#f5e2c0', '#d7a878'], // saturnine cream
    ['#d88a6a', '#a4523c', '#f0b898', '#c06a50'], // dusty rose
  ]
  const rockyPalettes = [
    ['#b0563a', '#7a3626', '#d8875f'], // martian
    ['#8a8a92', '#5a5a64', '#b8b8c0'], // mercurial grey
    ['#a08668', '#6e5a44', '#c8ae8e'], // sandy
    ['#7c6a8a', '#544868', '#a894b8'], // violet rock
  ]

  if (kind === 'gas') {
    const p = gasPalettes[seed % gasPalettes.length]
    // horizontal turbulent bands
    for (let y = 0; y < H2; y++) {
      const band = Math.sin(y * 0.22 + rng() * 0.15) + Math.sin(y * 0.075 + 2.1)
      const idx = Math.abs(Math.round(band * 1.5 + (seed % 3))) % p.length
      ctx.fillStyle = p[idx]
      ctx.fillRect(0, y, W2, 1)
      // wavy lighter streak inside the band
      if (y % 7 === (seed % 7)) {
        ctx.globalAlpha = 0.25
        ctx.fillStyle = p[(idx + 2) % p.length]
        for (let x = 0; x < W2; x += 4) {
          const off = Math.sin(x * 0.05 + y) * 2
          ctx.fillRect(x, y + off, 4, 1)
        }
        ctx.globalAlpha = 1
      }
    }
    // great storm spot on some giants
    if (seed % 3 === 0) {
      const sx = rng() * W2, sy = H2 * (0.35 + rng() * 0.3)
      const grad = ctx.createRadialGradient(sx, sy, 1, sx, sy, 16)
      grad.addColorStop(0, 'rgba(255,240,225,0.85)')
      grad.addColorStop(0.5, p[3] + 'cc')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.save(); ctx.translate(sx, sy); ctx.scale(1.8, 1); ctx.translate(-sx, -sy)
      ctx.beginPath(); ctx.arc(sx, sy, 16, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }
  } else if (kind === 'terra') {
    // oceans
    ctx.fillStyle = '#2a5fc8'
    ctx.fillRect(0, 0, W2, H2)
    // continents — clustered green/brown blobs
    for (let i = 0; i < 26; i++) {
      const cx = rng() * W2, cy = H2 * 0.15 + rng() * H2 * 0.7
      const r = 6 + rng() * 18
      ctx.fillStyle = rng() > 0.35 ? '#3f9455' : '#8a7a4e'
      ctx.globalAlpha = 0.9
      for (let j = 0; j < 7; j++) {
        ctx.beginPath()
        ctx.arc(cx + (rng() - 0.5) * r * 1.8, cy + (rng() - 0.5) * r, r * (0.3 + rng() * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
    }
    // clouds
    ctx.globalAlpha = 0.35
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 34; i++) {
      const cx = rng() * W2, cy = rng() * H2, r = 3 + rng() * 9
      ctx.save(); ctx.translate(cx, cy); ctx.scale(2.2, 0.6); ctx.translate(-cx, -cy)
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }
    ctx.globalAlpha = 1
    // polar caps
    ctx.fillStyle = 'rgba(240,248,255,0.9)'
    ctx.fillRect(0, 0, W2, 7)
    ctx.fillRect(0, H2 - 7, W2, 7)
  } else {
    const p = kind === 'ice'
      ? ['#cfe4f2', '#9fc2dc', '#eaf6ff']
      : rockyPalettes[seed % rockyPalettes.length]
    ctx.fillStyle = p[0]
    ctx.fillRect(0, 0, W2, H2)
    // large regional shading
    for (let i = 0; i < 10; i++) {
      ctx.globalAlpha = 0.18
      ctx.fillStyle = i % 2 ? p[1] : p[2]
      const cx = rng() * W2, cy = rng() * H2, r = 18 + rng() * 34
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1
    // craters with lit rims
    const craters = kind === 'ice' ? 18 : 46
    for (let i = 0; i < craters; i++) {
      const cx = rng() * W2, cy = rng() * H2, r = 1 + rng() * 4.5
      ctx.fillStyle = 'rgba(0,0,0,0.28)'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.22)'
      ctx.beginPath(); ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.55, 0, Math.PI * 2); ctx.fill()
    }
    if (kind === 'ice') {
      // long frozen streaks
      ctx.strokeStyle = 'rgba(120,160,200,0.35)'
      ctx.lineWidth = 1
      for (let i = 0; i < 14; i++) {
        ctx.beginPath()
        const y0 = rng() * H2
        ctx.moveTo(0, y0)
        ctx.bezierCurveTo(W2 * 0.3, y0 + (rng() - 0.5) * 24, W2 * 0.7, y0 + (rng() - 0.5) * 24, W2, y0 + (rng() - 0.5) * 12)
        ctx.stroke()
      }
    }
  }

  // subtle limb/pole darkening for depth
  const shade = ctx.createLinearGradient(0, 0, 0, H2)
  shade.addColorStop(0, 'rgba(0,0,0,0.35)')
  shade.addColorStop(0.18, 'rgba(0,0,0,0)')
  shade.addColorStop(0.82, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.35)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, W2, H2)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

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

/** Soft radial annulus texture for the ecliptic glow disc */
function useEclipticTexture() {
  return useMemo(() => {
    const size = 512
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0.0, 'rgba(0,0,0,0)')
    g.addColorStop(0.22, 'rgba(0,0,0,0)')
    g.addColorStop(0.34, 'rgba(255,150,80,0.45)')
    g.addColorStop(0.5, 'rgba(140,90,255,0.20)')
    g.addColorStop(0.72, 'rgba(60,90,255,0.08)')
    g.addColorStop(1.0, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
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
      const t = Math.random()
      let r2 = 1, g2 = 1, b2 = 0.96
      if (t < 0.55)       { r2 = 1.00; g2 = 1.00; b2 = 0.95 }
      else if (t < 0.78)  { r2 = 0.76; g2 = 0.85; b2 = 1.00 }
      else if (t < 0.92)  { r2 = 1.00; g2 = 0.84; b2 = 0.55 }
      else                { r2 = 1.00; g2 = 0.42; b2 = 0.30 }
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
    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = 0.86 + Math.sin(state.clock.elapsedTime * 1.3 + radius) * 0.14
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

/** Faint Milky-Way band arcing across the deep background */
function MilkyWay() {
  const g = useRef<THREE.Group>(null!)
  const tex = useSoftPointTexture()
  useFrame((_, d) => { if (g.current) g.current.rotation.y += d * 0.002 })
  const patches = useMemo(() => {
    const colors = ['#8a9bd9', '#c9b8ff', '#ffd9c2', '#6b7fd7', '#b393e8']
    return Array.from({ length: 16 }).map((_, i) => {
      const a = (i / 16) * Math.PI * 2
      const r = 30
      const wobble = (Math.sin(i * 3.7) + Math.cos(i * 1.9)) * 2
      return {
        pos: [Math.cos(a) * r, Math.sin(a) * r * 0.35 + wobble, -Math.abs(Math.sin(a)) * 18 - 6] as [number, number, number],
        scale: 7 + (i % 4) * 2.2,
        color: colors[i % colors.length],
        opacity: 0.04 + (i % 3) * 0.02,
      }
    })
  }, [])
  return (
    <group ref={g} rotation={[0.5, 0, 0.35]}>
      {patches.map((p, i) => (
        <sprite key={i} position={p.pos} scale={[p.scale * 1.8, p.scale, 1]}>
          <spriteMaterial map={tex} color={p.color} transparent opacity={p.opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      ))}
    </group>
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
    for (const s of shots.current) s.life += d
    shots.current = shots.current.filter((s) => s.life < s.max)
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
      <mesh ref={wire}>
        <sphereGeometry args={[0.82, 24, 24]} />
        <meshBasicMaterial color="#ffb87a" wireframe transparent opacity={0.35} />
      </mesh>
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

/** Glowing accretion / ecliptic disc lying in the orbital plane */
function EclipticDisc() {
  const ref = useRef<THREE.Mesh>(null!)
  const tex = useEclipticTexture()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.02
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.26 + Math.sin(state.clock.elapsedTime * 0.7) * 0.05
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[13, 13]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.28}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/** Asteroid belt — a ring of rocky debris between the inner and outer system */
function AsteroidBelt() {
  const ref = useRef<THREE.Points>(null!)
  const tex = useSoftPointTexture()
  const geom = useMemo(() => {
    const count = 1100
    const positions = new Float32Array(count * 3)
    const rng = mulberry32(4242)
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2
      const r = 4.35 + rng() * 0.45
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = (rng() - 0.5) * 0.14
      positions[i * 3 + 2] = Math.sin(a) * r
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.022 })
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        size={0.022}
        sizeAttenuation
        color="#b8a890"
        map={tex}
        alphaMap={tex}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  )
}

/** Orbital elements for one planet — deterministic per seed */
function orbitalElements(seed: number, index: number, weight: number) {
  const rng = mulberry32(seed * 104729 + 7)
  const a = 2.35 + index * 0.152 + rng() * 0.06          // semi-major axis
  const e = 0.03 + rng() * 0.09                           // eccentricity
  const b = a * Math.sqrt(1 - e * e)                      // semi-minor axis
  const cFocus = a * e                                    // sun sits at the focus
  const inc = (rng() - 0.5) * 0.16                        // inclination ±4.6°
  const node = rng() * Math.PI * 2                        // ascending node
  const phase = rng() * Math.PI * 2
  const speed = 0.85 / Math.pow(a, 1.5)                   // Kepler: ω ∝ a^-3/2
  const spin = 0.25 + rng() * 0.6
  const kind: PlanetKind =
    seed % 7 === 0 ? 'terra'
    : weight >= 0.9 ? 'gas'
    : seed % 4 === 0 ? 'ice'
    : 'rocky'
  const size = (0.07 + weight * 0.075) * (kind === 'gas' ? 1.65 : 1)
  const hasRing = kind === 'gas' && seed % 2 === 0
  return { a, b, cFocus, inc, node, phase, speed, spin, kind, size, hasRing }
}

/** Faint elliptical orbit path — drawn in the same tilted plane the planet moves in */
function OrbitPath({ a, b, cFocus }: { a: number; b: number; cFocus: number }) {
  const geom = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const t = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(t) * a - cFocus, 0, Math.sin(t) * b))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [a, b, cFocus])
  return (
    <primitive
      object={useMemo(() => {
        const mat = new THREE.LineBasicMaterial({ color: '#ebe6db', transparent: true, opacity: 0.09 })
        return new THREE.Line(geom, mat)
      }, [geom])}
    />
  )
}

/** A skill as a real planet: textured, sun-lit, on a Keplerian orbit */
function Planet({ label, seed, index, weight }: { label: string; seed: number; index: number; weight: number }) {
  const orbiter = useRef<THREE.Group>(null!)
  const body = useRef<THREE.Mesh>(null!)
  const glow = useRef<THREE.Sprite>(null!)
  const [hover, setHover] = useState(false)
  const softTex = useSoftPointTexture()

  const el = useMemo(() => orbitalElements(seed, index, weight), [seed, index, weight])
  const surface = useMemo(() => makePlanetTexture(seed, el.kind), [seed, el.kind])

  useFrame((state, d) => {
    const t = state.clock.elapsedTime * el.speed + el.phase
    if (orbiter.current) {
      orbiter.current.position.x = Math.cos(t) * el.a - el.cFocus
      orbiter.current.position.z = Math.sin(t) * el.b
    }
    if (body.current) body.current.rotation.y += d * el.spin
    if (glow.current) {
      const gmat = glow.current.material as THREE.SpriteMaterial
      gmat.opacity = hover ? 0.55 : 0.16
    }
  })

  const hoverColor = '#ff2447'
  return (
    <group rotation={[el.inc, el.node, 0]}>
      <OrbitPath a={el.a} b={el.b} cFocus={el.cFocus} />
      <group ref={orbiter}>
        {/* thin atmosphere / hover glow */}
        <sprite ref={glow} scale={el.size * 5.5}>
          <spriteMaterial
            map={softTex}
            color={hover ? hoverColor : el.kind === 'terra' ? '#7ab8ff' : '#ffe0c0'}
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
        {/* the planet itself — lit by the sun, real day/night terminator */}
        <mesh
          ref={body}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHover(false); document.body.style.cursor = '' }}
        >
          <sphereGeometry args={[el.size, 32, 32]} />
          <meshStandardMaterial
            map={surface}
            roughness={el.kind === 'gas' ? 0.7 : 0.95}
            metalness={0.02}
            emissive={hover ? hoverColor : '#000000'}
            emissiveIntensity={hover ? 0.35 : 0}
          />
        </mesh>
        {/* ring system on some gas giants */}
        {el.hasRing && (
          <mesh rotation={[-Math.PI / 2 + 0.42, 0.2, 0]}>
            <ringGeometry args={[el.size * 1.45, el.size * 2.35, 48]} />
            <meshBasicMaterial
              color="#d8c8a8"
              transparent
              opacity={hover ? 0.8 : 0.55}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
        <Billboard>
          <Text
            position={[0, el.size + 0.14, 0]}
            fontSize={hover ? 0.2 : 0.14}
            color={hover ? hoverColor : '#f4f0e6'}
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.009}
            outlineColor="#02030a"
          >
            {label}
          </Text>
        </Billboard>
      </group>
    </group>
  )
}

function Cluster() {
  const group = useRef<THREE.Group>(null!)
  const target = useRef({ x: 0, y: 0 })
  const curr = useRef({ x: 0, y: 0 })

  useFrame((state, d) => {
    if (!group.current) return
    group.current.rotation.y += d * 0.02
    const m = state.pointer
    target.current.x = m.x * 0.22
    target.current.y = m.y * 0.12
    curr.current.x += (target.current.x - curr.current.x) * 0.04
    curr.current.y += (target.current.y - curr.current.y) * 0.04
    group.current.rotation.x = curr.current.y
    group.current.rotation.z = curr.current.x * 0.15
  })

  return (
    <group ref={group}>
      <Sun />
      <EclipticDisc />
      <AsteroidBelt />
      {skills.map((s, i) => (
        <Planet key={s.label} label={s.label} seed={i + 1} index={i} weight={s.weight} />
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#02030a']} />
      <fog attach="fog" args={['#02030a', 14, 34]} />

      <ambientLight intensity={0.16} />
      {/* the sun is the light source — planets get a real terminator */}
      <pointLight position={[0, 0, 0]} intensity={26} color="#ffd9a8" distance={40} decay={1.6} />
      <pointLight position={[8, 5, 4]} intensity={0.3} color="#2c5bff" />
      <pointLight position={[-8, -4, 2]} intensity={0.2} color="#6b2ec9" />

      <StarsLayer count={5500} radius={55} size={0.05} intensity={1} />
      <StarsLayer count={900}  radius={40} size={0.12} intensity={1} />
      <StarsLayer count={180}  radius={30} size={0.28} intensity={1.1} />
      <StarsLayer count={28}   radius={22} size={0.7}  intensity={1.3} />

      <MilkyWay />
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
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-neo-red"
          >
            § 03.5 — Constellation
          </motion.p>
          <h2 className="mt-3 font-display text-5xl md:text-7xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
            The <span className="font-serif italic text-neo-red">stack</span> in orbit.
          </h2>
          <p className="mt-5 max-w-xl text-bone/85 text-sm md:text-base leading-relaxed">
            A working solar system of the tools I reach for most — textured
            planets on true Keplerian orbits, an asteroid belt, and a star that
            actually lights them. Move your cursor to tilt the plane; hover any
            planet to ignite it.
          </p>
        </div>

        <div className="relative h-[72vh] min-h-[560px] rounded-lg border border-white/10 bg-[#02030a] overflow-hidden">
          <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, 3.4, 9.6], fov: 50 }}
            dpr={[1, 1.8]}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 45%, rgba(2,3,10,0.7) 100%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px)',
            }}
          />

          <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">
            {skills.length} planets · kepler drive · hover to ignite
          </div>
          <div className="pointer-events-none absolute top-3 right-4 font-mono text-[11px] uppercase tracking-[0.3em] text-bone/60">
            SECTOR-01 · live feed
          </div>
        </div>
      </div>
    </section>
  )
}
