import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls (for zooming & rotation)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.zoomSpeed = 1.5;

// 🔥 Create Spaceship (Body, Wings, Thrusters)
const spaceship = new THREE.Group();

// **Main Body**
const bodyGeometry = new THREE.CylinderGeometry(1.5, 1, 6, 32);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff, metalness: 0.8, roughness: 0.3 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.rotation.z = Math.PI / 2;
spaceship.add(body);

// **Cockpit (Glass Dome)**
const cockpitGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const cockpitMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, transparent: true, opacity: 0.7 });
const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
cockpit.position.set(1.8, 0, 0);
spaceship.add(cockpit);

// **Wings**
const wingGeometry = new THREE.BoxGeometry(4, 0.2, 2);
const wingMaterial = new THREE.MeshStandardMaterial({ color: 0x6666ff, metalness: 0.9 });
const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
leftWing.position.set(0, -0.5, 2);
spaceship.add(leftWing);

const rightWing = leftWing.clone();
rightWing.position.z = -2;
spaceship.add(rightWing);

// **Thrusters**
const thrusterGeometry = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 16);
const thrusterMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const leftThruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
leftThruster.position.set(-2.5, -0.5, 1);
spaceship.add(leftThruster);

const rightThruster = leftThruster.clone();
rightThruster.position.z = -1;
spaceship.add(rightThruster);

// **Glowing Thruster Flames**
const flameGeometry = new THREE.ConeGeometry(0.6, 1.5, 16);
const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xff5500, emissive: 0xff2200 });
const leftFlame = new THREE.Mesh(flameGeometry, flameMaterial);
leftFlame.position.set(-3.3, -0.5, 1);
spaceship.add(leftFlame);

const rightFlame = leftFlame.clone();
rightFlame.position.z = -1;
spaceship.add(rightFlame);

scene.add(spaceship);

// 💡 Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 🌌 Floating Particles (Stars)
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 500;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// 🎮 Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate spaceship slowly
    spaceship.rotation.y += 0.002;

    // Animate thruster flames (pulse effect)
    leftFlame.scale.y = Math.sin(Date.now() * 0.005) * 0.5 + 1;
    rightFlame.scale.y = leftFlame.scale.y;

    // Move stars slightly
    const positions = particleGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.02;
        positions[i + 1] += (Math.random() - 0.5) * 0.02;
        positions[i + 2] += (Math.random() - 0.5) * 0.02;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Responsive Canvas
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
