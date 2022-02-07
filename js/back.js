import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import SimplexNoise from "https://cdn.jsdelivr.net/npm/simplex-noise@3.0.0/dist/esm/simplex-noise.js";

// Some variables
const container = document.getElementById("backDiv");
const config = {
    fov: 60,
    camZ: -10,
    xyCoeff: 70,
    zCoeff: 12,
    speedCoeff: 0.00005,
    lightInst: 0.7,
    ambientCol: 0x001030,
    aCol: 0x75dddd,
    bCol: 0xc2efeb,
    cCol: 0x548cff,
    dCol: 0x7900ff,
    wireframe: false,
    numParticles: 300,
    starCol: 0xffffff,
    starSize: 18,
    mouseSens: 0.00004,
    meshVertRatio: 3,
};

let camera, scene, simplex, renderer;
let light1, light2, light3, light4;
let w, h, mx, my;
let plane, particles;

init();

function init() {
    // Create camera
    camera = new THREE.PerspectiveCamera(
        config.fov,
        window.innerWidth / window.innerHeight
    );
    camera.position.z = config.camZ;
    // Get Size
    onWindowResize();
    // Ensure correct size
    window.addEventListener("resize", onWindowResize, false);

    // Mouse movement
    (mx = 0), (my = 0);
    //document.body.addEventListener("pointermove", onPointerMove);

    // Renderer settings
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setSize(w, h);
    renderer.setClearColor(config.ambientCol, 1);
    container.appendChild(renderer.domElement);

    // Noise
    simplex = new SimplexNoise();

    // Create scene
    makeScene();
    lights();

    // Go
    animateAll();
}

// Start scene
function makeScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(config.ambientCol, 1, 30000);

    // == Color Ocean ==
    // Lambert for performance
    const meshMat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        wireframe: config.wireframe,
    });

    // Plane
    const planeGeo = new THREE.PlaneBufferGeometry(
        w,
        h,
        Math.floor(w / config.meshVertRatio),
        Math.floor(h / config.meshVertRatio)
    );

    plane = new THREE.Mesh(planeGeo, meshMat);
    scene.add(plane);

    plane.rotation.x -= Math.PI * 0.5 + 0.2;
    plane.position.y = -25;
    camera.position.z = 60;

    // == Stars ==
    // Geometry
    const verts = [];
    for (let i = 0; i < config.numParticles; i++) {
        verts.push(
            4000 * Math.random() - 2000, // wide
            2000 * Math.random() - 500, // height
            1000 * Math.random() - 1700 // far
        );
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(verts, 3)
    );

    // Material
    const sprite = new THREE.TextureLoader().load("./images/shuriken.png");
    const particleMat = new THREE.PointsMaterial({
        color: config.starCol,
        size: config.starSize,
        sizeAttenuation: true,
        transparent: true,
        map: sprite,
    });

    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
}

function lights() {
    const radius = 40;
    const hi = 10;
    const lightDist = 500;

    // ambient light (so it meshes with background)
    const light = new THREE.AmbientLight(config.ambientCol);
    scene.add(light);

    // Point Lights (colors)
    light1 = new THREE.PointLight(config.aCol, config.lightInst, lightDist);
    light2 = new THREE.PointLight(config.bCol, config.lightInst, lightDist);
    light3 = new THREE.PointLight(config.cCol, config.lightInst, lightDist);
    light4 = new THREE.PointLight(config.dCol, config.lightInst, lightDist);

    light1.position.set(0, hi, radius);
    light2.position.set(0, -hi, -radius);
    light3.position.set(radius, hi, 0);
    light4.position.set(-radius, hi, 0);

    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
    scene.add(light4);
}

function animateMesh() {
    const t = Date.now() * config.speedCoeff;
    const geoArr = plane.geometry.attributes.position.array;

    // Noise for each point
    for (let i = 0; i < geoArr.length; i += 3) {
        geoArr[i + 2] =
            simplex.noise3D(
                geoArr[i] / config.xyCoeff,
                geoArr[i + 1] / config.xyCoeff,
                t
            ) * config.zCoeff;
    }
    plane.geometry.attributes.position.needsUpdate = true;
}

function animateColors() {
    // dance in elongated circle
    const t = Date.now() * 0.001;
    const d = 50; //dia
    light1.position.x = Math.sin(t * 0.1) * d;
    light1.position.z = Math.cos(t * 0.2) * d;
    light2.position.x = Math.cos(t * 0.3) * d;
    light2.position.z = Math.sin(t * 0.4) * d;
    light3.position.x = Math.sin(t * 0.5) * d;
    light3.position.z = Math.sin(t * 0.6) * d;
    light4.position.x = Math.sin(t * 0.7) * d;
    light4.position.z = Math.cos(t * 0.8) * d;
}

function animateAll() {
    requestAnimationFrame(animateAll);

    animateMesh();
    animateColors();

    renderer.render(scene, camera);
}

// Update camera on window resize
function onWindowResize() {
    w = window.innerWidth;
    h = window.innerHeight;
    if (renderer && camera) {
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
}

const minPolarAngle = Math.PI / 3;
const maxPolarAngle = (2 * Math.PI) / 3;
const maxSideAngle = Math.PI / 6;
const PI_2 = Math.PI / 2;
const euler = new THREE.Euler(0, 0, 0, "YXZ");

// Three.js PointerLockControls (just the rotation)
function onPointerMove(event) {
    if (event.isPrimary === false) return;
    mx = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    my = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    euler.setFromQuaternion(camera.quaternion);
    euler.y -= mx * config.mouseSens;
    euler.x -= my * config.mouseSens;

    // Lock view
    euler.x = Math.max(
        PI_2 - maxPolarAngle,
        Math.min(PI_2 - minPolarAngle, euler.x)
    );
    euler.y = Math.max(-maxSideAngle, Math.min(maxSideAngle, euler.y));

    camera.quaternion.setFromEuler(euler);
}
