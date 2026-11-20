import * as THREE from 'three';

export class River {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.init();
  }

  init() {
    // High-segment plane for organic wave deformation
    const riverGeometry = new THREE.PlaneGeometry(70, 320, 90, 180);
    riverGeometry.rotateX(-Math.PI / 2);

    // Luminous reflective river water material
    const riverMaterial = new THREE.MeshStandardMaterial({
      color: 0x113a60,
      roughness: 0.1,
      metalness: 0.85,
      flatShading: true,
      transparent: true,
      opacity: 0.95
    });

    this.mesh = new THREE.Mesh(riverGeometry, riverMaterial);
    this.mesh.position.set(0, -0.4, 0);
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    // Store base vertices for sine wave oscillation
    this.posAttribute = riverGeometry.attributes.position;
    this.basePositions = this.posAttribute.array.slice();
  }

  update(time) {
    if (!this.mesh) return;
    const array = this.posAttribute.array;
    const base = this.basePositions;
    const len = array.length;

    // Simulate flowing river ripples and water currents
    for (let i = 0; i < len; i += 3) {
      const x = base[i];
      const z = base[i + 2];
      
      const wave1 = Math.sin(x * 0.25 + time * 1.8 + z * 0.1) * 0.12;
      const wave2 = Math.cos(z * 0.3 - time * 2.2 + x * 0.15) * 0.09;
      const wave3 = Math.sin((x + z) * 0.18 + time * 1.2) * 0.06;

      array[i + 1] = base[i + 1] + wave1 + wave2 + wave3;
    }

    this.posAttribute.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
  }
}
