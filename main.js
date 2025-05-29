import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// Setup renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop(animate);
document.body.appendChild( renderer.domElement );

// Setup scene
const scene = new THREE.Scene();

// Setup star skybox
const starsTexture = new THREE.TextureLoader().load('./stars.jpg');
starsTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = starsTexture;

// Setup camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 150);
camera.lookAt(new THREE.Vector3(0, -1, 0))

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

const sphereGeometry = new THREE.SphereGeometry( 8, 32, 16 );
const blueMaterial = new THREE.MeshPhongMaterial( { color: 0x2a47b0, emissive: 0x220038, emissiveIntensity: 0.2, shininess: 0.7 } );
const redMaterial = new THREE.MeshPhongMaterial( { color: 0xa13927, emissive: 0xa24816, emissiveIntensity: 0.2, shininess: 0.7 } );
const purpleMaterial = new THREE.MeshPhongMaterial( { color: 0x521da1, emissive: 0x7c40d6, emissiveIntensity: 0.2, shininess: 0.7 } );
const yellowMaterial = new THREE.MeshPhongMaterial( { color: 0xccc72b, emissive: 0xe0dc63, emissiveIntensity: 0.2, shininess: 0.7 } );
const greenMaterial = new THREE.MeshPhongMaterial( { color: 0x3a9421, emissive: 0x7bd962, emissiveIntensity: 0.2, shininess: 0.7 } );
const orangeMaterial = new THREE.MeshPhongMaterial( { color: 0xbd6a22, emissive: 0xe09a5c, emissiveIntensity: 0.2, shininess: 0.7 } );
const blueSphere = new THREE.Mesh( sphereGeometry.clone(), blueMaterial );
const redSphere = new THREE.Mesh( sphereGeometry.clone(), redMaterial );
const purpleSphere = new THREE.Mesh( sphereGeometry.clone(), purpleMaterial );
const yellowSphere = new THREE.Mesh( sphereGeometry.clone(), yellowMaterial );
const greenSphere = new THREE.Mesh( sphereGeometry.clone(), greenMaterial );
const orangeSphere = new THREE.Mesh( sphereGeometry.clone(), orangeMaterial );
pivot.add( blueSphere );
pivot.add( redSphere );
pivot2.add(purpleSphere);
pivot2.add(yellowSphere);
pivot3.add(greenSphere);
pivot3.add(orangeSphere);
blueSphere.position.x = 80;
redSphere.position.x = -80;
purpleSphere.position.y = 80;
yellowSphere.position.y = -80;
greenSphere.position.z = -80;
orangeSphere.position.z = 80;


// Atmospheric glow effect
// Code from https://discourse.threejs.org/t/how-to-create-an-atmospheric-glow-effect-on-surface-of-globe-sphere/32852/4
var vertexShader = [
      'varying float intensity ;',
      'uniform vec3 lightSourcePos;',
      'uniform vec3 camPos;',
      'void main() {',
        'vec3 vNormal = normalize( normalMatrix * normal );',
        'vec4 viewLightPos   =  modelViewMatrix * vec4(lightSourcePos, 1.0);', // pos of light source
        'vec4 viewCamPos  = viewMatrix * vec4(camPos, 1.0);',
        'vec4 vViewPosition4   =  modelViewMatrix * vec4(position, 1.0);',
        'vec3 camPosToVertexDir =  normalize(viewCamPos.xyz - vViewPosition4.xyz);',
        'vec3 lightDir = normalize(viewLightPos.xyz - vViewPosition4.xyz) ;',
        'float lightsourceIntensity = clamp(dot(lightDir, vNormal) + 1.0, 0.0, 1.0);', //lightsource facing surface has higher intensity
        'intensity = pow( 0.7 - dot(vNormal, camPosToVertexDir), 12.0 ) * lightsourceIntensity;',//intensity is highest at faces orthogonal to cam pos-vertex direction
        'gl_Position = projectionMatrix * vViewPosition4;',
        'vec3 vPosition = gl_Position.xyz;',
      '}'
    ].join('\n')
	
var fragmentShader = [
      'uniform vec3 glowColor;',
      'varying float intensity ;',
      'void main() {',
        'vec3 glow = glowColor * intensity*0.3;',
        'gl_FragColor = vec4( glow, 1.0 ) ;',
      '}'
    ].join('\n')

const customBlueMaterial = new THREE.ShaderMaterial(
    {
        uniforms:
            {
                "lightSourcePos": {type: "v3", value: dLight1.position},
                "camPos": {type: "v3", value: camera.position},
                "glowColor": {type: "v3", value: new THREE.Color(0x7993db)}
            },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    }
);

const customRedMaterial = customBlueMaterial.clone();
customRedMaterial.uniforms.glowColor.value = new THREE.Color(0xd68b74);
const customPurpleMaterial = customBlueMaterial.clone();
// customRedMaterial.uniforms.glowColor.value = new THREE.Color(0xd68b74);
// const customRedMaterial = customBlueMaterial.clone();
// customRedMaterial.uniforms.glowColor.value = new THREE.Color(0xd68b74);
// const customRedMaterial = customBlueMaterial.clone();
// customRedMaterial.uniforms.glowColor.value = new THREE.Color(0xd68b74);
// const customRedMaterial = customBlueMaterial.clone();
// customRedMaterial.uniforms.glowColor.value = new THREE.Color(0xd68b74);


const blueGlow = new THREE.Mesh(sphereGeometry.clone(), customBlueMaterial);
pivot.add(blueGlow);
blueGlow.position.x = blueSphere.position.x;
blueGlow.scale.setScalar(1.15);

const redGlow = new THREE.Mesh(sphereGeometry.clone(), customRedMaterial);
pivot.add(redGlow);
redGlow.position.x = redSphere.position.x;
redGlow.scale.setScalar(1.15);

// Title text
const loader = new FontLoader();
loader.load( './fonts/helvetiker_bold.typeface.json', function ( font ) {
	const textGeometry = new TextGeometry( 'Tetsuo', {
		font: font,
		size: 25,
		depth: 5,
		curveSegments: 12,
	} );
    textGeometry.computeBoundingBox();
    const offset = (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) / -2;
    const textMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 50, emissive: 0xffffff, emissiveIntensity: 0.3});
    const title = new THREE.Mesh(textGeometry, textMaterial);
    title.position.set(offset, 0, 0);
    scene.add(title);
} );


window.addEventListener( 'resize', onWindowResize );

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