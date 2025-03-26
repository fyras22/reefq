const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter');
const { Scene, Group, TorusGeometry, Mesh, MeshStandardMaterial, DirectionalLight, AmbientLight } = require('three');
const fs = require('fs');
const path = require('path');

// Create a scene
const scene = new Scene();

// Create ring geometry
const ringGeometry = new TorusGeometry(1, 0.3, 32, 100);
const ringMaterial = new MeshStandardMaterial({
  color: 0xC0C0C0,
  metalness: 0.8,
  roughness: 0.2,
  envMapIntensity: 1
});
const ring = new Mesh(ringGeometry, ringMaterial);

// Create gem geometry (small sphere)
const gemGeometry = new TorusGeometry(0.2, 0.1, 32, 100);
const gemMaterial = new MeshStandardMaterial({
  color: 0xFFD700,
  metalness: 0.1,
  roughness: 0.1,
  envMapIntensity: 2,
  transparent: true,
  opacity: 0.8
});
const gem = new Mesh(gemGeometry, gemMaterial);
gem.position.set(0, 0, 0.3); // Position gem on top of ring

// Create a group to hold both meshes
const group = new Group();
group.add(ring);
group.add(gem);

// Add lights
const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add the group to the scene
scene.add(group);

// Export to GLB
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (glb: any) => {
    // Ensure the models directory exists
    const modelsDir = path.join(process.cwd(), 'public', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    // Write the GLB file
    if (glb instanceof ArrayBuffer) {
      fs.writeFileSync(path.join(modelsDir, 'ring.glb'), Buffer.from(glb));
    } else {
      fs.writeFileSync(path.join(modelsDir, 'ring.glb'), JSON.stringify(glb));
    }
    console.log('Ring model generated successfully!');
  },
  (error: Error) => {
    console.error('Error generating ring model:', error);
  }
); 