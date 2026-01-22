let ctx = null

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

import useGameStore from '../store/gameStore'

function cardFlip(c) {
  const t = c.currentTime
  const buf = c.createBuffer(1, c.sampleRate * 0.015, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const src = c.createBufferSource()
  src.buffer = buf

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(2000, t)

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.06, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015)

  src.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  src.start(t)
  src.stop(t + 0.015)
}

function bottleSpin(c) {
  const o = c.createOscillator()
  const g = c.createGain()
  const t = c.currentTime
  o.type = 'sine'
  o.frequency.setValueAtTime(300, t)
  o.frequency.linearRampToValueAtTime(600, t + 0.1)
  o.frequency.linearRampToValueAtTime(300, t + 0.2)
  g.gain.setValueAtTime(0.05, t)
  g.gain.setValueAtTime(0.05, t + 0.15)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
  o.connect(g)
  g.connect(c.destination)
  o.start(t)
  o.stop(t + 0.2)
}

function timerExpire(c) {
  const t = c.currentTime
  const notes = [523, 440, 349]
  notes.forEach((freq, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(freq, t + i * 0.08)
    g.gain.setValueAtTime(0.06, t + i * 0.08)
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.08)
    o.connect(g)
    g.connect(c.destination)
    o.start(t + i * 0.08)
    o.stop(t + i * 0.08 + 0.08)
  })
}

function scorePoint(c) {
  const t = c.currentTime
  const notes = [523, 659]
  notes.forEach((freq, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(freq, t + i * 0.08)
    g.gain.setValueAtTime(0.001, t + i * 0.08)
    g.gain.linearRampToValueAtTime(0.06, t + i * 0.08 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.08)
    o.connect(g)
    g.connect(c.destination)
    o.start(t + i * 0.08)
    o.stop(t + i * 0.08 + 0.08)
  })
}

function favourite(c) {
  const o = c.createOscillator()
  const g = c.createGain()
  const t = c.currentTime
  o.type = 'sine'
  o.frequency.setValueAtTime(880, t)
  g.gain.setValueAtTime(0.001, t)
  g.gain.linearRampToValueAtTime(0.07, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
  o.connect(g)
  g.connect(c.destination)
  o.start(t)
  o.stop(t + 0.15)
}

const sounds = { card_flip: cardFlip, bottle_spin: bottleSpin, timer_expire: timerExpire, score_point: scorePoint, favourite }
const soundNames = new Set(Object.keys(sounds))

export function useSound() {
  return {
    play(soundKey) {
      if (!soundNames.has(soundKey)) {
        console.warn(`Unknown sound: "${soundKey}"`)
        return
      }
      if (typeof window === 'undefined') return
      if (!useGameStore.getState().soundEnabled) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const c = getCtx()
      sounds[soundKey](c)
    },
  }
}
