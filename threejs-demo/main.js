import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

let loaded = false;
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create the box
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const loader = new OBJLoader();
let mesh = null;
loader.load( 'assets/teapot.obj', function ( obj ) {
  mesh = obj;

  // Set the material
  const material = new THREE.MeshLambertMaterial( { color: 0x00ffff } );
  obj.children.forEach((childMesh) => {
    if (!childMesh) return;
    childMesh.material = material;
  });

  // Correct orientation & position
  obj.scale.set( 0.1, 0.1, 0.1 );
  obj.rotation.x = - 0.5 * Math.PI;
  obj.position.y -= 1.5;

  scene.add( obj );
  loaded = true;
}, undefined, function ( error ) {
  console.error( error );
} );

// Add a light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// Set up the camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

    if (loaded) {
        mesh.rotation.z += 0.01;
    }
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();