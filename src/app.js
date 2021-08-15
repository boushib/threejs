import './app.css'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MeshStandardMaterial } from 'three'

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

// debug
const params = {
  color: 0x8bc34a,
  sceneColor: 0x1c2f40,
  spin: () => {
    gsap.to(cube.rotation, {
      y: cube.rotation.y + 2.5 * Math.PI,
      duration: 1.2,
    })
  },
}
const gui = new dat.GUI({ closed: true, width: 300 })

// canvas
const canvas = document.getElementById('3d')

// scene
const scene = new THREE.Scene()

// objects

// floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20, 100, 100),
  new THREE.MeshBasicMaterial({ color: 'green' })
)
// house
const house = new THREE.Group()

const houseHeight = 3
const houseWidth = 5
const doorHeight = 2

// walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(houseWidth, houseHeight, houseWidth),
  new THREE.MeshStandardMaterial({
    color: 0x795548,
    metalness: 0.4,
    roughness: 0.1,
  })
)
walls.position.y = houseHeight / 2

// roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(4.4, 1, 4, 1),
  new THREE.MeshStandardMaterial({
    color: 0x9e9e9e,
    metalness: 0.4,
    roughness: 0.1,
  })
)

const AxesHelper = new THREE.AxesHelper(4)
scene.add(AxesHelper)

roof.position.y = houseHeight + 0.5
roof.rotation.y = Math.PI / 4

// door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.2, doorHeight),
  new MeshStandardMaterial({ color: 0xaa7b7b })
)
door.translateZ(houseWidth / 2 + 0.001)
door.translateY(doorHeight / 2)

// bushes
const bushGeometry = new THREE.SphereBufferGeometry(0.6, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

const bushes = new THREE.Group()

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(1.5, 0.2, 3)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.5, 0.5, 0.5)
bush2.position.set(2.2, 0.1, 2.8)

bushes.add(bush1, bush2)

const graves = new THREE.Group()

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b1b6 })

for (let i = 0; i < 40; i++) {
  const angle = 2 * Math.PI * Math.random()
  const radius = 4 + 5 * Math.random()
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.3, z)
  grave.rotation.z = (0.5 - Math.random()) / 4
  graves.add(grave)
}

house.add(walls, roof, door, bushes, graves)
scene.add(floor, house)

floor.rotation.x = -Math.PI / 2
floor.position.y = 0

// house.rotation.x = 0.2

// Debug GUI
const settings = gui.addFolder('Settings')

// settings.add(params, 'spin')
gui.add(params, 'spin')
settings.addColor(params, 'color').onChange((color) => {
  // material.color.set(color)
})

const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// base camera
const camera = new THREE.PerspectiveCamera(
  75,
  canvasSize.width / canvasSize.height,
  0.01,
  100
)

// renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(canvasSize.width, canvasSize.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(params.sceneColor)

const setRendererPixedRatio = () => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

setRendererPixedRatio()

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.update()

camera.position.set(0, 0, 16)
scene.add(camera)

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

const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.15)
const moonLight = new THREE.PointLight(0xb9d5ff, 0.15)
const doorLight = new THREE.PointLight(0xbf6e0a, 1, 7)
doorLight.position.set(0, doorHeight + 0.4, houseWidth / 2 + 1)
const doorLightHelper = new THREE.PointLightHelper(doorLight)
scene.add(ambientLight, moonLight)
scene.add(doorLightHelper)
house.add(doorLight)

const fog = new THREE.Fog(params.sceneColor, 1, 14)
scene.fog = fog

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
  // update controls
  controls.update()

  // Call animate again on the next frame
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()
