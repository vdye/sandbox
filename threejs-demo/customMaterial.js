import * as THREE from 'three';

const vertexShader = `
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

const fragmentShader = `
  uniform vec3 colorA;
  uniform vec3 colorB;
  varying vec3 vUv;

  void main() {
    gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
  }
`;

const normalVS = `
  varying vec3 storedPos;

  void main() {
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * modelViewPosition;

    storedPos = normalize(gl_Position.xyz);
  }
`;

const normalFS = `
  uniform vec3 colorA;
  uniform vec3 colorB;
  varying vec3 storedPos;

  void main() {
    gl_FragColor = vec4(storedPos, 1.0);
  }
`;

export const ExampleShaderMaterial = new THREE.ShaderMaterial( {

	uniforms: {
    colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
    colorA: {type: 'vec3', value: new THREE.Color(0xFFFFFF)}
	},

	vertexShader: normalVS, //vertexShader,

	fragmentShader: normalFS, //fragmentShader

} );
