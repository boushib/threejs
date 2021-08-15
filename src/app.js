import './app.css'
import {
  Scene,
  Mesh,
  Clock,
  BoxBufferGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  AxesHelper,
  WebGLRenderer,
  TextureLoader,
  LoadingManager,
  Loader,
} from 'three'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const loadingManager = new LoadingManager()
// loading manager progress
// loadingManager.onProgress = (p) => {
//   console.log(`${p}%`)
// }
// loadingManager.onLoad = (p) => {
//   console.log(`${p}%`)
// }

const textureLoader = new TextureLoader(loadingManager)
const matcap = textureLoader.load('/img/matcaps/4.png')
const fontLoader = new THREE.FontLoader()
fontLoader.load('fonts/syne_extrabold.typeface.json', (font) => {
  // console.log(font)
  const geometry = new THREE.TextGeometry('HELLO', {
    font,
    // size: 80,
    size: 0.35,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  })

  const material = new THREE.MeshMatcapMaterial({ matcap })

  // metalness
  // material.metalness = 1
  // material.roughness = 0
  // material.envMap = envMap

  const text = new THREE.Mesh(geometry, material)

  geometry.center()
  text.rotation.x = 0.32

  // scene.add(text)
})

// const baseColorMap = textureLoader.load('/img/wood/base_color.jpg')
const baseColorMap = textureLoader.load('/img/metal/0/base.jpg')
const aoMap = textureLoader.load('/img/metal/0/ambientOcclusion.jpg')
const heightMap = textureLoader.load('/img/wood/height.png')

// baseColorMap.repeat.x = 3
// baseColorMap.repeat.y = 3
// baseColorMap.wrapS = THREE.MirroredRepeatWrapping
// baseColorMap.wrapT = THREE.MirroredRepeatWrapping
// baseColorMap.wrapS = THREE.RepeatWrapping
// baseColorMap.wrapT = THREE.RepeatWrapping
// map.rotation = Math.PI / 18

// debug
const params = {
  color: 0x8bc34a,
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
const scene = new Scene()

// Scene background
const envMap = new THREE.CubeTextureLoader()
  .setPath('/img/environment/4/')
  .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

scene.background = envMap

// objects
const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 32, 32)
const cubeGeometry = new THREE.BoxBufferGeometry(0.75, 0.75, 0.75)
const planeGeometry = new THREE.PlaneBufferGeometry(5, 5, 100, 100)
const material = new THREE.MeshStandardMaterial()

material.metalness = 0.3
material.roughness = 0.1
material.envMap = envMap

const sphere = new Mesh(sphereGeometry, material)
const cube = new Mesh(cubeGeometry, material)
const plane = new Mesh(planeGeometry, material)

scene.add(sphere, cube, plane)

plane.rotation.x = -Math.PI / 2
plane.position.y = -1

cube.position.set(1, 0, 0)

scene.rotation.x = 0.1

// enable shadows on objects
sphere.castShadow = true
cube.castShadow = true
plane.receiveShadow = true

// Lights
// for light bouncing
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// for real light
const pointLight = new THREE.PointLight(0xffeb3b, 0.5)
pointLight.position.set(0.5, 1, 0)
const directionalLight = new THREE.DirectionalLight(params.color, 0.3)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
)
// enable shadows for lights
directionalLight.castShadow = true
pointLight.castShadow = true

scene.add(directionalLightHelper, pointLightHelper)
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x00ff00, 0.3)
// scene.add(hemisphereLight)

scene.add(pointLight, ambientLight, directionalLight, hemisphereLight)

// Debug GUI
const position = gui.addFolder('Position')
position.add(sphere.position, 'x', 0, 1, 0.01)
position.add(sphere.position, 'y', 0, 1, 0.01)
position.add(sphere.position, 'z', 0, 1, 0.01)

const settings = gui.addFolder('Settings')
// settings.add(material, 'wireframe')

// settings.add(params, 'spin')
gui.add(params, 'spin')
settings.addColor(params, 'color').onChange((color) => {
  material.color.set(color)
})

// gui.add(material, 'metalness', 0, 1, 0.01)
// gui.add(material, 'roughness', 0, 1, 0.01)

const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// base camera
const camera = new PerspectiveCamera(
  70,
  canvasSize.width / canvasSize.height,
  0.01,
  100
)

// renderer
const renderer = new WebGLRenderer({ canvas })
renderer.setSize(canvasSize.width, canvasSize.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// enable shadows
renderer.shadowMap.enabled = true

const setRendererPixedRatio = () => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

setRendererPixedRatio()

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.update()

camera.position.set(0, 0, 3)

scene.add(camera)

const clock = new Clock()

// gsap.to(cube.position, { x: 2, duration: 1, delay: 1 })
// gsap.to(cube.position, { x: -2, duration: 1, delay: 2 })
// gsap.to(cube.position, { x: 0, duration: 1, delay: 3 })

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
