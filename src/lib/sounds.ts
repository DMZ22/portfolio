let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = true

const STORAGE = 'portfolio-sound'

export function initSound() {
  if (typeof window === 'undefined') return
  const saved = localStorage.getItem(STORAGE)
  if (saved === '0') enabled = false
  if (saved === '1') enabled = true
}

export function isSoundEnabled() {
  return enabled
}

export function setSoundEnabled(v: boolean) {
  enabled = v
  try { localStorage.setItem(STORAGE, v ? '1' : '0') } catch {}
  if (master) master.gain.value = v ? 1 : 0
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = enabled ? 1 : 0
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function out() {
  return master ?? getCtx()?.destination ?? null
}

/** Deep train-horn — two detuned sawtooth oscillators through a lowpass, pitch bends down. */
export function playHorn() {
  if (!enabled) return
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  const dest = out(); if (!dest) return

  const osc1 = c.createOscillator()
  const osc2 = c.createOscillator()
  const osc3 = c.createOscillator() // sub
  osc1.type = 'sawtooth'
  osc2.type = 'sawtooth'
  osc3.type = 'sine'

  osc1.frequency.setValueAtTime(138, now)
  osc2.frequency.setValueAtTime(174, now) // minor third above
  osc3.frequency.setValueAtTime(69, now)

  // long pitch bend down — distant-horn feel
  osc1.frequency.linearRampToValueAtTime(116, now + 0.9)
  osc2.frequency.linearRampToValueAtTime(146, now + 0.9)
  osc3.frequency.linearRampToValueAtTime(58, now + 0.9)

  // warm horn body via lowpass
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(900, now)
  filter.frequency.exponentialRampToValueAtTime(500, now + 0.9)
  filter.Q.value = 1.5

  const gain = c.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.22, now + 0.08)  // attack
  gain.gain.setValueAtTime(0.22, now + 0.75)            // sustain
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1) // release

  // slight detune wobble
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.frequency.value = 5.5
  lfoGain.gain.value = 2.4
  lfo.connect(lfoGain)
  lfoGain.connect(osc1.detune)
  lfoGain.connect(osc2.detune)

  osc1.connect(filter)
  osc2.connect(filter)
  osc3.connect(filter)
  filter.connect(gain)
  gain.connect(dest)

  osc1.start(now); osc2.start(now); osc3.start(now); lfo.start(now)
  osc1.stop(now + 1.2); osc2.stop(now + 1.2); osc3.stop(now + 1.2); lfo.stop(now + 1.2)
}

/** Short mechanical click. */
export function playClick() {
  if (!enabled) return
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  const dest = out(); if (!dest) return

  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(1400, now)
  osc.frequency.exponentialRampToValueAtTime(520, now + 0.06)
  gain.gain.setValueAtTime(0.11, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
  osc.connect(gain); gain.connect(dest)
  osc.start(now); osc.stop(now + 0.13)
}

/** Short filtered-noise whoosh for transitions. */
export function playWhoosh(up = true) {
  if (!enabled) return
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  const dest = out(); if (!dest) return

  const buf = c.createBuffer(1, c.sampleRate * 0.35, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const src = c.createBufferSource()
  src.buffer = buf

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 3
  if (up) {
    filter.frequency.setValueAtTime(400, now)
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.3)
  } else {
    filter.frequency.setValueAtTime(3200, now)
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.3)
  }

  const gain = c.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.3, now + 0.06)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32)

  src.connect(filter); filter.connect(gain); gain.connect(dest)
  src.start(now)
}

/** Soft hover tick. */
export function playTick() {
  if (!enabled) return
  const c = getCtx(); if (!c) return
  const now = c.currentTime
  const dest = out(); if (!dest) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(2400, now)
  gain.gain.setValueAtTime(0.04, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)
  osc.connect(gain); gain.connect(dest)
  osc.start(now); osc.stop(now + 0.08)
}
