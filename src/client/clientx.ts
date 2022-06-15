import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { AnimationMixer } from 'three'


const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(2.5, 7.5, 15)
scene.add(light)
/*const light1 = new THREE.SpotLight()
light1.position.set(2.5, 5, 2.5)
light1.angle = Math.PI / 8
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)

const light2 = new THREE.SpotLight()
light2.position.set(-2.5, 5, 2.5)
light2.angle = Math.PI / 8
light2.penumbra = 0.5
light2.castShadow = true
light2.shadow.mapSize.width = 1024
light2.shadow.mapSize.height = 1024
light2.shadow.camera.near = 0.5
light2.shadow.camera.far = 20
scene.add(light2)*/

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 1.4, 1.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xaec6cf, wireframe: true })
)
floor.rotateX(-Math.PI / 2)
scene.add(floor)

let mixer: THREE.AnimationMixer
let modelReady = false
const animationActions: THREE.AnimationAction[] = []
let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
const fbxLoader: FBXLoader = new FBXLoader()
let modelx: THREE.Group
fbxLoader.load(
    'models/vanguard_t_choonyung.fbx',
    (object) => {
        object.scale.set(0.01, 0.01, 0.01)
        modelx=object
        object.position.y=0
        mixer = new THREE.AnimationMixer(object)

        const animationAction = mixer.clipAction(
            (object as THREE.Object3D).animations[0]
        )
        animationActions.push(animationAction)
        animationsFolder.add(animations, 'default')
        activeAction = animationActions[0]

        scene.add(object)

        //add an animation from another file
        fbxLoader.load(
            'models/vanguard@samba.fbx',
            (object) => {
                console.log('loaded samba')
                const animationAction = mixer.clipAction(
                    (object as THREE.Object3D).animations[0]
                )
                animationActions.push(animationAction)
                animationsFolder.add(animations, 'samba')

                //add an animation from another file
                fbxLoader.load(
                    'models/vanguard@bellydance.fbx',
                    (object) => {
                        console.log('loaded bellydance')
                        const animationAction = mixer.clipAction(
                            (object as THREE.Object3D).animations[0]
                        )
                        animationActions.push(animationAction)
                        animationsFolder.add(animations, 'bellydance')

                        //add an animation from another file
                        fbxLoader.load(
                            'models/vanguard@goofyrunning.fbx',
                            (object) => {
                                console.log('loaded goofyrunning');
                                (object as THREE.Object3D).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
                                //console.dir((object as THREE.Object3D).animations[0])
                                const animationAction = mixer.clipAction(
                                    (object as THREE.Object3D).animations[0]
                                )
                                animationActions.push(animationAction)
                                animationsFolder.add(animations, 'goofyrunning')

                                modelReady = true
                            },
                            (xhr) => {
                                console.log(
                                    (xhr.loaded / xhr.total) * 100 + '% loaded'
                                )
                            },
                            (error) => {
                                console.log(error)
                            }
                        )
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
const v1 = new THREE.Vector3(0, 0, 0)
//const v2 = new THREE.Vector3(0,0,0)
 const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
       case "KeyW":
           setAction(animationActions[3])  
           v1.x=v1.x+0.5
           modelx.lookAt(v1)
           modelx.position.lerp(v1,0.1) 
           setAction(animationActions[0])    
           break
         case "KeyA": 
            setAction(animationActions[3])  
            v1.z=v1.z+0.5 
            modelx.lookAt(v1)
            modelx.position.lerp(v1,0.1)
            setAction(animationActions[0])  
             break
         case "KeyS":
            setAction(animationActions[3])    
            v1.x=v1.x-0.5
            modelx.lookAt(v1)
            modelx.position.lerp(v1,0.1)
            setAction(animationActions[0])  
            break
         case "KeyD":
            setAction(animationActions[3])  
            v1.z=v1.z-0.5 
            modelx.lookAt(v1)
            modelx.position.lerp(v1,0.1)
            setAction(animationActions[0])  
            break
     }

}
 document.addEventListener('keydown', onKeyDown, false)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const animations = {
    default: function () {
        setAction(animationActions[0])
    },
    samba: function () {
        setAction(animationActions[1])
    },
    bellydance: function () {
        setAction(animationActions[2])
    },
    goofyrunning: function () {
        setAction(animationActions[3])
    }
}

const setAction = (toAction: THREE.AnimationAction) => {
    if (toAction != activeAction) {
        lastAction = activeAction
        activeAction = toAction
        //lastAction.stop()
        lastAction.fadeOut(1)
        activeAction.reset()
        activeAction.fadeIn(1)
        activeAction.play()
    }
}
const gui = new GUI()
const animationsFolder = gui.addFolder('Animations')
animationsFolder.open()

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    if (modelReady) mixer.update(clock.getDelta())


    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()