import * as THREE from 'three';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.lanterns = [];
    this.flickerLights = [];
    this.init();
  }

  init() {
    this.buildSkyAndMoon();
    this.buildLighting();
    this.buildRiverBanks();
    this.buildThaiTemple();
    this.buildChedi();
    this.buildThaiHouses();
    this.buildFloatingSkyLanterns();
  }

  buildSkyAndMoon() {
    // Starfield particles
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 500;
      starPos[i + 1] = 40 + Math.random() * 180;
      starPos[i + 2] = (Math.random() - 0.5) * 500;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeo, starMat);
    this.scene.add(starField);

    // Glowing Full Moon
    const moonGeo = new THREE.SphereGeometry(14, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xfff3d1
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-60, 95, -160);
    this.scene.add(moon);

    // Moon Glow Halo (Sprite)
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 245, 210, 0.9)');
    grad.addColorStop(0.3, 'rgba(255, 225, 160, 0.4)');
    grad.addColorStop(0.7, 'rgba(255, 200, 120, 0.15)');
    grad.addColorStop(1, 'rgba(255, 200, 100, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const glowTexture = new THREE.CanvasTexture(canvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const moonGlow = new THREE.Sprite(glowMat);
    moonGlow.position.copy(moon.position);
    moonGlow.scale.set(65, 65, 1);
    this.scene.add(moonGlow);
  }

  buildLighting() {
    // Ambient night light - boosted for clarity
    const ambientLight = new THREE.AmbientLight(0x42628c, 2.2);
    this.scene.add(ambientLight);

    // Sky & ground hemisphere light for natural ambient bounce
    const hemiLight = new THREE.HemisphereLight(0x7da4d4, 0x223825, 1.4);
    this.scene.add(hemiLight);

    // Moonlight directional - clear luminous moonlight
    const moonLight = new THREE.DirectionalLight(0xdbeafe, 2.6);
    moonLight.position.set(-60, 95, -160);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 10;
    moonLight.shadow.camera.far = 300;
    this.scene.add(moonLight);

    // Warm festival lantern lights - boosted intensity & reach
    const warmLightPositions = [
      [-28, 6, -30], [-26, 6, 15], [-27, 6, 60],
      [28, 6, -40], [27, 6, 20], [26, 6, 70],
      [-36, 12, -80], [35, 12, -60]
    ];
    warmLightPositions.forEach(pos => {
      const pLight = new THREE.PointLight(0xffb74d, 2.4, 45, 1.6);
      pLight.position.set(pos[0], pos[1], pos[2]);
      this.scene.add(pLight);
      this.flickerLights.push({ light: pLight, baseIntensity: 2.4, offset: Math.random() * 10 });
    });
  }

  buildRiverBanks() {
    // Terrain materials
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x1a3320,
      roughness: 0.85
    });
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.7
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5d4037,
      roughness: 0.6
    });

    // Left River Bank
    const leftBankGeo = new THREE.BoxGeometry(45, 5, 320);
    const leftBank = new THREE.Mesh(leftBankGeo, grassMat);
    leftBank.position.set(-52, 1.5, 0);
    leftBank.receiveShadow = true;
    this.scene.add(leftBank);

    // Right River Bank
    const rightBankGeo = new THREE.BoxGeometry(45, 5, 320);
    const rightBank = new THREE.Mesh(rightBankGeo, grassMat);
    rightBank.position.set(52, 1.5, 0);
    rightBank.receiveShadow = true;
    this.scene.add(rightBank);

    // Stone Steps & Promenade on Left (ท่าน้ำลอยกระทงฝั่งซ้าย)
    for (let i = 0; i < 4; i++) {
      const stepGeo = new THREE.BoxGeometry(26, 0.6, 60);
      const step = new THREE.Mesh(stepGeo, stoneMat);
      step.position.set(-32 + i * 1.5, 2.5 - i * 0.7, 10);
      step.receiveShadow = true;
      this.scene.add(step);
    }

    // Wooden Pier on Right (สะพานท่าน้ำฝั่งขวา)
    const pierPlankGeo = new THREE.BoxGeometry(18, 0.5, 30);
    const pier = new THREE.Mesh(pierPlankGeo, woodMat);
    pier.position.set(24, 1.2, 0);
    pier.receiveShadow = true;
    this.scene.add(pier);

    // Wooden Posts for pier
    for (let x of [16, 24, 32]) {
      for (let z of [-12, 0, 12]) {
        const postGeo = new THREE.CylinderGeometry(0.3, 0.3, 4);
        const post = new THREE.Mesh(postGeo, woodMat);
        post.position.set(x, 0, z);
        this.scene.add(post);
      }
    }

    // Hanging Festival Lanterns along banks
    this.createBankLanterns([-28, -20, 20, 28]);
  }

  createBankLanterns(xPositions) {
    const lanternGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.4, 8);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xffb74d,
      emissive: 0xff9800,
      emissiveIntensity: 0.8
    });

    for (let x of xPositions) {
      for (let z = -120; z <= 120; z += 35) {
        const lanternPole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 4.5),
          new THREE.MeshStandardMaterial({ color: 0x3e2723 })
        );
        lanternPole.position.set(x > 0 ? x + 2 : x - 2, 4.5, z);
        this.scene.add(lanternPole);

        const lantern = new THREE.Mesh(lanternGeo, lanternMat);
        lantern.position.set(x, 5.5, z);
        this.scene.add(lantern);
      }
    }
  }

  buildThaiTemple() {
    const templeGroup = new THREE.Group();
    templeGroup.position.set(-52, 4, -70);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.7,
      roughness: 0.25,
      emissive: 0xb8860b,
      emissiveIntensity: 0.2
    });
    const whiteWallMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.8
    });
    const orangeRoofMat = new THREE.MeshStandardMaterial({
      color: 0xd84315,
      roughness: 0.5
    });

    // Base podium & steps
    const baseGeo = new THREE.BoxGeometry(28, 2.5, 42);
    const base = new THREE.Mesh(baseGeo, whiteWallMat);
    templeGroup.add(base);

    // Main sanctuary hall (Ubosot)
    const hallGeo = new THREE.BoxGeometry(22, 12, 34);
    const hall = new THREE.Mesh(hallGeo, whiteWallMat);
    hall.position.set(0, 7, 0);
    templeGroup.add(hall);

    // Columns
    for (let x of [-10, -5, 0, 5, 10]) {
      for (let z of [-18, 18]) {
        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 0.4, 12),
          whiteWallMat
        );
        col.position.set(x, 7, z);
        templeGroup.add(col);
      }
    }

    // Tiered Sloping Roofs (3 tiers of Thai roofs)
    const roofTiers = [
      { y: 14, scaleX: 26, scaleZ: 38, h: 4 },
      { y: 17, scaleX: 22, scaleZ: 32, h: 3.5 },
      { y: 19.5, scaleX: 18, scaleZ: 26, h: 3 }
    ];

    roofTiers.forEach(tier => {
      // Slanted roof prism using cylinder 3 segments
      const roofGeo = new THREE.ConeGeometry(tier.scaleX * 0.6, tier.h, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, orangeRoofMat);
      roof.position.set(0, tier.y, 0);
      roof.scale.set(1.2, 1, 1.8);
      templeGroup.add(roof);

      // Gold Ridge trim
      const ridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.8, tier.scaleZ * 0.8),
        goldMat
      );
      ridge.position.set(0, tier.y + tier.h * 0.45, 0);
      templeGroup.add(ridge);
    });

    // Chofa (ornate curved finials at gable ends)
    for (let z of [-17, 17]) {
      const chofa = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 3, 6),
        goldMat
      );
      chofa.position.set(0, 22, z);
      chofa.rotation.x = z > 0 ? 0.3 : -0.3;
      templeGroup.add(chofa);
    }

    // Glowing Temple Interior Light shining through entrance
    const doorLight = new THREE.PointLight(0xffb300, 2, 25);
    doorLight.position.set(0, 6, 18);
    templeGroup.add(doorLight);

    this.scene.add(templeGroup);
  }

  buildChedi() {
    const chediGroup = new THREE.Group();
    chediGroup.position.set(54, 4, -75);

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x996515,
      emissiveIntensity: 0.25
    });

    // Tiered square bases
    for (let i = 0; i < 4; i++) {
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(22 - i * 3.5, 1.8, 22 - i * 3.5),
        goldMat
      );
      base.position.set(0, i * 1.8, 0);
      chediGroup.add(base);
    }

    // Bell body (ระฆังคว่ำ)
    const bell = new THREE.Mesh(
      new THREE.CylinderGeometry(4.5, 7.5, 9, 24),
      goldMat
    );
    bell.position.set(0, 11, 0);
    chediGroup.add(bell);

    // Throne / Harmika (บัลลังก์)
    const throne = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 2.2, 5.2),
      goldMat
    );
    throne.position.set(0, 16.5, 0);
    chediGroup.add(throne);

    // Spire rings (ปล้องไฉน) & Lotus bud finial (ปลียอด)
    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(2.4, 16, 24),
      goldMat
    );
    spire.position.set(0, 25.5, 0);
    chediGroup.add(spire);

    // Golden spotlight shining on Chedi
    const chediSpot = new THREE.SpotLight(0xffd54f, 2.5, 60, Math.PI / 4, 0.4);
    chediSpot.position.set(40, 6, -55);
    chediSpot.target = chediGroup;
    this.scene.add(chediSpot);

    this.scene.add(chediGroup);
  }

  buildThaiHouses() {
    // Array of Thai traditional wooden stilt houses along the banks
    const houseConfigs = [
      { x: -50, z: 45, rotY: 0.2 },
      { x: -52, z: 95, rotY: -0.1 },
      { x: 50, z: 40, rotY: -Math.PI + 0.2 },
      { x: 52, z: 90, rotY: -Math.PI - 0.15 }
    ];

    const teakMat = new THREE.MeshStandardMaterial({
      color: 0x4e342e,
      roughness: 0.7
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x8d6e63,
      roughness: 0.6
    });

    houseConfigs.forEach(cfg => {
      const house = new THREE.Group();
      house.position.set(cfg.x, 4, cfg.z);
      house.rotation.y = cfg.rotY;

      // Wooden Stilts (เสาใต้ถุน)
      for (let sx of [-6, 0, 6]) {
        for (let sz of [-5, 5]) {
          const stilt = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 4.5),
            teakMat
          );
          stilt.position.set(sx, 2.2, sz);
          house.add(stilt);
        }
      }

      // Elevated Floor & Veranda
      const floor = new THREE.Mesh(
        new THREE.BoxGeometry(15, 0.5, 13),
        teakMat
      );
      floor.position.set(0, 4.5, 0);
      house.add(floor);

      // Main Living Room Wall
      const room = new THREE.Mesh(
        new THREE.BoxGeometry(11, 5.5, 9),
        teakMat
      );
      room.position.set(-1.5, 7.3, 0);
      house.add(room);

      // Curved Thai Gable Roof (หน้าจั่วเรือนไทย)
      const roofGeo = new THREE.ConeGeometry(8, 4.5, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(-1.5, 11.5, 0);
      roof.scale.set(1.1, 1, 1.4);
      house.add(roof);

      // Warm veranda lamp
      const lamp = new THREE.PointLight(0xffab40, 1.2, 18);
      lamp.position.set(4, 6.5, 0);
      house.add(lamp);

      this.scene.add(house);
    });
  }

  buildFloatingSkyLanterns() {
    const lanternGeo = new THREE.CylinderGeometry(0.8, 0.6, 1.8, 12);
    const lanternMat = new THREE.MeshBasicMaterial({
      color: 0xffecb3
    });

    for (let i = 0; i < 35; i++) {
      const mesh = new THREE.Mesh(lanternGeo, lanternMat);
      const x = (Math.random() - 0.5) * 110;
      const y = 15 + Math.random() * 90;
      const z = -40 - Math.random() * 120;
      mesh.position.set(x, y, z);

      this.lanterns.push({
        mesh,
        baseX: x,
        baseZ: z,
        speedY: 0.12 + Math.random() * 0.18,
        swaySpeed: 1 + Math.random() * 1.5,
        swayOffset: Math.random() * Math.PI * 2
      });
      this.scene.add(mesh);
    }
  }

  update(time) {
    // Animate sky lanterns rising and swaying
    this.lanterns.forEach(item => {
      item.mesh.position.y += item.speedY;
      item.mesh.position.x = item.baseX + Math.sin(time * item.swaySpeed + item.swayOffset) * 2;
      item.mesh.position.z = item.baseZ + Math.cos(time * item.swaySpeed * 0.8 + item.swayOffset) * 1.5;

      // Wrap around when reaching upper sky
      if (item.mesh.position.y > 120) {
        item.mesh.position.y = 12;
      }
    });

    // Gentle candle/lantern light flicker
    this.flickerLights.forEach(item => {
      item.light.intensity = item.baseIntensity + Math.sin(time * 8 + item.offset) * 0.25;
    });
  }
}
