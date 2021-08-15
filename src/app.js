import './app.css'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MeshStandardMaterial } from 'three'

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const doorAlphaTexture = textureLoader.load('/img/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
  '/img/door/ambientOcclusion.jpg'
)
const doorColorTexture = textureLoader.load('/img/door/color.jpg')
const doorHeightTexture = textureLoader.load('/img/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/img/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/img/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/img/door/roughness.jpg')

const brickColorTexture = textureLoader.load('/img/bricks/color.jpg')
const brickAmbientOcclusionTexture = textureLoader.load(
  '/img/bricks/ambientOcclusion.jpg'
)
const brickNormalTexture = textureLoader.load('/img/bricks/normal.jpg')
const brickRoughnessTexture = textureLoader.load('/img/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/img/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load(
  '/img/grass/ambientOcclusion.jpg'
)
const grassNormalTexture = textureLoader.load('/img/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/img/grass/roughness.jpg')

const grassRepeat = 14

grassColorTexture.repeat.set(grassRepeat, grassRepeat)
grassAmbientOcclusionTexture.repeat.set(grassRepeat, grassRepeat)
grassNormalTexture.repeat.set(grassRepeat, grassRepeat)
grassRoughnessTexture.repeat.set(grassRepeat, grassRepeat)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

// roof textures
const roofColorTexture = textureLoader.load('/img/roof/color.jpg')
const roofAmbientOcclusionTexture = textureLoader.load(
  '/img/roof/ambientOcclusion.jpg'
)
const roofNormalTexture = textureLoader.load('/img/roof/normal.jpg')
const roofRoughnessTexture = textureLoader.load('/img/roof/roughness.jpg')
const roofHeightTexture = textureLoader.load('/img/roof/height.jpg')

const roofRepeat = 2

roofColorTexture.repeat.set(roofRepeat, roofRepeat)
roofAmbientOcclusionTexture.repeat.set(roofRepeat, roofRepeat)
roofNormalTexture.repeat.set(roofRepeat, roofRepeat)
roofRoughnessTexture.repeat.set(roofRepeat, roofRepeat)
roofHeightTexture.repeat.set(roofRepeat, roofRepeat)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping
roofRoughnessTexture.wrapS = THREE.RepeatWrapping
roofHeightTexture.wrapS = THREE.RepeatWrapping

roofColorTexture.wrapT = THREE.RepeatWrapping
roofAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
roofNormalTexture.wrapT = THREE.RepeatWrapping
roofRoughnessTexture.wrapT = THREE.RepeatWrapping
roofHeightTexture.wrapT = THREE.RepeatWrapping

// debug
const params = {
  color: 0x8bc34a,
  sceneColor: 0x222222,
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
  new THREE.PlaneBufferGeometry(20, 20, 500, 500),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    // roughnessMap: grassRoughnessTexture,
  })
)
// enable aoMap
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

// house
const house = new THREE.Group()

const houseHeight = 2.5
const houseWidth = 5
const doorHeight = 2

// walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(houseWidth, houseHeight, houseWidth),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientOcclusionTexture,
    normalMap: brickNormalTexture,
    // metalness: 0.3,
    // roughness: 0.01,
  })
)
// enable aoMap
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = houseHeight / 2

// roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(4.2, 1, 4, 1),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofAmbientOcclusionTexture,
    // needed for alpha to work
    transparent: true,
    displacementMap: roofHeightTexture,
    displacementScale: 0.1,
    normalMap: roofNormalTexture,
  })
)

// enable aoMap
roof.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(roof.geometry.attributes.uv.array, 2)
)

const AxesHelper = new THREE.AxesHelper(4)
// scene.add(AxesHelper)

roof.position.y = houseHeight + 0.5
roof.rotation.y = Math.PI / 4

// door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(doorHeight, doorHeight, 100, 100),
  new MeshStandardMaterial({
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    // needed for alpha to work
    transparent: true,
    alphaMap: doorAlphaTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    metalness: 1,
    roughness: 0.2,
    // aoMapIntensity: 2,
  })
)
// enable aoMap
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.translateZ(houseWidth / 2 + 0.00001)
door.translateY(doorHeight / 2 - 0.1)

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
  grave.position.set(x, 0.24, z)
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

// camera.position.set(0, 0, 16)
camera.position.set(0, 2, 10)
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

const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.5)
const moonLight = new THREE.PointLight(0xb9d5ff, 0.3)
const doorLight = new THREE.PointLight(0xbf6e0a, 1, 7)
doorLight.position.set(0, doorHeight + 0.2, houseWidth / 2 + 1)
// const doorLightHelper = new THREE.PointLightHelper(doorLight)
scene.add(ambientLight, moonLight)
// scene.add(doorLightHelper)
house.add(doorLight)

const fog = new THREE.Fog(params.sceneColor, 1, 24)
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
