import { useMemo } from 'react'

/** Deterministic pseudo-random */
function seeded(n: number) {
  const x = Math.sin(n) * 10000
  return x - Math.floor(x)
}

type Star = { x: number; y: number; r: number; o: number; c: string; twinkle: number }

export default function StarsBG() {
  const stars: Star[] = useMemo(() => {
    const out: Star[] = []
    const palette = ['#ebe6db', '#ebe6db', '#ebe6db', '#bcd6ff', '#ffc9a0', '#ffe6a8']
    for (let i = 0; i < 260; i++) {
      const t = seeded(i * 3.1 + 12)
      out.push({
        x: seeded(i * 2.7 + 1) * 100,
        y: seeded(i * 1.9 + 5) * 100,
        r: 0.05 + seeded(i * 5.3 + 9) * 0.2,
        o: 0.35 + seeded(i * 6.1 + 7) * 0.55,
        c: palette[Math.floor(seeded(i * 7.7 + 3) * palette.length)],
        twinkle: t < 0.18 ? 2 + seeded(i + 99) * 3 : 0,
      })
    }
    return out
  }, [])

  // a few bright standout stars with a tiny glow disk
  const bright: Star[] = useMemo(() => {
    const out: Star[] = []
    const palette = ['#ffffff', '#bcd6ff', '#ffd9a8', '#ffb38a']
    for (let i = 0; i < 16; i++) {
      out.push({
        x: seeded(i * 11.3 + 21) * 100,
        y: seeded(i * 13.7 + 31) * 100,
        r: 0.35 + seeded(i * 17.1 + 41) * 0.35,
        o: 0.8 + seeded(i * 19.9 + 51) * 0.2,
        c: palette[Math.floor(seeded(i * 23.5 + 61) * palette.length)],
        twinkle: 3 + seeded(i + 199) * 4,
      })
    }
    return out
  }, [])

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
    >
      {/* tiny stars */}
      {stars.map((s, i) => (
        <circle
          key={`s${i}`}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={s.c}
          opacity={s.o}
          style={
            s.twinkle > 0
              ? {
                  animation: `twinkle ${s.twinkle}s ease-in-out ${i * 0.07}s infinite`,
                  transformOrigin: `${s.x}% ${s.y}%`,
                }
              : undefined
          }
        />
      ))}
      {/* bright stars with soft glow */}
      {bright.map((s, i) => (
        <g key={`b${i}`}>
          <circle
            cx={s.x}
            cy={s.y}
            r={s.r * 3}
            fill={s.c}
            opacity={s.o * 0.15}
            style={{ filter: 'blur(0.6px)' }}
          />
          <circle
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.c}
            opacity={s.o}
            style={{
              animation: `twinkle ${s.twinkle}s ease-in-out ${i * 0.13}s infinite`,
              transformOrigin: `${s.x}% ${s.y}%`,
            }}
          />
        </g>
      ))}
    </svg>
  )
}
