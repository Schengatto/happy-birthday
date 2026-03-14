import { onUnmounted } from 'vue'

interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  rotV: number
  w: number
  h: number
  color: string
  life: number
  gravity: number
}

const COLORS = ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#ffd200', '#fc5c7d', '#a1c4fd']

export function useConfetti() {
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let particles: ConfettiParticle[] = []
  let raf: number | null = null

  function init(canvasEl: HTMLCanvasElement) {
    canvas = canvasEl
    ctx = canvas.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
  }

  function resize() {
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  function burst(count = 90, fromCenter = false) {
    if (!canvas) return
    for (let i = 0; i < count; i++) {
      particles.push({
        x: fromCenter ? canvas.width / 2 : Math.random() * canvas.width,
        y: fromCenter ? canvas.height / 2 : -20,
        vx: (Math.random() - 0.5) * (fromCenter ? 10 : 3),
        vy: fromCenter ? -(Math.random() * 9 + 4) : (Math.random() * 2.5 + 1),
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 6,
        w: Math.random() * 8 + 4,
        h: Math.random() * 5 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        life: 1,
        gravity: fromCenter ? 0.22 : 0.03,
      })
    }
    if (!raf) draw()
  }

  function draw() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles = particles.filter(p => p.life > 0 && p.y < canvas!.height + 30)

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += p.gravity
      p.rot += p.rotV
      p.life -= 0.006

      ctx.save()
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rot * Math.PI) / 180)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }

    if (particles.length > 0) {
      raf = requestAnimationFrame(draw)
    } else {
      raf = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  function cleanup() {
    if (raf) cancelAnimationFrame(raf)
    raf = null
    particles = []
    window.removeEventListener('resize', resize)
  }

  onUnmounted(cleanup)

  return { init, burst, cleanup }
}
