import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function Spotlight({
  children,
  className = '',
  color = 'rgba(255, 180, 90, 0.16)',
  size = 520,
}: {
  children: ReactNode
  className?: string
  color?: string
  size?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(-9999)
  const my = useMotionValue(-9999)
  const smx = useSpring(mx, { stiffness: 200, damping: 35, mass: 0.5 })
  const smy = useSpring(my, { stiffness: 200, damping: 35, mass: 0.5 })
  const bg = useTransform<number, string>([smx, smy], ([x, y]) =>
    `radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`,
  )

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }
  const onLeave = () => {
    mx.set(-9999)
    my.set(-9999)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity"
        style={{ background: bg }}
      />
      <div className="relative z-[2]">{children}</div>
    </div>
  )
}
