import * as THREE from 'three';
import { KRATHONG_STYLES } from '../../utils/initialData';

export class KrathongGroup {
  constructor(scene, onSelectKrathong) {
    this.scene = scene;
    this.onSelectKrathong = onSelectKrathong;
    this.krathongMap = new Map(); // id -> { group, data, phase, speed, currentZ, baseX }
    this.clickableMeshes = [];
    this.styleCache = new Map(KRATHONG_STYLES.map(s => [s.id, s]));
  }

  // Generate 3D procedural Krathong Mesh
  createKrathongMesh(krathongData) {
    const style = this.styleCache.get(krathongData.style) || KRATHONG_STYLES[0];
    const group = new THREE.Group();
    group.name = `krathong_${krathongData.id}`;

    // 1. Banana Leaf Base (ฐานใบตอง)
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.45, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d32,
      roughness: 0.6
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.22;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // 2. Folded Lotus Petals (กลีบกระทงพับวิจิตร)
    const petalColor = new THREE.Color(style.petalColor);
    const petalMat = new THREE.MeshStandardMaterial({
      color: petalColor,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    // Outer Petals ring (12 petals)
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalGeo = new THREE.ConeGeometry(0.35, 1.1, 4);
      petalGeo.scale(1.2, 1, 0.3);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(
        Math.cos(angle) * 1.5,
        0.55,
        Math.sin(angle) * 1.5
      );
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.z = -0.55; // Tilted outwards
      group.add(petal);
    }

    // Inner Petals ring (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + 0.2;
      const petalGeo = new THREE.ConeGeometry(0.28, 0.9, 4);
      petalGeo.scale(1.1, 1, 0.25);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(
        Math.cos(angle) * 1.0,
        0.65,
        Math.sin(angle) * 1.0
      );
      petal.rotation.y = -angle + Math.PI / 2;
      petal.rotation.z = -0.35;
      group.add(petal);
    }

    // 3. Flower Bed (ดอกไม้ประดับกลางกระทง)
    const flowerGeo = new THREE.DodecahedronGeometry(0.4, 1);
    const flowerMat = new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      roughness: 0.5
    });
    const flower = new THREE.Mesh(flowerGeo, flowerMat);
    flower.position.set(0, 0.5, 0);
    group.add(flower);

    // 4. Incense Sticks (ธูป 3 ดอก)
    const incenseMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const incenseGlowMat = new THREE.MeshBasicMaterial({ color: 0xff1744 }); // Red ember tip
    for (let i = -1; i <= 1; i++) {
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 1.8),
        incenseMat
      );
      stick.position.set(i * 0.12 - 0.2, 1.1, -0.2);
      stick.rotation.z = 0.15 * i;
      stick.rotation.x = -0.15;
      group.add(stick);

      // Glowing tip
      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        incenseGlowMat
      );
      tip.position.set(i * 0.12 - 0.2, 2.0, -0.3);
      group.add(tip);
    }

    // 5. Candle (เทียนไข & เปลวไฟ)
    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xfff9c4 })
    );
    candle.position.set(0.1, 0.95, 0.05);
    group.add(candle);

    // Candle Flame (เปลวเทียน)
    const flameGeo = new THREE.ConeGeometry(0.12, 0.4, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffb300 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0.1, 1.7, 0.05);
    group.add(flame);

    // Candle Light (PointLight with warm, bright glow)
    const candleLight = new THREE.PointLight(0xffa726, 2.5, 18, 1.8);
    candleLight.position.set(0.1, 1.8, 0.05);
    group.add(candleLight);

    // 6. Invisible Click/Tap Collider (hitbox)
    const colliderGeo = new THREE.CylinderGeometry(2.0, 2.0, 2.4, 8);
    const colliderMat = new THREE.MeshBasicMaterial({
      visible: false,
      wireframe: true
    });
    const collider = new THREE.Mesh(colliderGeo, colliderMat);
    collider.position.y = 1.0;
    collider.userData = { id: krathongData.id, data: krathongData, rootGroup: group };
    group.add(collider);
    this.clickableMeshes.push(collider);

    // 7. Floating Name Sprite above Krathong
    const sprite = this.createNameSprite(krathongData.name, krathongData.votes);
    sprite.position.set(0, 2.6, 0);
    group.add(sprite);

    // Special aura ring if user created this krathong
    if (krathongData.isUserCreated) {
      const ringGeo = new THREE.RingGeometry(2.1, 2.3, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffeb3b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.05;
      group.add(ring);
    }

    return { group, flame, candleLight, sprite, collider };
  }

  createNameSprite(name, votes) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Rounded background pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(10, 8, 236, 48, 24);
    ctx.fill();
    ctx.stroke();

    // Text: Name & Votes
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${name} (${votes} โหวต)`, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4.2, 1.1, 1);
    return sprite;
  }

  syncKrathongs(krathongList) {
    const incomingIds = new Set(krathongList.map(k => k.id));

    // Remove deleted krathongs
    for (let [id, item] of this.krathongMap.entries()) {
      if (!incomingIds.has(id)) {
        this.scene.remove(item.group);
        this.clickableMeshes = this.clickableMeshes.filter(m => m.userData.id !== id);
        this.krathongMap.delete(id);
      }
    }

    // Add or update krathongs
    krathongList.forEach((data, index) => {
      let entry = this.krathongMap.get(data.id);
      if (!entry) {
        const { group, flame, candleLight, sprite, collider } = this.createKrathongMesh(data);
        
        // Initial distribution: across river x: [-16, 16], z: [-90, 90]
        let x, z;
        if (data.isUserCreated) {
          x = (Math.random() - 0.5) * 8;
          z = -5 - Math.random() * 8; // near the view center/pier
        } else {
          // Spread 20 initial krathongs nicely along the river
          const lane = (index % 5) - 2; // -2, -1, 0, 1, 2
          x = lane * 6.5 + (Math.random() - 0.5) * 3;
          z = -85 + (index * 9) + (Math.random() - 0.5) * 4;
        }

        group.position.set(x, -0.35, z);
        this.scene.add(group);

        entry = {
          group,
          flame,
          candleLight,
          sprite,
          collider,
          data,
          baseX: x,
          currentZ: z,
          phase: Math.random() * Math.PI * 2,
          driftSpeed: 0.4 + Math.random() * 0.35
        };
        this.krathongMap.set(data.id, entry);
      } else {
        // Update vote count on sprite if changed
        if (entry.data.votes !== data.votes) {
          entry.data = data;
          entry.collider.userData.data = data;
          // Refresh sprite text
          entry.group.remove(entry.sprite);
          const newSprite = this.createNameSprite(data.name, data.votes);
          newSprite.position.set(0, 2.6, 0);
          entry.group.add(newSprite);
          entry.sprite = newSprite;
        }
      }
    });
  }

  update(time, delta) {
    for (let item of this.krathongMap.values()) {
      // 1. Water floating wave animation (bobbing up and down)
      item.group.position.y = -0.35 + Math.sin(time * 2.2 + item.phase) * 0.12;
      
      // 2. Gentle pitch and roll oscillation
      item.group.rotation.x = Math.sin(time * 1.6 + item.phase) * 0.05;
      item.group.rotation.z = Math.cos(time * 1.8 + item.phase) * 0.05;

      // 3. Gentle downstream drift along Z
      item.currentZ += item.driftSpeed * delta * 2.5;
      // Loop back upstream when drifting too far down
      if (item.currentZ > 110) {
        item.currentZ = -110;
        item.baseX = (Math.random() - 0.5) * 28;
      }
      item.group.position.z = item.currentZ;
      item.group.position.x = item.baseX + Math.sin(time * 0.8 + item.phase) * 1.2;

      // 4. Candle flicker
      if (item.flame) {
        const scale = 0.9 + Math.sin(time * 12 + item.phase) * 0.2;
        item.flame.scale.set(scale, scale * 1.1, scale);
        item.candleLight.intensity = 1.4 + Math.sin(time * 14 + item.phase) * 0.4;
      }
    }
  }

  getKrathongPosition(id) {
    const entry = this.krathongMap.get(id);
    return entry ? entry.group.position : null;
  }
}
