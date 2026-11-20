import * as THREE from 'three';

export class CrowdGroup {
  constructor(scene) {
    this.scene = scene;
    this.people = [];
    this.init();
  }

  init() {
    // 20 people strategically placed on riverbanks, stone steps, and pier
    const crowdPositions = [
      // Left Bank & Steps (ท่าน้ำฝั่งซ้าย)
      { x: -25, y: 2.2, z: -15, rotY: 1.4, isWalking: false, color: 0xe91e63, hasLantern: true },
      { x: -27, y: 2.8, z: -5, rotY: 1.6, isWalking: true, color: 0x2196f3, minZ: -25, maxZ: 10 },
      { x: -24, y: 1.2, z: 5, rotY: 1.3, isWalking: false, color: 0xff9800, isPraying: true },
      { x: -26, y: 1.8, z: 18, rotY: 1.5, isWalking: false, color: 0x9c27b0, hasKrathong: true },
      { x: -28, y: 3.0, z: 30, rotY: 1.7, isWalking: true, color: 0x4caf50, minZ: 15, maxZ: 45 },
      { x: -25, y: 1.5, z: 42, rotY: 1.4, isWalking: false, color: 0xffeb3b, isPraying: true },
      { x: -29, y: 3.2, z: -40, rotY: 1.8, isWalking: false, color: 0x00bcd4, hasLantern: true },
      { x: -27, y: 2.5, z: -60, rotY: 1.2, isWalking: true, color: 0xf06292, minZ: -75, maxZ: -40 },
      { x: -24, y: 1.4, z: -2, rotY: 1.4, isWalking: false, color: 0xff5722, hasKrathong: true },
      { x: -30, y: 3.5, z: 8, rotY: 1.6, isWalking: true, color: 0x3f51b5, minZ: -10, maxZ: 25 },

      // Right Bank & Wooden Pier (สะพานท่าน้ำฝั่งขวา)
      { x: 22, y: 1.5, z: -8, rotY: -1.3, isWalking: false, color: 0xec407a, isPraying: true },
      { x: 20, y: 1.5, z: 2, rotY: -1.5, isWalking: false, color: 0xffca28, hasKrathong: true },
      { x: 23, y: 1.5, z: 10, rotY: -1.6, isWalking: false, color: 0xab47bc, hasLantern: true },
      { x: 26, y: 3.0, z: -20, rotY: -1.7, isWalking: true, color: 0x26a69a, minZ: -35, maxZ: -5 },
      { x: 28, y: 3.2, z: -45, rotY: -1.4, isWalking: false, color: 0xef5350, isPraying: true },
      { x: 27, y: 3.0, z: 25, rotY: -1.5, isWalking: true, color: 0x5c6bc0, minZ: 10, maxZ: 40 },
      { x: 29, y: 3.4, z: 50, rotY: -1.8, isWalking: false, color: 0x8d6e63, hasLantern: true },
      { x: 25, y: 2.8, z: 65, rotY: -1.4, isWalking: true, color: 0x66bb6a, minZ: 50, maxZ: 80 },
      { x: 21, y: 1.5, z: -4, rotY: -1.4, isWalking: false, color: 0xff7043, hasKrathong: true },
      { x: 28, y: 3.2, z: -65, rotY: -1.6, isWalking: true, color: 0x29b6f6, minZ: -80, maxZ: -50 }
    ];

    crowdPositions.forEach((cfg, index) => {
      const personGroup = this.createPersonMesh(cfg);
      personGroup.position.set(cfg.x, cfg.y, cfg.z);
      personGroup.rotation.y = cfg.rotY;
      this.scene.add(personGroup);

      this.people.push({
        group: personGroup,
        cfg,
        phase: Math.random() * Math.PI * 2,
        walkSpeed: 0.8 + Math.random() * 0.4,
        walkDir: Math.random() > 0.5 ? 1 : -1,
        currentZ: cfg.z
      });
    });
  }

  createPersonMesh(cfg) {
    const group = new THREE.Group();

    // Skin & Hair Material
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.7 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.9 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: cfg.color, roughness: 0.6 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.8 });

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), skinMat);
    head.position.y = 2.45;
    group.add(head);

    // Hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), hairMat);
    hair.position.set(0, 2.55, -0.05);
    hair.scale.set(1, 0.75, 1);
    group.add(hair);

    // Torso / Thai Silk Shirt
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.1, 10), shirtMat);
    torso.position.y = 1.7;
    group.add(torso);

    // Thai Sabai Sash (สไบเฉียงพาดไหล่)
    const sash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.44, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.4 })
    );
    sash.position.y = 1.7;
    sash.scale.set(1.05, 1, 0.6);
    sash.rotation.z = 0.35;
    group.add(sash);

    // Legs / Pants
    const legLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1), pantsMat);
    legLeft.position.set(-0.16, 0.6, 0);
    group.add(legLeft);

    const legRight = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1), pantsMat);
    legRight.position.set(0.16, 0.6, 0);
    group.add(legRight);

    // Arms & Accessories
    if (cfg.isPraying) {
      // Hands folded in prayer (Wai / ไหว้)
      const hands = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 0.2), skinMat);
      hands.position.set(0, 1.9, 0.45);
      group.add(hands);
    } else if (cfg.hasKrathong) {
      // Holding miniature glowing krathong
      const miniKrathong = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.25, 0.15, 8),
        new THREE.MeshStandardMaterial({ color: 0x4caf50 })
      );
      miniKrathong.position.set(0, 1.6, 0.5);

      const miniFlame = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xffa000 })
      );
      miniFlame.position.set(0, 1.75, 0.5);
      group.add(miniKrathong);
      group.add(miniFlame);
    } else if (cfg.hasLantern) {
      // Holding hanging small paper lantern
      const lantern = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.15, 0.5, 8),
        new THREE.MeshStandardMaterial({
          color: 0xffeb3b,
          emissive: 0xff9800,
          emissiveIntensity: 0.8
        })
      );
      lantern.position.set(0.35, 1.4, 0.4);
      group.add(lantern);
    }

    return group;
  }

  update(time, delta) {
    this.people.forEach(p => {
      // Subtle idle breathing sway
      p.group.position.y = p.cfg.y + Math.sin(time * 2 + p.phase) * 0.03;
      p.group.rotation.z = Math.sin(time * 1.5 + p.phase) * 0.02;

      // Walking people logic
      if (p.cfg.isWalking) {
        p.currentZ += p.walkDir * p.walkSpeed * delta;
        if (p.currentZ > p.cfg.maxZ) {
          p.walkDir = -1;
          p.group.rotation.y = -Math.PI / 2;
        } else if (p.currentZ < p.cfg.minZ) {
          p.walkDir = 1;
          p.group.rotation.y = Math.PI / 2;
        }
        p.group.position.z = p.currentZ;
      }
    });
  }
}
