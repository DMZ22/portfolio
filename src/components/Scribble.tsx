import { motion } from 'framer-motion'

type Variant = 'circle' | 'underline' | 'arrow' | 'box'

export default function Scribble({
  variant = 'circle',
  color = '#ff2447',
  className = '',
  delay = 0,
}: {
  variant?: Variant
  color?: string
  className?: string
  delay?: number
}) {
  const transition = {
    duration: 1.1,
    ease: 'easeInOut' as const,
    delay,
  }
  const init = { pathLength: 0, opacity: 0 }
  const anim = { pathLength: 1, opacity: 1 }

  if (variant === 'circle') {
    return (
      <svg
        viewBox="0 0 300 120"
        fill="none"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute ${className}`}
      >
        <motion.path
          d="M 12,60 C 12,18 70,8 150,10 C 240,12 290,28 288,58 C 286,92 220,110 140,108 C 52,106 14,94 18,64"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
          initial={init}
          whileInView={anim}
          viewport={{ once: true, margin: '-40px' }}
          transition={transition}
        />
      </svg>
    )
  }

  if (variant === 'underline') {
    return (
      <svg
        viewBox="0 0 300 30"
        fill="none"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute ${className}`}
      >
        <motion.path
          d="M 4,16 C 60,8 140,24 210,14 C 240,10 280,18 296,12"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          initial={init}
          whileInView={anim}
          viewport={{ once: true }}
          transition={transition}
        />
        <motion.path
          d="M 14,24 C 70,18 150,28 220,20 C 250,17 280,22 290,19"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.6}
          initial={init}
          whileInView={anim}
          viewport={{ once: true }}
          transition={{ ...transition, delay: delay + 0.25 }}
        />
      </svg>
    )
  }

  if (variant === 'arrow') {
    return (
      <svg
        viewBox="0 0 160 120"
        fill="none"
        className={`pointer-events-none absolute ${className}`}
      >
        <motion.path
          d="M 10,12 C 40,20 70,40 80,70 C 85,85 82,100 70,108"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={init}
          whileInView={anim}
          viewport={{ once: true }}
          transition={transition}
        />
        <motion.path
          d="M 62,96 L 70,108 L 82,100"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={init}
          whileInView={anim}
          viewport={{ once: true }}
          transition={{ ...transition, delay: delay + 0.8 }}
        />
      </svg>
    )
  }

  // box
  return (
    <svg
      viewBox="0 0 300 100"
      fill="none"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute ${className}`}
    >
      <motion.path
        d="M 6,10 L 294,6 L 296,94 L 8,96 Z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={init}
        whileInView={anim}
        viewport={{ once: true }}
        transition={transition}
      />
    </svg>
  )
}
