/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as THREE from "three"
import React, { useEffect, useRef } from "react"

interface SpiderThermalEffectProps {
  width?: number
  height?: number
  className?: string
  fillHeight?: boolean
  paused?: boolean
}

const SpiderThermalEffect: React.FC<SpiderThermalEffectProps> = ({
  width = 400,
  height = 400,
  className = "",
  fillHeight = false,
  paused = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<SpiderThermalEngine | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const initEngine = async () => {
      try {
        const engine = new SpiderThermalEngine(containerRef.current!)
        await engine.init()
        engineRef.current = engine
        // If initially paused, apply it
        if (paused) engine.pause()
      } catch (error) {
        console.error("Failed to initialize spider thermal effect:", error)
      }
    }

    initEngine()

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose()
        engineRef.current = null
      }
    }
  }, [])

  // Sync paused prop with engine
  useEffect(() => {
    if (engineRef.current) {
      if (paused) engineRef.current.pause()
      else engineRef.current.resume()
    }
  }, [paused])

  return (
    <div className={`flex w-full h-full justify-center ${className}`}>
      <div
        ref={containerRef}
        style={fillHeight ? { width } : { width, height }}
        className={fillHeight ? "h-full" : ""}
      />
    </div>
  )
}

export { SpiderThermalEffect }

// ─── Spider canvas texture ───────────────────────────────────────────────────

function createSpiderCanvasTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = "white"

  const cx = size / 2
  const cy = size / 2
  const r = 230  // hexagon radius

  // Regular hexagon, corner pointing straight UP (start at -Math.PI/2)
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI * 2) / 6
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

// ─── Engine ──────────────────────────────────────────────────────────────────

class SpiderThermalEngine implements Disposable {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  private drawRenderer!: DrawRenderer
  private interactionManager!: InteractionManager
  private thermalMaterial!: ThermalMaterial
  private heatMesh!: THREE.Mesh
  private maskTexture!: THREE.Texture
  private container: HTMLElement
  private heatUp = 0
  private parameters: EffectParameters = { ...DEFAULT_PARAMETERS }
  private animationId: number | null = null
  private lastTime = 0
  private isPaused = false
  private animationValues: AnimationValues = {
    blendVideo: { value: 1, target: 1 },
    amount: { value: 0, target: 1 },
    mouse: {
      position: new THREE.Vector3(0, 0, 0),
      target: new THREE.Vector3(0, 0, 0),
    },
    move: { value: 1, target: 1 },
    scrollAnimation: {
      opacity: { value: 1, target: 1 },
      scale: { value: 1, target: 1 },
      power: { value: 0.8, target: 0.8 },
    },
  }

  private resizeHandler = () => {
    const w = this.container.offsetWidth
    const h = this.container.offsetHeight
    this.renderer.setSize(w, h)
    this.onResize(w, h)
    this.interactionManager?.updateBounds()
  }

  constructor(container: HTMLElement) {
    this.container = container
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      logarithmicDepthBuffer: false,
    })
    this.renderer.outputColorSpace =
      (THREE as any).SRGBColorSpace ?? this.renderer.outputColorSpace
    this.renderer.setClearColor(0x000000, 0)
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(
      CAMERA_CONFIG.LEFT,
      CAMERA_CONFIG.RIGHT,
      CAMERA_CONFIG.TOP,
      CAMERA_CONFIG.BOTTOM,
      CAMERA_CONFIG.NEAR,
      CAMERA_CONFIG.FAR
    )
    this.camera.position.z = CAMERA_CONFIG.POSITION_Z
    this.setupRenderer()
    this.setupResizeHandler()
  }

  private setupRenderer(): void {
    const w = this.container.offsetWidth
    const h = this.container.offsetHeight
    this.renderer.setSize(w, h)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)) // Limit pixel ratio for performance
    this.renderer.domElement.style.pointerEvents = "none"
    this.container.appendChild(this.renderer.domElement)
  }

  private setupResizeHandler(): void {
    window.addEventListener("resize", this.resizeHandler)
  }

  async init(): Promise<void> {
    const isMobile = isTouchDevice()
    this.drawRenderer = new DrawRenderer(256, { radiusRatio: 1000, isMobile })

    // Spider shape is generated from canvas — no network request needed
    this.maskTexture = createSpiderCanvasTexture()

    this.createThermalEffect()
    this.setupMaterialTextureBasedUniforms()
    this.setupInteractionManager()
    this.onResize(this.container.offsetWidth, this.container.offsetHeight)
    this.startAnimationLoop()
  }

  private setupMaterialTextureBasedUniforms(): void {
    if (!this.thermalMaterial || !this.maskTexture) return
    const uniforms = this.thermalMaterial.getUniforms?.()
    const texWidth =
      (this.maskTexture.image && (this.maskTexture.image as any).width) || 512
    const glowRadiusUV = 10 / Math.max(1, texWidth)
    if (uniforms?.glowRadius) uniforms.glowRadius.value = glowRadiusUV
    if (uniforms?.glowIntensity) uniforms.glowIntensity.value = 0.7
  }

  private createThermalEffect(): void {
    this.thermalMaterial = new ThermalMaterial({
      drawTexture: this.drawRenderer.getTexture(),
      maskTexture: this.maskTexture,
    })
    this.heatMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      this.thermalMaterial.getMaterial()
    )
    this.heatMesh.position.set(0, 0, 0)
    this.scene.add(this.heatMesh)
  }

  private setupInteractionManager(): void {
    this.interactionManager = new InteractionManager({
      container: this.container,
      hitContainer: this.container,
      onPositionUpdate: (position, direction) => {
        this.animationValues.mouse.target.copy(position)
        this.drawRenderer.updateDirection(direction)
      },
      onInteractionChange: (isInteracting) => {
        this.animationValues.move.target = isInteracting
          ? INTERACTION.HOLD_MOVE_TARGET
          : INTERACTION.RELEASE_MOVE_TARGET
        this.animationValues.scrollAnimation.power.target = isInteracting
          ? INTERACTION.HOLD_POWER_TARGET
          : INTERACTION.RELEASE_POWER_TARGET
      },
    })
  }

  private startAnimationLoop(): void {
    const animate = (currentTime: number) => {
      if (this.isPaused) return

      const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1) // Cap delta time
      this.lastTime = currentTime
      this.update(deltaTime)
      this.render()
      this.animationId = requestAnimationFrame(animate)
    }
    this.lastTime = performance.now()
    this.animationId = requestAnimationFrame(animate)
  }

  private update(deltaTime: number): void {
    this.updateAnimationValues(deltaTime)
    this.updateHeatInteraction(deltaTime)
    this.updateThermalMaterial()
    this.updateMeshTransform()
    this.updateDrawRenderer()
    this.thermalMaterial.updateTime(this.lastTime / 1000)
  }

  private updateAnimationValues(deltaTime: number): void {
    this.animationValues.mouse.position.lerp(
      this.animationValues.mouse.target,
      lerpSpeed(ANIMATION.MOUSE_INTERPOLATION_SPEED, deltaTime)
    )
    this.animationValues.move.value = lerp(
      this.animationValues.move.value,
      this.animationValues.move.target,
      lerpSpeed(ANIMATION.MOVEMENT_INTERPOLATION_SPEED, deltaTime)
    )
    this.animationValues.scrollAnimation.power.value = clamp(
      lerp(
        this.animationValues.scrollAnimation.power.value,
        this.animationValues.scrollAnimation.power.target,
        lerpSpeed(ANIMATION.POWER_INTERPOLATION_SPEED, deltaTime)
      ),
      ANIMATION.POWER_MIN,
      ANIMATION.POWER_MAX
    )
    this.animationValues.scrollAnimation.opacity.value = lerp(
      this.animationValues.scrollAnimation.opacity.value,
      this.animationValues.scrollAnimation.opacity.target *
        this.animationValues.move.value,
      lerpSpeed(ANIMATION.SCROLL_INTERPOLATION_SPEED, deltaTime)
    )
    this.animationValues.scrollAnimation.scale.value = lerp(
      this.animationValues.scrollAnimation.scale.value,
      this.animationValues.scrollAnimation.scale.target,
      lerpSpeed(ANIMATION.SCROLL_INTERPOLATION_SPEED, deltaTime)
    )
    if (this.animationValues.amount.value < 0.99999) {
      this.animationValues.amount.value = lerp(
        this.animationValues.amount.value,
        this.animationValues.amount.target,
        ANIMATION.FADE_IN_SPEED * deltaTime * ANIMATION.TARGET_FPS
      )
    }
  }

  private updateHeatInteraction(deltaTime: number): void {
    const interactionState = this.interactionManager.getInteractionState()
    const mouseState = this.interactionManager.getMouseState()
    this.drawRenderer.updatePosition(mouseState.position, true)
    if (interactionState.hold) {
      this.heatUp +=
        this.parameters.heatSensitivity * deltaTime * ANIMATION.TARGET_FPS
      this.heatUp = Math.min(this.heatUp, ANIMATION.HEAT_MAX_VALUE)
    }
    this.drawRenderer.updateDraw(this.heatUp)
    this.heatUp *= this.parameters.heatDecay
    if (this.heatUp < INTERACTION.HEAT_CLEANUP_THRESHOLD) {
      this.heatUp = 0
    }
    this.interactionManager.updateMousePosition(
      lerpSpeed(ANIMATION.MOUSE_INTERPOLATION_SPEED, deltaTime)
    )
  }

  private updateThermalMaterial(): void {
    if (!this.thermalMaterial) return
    this.thermalMaterial.updateUniforms({
      opacity: this.animationValues.scrollAnimation.opacity.value,
      amount: this.animationValues.amount.value,
      power: this.parameters.contrastPower,
      blendVideo: this.parameters.videoBlendAmount,
      randomValue: Math.random(),
    })
    this.thermalMaterial.updateFromParameters(this.parameters)
  }

  private updateMeshTransform(): void {
    const scale = this.animationValues.scrollAnimation.scale.value
    if (this.heatMesh) this.heatMesh.scale.set(scale, scale, scale)
  }

  private updateDrawRenderer(): void {
    this.drawRenderer.updateDirection({ x: 0, y: 0 })
  }

  pause(): void {
    if (this.isPaused) return
    this.isPaused = true
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.interactionManager?.pause()
  }

  resume(): void {
    if (!this.isPaused) return
    this.isPaused = false
    this.lastTime = performance.now()
    this.startAnimationLoop()
    this.interactionManager?.resume()
  }

  private render(): void {
    if (this.drawRenderer) {
      const rect = this.interactionManager.getBounds()
      this.drawRenderer.resize(rect.width, rect.height)
      this.drawRenderer.render(this.renderer)
    }
    this.renderer.autoClear = true
    this.renderer.render(this.scene, this.camera)
  }

  private onResize(width: number, height: number): void {
    const aspectRatio = width / height
    let cameraWidth: number, cameraHeight: number
    if (aspectRatio >= 1) {
      cameraHeight = 1
      cameraWidth = aspectRatio
      if (this.heatMesh) this.heatMesh.position.set(0, 0, 0)
    } else {
      cameraWidth = 1
      cameraHeight = 1 / aspectRatio
      if (this.heatMesh) this.heatMesh.position.set(0, 0, 0)
    }
    this.camera.left = -cameraWidth / 2
    this.camera.right = cameraWidth / 2
    this.camera.top = cameraHeight / 2
    this.camera.bottom = -cameraHeight / 2
    this.camera.updateProjectionMatrix()
  }

  dispose(): void {
    this.pause()
    window.removeEventListener("resize", this.resizeHandler)
    this.drawRenderer?.dispose()
    this.interactionManager?.dispose()
    this.thermalMaterial?.dispose()
    if (this.heatMesh) {
      if (this.heatMesh.geometry) this.heatMesh.geometry.dispose()
    }
    this.scene.remove(this.heatMesh)
    if (this.maskTexture) this.maskTexture.dispose()
    this.renderer.dispose()
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement)
    }
  }
}

// ─── ThermalMaterial ─────────────────────────────────────────────────────────

interface ThermalMaterialConfig {
  drawTexture: THREE.Texture
  maskTexture: THREE.Texture
}

class ThermalMaterial implements Disposable {
  private material: THREE.ShaderMaterial
  private uniforms: ThermalShaderUniforms

  constructor(config: ThermalMaterialConfig) {
    this.uniforms = this.createUniforms(config)
    this.material = this.createMaterial()
  }

  private createUniforms(
    config: ThermalMaterialConfig
  ): ThermalShaderUniforms {
    const colors = THERMAL_PALETTE.map(hexToRGB) as [
      [number, number, number],
      [number, number, number],
      [number, number, number],
      [number, number, number],
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ]

    return {
      blendVideo: { value: 0 },
      drawMap: { value: config.drawTexture },
      textureMap: { value: config.drawTexture },
      maskMap: { value: config.maskTexture },

      scale: { value: [1, 1] },
      offset: { value: [0, 0] },
      opacity: { value: 1 },
      amount: { value: 0 },

      color1: { value: colors[0] },
      color2: { value: colors[1] },
      color3: { value: colors[2] },
      color4: { value: colors[3] },
      color5: { value: colors[4] },
      color6: { value: colors[5] },
      color7: { value: colors[6] },

      blend: { value: [...GRADIENT_CONFIG.BLEND_POINTS] as [number, number, number, number] },
      fade:  { value: [...GRADIENT_CONFIG.FADE_RANGES]  as [number, number, number, number] },
      maxBlend: { value: [...GRADIENT_CONFIG.MAX_BLEND] as [number, number, number, number] },

      power: { value: 0.8 },
      rnd:   { value: 0 },
      heat:  { value: [0, 0, 0, 1.02] },
      stretch: { value: [1, 1, 0, 0] },

      effectIntensity:   { value: 1.0 },
      colorSaturation:   { value: 1.3 },
      gradientShift:     { value: 0.0 },
      interactionSize:   { value: 1.0 },

      time:              { value: 0.0 },
      glowRadius:        { value: 0.02 },
      glowIntensity:     { value: 0.7 },
      blurAmount:        { value: 0.005 },

      animationSpeed:    { value: 1.0 },
      animationIntensity:{ value: 0.5 },
      waveFrequency:     { value: 8.0 },
      pulseSpeed:        { value: 2.0 },
      baseAnimationLevel:{ value: 0.3 },
      animationBlendMode:{ value: 1.0 },
    }
  }

  private createMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: thermalVertexShader,
      fragmentShader: thermalFragmentShader,
      depthTest: false,
      transparent: true,
    })
  }

  updateUniforms(updates: {
    opacity?: number
    amount?: number
    power?: number
    blendVideo?: number
    effectIntensity?: number
    colorSaturation?: number
    gradientShift?: number
    interactionSize?: number
    randomValue?: number
  }): void {
    if (updates.opacity !== undefined) this.uniforms.opacity.value = updates.opacity
    if (updates.amount !== undefined) this.uniforms.amount.value = updates.amount
    if (updates.power !== undefined) this.uniforms.power.value = updates.power
    if (updates.blendVideo !== undefined) this.uniforms.blendVideo.value = updates.blendVideo
    if (updates.effectIntensity !== undefined) this.uniforms.effectIntensity.value = updates.effectIntensity
    if (updates.colorSaturation !== undefined) this.uniforms.colorSaturation.value = updates.colorSaturation
    if (updates.gradientShift !== undefined) this.uniforms.gradientShift.value = updates.gradientShift
    if (updates.interactionSize !== undefined) this.uniforms.interactionSize.value = updates.interactionSize
    if (updates.randomValue !== undefined) this.uniforms.rnd.value = updates.randomValue
  }

  updateTime(time: number): void {
    this.uniforms.time.value = time
  }

  updateFromParameters(parameters: EffectParameters): void {
    this.updateUniforms({
      effectIntensity: parameters.effectIntensity,
      colorSaturation: parameters.colorSaturation,
      gradientShift: parameters.gradientShift,
      interactionSize: parameters.interactionRadius,
      power: parameters.contrastPower,
      blendVideo: parameters.videoBlendAmount,
    })
  }

  getMaterial(): THREE.ShaderMaterial {
    return this.material
  }

  getUniforms(): ThermalShaderUniforms {
    return this.uniforms
  }

  dispose(): void {
    this.material.dispose()
  }
}

// ─── InteractionManager ──────────────────────────────────────────────────────

interface InteractionManagerConfig {
  container: HTMLElement
  hitContainer?: HTMLElement
  onPositionUpdate: (
    position: THREE.Vector3,
    direction: { x: number; y: number }
  ) => void
  onInteractionChange: (isInteracting: boolean) => void
}

class InteractionManager implements Disposable {
  private container: HTMLElement
  private hitContainer: HTMLElement
  private onPositionUpdate: InteractionManagerConfig["onPositionUpdate"]
  private onInteractionChange: InteractionManagerConfig["onInteractionChange"]
  private mouseState: MouseState
  private interactionState: InteractionState
  private cleanupFunctions: Array<() => void> = []
  private cachedBounds: DOMRect | null = null
  private isPaused = false

  constructor(config: InteractionManagerConfig) {
    this.container = config.container
    this.hitContainer = config.hitContainer || config.container
    this.onPositionUpdate = config.onPositionUpdate
    this.onInteractionChange = config.onInteractionChange

    this.mouseState = {
      position: new THREE.Vector3(0, 0, 0),
      target: new THREE.Vector3(0, 0, 0),
    }

    this.interactionState = {
      hold: false,
      heatUp: 0,
      lastNX: 0.5,
      lastNY: 0.5,
    }

    this.updateBounds()
    this.setupEventListeners()
  }

  updateBounds(): void {
    this.cachedBounds = this.hitContainer.getBoundingClientRect()
  }

  getBounds(): DOMRect {
    if (!this.cachedBounds) this.updateBounds()
    return this.cachedBounds!
  }

  private setupEventListeners(): void {
    this.cleanupFunctions.push(
      addEventListenerWithCleanup(this.hitContainer, "pointermove", this.handlePointerMove),
      addEventListenerWithCleanup(this.hitContainer, "pointerdown", this.handlePointerDown),
      addEventListenerWithCleanup(this.hitContainer, "pointerenter", this.handlePointerEnter),
      addEventListenerWithCleanup(this.hitContainer, "pointerup", this.handlePointerUp),
      addEventListenerWithCleanup(this.hitContainer, "pointerleave", this.handlePointerLeave)
    )
    
    // Only add global listener if not paused and on desktop
    if (!this.isPaused && !isTouchDevice()) {
      this.cleanupFunctions.push(
        addEventListenerWithCleanup(window, "pointermove", this.handleGlobalPointerMove, { passive: true })
      )
    }
  }

  private removeEventListeners(): void {
    this.cleanupFunctions.forEach((fn) => fn())
    this.cleanupFunctions = []
  }

  pause(): void {
    if (this.isPaused) return
    this.isPaused = true
    this.removeEventListeners()
  }

  resume(): void {
    if (!this.isPaused) return
    this.isPaused = false
    this.updateBounds()
    this.setupEventListeners()
  }

  private handlePointerMove = (event: Event) => {
    if (this.isPaused) return
    const e = event as PointerEvent
    this.updatePosition(e.clientX, e.clientY)
    this.setInteracting(true)
  }

  private handlePointerDown = (event: Event) => {
    if (this.isPaused) return
    const e = event as PointerEvent
    this.updatePosition(e.clientX, e.clientY)
    this.setInteracting(true)
  }

  private handlePointerEnter = (event: Event) => {
    if (this.isPaused) return
    const e = event as PointerEvent
    this.updatePosition(e.clientX, e.clientY)
  }

  private handlePointerUp = () => this.setInteracting(false)
  private handlePointerLeave = () => this.setInteracting(false)

  private handleGlobalPointerMove = (event: Event) => {
    if (this.isPaused) return
    const e = event as PointerEvent
    this.updateGlobalPosition(e.clientX, e.clientY)
    // Don't call setInteracting(true) here as it might keep the engine busy unnecessarily
  }

  private updatePosition(clientX: number, clientY: number): void {
    const bounds = this.getBounds()
    const { x, y } = screenToNDC(clientX, clientY, bounds)
    const { x: dx, y: dy } = calculateMovementDelta(
      clientX, clientY,
      this.interactionState.lastNX,
      this.interactionState.lastNY,
      bounds
    )
    this.mouseState.target.set(x, y, 0)
    this.onPositionUpdate(this.mouseState.target, { x: dx, y: dy })
    this.interactionState.lastNX = bounds.width > 0 ? (clientX - bounds.left) / bounds.width : 0.5
    this.interactionState.lastNY = bounds.height > 0 ? (clientY - bounds.top) / bounds.height : 0.5
  }

  private updateGlobalPosition(clientX: number, clientY: number): void {
    const bounds = this.getBounds()
    const { x, y } = screenToNDC(clientX, clientY, bounds)
    const { x: dx, y: dy } = calculateMovementDelta(
      clientX, clientY,
      this.interactionState.lastNX,
      this.interactionState.lastNY,
      bounds
    )
    this.mouseState.target.set(x, y, 0)
    this.onPositionUpdate(this.mouseState.target, { x: dx, y: dy })
    this.interactionState.lastNX = bounds.width > 0 ? (clientX - bounds.left) / bounds.width : 0.5
    this.interactionState.lastNY = bounds.height > 0 ? (clientY - bounds.top) / bounds.height : 0.5
  }

  private setInteracting(isInteracting: boolean): void {
    if (this.interactionState.hold !== isInteracting) {
      this.interactionState.hold = isInteracting
      this.onInteractionChange(isInteracting)
    }
  }

  getMouseState(): Readonly<MouseState> { return this.mouseState }
  getInteractionState(): Readonly<InteractionState> { return this.interactionState }

  updateMousePosition(lerpFactor: number): void {
    this.mouseState.position.lerp(this.mouseState.target, lerpFactor)
  }

  dispose(): void {
    this.removeEventListeners()
  }
}

// ─── DrawRenderer ────────────────────────────────────────────────────────────

class DrawRenderer implements Disposable {
  private camera: THREE.OrthographicCamera
  private renderTargetA: THREE.WebGLRenderTarget
  private renderTargetB: THREE.WebGLRenderTarget
  private material: THREE.ShaderMaterial
  private scene: THREE.Scene
  private mesh: THREE.Mesh
  private uniforms: DrawRendererUniforms
  private options: DrawRendererOptions

  constructor(size = DRAW_RENDERER.TEXTURE_SIZE, options: DrawRendererOptions = {}) {
    this.options = options
    this.camera = new THREE.OrthographicCamera(
      CAMERA_CONFIG.LEFT, CAMERA_CONFIG.RIGHT,
      CAMERA_CONFIG.TOP, CAMERA_CONFIG.BOTTOM,
      CAMERA_CONFIG.NEAR, CAMERA_CONFIG.FAR
    )
    this.camera.position.z = CAMERA_CONFIG.POSITION_Z

    const rtOpts: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      colorSpace: THREE.LinearSRGBColorSpace,
      depthBuffer: false,
      stencilBuffer: false,
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearMipmapLinearFilter,
      generateMipmaps: true,
    }

    this.renderTargetA = new THREE.WebGLRenderTarget(size, size, rtOpts)
    this.renderTargetB = new THREE.WebGLRenderTarget(size, size, rtOpts)

    this.uniforms = this.createUniforms()
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: drawVertexShader,
      fragmentShader: drawFragmentShader,
      depthTest: false,
      transparent: true,
    })

    this.scene = new THREE.Scene()
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.material)
    this.scene.add(this.mesh)
  }

  private createUniforms(): DrawRendererUniforms {
    const [rx, ry, rz] = DRAW_RENDERER.UNIFORMS.RADIUS_VECTOR
    return {
      uRadius: { value: new THREE.Vector3(rx, ry, rz) },
      uPosition: { value: new THREE.Vector2(0, 0) },
      uDirection: { value: new THREE.Vector4(0, 0, 0, 0) },
      uResolution: { value: new THREE.Vector3(0, 0, 0) },
      uTexture: { value: null },
      uSizeDamping: { value: DRAW_RENDERER.UNIFORMS.SIZE_DAMPING },
      uFadeDamping: { value: DRAW_RENDERER.UNIFORMS.FADE_DAMPING },
      uDraw: { value: 0 },
    }
  }

  updateRadius(px = 0): void { this.uniforms.uRadius.value.z = px }
  updateDraw(value = 0): void { this.uniforms.uDraw.value = value }

  updatePosition(position: { x: number; y: number }, normalized = false): void {
    const x = normalized ? 0.5 * position.x + 0.5 : position.x
    const y = normalized ? 0.5 * position.y + 0.5 : position.y
    this.uniforms.uPosition.value.set(x, y)
  }

  updateDirection(direction: { x: number; y: number }): void {
    this.uniforms.uDirection.value.set(
      direction.x, direction.y, 0,
      DRAW_RENDERER.UNIFORMS.DIRECTION_MULTIPLIER
    )
  }

  resize(width: number, height: number): void {
    const ratio = height / (this.options.radiusRatio ?? DRAW_RENDERER.RADIUS_RATIO)
    const baseRadius = this.options.isMobile
      ? DRAW_RENDERER.MOBILE_RADIUS
      : DRAW_RENDERER.DESKTOP_RADIUS
    this.updateRadius(baseRadius * ratio)
    this.uniforms.uResolution.value.set(width, height, 1)
  }

  getTexture(): THREE.Texture { return this.renderTargetB.texture }

  render(renderer: THREE.WebGLRenderer): void {
    this.uniforms.uTexture.value = this.renderTargetB.texture
    const prev = renderer.getRenderTarget()
    renderer.setRenderTarget(this.renderTargetA)
    if (renderer.autoClear) renderer.clear()
    renderer.render(this.scene, this.camera)
    renderer.setRenderTarget(prev)
    const tmp = this.renderTargetA
    this.renderTargetA = this.renderTargetB
    this.renderTargetB = tmp
  }

  dispose(): void {
    this.material.dispose()
    this.renderTargetA.dispose()
    this.renderTargetB.dispose()
    this.mesh.geometry.dispose()
  }
}

// ─── Shaders ─────────────────────────────────────────────────────────────────

const thermalVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec4 vClipPosition;
void main() {
    vUv = uv;
    vClipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipPosition;
}
`

const thermalFragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D drawMap;
uniform sampler2D maskMap;
uniform float time;

uniform float opacity;
uniform float amount;
uniform vec2 scale;
uniform vec2 offset;
uniform float power;
uniform float effectIntensity;
uniform float colorSaturation;
uniform float gradientShift;
uniform float interactionSize;

uniform vec3 color1, color2, color3, color4, color5, color6, color7;
uniform vec4 blend, fade, maxBlend;

varying vec2 vUv;
varying vec4 vClipPosition;

vec3 linearRgbToLuminance(vec3 c) {
    float f = dot(c, vec3(0.2126729, 0.7151522, 0.0721750));
    return vec3(f);
}

vec3 saturation(vec3 c, float s) {
    return mix(linearRgbToLuminance(c), c, s);
}

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 gradient(float t) {
    t = clamp(t + gradientShift, 0.0, 1.0);
    float p1 = blend.x, p2 = blend.y, p3 = blend.z, p4 = blend.w;
    float p5 = maxBlend.x, p6 = maxBlend.y;
    float f1 = fade.x, f2 = fade.y, f3 = fade.z, f4 = fade.w;
    float f5 = maxBlend.z, f6 = maxBlend.w;
    float b1 = smoothstep(p1 - f1 * 0.5, p1 + f1 * 0.5, t);
    float b2 = smoothstep(p2 - f2 * 0.5, p2 + f2 * 0.5, t);
    float b3 = smoothstep(p3 - f3 * 0.5, p3 + f3 * 0.5, t);
    float b4 = smoothstep(p4 - f4 * 0.5, p4 + f4 * 0.5, t);
    float b5 = smoothstep(p5 - f5 * 0.5, p5 + f5 * 0.5, t);
    float b6 = smoothstep(p6 - f6 * 0.5, p6 + f6 * 0.5, t);
    vec3 col = color1;
    col = mix(col, color2, b1);
    col = mix(col, color3, b2);
    col = mix(col, color4, b3);
    col = mix(col, color5, b4);
    col = mix(col, color6, b5);
    col = mix(col, color7, b6);
    return col;
}

void main() {
    vec2 duv = vClipPosition.xy / vClipPosition.w;
    duv = 0.5 + duv * 0.5;

    vec2 uv = vUv;
    uv -= 0.5;
    uv /= scale;
    uv += 0.5;
    uv += offset;

    float o = clamp(opacity, 0.0, 1.0);
    float a = clamp(amount, 0.0, 1.0);
    float v = o * a;

    vec4 tex = texture(maskMap, uv);
    float mask = tex.a;

    vec3 draw = texture(drawMap, duv).rgb;
    float heatDraw = draw.b * mask * interactionSize;

    float noiseAnim = smoothNoise(uv * 5.0 + vec2(time * 1.0, time * 1.2));
    float waveAnim  = 0.5 + 0.5 * sin(time * 0.5 + uv.y * 8.0);
    float timeAnim  = mix(noiseAnim, waveAnim, 1.0);
    heatDraw += 0.8 * timeAnim;

    float map = pow(heatDraw, power);

    vec3 final = gradient(map);
    final = saturation(final, colorSaturation);
    final *= mask * (1.0 + map * 1.5);
    final = mix(vec3(0.0), final, v * effectIntensity);
    final *= mask;
    float alpha = mask * (o * a * effectIntensity);

    gl_FragColor = vec4(final, alpha);
}
`

const drawVertexShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const drawFragmentShader = /* glsl */ `
precision highp float;

uniform float uDraw;
uniform vec3 uRadius;
uniform vec3 uResolution;
uniform vec2 uPosition;
uniform vec4 uDirection;
uniform float uSizeDamping;
uniform float uFadeDamping;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 pos = uPosition;
    pos.y /= aspect;
    vec2 uv = vUv;
    uv.y /= aspect;

    float dist = distance(pos, uv) / ((uRadius.z * 1.5) / uResolution.x);
    dist = smoothstep(uRadius.x, uRadius.y, dist);

    vec3 dir = uDirection.xyz * uDirection.w;
    vec2 offset = vec2((-dir.x) * (1.0 - dist), (dir.y) * (1.0 - dist));

    vec4 color = texture(uTexture, vUv + (offset * 0.01));
    color *= uFadeDamping;
    color.r += offset.x;
    color.g += offset.y;
    color.rg = clamp(color.rg, -1.0, 1.0);
    color.b += uDraw * (1.0 - dist);

    gl_FragColor = vec4(color.rgb, 1.0);
}
`

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_PARAMETERS: EffectParameters = {
  effectIntensity: 1.3,
  contrastPower: 0.8,
  colorSaturation: 1.5,
  heatSensitivity: 0.5,
  videoBlendAmount: 1.0,
  gradientShift: 0.0,
  heatDecay: 0.9,
  interactionRadius: 1.0,
  reactivity: 3.0,
} as const

const THERMAL_PALETTE = [
  "000000",
  "020918",
  "071a42",
  "0a2f7a",
  "0c4ed1",
  "1794ff",
  "7ddcff",
] as const

const ANIMATION = {
  FADE_IN_SPEED: 0.1,
  MOUSE_INTERPOLATION_SPEED: 0.8,
  SCROLL_INTERPOLATION_SPEED: 0.2,
  MOVEMENT_INTERPOLATION_SPEED: 0.01,
  POWER_INTERPOLATION_SPEED: 0.01,
  VIDEO_BLEND_SPEED: 0.1,
  HEAT_MAX_VALUE: 1.3,
  TARGET_FPS: 60,
  POWER_MIN: 0.8,
  POWER_MAX: 1.0,
} as const

const DRAW_RENDERER = {
  TEXTURE_SIZE: 256,
  RADIUS_RATIO: 1000,
  MOBILE_RADIUS: 350,
  DESKTOP_RADIUS: 220,
  UNIFORMS: {
    RADIUS_VECTOR: [-8, 0.9, 150] as const,
    SIZE_DAMPING: 0.8,
    FADE_DAMPING: 0.98,
    DIRECTION_MULTIPLIER: 100,
  },
} as const

const GRADIENT_CONFIG = {
  BLEND_POINTS: [0.4, 0.7, 0.81, 0.91] as const,
  FADE_RANGES: [1, 1, 0.72, 0.52] as const,
  MAX_BLEND: [0.8, 0.87, 0.5, 0.27] as const,
} as const

const CAMERA_CONFIG = {
  LEFT: -0.5,
  RIGHT: 0.5,
  TOP: 0.5,
  BOTTOM: -0.5,
  NEAR: -1,
  FAR: 1,
  POSITION_Z: 1,
} as const

const INTERACTION = {
  HOLD_MOVE_TARGET: 0.95,
  RELEASE_MOVE_TARGET: 1.0,
  HOLD_POWER_TARGET: 1.0,
  RELEASE_POWER_TARGET: 0.8,
  HEAT_CLEANUP_THRESHOLD: 0.001,
} as const

// ─── Types ───────────────────────────────────────────────────────────────────

interface EffectParameters {
  effectIntensity: number
  contrastPower: number
  colorSaturation: number
  heatSensitivity: number
  videoBlendAmount: number
  gradientShift: number
  heatDecay: number
  interactionRadius: number
  reactivity: number
}

interface ThermalShaderUniforms extends Record<string, { value: any }> {
  blendVideo: { value: number }
  drawMap: { value: THREE.Texture }
  textureMap: { value: THREE.Texture }
  maskMap: { value: THREE.Texture }
  scale: { value: [number, number] }
  offset: { value: [number, number] }
  opacity: { value: number }
  amount: { value: number }
  color1: { value: [number, number, number] }
  color2: { value: [number, number, number] }
  color3: { value: [number, number, number] }
  color4: { value: [number, number, number] }
  color5: { value: [number, number, number] }
  color6: { value: [number, number, number] }
  color7: { value: [number, number, number] }
  blend: { value: [number, number, number, number] }
  fade: { value: [number, number, number, number] }
  maxBlend: { value: [number, number, number, number] }
  power: { value: number }
  rnd: { value: number }
  heat: { value: [number, number, number, number] }
  stretch: { value: [number, number, number, number] }
  effectIntensity: { value: number }
  colorSaturation: { value: number }
  gradientShift: { value: number }
  interactionSize: { value: number }
}

interface DrawRendererUniforms extends Record<string, { value: any }> {
  uRadius: { value: THREE.Vector3 }
  uPosition: { value: THREE.Vector2 }
  uDirection: { value: THREE.Vector4 }
  uResolution: { value: THREE.Vector3 }
  uTexture: { value: THREE.Texture | null }
  uSizeDamping: { value: number }
  uFadeDamping: { value: number }
  uDraw: { value: number }
}

interface AnimationValues {
  blendVideo: { value: number; target: number }
  amount: { value: number; target: number }
  mouse: { position: THREE.Vector3; target: THREE.Vector3 }
  move: { value: number; target: number }
  scrollAnimation: {
    opacity: { value: number; target: number }
    scale: { value: number; target: number }
    power: { value: number; target: number }
  }
}

interface MouseState {
  position: THREE.Vector3
  target: THREE.Vector3
}

interface InteractionState {
  hold: boolean
  heatUp: number
  lastNX: number
  lastNY: number
}

interface DrawRendererOptions {
  radiusRatio?: number
  isMobile?: boolean
}

interface Disposable {
  dispose(): void
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

function lerpSpeed(base: number, deltaTime: number): number {
  const n = base * deltaTime * 60
  return n > 1 ? 1 : n < 0 ? 0 : n
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function hexToRGB(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "")
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("")
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ]
}

function screenToNDC(
  screenX: number,
  screenY: number,
  bounds: DOMRect
): { x: number; y: number } {
  const nx = bounds.width > 0 ? (screenX - bounds.left) / bounds.width : 0.5
  const ny = bounds.height > 0 ? (screenY - bounds.top) / bounds.height : 0.5
  return { x: 2 * (nx - 0.5), y: 2 * -(ny - 0.5) }
}

function calculateMovementDelta(
  currentX: number,
  currentY: number,
  lastX: number,
  lastY: number,
  bounds: DOMRect
): { x: number; y: number } {
  const nx = bounds.width > 0 ? (currentX - bounds.left) / bounds.width : 0.5
  const ny = bounds.height > 0 ? (currentY - bounds.top) / bounds.height : 0.5
  return { x: nx - lastX, y: ny - lastY }
}

function addEventListenerWithCleanup(
  element: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler, options)
  return () => element.removeEventListener(event, handler)
}
