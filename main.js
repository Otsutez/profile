import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Setup renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop(animate);

// Setup scene
const scene = new THREE.Scene();

// Setup star skybox
const starsTexture = new THREE.TextureLoader().load('./stars.jpg');
starsTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = starsTexture;

// Setup camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 200);
camera.lookAt(new THREE.Vector3(0, -1, 0))

const control = new OrbitControls(camera, renderer.domElement);
control.enablePan = false;
control.enableZoom = false;
control.update();

// Setup lights, code taken from https://github.com/janarosmonaliev/github-globe/blob/main/src/index.js
scene.add(new THREE.AmbientLight(0xbbbbbb, 0.7));

const dLight = new THREE.DirectionalLight(0xffffff, 1);
dLight.position.set(-800, 2000, 400);
scene.add(dLight);

const dLight1 = new THREE.DirectionalLight(0x7982f6, 2);
dLight1.position.set(-200, 500, 200);
scene.add(dLight1);

const dLight2 = new THREE.PointLight(0x8566cc, 0.5);
dLight2.position.set(-200, 500, 200);
scene.add(dLight2);

// Setup objects
const pivot = new THREE.Object3D();
scene.add(pivot);
const pivot2 = new THREE.Object3D();
scene.add(pivot2);
const pivot3 = new THREE.Object3D();
scene.add(pivot3);

function makeSphere(geometry, color, emissive) {
    const material = new THREE.MeshPhongMaterial({color: color, emissive: emissive, emissiveIntensity: 0.2, shininess: 0.7, wireframe: true});
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
}

const colors = [0x2a47b0, 0xa13927, 0x521da1, 0xccc72b, 0x3a9421, 0xbd6a22]
const emissive = [0x220038, 0xa24816, 0x7c40d6, 0xe0dc63,  0x7bd962, 0xe09a5c]

const sphereGeometry = new THREE.SphereGeometry( 7, 32, 16 );
for (let i = 0; i < colors.length; i++) {
    const sphere = makeSphere(sphereGeometry, colors[i], emissive[i]);
    const pos = (i % 2 == 0) ? 100 : -100;
    if (i < 2) {
        pivot.add(sphere);
        sphere.position.x = pos;
    } else if (i < 4) {
        pivot2.add(sphere);
        sphere.position.y = pos;
    } else {
        pivot3.add(sphere);
        sphere.position.z = pos;
    }
}

// Title text
const loader = new FontLoader();
loader.load( './fonts/helvetiker_bold.typeface.json', function ( font ) {
	const textGeometry = new TextGeometry( 'Tetsuo', {
		font: font,
		size: 30,
		depth: 6,
		curveSegments: 12,
	} );
    textGeometry.computeBoundingBox();
    const offset = (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) / -2;
    const textMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 50, emissive: 0xffffff, emissiveIntensity: 0.3});
    const title = new THREE.Mesh(textGeometry, textMaterial);
    title.position.set(offset, 0, 0);
    scene.add(title);
} );

window.addEventListener('resize', onWindowResize);
document.addEventListener('mousemove', onPointerMove);

function animate() {
    pivot.rotateZ(0.01);
    pivot2.rotateX(0.01);
    pivot3.rotateY(0.01);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}