import './app.css'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const particleMap = textureLoader.load('/img/particles/3.png')

// debug
const params = {
  color: 0x8bc34a,
  spin: () => {
    gsap.to(mesh.rotation, {
      y: mesh.rotation.y + 2.5 * Math.PI,
      duration: 1.2,
    })
  },
}
const gui = new dat.GUI({ closed: true, width: 300 })

// canvas
const canvas = document.getElementById('3d')

// scene
const scene = new THREE.Scene()

// Scene background
const envMap = new THREE.CubeTextureLoader()
  .setPath('/img/environment/4/')
  .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

scene.background = envMap

// objects
const sphereGeometry = new THREE.SphereBufferGeometry(0.75, 32, 32)
const particlesGeometry = new THREE.BufferGeometry()

const PARTICLES_COUNT = 10000

const positions = new Float32Array(PARTICLES_COUNT * 3)
for (let i = 0; i < PARTICLES_COUNT * 3; i++) {
  positions[i] = 10 * (0.5 - Math.random())
}
particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)

const material = new THREE.MeshStandardMaterial()
const particleMaterial = new THREE.PointsMaterial({
  size: 0.03,
  sizeAttenuation: true,
  color: params.color,
  transparent: true,
  alphaMap: particleMap,
})

const particles = new THREE.Points(particlesGeometry, particleMaterial)
scene.add(particles)

material.metalness = 0.3
material.roughness = 0.1
material.envMap = envMap

const mesh = new THREE.Mesh(sphereGeometry, material)
//scene.add(mesh)

// Helpers
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// Lights

// for light bouncing
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// for real light
const pointLight = new THREE.PointLight(0xffeb3b, 0.3)
pointLight.position.set(0.5, 4, 0)
const directionalLight = new THREE.DirectionalLight(params.color, 0.2)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3)
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
)
// enable shadows for lights
directionalLight.castShadow = true
pointLight.castShadow = true

// optimize shadows
// make sure size is power of 2 for mipmapping
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 4

pointLight.shadow.radius = 40
directionalLight.shadow.radius = 40

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
)

scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = false
scene.add(directionalLightHelper, pointLightHelper)
scene.add(pointLight, ambientLight, directionalLight)

// Debug GUI
const position = gui.addFolder('Position')

const settings = gui.addFolder('Settings')

gui.add(params, 'spin')
settings.addColor(params, 'color').onChange((color) => {
  material.color.set(color)
})

const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// base camera
const camera = new THREE.PerspectiveCamera(
  70,
  canvasSize.width / canvasSize.height,
  0.01,
  100
)

// renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(canvasSize.width, canvasSize.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// enable shadows
renderer.shadowMap.enabled = true
// soft shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const setRendererPixedRatio = () => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

setRendererPixedRatio()

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.update()

camera.position.set(0, 0, 3)
scene.add(camera)

const clock = new THREE.Clock()

window.addEventListener('resize', () => {
  canvasSize.width = window.innerWidth
  canvasSize.height = window.innerHeight

  // update the camera apect ratio
  camera.aspect = canvasSize.width / canvasSize.height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(canvasSize.width, canvasSize.height)

  setRendererPixedRatio()
})

window.addEventListener('dblclick', () => {
  const isFullscreen =
    document.fullscreenElement || document.webkitFullscreenElement
  if (!isFullscreen) {
    if (canvas.requestFullscreen) {
      return canvas.requestFullscreen()
    }
    if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      return document.exitFullscreen()
    }
    if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

const animate = () => {
  // render
  const elapsedTime = clock.getElapsedTime()

  // update controls
  controls.update()

  // Call animate again on the next frame
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()
