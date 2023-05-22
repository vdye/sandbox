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

const texVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    vec4 viewModelPosition = modelViewMatrix * vec4(position, 1.0);

    // Pass varyings to fragment shader
    vViewPosition = viewModelPosition.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * viewModelPosition;

    // Rotate the object normals by a 3x3 normal matrix.
    // We could also do this CPU-side to avoid doing it per-vertex
    mat3 normalMatrix = transpose(inverse(mat3(modelViewMatrix)));
    vNormal = normalize(normalMatrix * normal);
  }
`;

const texFragmentShader = `
  // Lighting info
  struct DirectionalLight {
    vec3 direction;
    vec3 color;
  };
  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

  // Phong constants
  uniform vec3 ambientColor;
  uniform vec3 specularColor;
  uniform float Ka;         // Ambient reflection coefficient
  uniform float Kd;         // Diffuse reflection coefficient
  uniform float Ks;         // Specular reflection coefficient
  uniform float shininess;  // Shininess

  // Texture
  uniform sampler2D tex;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    float newU = abs(vUv.x * 2.0 - 1.0);
    vec4 baseColor = texture2D(tex, vec2(newU, vUv.y));

    // Get the lambert (diffuse) color
    float diffuseCoeff = max(dot(vNormal, normalize(directionalLights[0].direction)), 0.0);
    vec3 lambertColor = baseColor.xyz * diffuseCoeff;

    // Get the specular factor
    vec3 R = reflect(-directionalLights[0].direction, vNormal);
    float specular = pow(max(dot(-normalize(vViewPosition), R), 0.0), shininess);

    gl_FragColor = vec4(Ka * ambientColor +
                        Kd * lambertColor +
                        Ks * specular * specularColor, 1.0);
  }
`;

const texLoader = new THREE.TextureLoader();
export const ExampleTextureMaterial = new THREE.ShaderMaterial( {

  lights: true,
  uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib['lights'],
    {
      tex: { type: "t", value: texLoader.load( "resources/images/ball_texture.png" ) }
    },
    {
      ambientColor: {type: 'vec3', value: new THREE.Color(0x000000)},
      specularColor: {type: 'vec3', value: new THREE.Color(0xFFFFFF)},
      Ka: { value: 1.0 },
      Kd: { value: 1.0 },
      Ks: { value: 1.0 },
      shininess: { value: 5.0 },
    }
  ]),

  vertexShader: texVertexShader,
  fragmentShader: texFragmentShader
} );

console.log(ExampleTextureMaterial);