import { motion } from 'framer-motion'

/** Spinning circular seal — "BACKEND · AI / ML · FULL-STACK · CS STUDENT ·" */
export function BrandSeal({
  size = 160,
  className = '',
  text = 'BACKEND  ·  AI / ML  ·  FULL-STACK  ·  CS STUDENT  · ',
  duration = 20,
  reverse = false,
  accent = '#ff2447',
}: {
  size?: number
  className?: string
  text?: string
  duration?: number
  reverse?: boolean
  accent?: string
}) {
  const id = 'seal-' + text.replace(/[^a-z0-9]/gi, '').slice(0, 8)
  // Repeat enough to cover the path
  const repeated = (text + text).toUpperCase()

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <defs>
            <path id={id} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text fontSize="7.4" letterSpacing="1.6" fontFamily="'JetBrains Mono', monospace" fill="currentColor">
            <textPath href={`#${id}`}>{repeated}</textPath>
          </text>
        </svg>
      </motion.div>
      {/* Static center mark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: size * 0.48,
            height: size * 0.48,
            background: accent,
            color: '#050506',
          }}
        >
          <span className="font-display text-2xl font-bold tracking-tightest">D</span>
        </div>
      </div>
      {/* tiny tick marks around */}
      <svg viewBox="0 0 100 100" width={size} height={size} className="absolute inset-0 text-bone/30">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 12
          const x1 = 50 + Math.cos(a) * 44
          const y1 = 50 + Math.sin(a) * 44
          const x2 = 50 + Math.cos(a) * 46
          const y2 = 50 + Math.sin(a) * 46
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" />
        })}
      </svg>
    </div>
  )
}

/** Minimal horizontal lockup used in navbar */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 40 40" className="shrink-0">
        <rect x="2" y="2" width="36" height="36" fill="#ff2447" />
        <text
          x="20"
          y="28"
          textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif"
          fontSize="22"
          fontWeight="700"
          fill="#050506"
          letterSpacing="-1"
        >
          D
        </text>
        <circle cx="34" cy="6" r="1.6" fill="#050506" />
      </svg>
      <div className="leading-none">
        <div className="font-display text-sm font-semibold text-bone">
          Devashish<span className="text-neo-red">.</span>
        </div>
        <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-bone/50 mt-0.5">
          developer · cs student
        </div>
      </div>
    </div>
  )
}

/** Giant repeated wordmark — for backgrounds / footers */
export function Wordmark({ text = 'DEVASHISH', className = '' }: { text?: string; className?: string }) {
  return (
    <span className={className}>
      {text}
    </span>
  )
}
