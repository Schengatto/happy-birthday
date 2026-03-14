let audioCtx: AudioContext | null = null

function getAudioCtx(): AudioContext | null {
  if (import.meta.server) return null
  const AC = window.AudioContext || (window as any).webkitAudioContext
  if (!AC) return null
  if (!audioCtx) audioCtx = new AC()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTone(freq: number, type: OscillatorType, duration: number, volume: number, delay = 0) {
  const ctx = getAudioCtx()
  if (!ctx) return
  const now = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
  osc.start(now)
  osc.stop(now + duration + 0.01)
}

export function useAudio() {

  function playSuccess() {
    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      playTone(freq, 'sine', 0.18, 0.3, i * 0.09)
    })
  }

  function playError() {
    ;[280, 185].forEach((freq, i) => {
      playTone(freq, 'square', 0.22, 0.18, i * 0.13)
    })
  }

  function playFlip() {
    playTone(660, 'sine', 0.12, 0.15)
  }

  function playMatch() {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      playTone(freq, 'sine', 0.2, 0.25, i * 0.08)
    })
  }

  function playPop(good: boolean) {
    if (good) {
      playTone(880, 'sine', 0.1, 0.2)
      playTone(1200, 'sine', 0.1, 0.15, 0.05)
    } else {
      playTone(200, 'sawtooth', 0.2, 0.15)
      playTone(140, 'sawtooth', 0.2, 0.1, 0.08)
    }
  }

  function playLevelUp() {
    ;[523, 659, 784, 1047].forEach((freq, i) => {
      playTone(freq, 'sine', 0.2, 0.25, i * 0.16)
    })
  }

  function playVictory() {
    ;[523, 587, 659, 698, 784, 880, 1047].forEach((freq, i) => {
      playTone(freq, 'triangle', 0.25, 0.3, i * 0.1)
    })
  }

  function playHappyBirthday(recipientName?: string) {
    const ctx = getAudioCtx()
    if (!ctx) return
    const B = 0.38
    const song = [
      { f: 392.00, d: 0.75 * B }, { f: 392.00, d: 0.25 * B },
      { f: 440.00, d: B }, { f: 392.00, d: B },
      { f: 523.25, d: B }, { f: 493.88, d: 2 * B },
      { f: 0, d: 0.4 * B },
      { f: 392.00, d: 0.75 * B }, { f: 392.00, d: 0.25 * B },
      { f: 440.00, d: B }, { f: 392.00, d: B },
      { f: 587.33, d: B }, { f: 523.25, d: 2 * B },
      { f: 0, d: 0.4 * B },
      { f: 392.00, d: 0.75 * B }, { f: 392.00, d: 0.25 * B },
      { f: 783.99, d: B }, { f: 659.25, d: B },
      { f: 523.25, d: B }, { f: 493.88, d: B },
      { f: 440.00, d: 2 * B },
      { f: 0, d: 0.4 * B },
      { f: 698.46, d: 0.75 * B }, { f: 698.46, d: 0.25 * B },
      { f: 659.25, d: B }, { f: 523.25, d: B },
      { f: 587.33, d: B }, { f: 523.25, d: 2.5 * B },
    ]

    let t = ctx.currentTime + 0.08
    for (const note of song) {
      if (note.f > 0) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(note.f, t)
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.35, t + 0.02)
        gain.gain.setValueAtTime(0.35, t + note.d - 0.06)
        gain.gain.linearRampToValueAtTime(0, t + note.d)
        osc.start(t)
        osc.stop(t + note.d + 0.01)
      }
      t += note.d
    }
  }

  return {
    playSuccess,
    playError,
    playFlip,
    playMatch,
    playPop,
    playLevelUp,
    playVictory,
    playHappyBirthday,
  }
}
