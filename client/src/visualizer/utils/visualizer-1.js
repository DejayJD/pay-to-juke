import vertexShader from './shaders/visualizer-1.vert'
import fragmentShader from './shaders/visualizer-1.frag'

import createLine from './gl-line-3d'
import vignette from './gl-vignette-background'
import GLAudioAnalyser from './GLAudioAnalyser'

import createOrbit from 'orbit-controls'
import createCamera from 'perspective-camera'
import createShader from 'gl-shader'

import setIdentity from 'gl-mat4/identity'
import newArray from 'array-range'
import lerp from 'lerp'
import hexRgbByte from 'hex-rgb'
import getWebGLContext from 'webgl-context'
import canvasLoop from 'canvas-loop'
import canvasFit from 'canvas-fit'

const hexRgb = (str) => hexRgbByte(str).map((x) => x / 255)

let settings = {
  opacity: 0.5,
  additive: false,
  gradient: ['#FFFFFF', '#4F4F4F'],
  color: '#000',
  useHue: true
}

const webglExists = true // webglSupported()
const gl = getWebGLContext()

let audioCtx
let source

let Visualizer1 = (function () {
  if (!webglExists) return null

  const steps = 200
  const segments = 100
  const radius = 0.1
  const thickness = 0.01

  const colorVec = hexRgb(settings.color)

  const canvas = gl.canvas

  const app = canvasLoop(canvas, {
    scale: window.devicePixelRatio
  })

  const background = vignette(gl)
  background.style({
    aspect: 1,
    smoothing: [-0.5, 1.0],
    noiseAlpha: 0.1,
    offset: [-0.05, -0.15]
  })

  const identity = setIdentity([])
  const shader = createShader(gl, vertexShader, fragmentShader)

  const camera = createCamera({
    fov: (15 * Math.PI) / 180,
    position: [0, 0, 1],
    near: 0.0001,
    far: 10000
  })

  const controls = createOrbit({
    element: canvas,
    distanceBounds: [0.4, 3],
    distance: 0.4
  })

  const paths = newArray(segments).map(createSegment)
  const lines = paths.map((path) => {
    return createLine(gl, shader, path)
  })

  let time = 0
  app.on('tick', (dt) => {
    time += Math.min(30, dt) / 1000

    const width = gl.drawingBufferWidth
    const height = gl.drawingBufferHeight

    // set up our camera
    camera.viewport[2] = width
    camera.viewport[3] = height
    controls.update(camera.position, camera.direction, camera.up)
    camera.update()

    gl.viewport(0, 0, width, height)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const size = Math.min(width, height) * 1.5
    gl.disable(gl.DEPTH_TEST)
    background.style({
      color1: hexRgb('#2A2A29'),
      color2: hexRgb('#2A2A29'),
      scale: [(1 / width) * size, (1 / height) * size]
    })
    background.draw()

    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    if (settings.additive) gl.blendFunc(gl.ONE, gl.ONE)
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.disable(gl.CULL_FACE)

    shader.bind()
    shader.uniforms.iGlobalTime = time
    shader.uniforms.radius = radius
    shader.uniforms.audioTexture = 0
    shader.uniforms.opacity = settings.opacity
    shader.uniforms.useHue = settings.useHue

    if (analyser) {
      analyser.bindFrequencies(0)
    }

    lines.forEach((line, i, list) => {
      line.color = colorVec
      line.thickness = thickness
      line.model = identity
      line.view = camera.view
      line.projection = camera.projection
      line.aspect = width / height
      line.miter = 0
      shader.uniforms.index = i / (list.length - 1)
      line.draw()
    })
  })

  function createSegment() {
    return newArray(steps).map((i, _, list) => {
      const x = lerp(-1, 1, i / (list.length - 1))
      return [x, 0, 0]
    })
  }

  let analyser = null
  setDominantColors()

  function show(darkMode) {
    if (darkMode) {
      settings.gradient = ['#323232', '#111111']
      settings.color = '#FFF'
    } else {
      settings.gradient = ['#FFFFFF', '#4F4F4F']
      settings.color = '#000'
    }
    try {
      const parentContainer = document.getElementById('#visualizer-container')
      canvasFit(canvas, parentContainer)
      window.addEventListener(
        'resize',
        canvasFit(canvas, parentContainer),
        false
      )
    } catch (e) {
      console.log(e)
    }
    const visWrapper = document.querySelector('.visualizer')
    if (visWrapper && !visWrapper.hasChildNodes()) {
      visWrapper.appendChild(canvas)
    }
    app.start()
  }

  /** Binds the visualizer to an AudioStream element. */
  function bind(audio) {
    // Set up WebAudio API handles
    if (analyser) return
    // const AudioContext = window.AudioContext || window.webkitAudioContext
    try {
      audioCtx = new AudioContext()
      const gainNode = audioCtx.createGain()
      source = audioCtx.createMediaElementSource(audio)
      source.connect(gainNode)
      gainNode.connect(audioCtx.destination)
    } catch (e) {
      console.error('error setting up audio context')
      console.error(e)
    }
    analyser = new GLAudioAnalyser(gl, source, audioCtx)
  }

  function hide() {
    const visWrapper = document.querySelector('.visualizer')
    if (visWrapper && visWrapper.hasChildNodes()) {
      visWrapper.removeChild(canvas)
    }
  }

  function stop() {
    app.stop()
  }

  function setDominantColors(colors) {
    const defaultDominantColors = [
      { r: 82, g: 224, b: 224 },
      { r: 110, g: 82, b: 224 },
      { r: 224, g: 82, b: 167 }
    ]

    if (!colors || !colors[0]) {
      colors = defaultDominantColors
    }

    // Pull out 3 colors
    const color1 = colors[0]
    const color2 = colors[1] || color1
    const color3 = colors[2] || color2

    shader.uniforms.r1 = calcuateColorPixel(color1.r)
    shader.uniforms.g1 = calcuateColorPixel(color1.g)
    shader.uniforms.b1 = calcuateColorPixel(color1.b)

    shader.uniforms.r2 = calcuateColorPixel(color2.r)
    shader.uniforms.g2 = calcuateColorPixel(color2.g)
    shader.uniforms.b2 = calcuateColorPixel(color2.b)

    shader.uniforms.r3 = calcuateColorPixel(color3.r)
    shader.uniforms.g3 = calcuateColorPixel(color3.g)
    shader.uniforms.b3 = calcuateColorPixel(color3.b)
  }

  function calcuateColorPixel(colorPixel) {
    return colorPixel > 0 ? colorPixel / 255.0 : 0.0
  }

  return {
    bind,
    stop,
    show,
    hide,
    setDominantColors
  }
})()

export default Visualizer1
