import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { River } from './River';
import { Environment } from './Environment';
import { KrathongGroup } from './KrathongGroup';
import { CrowdGroup } from './CrowdGroup';

export class SceneManager {
  constructor(container, onSelectKrathong) {
    this.container = container;
    this.onSelectKrathong = onSelectKrathong;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    this.river = null;
    this.environment = null;
    this.krathongGroup = null;
    this.crowdGroup = null;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pointerDownPos = new THREE.Vector2();

    this.clock = new THREE.Clock();
    this.animationFrameId = null;

    this.targetCameraPos = null;
    this.targetLookAt = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene - Brighter night atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0e1b2f);
    this.scene.fog = new THREE.FogExp2(0x0e1e36, 0.004);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.5, 600);
    // Initial cinematic viewpoint: looking over river towards temple and moon
    this.camera.position.set(0, 14, 38);

    // 3. Renderer - Increased exposure for a vivid, bright festival night
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.6;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 4. Controls (Mouse & Multi-touch for PC, Tablet & Smartphone)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 120;
    // Prevent camera from dipping below water surface
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minPolarAngle = 0.15;
    this.controls.target.set(0, 1.5, -5);

    // 5. Build 3D Entities
    this.environment = new Environment(this.scene);
    this.river = new River(this.scene);
    this.crowdGroup = new CrowdGroup(this.scene);
    this.krathongGroup = new KrathongGroup(this.scene, this.onSelectKrathong);

    // 6. Bind Events
    this.onResize = this.onResize.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);

    // 7. Start Render Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onPointerDown(e) {
    this.pointerDownPos.set(e.clientX, e.clientY);
  }

  onPointerUp(e) {
    // Only count as click/tap if pointer hasn't moved significantly (avoids trigger during orbit drag)
    const dist = this.pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
    if (dist > 8) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.krathongGroup.clickableMeshes, true);

    if (intersects.length > 0) {
      // Find the hit collider
      const hit = intersects[0].object;
      if (hit.userData && hit.userData.data) {
        if (this.onSelectKrathong) {
          this.onSelectKrathong(hit.userData.data);
        }
      }
    }
  }

  syncKrathongs(list) {
    if (this.krathongGroup) {
      this.krathongGroup.syncKrathongs(list);
    }
  }

  focusOnKrathong(id) {
    const pos = this.krathongGroup.getKrathongPosition(id);
    if (pos) {
      this.targetLookAt = new THREE.Vector3(pos.x, pos.y + 0.5, pos.z);
      this.targetCameraPos = new THREE.Vector3(pos.x, pos.y + 3.5, pos.z + 7);
    }
  }

  resetCamera() {
    this.targetCameraPos = new THREE.Vector3(0, 14, 38);
    this.targetLookAt = new THREE.Vector3(0, 1.5, -5);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Update 3D elements
    if (this.river) this.river.update(time);
    if (this.environment) this.environment.update(time);
    if (this.crowdGroup) this.crowdGroup.update(time, delta);
    if (this.krathongGroup) this.krathongGroup.update(time, delta);

    // Smooth camera tweening when targeting a krathong
    if (this.targetCameraPos && this.targetLookAt) {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.controls.target.lerp(this.targetLookAt, 0.05);

      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.2) {
        this.targetCameraPos = null;
        this.targetLookAt = null;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
      this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }
}
