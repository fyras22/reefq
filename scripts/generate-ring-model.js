const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const fs = require('fs');
const path = require('path');

// Create a scene
const scene = new THREE.Scene();

// Create ring geometry
const ringGeometry = new THREE.TorusGeometry(1, 0.3, 32, 100);
const ringMaterial = new THREE.MeshStandardMaterial({
  color: 0xC0C0C0,
  metalness: 0.8,
  roughness: 0.2,
  envMapIntensity: 1
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);

// Create gem geometry (small sphere)
const gemGeometry = new THREE.TorusGeometry(0.2, 0.1, 32, 100);
const gemMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFD700,
  metalness: 0.1,
  roughness: 0.1,
  envMapIntensity: 2,
  transparent: true,
  opacity: 0.8
});
const gem = new THREE.Mesh(gemGeometry, gemMaterial);
gem.position.set(0, 0, 0.3); // Position gem on top of ring

// Create a group to hold both meshes
const group = new THREE.Group();
group.add(ring);
group.add(gem);

// Add lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Add the group to the scene
scene.add(group);

// Create a simple JSON representation of the scene
const sceneData = {
  ring: {
    geometry: {
      type: 'TorusGeometry',
      args: [1, 0.3, 32, 100]
    },
    material: {
      type: 'MeshStandardMaterial',
      properties: {
        color: 0xC0C0C0,
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 1
      }
    }
  },
  gem: {
    geometry: {
      type: 'TorusGeometry',
      args: [0.2, 0.1, 32, 100]
    },
    material: {
      type: 'MeshStandardMaterial',
      properties: {
        color: 0xFFD700,
        metalness: 0.1,
        roughness: 0.1,
        envMapIntensity: 2,
        transparent: true,
        opacity: 0.8
      }
    },
    position: [0, 0, 0.3]
  }
};

// Ensure the models directory exists
const modelsDir = path.join(process.cwd(), 'public', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Write the JSON file
fs.writeFileSync(
  path.join(modelsDir, 'ring.json'),
  JSON.stringify(sceneData, null, 2)
);

console.log('Ring model data generated successfully!'); 