'use client'

import { memo, useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

// Cap canvas animation to 30fps — background animation; 30fps is imperceptible
const FRAME_MS = 1000 / 30

interface Point {
  x: number
  y: number
  wave: { x: number; y: number }
  cursor: { x: number; y: number; vx: number; vy: number }
}

interface WaveBackgroundProps {
  className?: string
  opacity?: number
  paused?: boolean
}

function WaveBackground({
  className = '',
  opacity = 1,
  paused = false,
}: WaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const mouseRef = useRef({ x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false })
  const linesRef = useRef<Point[][]>([])
  const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
  const rafRef = useRef<number | null>(null)
  const boundingRef = useRef<DOMRect | null>(null)
  const dimsRef = useRef({ width: 0, height: 0 })
  // Color lerp state — lives in refs, never triggers React re-render
  const currentHue = useRef(200)  // start at cool blue-cyan
  const currentGlow = useRef(0)
  const lastFrameTimeRef = useRef(0)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    noiseRef.current = createNoise2D()
    setSize()
    buildLines()

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setSize = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    boundingRef.current = container.getBoundingClientRect()
    const { width, height } = boundingRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctxRef.current = ctx
    }
    dimsRef.current = { width, height }
  }

  const buildLines = () => {
    const { width, height } = dimsRef.current
    linesRef.current = []
    const xGap = 30, yGap = 30 // Increased gap for performance
    const totalLines = Math.ceil((width + 200) / xGap)
    const totalPoints = Math.ceil((height + 30) / yGap)
    const xStart = (width - xGap * totalLines) / 2
    const yStart = (height - yGap * totalPoints) / 2
    for (let i = 0; i < totalLines; i++) {
      const points: Point[] = []
      for (let j = 0; j < totalPoints; j++) {
        points.push({ x: xStart + xGap * i, y: yStart + yGap * j, wave: { x: 0, y: 0 }, cursor: { x: 0, y: 0, vx: 0, vy: 0 } })
      }
      linesRef.current.push(points)
    }
  }

  const onResize = () => { setSize(); buildLines() }

  const onMouseMove = (e: MouseEvent) => {
    if (!boundingRef.current) return
    const mouse = mouseRef.current
    mouse.x = e.pageX - boundingRef.current.left
    mouse.y = e.pageY - boundingRef.current.top + window.scrollY
    if (!mouse.set) {
      mouse.sx = mouse.x; mouse.sy = mouse.y
      mouse.lx = mouse.x; mouse.ly = mouse.y
      mouse.set = true
    }
  }

  const movePoints = (time: number) => {
    const noise = noiseRef.current
    if (!noise) return
    const mouse = mouseRef.current
    for (const points of linesRef.current) {
      for (const p of points) {
        const move = noise((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002) * 8
        p.wave.x = Math.cos(move) * 12
        p.wave.y = Math.sin(move) * 6
        
        const dx = p.x - mouse.sx
        const dy = p.y - mouse.sy
        const distSq = dx * dx + dy * dy
        const l = Math.max(175, mouse.vs)
        const lSq = l * l

        if (distSq < lSq) {
          const d = Math.sqrt(distSq)
          const s = 1 - d / l
          const f = Math.cos(d * 0.001) * s
          p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.0009
          p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.0009
        }
        
        p.cursor.vx += (0 - p.cursor.x) * 0.01
        p.cursor.vy += (0 - p.cursor.y) * 0.01
        p.cursor.vx *= 0.95
        p.cursor.vy *= 0.95
        p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x + p.cursor.vx))
        p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y + p.cursor.vy))
      }
    }
  }

  const drawToCanvas = (
    ctx: CanvasRenderingContext2D,
    hue: number,
    glow: number,
  ) => {
    const { width, height } = dimsRef.current
    const mouse = mouseRef.current
    ctx.clearRect(0, 0, width, height)

    const cx = mouse.set ? mouse.sx : -9999
    const cy = mouse.set ? mouse.sy : -9999
    const radius = 300 // Concentrated spotlight

    const path = new Path2D()
    for (const points of linesRef.current) {
      if (points.length < 2) continue
      const p0 = points[0]
      path.moveTo(p0.x + p0.wave.x, p0.y + p0.wave.y)
      for (let i = 1; i < points.length; i++) {
        const p = points[i]
        path.lineTo(p.x + p.wave.x + p.cursor.x, p.y + p.wave.y + p.cursor.y)
      }
    }

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    grad.addColorStop(0,    `hsla(${Math.round(hue)}, 95%, 85%, 1)`) // Brighter core
    grad.addColorStop(0.3,  `hsla(${Math.round(hue)}, 90%, 75%, 0.7)`)
    grad.addColorStop(0.6,  `hsla(${Math.round(hue)}, 80%, 65%, 0.2)`)
    grad.addColorStop(1,    `hsla(${Math.round(hue)}, 70%, 55%, 0.02)`)

    ctx.strokeStyle = grad
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    ctx.globalCompositeOperation = 'lighter'

    const bloomAlpha = Math.min(0.2 + glow * 0.5, 0.9)
    
    // Pass 1: Thin outer glow
    ctx.globalAlpha = bloomAlpha * 0.3
    ctx.lineWidth = 3 + glow * 4
    ctx.stroke(path)

    // Pass 2: Sharp middle bloom
    ctx.globalAlpha = bloomAlpha * 0.6
    ctx.lineWidth = 1.2 + glow * 2
    ctx.stroke(path)

    // Pass 3: Ultra-thin bright core
    ctx.globalAlpha = 1.0
    ctx.lineWidth = 0.8
    ctx.stroke(path)

    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1.0
  }

  const tick = (time: number) => {
    const elapsed = time - lastFrameTimeRef.current
    if (elapsed < FRAME_MS) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }
    lastFrameTimeRef.current = time - (elapsed % FRAME_MS)

    const mouse = mouseRef.current
    mouse.sx += (mouse.x - mouse.sx) * 0.1
    mouse.sy += (mouse.y - mouse.sy) * 0.1
    const dx = mouse.x - mouse.lx
    const dy = mouse.y - mouse.ly
    const d = Math.hypot(dx, dy)
    mouse.v = d
    mouse.vs += (d - mouse.vs) * 0.1
    mouse.vs = Math.min(100, mouse.vs)
    mouse.lx = mouse.x
    mouse.ly = mouse.y
    mouse.a = Math.atan2(dy, dx)

    const { width } = dimsRef.current
    const targetHue = mouse.set
      ? (mouse.sx / Math.max(1, width)) * 300 + time * 0.012
      : time * 0.012
    currentHue.current = currentHue.current + ((targetHue % 360) - currentHue.current) * 0.04

    const velocityBoost = Math.min(mouse.vs / 100 * 2.5, 2.5)
    const targetGlow = mouse.vs > 1.5 ? 0.5 + velocityBoost : 0
    const lerpSpeed = targetGlow > currentGlow.current ? 0.15 : 0.04
    currentGlow.current += (targetGlow - currentGlow.current) * lerpSpeed

    if (!pausedRef.current) {
      movePoints(time)
      const ctx = ctxRef.current
      if (ctx) drawToCanvas(ctx, currentHue.current, currentGlow.current)
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} style={{ opacity }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}

export default memo(WaveBackground)
