import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";

// Some variables
const container = document.getElementById("waveContainer");

const vertHeight = 15000,
    resolution = 80,
    size = 1250000,
    numObjects = 1,
    bgColor = "#001030",
    meshColor = "#6A94E6",
    orbitRate = 0.0006;

let time = 0;

init();

function init() {
    // Create camera
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        400000
    );
    camera.position.z = 10000;
    camera.position.y = 10000;

    // Start scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(bgColor, 1, 300000);

    // Create plane itself
    const planeGeo = new THREE.PlaneGeometry(
        size,
        size,
        resolution,
        resolution
    );
    const meshMat = new THREE.MeshBasicMaterial({
        color: meshColor,
        wireframe: true,
    });
    const plane = new THREE.Mesh(planeGeo, meshMat);
    plane.rotation.x -= Math.PI * 0.5;

    // Add to scene
    scene.add(plane);

    // Renderer settings
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(bgColor, 1);

    // Put renderer on page
    container.appendChild(renderer.domElement);

    // Init geo
    initGeo(plane);

    // Ensure correct size
    window.addEventListener(
        "resize",
        () => {
            onWindowResize(camera, renderer);
        },
        false
    );

    render(camera, plane, scene, renderer);

    // Render each succeeding frame
    function render() {
        // Go next
        requestAnimationFrame(render);

        const x = camera.position.x;
        const z = camera.position.z;

        // Orbit
        camera.position.x =
            x * Math.cos(orbitRate) + z * Math.sin(orbitRate) - 10;
        camera.position.z =
            z * Math.cos(orbitRate) - x * Math.sin(orbitRate) - 10;
        camera.lookAt(new THREE.Vector3(0, 8000, 0));

        // Move geometry
        for (let i = 0; i < resolution * resolution; i++) {
            const positionArr = plane.geometry.attributes.position.array;
            const z = positionArr[i * 3 + 2];
            positionArr[i * 3 + 2] += Math.sin((i + time) * 0.2) * 10;
        }
        time += 0.1;

        // Render
        plane.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }
}

// Initialize geometry positions
function initGeo(plane) {
    for (let i = 0; i < resolution * resolution; i++) {
        plane.geometry.attributes.position.array[i * 3 + 2] +=
            vertHeight * (Math.random() - 1);
    }
}

// Update camera on window resize
function onWindowResize(camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
