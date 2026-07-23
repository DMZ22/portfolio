import { motion, useScroll, useTransform } from 'framer-motion'
import { useMemo, useRef } from 'react'

type Candle = { o: number; h: number; l: number; c: number }

function gen(n: number): Candle[] {
  let price = 100
  const out: Candle[] = []
  let trend = 1
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.1) trend = -trend
    const o = price
    const move = (Math.random() - 0.5 + trend * 0.2) * 3.5
    const c = Math.max(20, o + move)
    const h = Math.max(o, c) + Math.random() * 1.2
    const l = Math.min(o, c) - Math.random() * 1.2
    out.push({ o, h, l, c })
    price = c
  }
  return out
}

export default function QuantZone() {
  const ref = useRef<HTMLDivElement>(null)
  const candles = useMemo(() => gen(60), [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], [40, -40])

  const W = 600
  const H = 220
  const cw = W / candles.length
  const max = Math.max(...candles.map((c) => c.h))
  const min = Math.min(...candles.map((c) => c.l))
  const y = (v: number) => H - ((v - min) / (max - min)) * H

  // an MA line
  const ma = candles.map((_, i) => {
    const w = 8
    const slice = candles.slice(Math.max(0, i - w), i + 1)
    const avg = slice.reduce((a, b) => a + b.c, 0) / slice.length
    return avg
  })

  return (
    <section id="quant" ref={ref} className="relative border-t border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-12 gap-6 items-end mb-10">
          <div className="col-span-12 md:col-span-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neo-red">
              § 02.5 — Quant Zone
            </p>
            <h2 className="mt-3 font-display text-5xl md:text-7xl font-medium uppercase tracking-tightest leading-[0.9] text-bone">
              Charts I <span className="font-serif italic text-neo-red">actually read.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:text-right">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-bone/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Live simulation — BTC/USD
            </div>
            <div className="mt-2 flex md:justify-end gap-6 font-mono text-xs uppercase tracking-[0.25em] text-bone/70">
              <span>OHLC</span>
              <span>MA(8)</span>
              <span>VOL</span>
            </div>
          </div>
        </div>

        <motion.div
          style={{ x }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden border border-white/10 bg-ink-950/80 p-4 md:p-6"
        >
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full opacity-40">
              {[...Array(5)].map((_, i) => (
                <line
                  key={i}
                  x1={0}
                  x2={W}
                  y1={(H / 5) * i}
                  y2={(H / 5) * i}
                  stroke="#ebe6db"
                  strokeWidth="0.3"
                  strokeDasharray="2 4"
                />
              ))}
            </svg>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="relative h-[280px] md:h-[360px] w-full">
            {/* candles */}
            {candles.map((c, i) => {
              const cx = i * cw + cw / 2
              const up = c.c >= c.o
              const col = up ? '#34d399' : '#ff2447'
              const top = Math.min(y(c.o), y(c.c))
              const bot = Math.max(y(c.o), y(c.c))
              const bodyH = Math.max(1, bot - top)
              return (
                <g key={i}>
                  <motion.line
                    x1={cx} x2={cx} y1={y(c.h)} y2={y(c.l)}
                    stroke={col} strokeWidth="0.8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.9 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.02 }}
                  />
                  <motion.rect
                    x={cx - cw * 0.35}
                    y={top}
                    width={cw * 0.7}
                    height={bodyH}
                    fill={col}
                    initial={{ scaleY: 0, originY: 0.5 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.02, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                </g>
              )
            })}
            {/* MA line */}
            <motion.polyline
              fill="none"
              stroke="#2c5bff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={ma.map((v, i) => `${i * cw + cw / 2},${y(v)}`).join(' ')}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            />
            {/* highlight last candle */}
            <motion.circle
              cx={(candles.length - 1) * cw + cw / 2}
              cy={y(candles[candles.length - 1].c)}
              r="5"
              fill="#ff2447"
              initial={{ scale: 0 }}
              whileInView={{ scale: [0, 1.8, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 2, repeat: Infinity, repeatDelay: 2 }}
            />
          </svg>

          <div className="relative mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[11px] uppercase tracking-[0.25em]">
            <div>
              <div className="text-bone/60 mb-1">last</div>
              <div className="text-bone">{candles[candles.length - 1].c.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-bone/60 mb-1">high</div>
              <div className="text-emerald-400">{Math.max(...candles.map((c) => c.h)).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-bone/60 mb-1">low</div>
              <div className="text-neo-red">{Math.min(...candles.map((c) => c.l)).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-bone/60 mb-1">signal</div>
              <div className="text-neo-red">BUY · 73%</div>
            </div>
          </div>
        </motion.div>

        <p className="mt-6 max-w-2xl text-bone/80 text-sm leading-relaxed">
          Demo of the signal engine powering{' '}
          <a href="https://github.com/DMZ22/Stock-Trader-Pro" target="_blank" rel="noreferrer" className="text-neo-red underline underline-offset-4">
            Stock Trader Pro
          </a>
          . Real version runs 230+ symbols with LSTM forecasting, multi-timeframe
          confluence, news sentiment and backtesting against 2:1 R/R.
        </p>
      </div>
    </section>
  )
}
