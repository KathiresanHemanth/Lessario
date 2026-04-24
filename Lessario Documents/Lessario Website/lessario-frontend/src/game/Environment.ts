import * as THREE from "three";

/**
 * Environment — Thiruchendur-inspired coastal open world.
 * Golden sandy beach (sloped), animated ocean, palm trees, ancient temple pillars.
 */
export class Environment {
  public collidables: THREE.Box3[] = [];
  public oceanPlane: THREE.Mesh;

  private _scene: THREE.Scene;
  private _oceanTime = 0;
  private _oceanVertices: Float32Array;
  private _oceanOriginalY: Float32Array;

  constructor(scene: THREE.Scene) {
    this._scene = scene;

    // === BEACH (Golden Sand) ===
    this._createBeach();

    // === OCEAN ===
    this.oceanPlane = this._createOcean();

    // === PALM TREES ===
    this._createPalmTrees();

    // === TEMPLE PILLARS ===
    this._createTemplePillars();

    // === DECORATIVE ELEMENTS ===
    this._createRocks();
    this._createSeashells();
  }

  /**
   * Large golden sandy beach with gentle downward slope.
   */
  private _createBeach(): void {
    const geo = new THREE.PlaneGeometry(200, 200, 80, 80);
    const positions = geo.attributes.position;

    // Apply slope: gently descends along -Z
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i); // This is the Z-world after rotation
      // y here is the local Y of the plane, which maps to world Z after rotation
      // slope it downward in -Z direction
      const slope = THREE.MathUtils.mapLinear(y, 100, -100, 0.5, -3.5);
      // Add subtle undulation for terrain interest
      const noise = Math.sin(x * 0.1) * Math.cos(y * 0.08) * 0.3;
      positions.setZ(i, slope + noise);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0xf5d68c,   // Golden sand
      roughness: 0.9,
      flatShading: false,
    });
    const beach = new THREE.Mesh(geo, mat);
    beach.rotation.x = -Math.PI / 2;
    beach.receiveShadow = true;
    this._scene.add(beach);
  }

  /**
   * Semi-transparent ocean plane with sine-wave animation.
   */
  private _createOcean(): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(200, 120, 60, 60);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0088cc,
      transparent: true,
      opacity: 0.65,
      roughness: 0.2,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const ocean = new THREE.Mesh(geo, mat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(0, -1.5, -40);
    ocean.receiveShadow = true;
    this._scene.add(ocean);

    // Store original vertex positions for wave animation
    const positions = geo.attributes.position;
    this._oceanVertices = positions.array as Float32Array;
    this._oceanOriginalY = new Float32Array(this._oceanVertices.length);
    for (let i = 0; i < this._oceanVertices.length; i++) {
      this._oceanOriginalY[i] = this._oceanVertices[i];
    }

    return ocean;
  }

  /**
   * Scatter palm trees across the beach.
   */
  private _createPalmTrees(): void {
    const treePositions = [
      { x: -12, z: 10 },
      { x: 8, z: 15 },
      { x: -20, z: 5 },
      { x: 15, z: 20 },
      { x: -5, z: 25 },
      { x: 25, z: 8 },
      { x: -30, z: 18 },
      { x: 35, z: 12 },
      { x: 0, z: 35 },
      { x: -18, z: 30 },
      { x: 22, z: 28 },
      { x: -8, z: -5 },
    ];

    for (const pos of treePositions) {
      this._createPalmTree(pos.x, pos.z);
    }
  }

  /**
   * Create a single palm tree (thin trunk cylinder + green cone leaves).
   */
  private _createPalmTree(x: number, z: number): void {
    const groundY = this._getGroundHeight(x, z);
    const treeHeight = 5 + Math.random() * 3;

    // Trunk — thin cylinder with slight brown variation
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, treeHeight, 8);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x8B6914,
      roughness: 0.8,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, groundY + treeHeight / 2, z);
    trunk.castShadow = true;
    // Slight random lean
    trunk.rotation.x = (Math.random() - 0.5) * 0.1;
    trunk.rotation.z = (Math.random() - 0.5) * 0.1;
    this._scene.add(trunk);

    // Leaves — cluster of cones
    const leafCount = 5;
    for (let i = 0; i < leafCount; i++) {
      const leafGeo = new THREE.ConeGeometry(1.5, 2.5, 6);
      const greenShade = 0x228B22 + Math.floor(Math.random() * 0x003300);
      const leafMat = new THREE.MeshStandardMaterial({
        color: greenShade,
        roughness: 0.7,
        flatShading: true,
      });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(x, groundY + treeHeight + 0.5, z);
      leaf.rotation.x = (Math.random() - 0.5) * 0.6;
      leaf.rotation.z = (Math.random() - 0.5) * 0.6 + (i * Math.PI * 2) / leafCount;
      leaf.castShadow = true;
      this._scene.add(leaf);
    }

    // Tree collision
    const treeBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, groundY + treeHeight / 2, z),
      new THREE.Vector3(0.5, treeHeight, 0.5)
    );
    this.collidables.push(treeBox);
  }

  /**
   * Create ancient temple pillars near the shore (Thiruchendur inspired).
   */
  private _createTemplePillars(): void {
    const pillarPositions = [
      { x: -6, z: -8 },
      { x: -3, z: -10 },
      { x: 0, z: -8 },
      { x: 3, z: -10 },
      { x: 6, z: -8 },
      // Back row
      { x: -6, z: -14 },
      { x: -3, z: -14 },
      { x: 0, z: -14 },
      { x: 3, z: -14 },
      { x: 6, z: -14 },
    ];

    for (const pos of pillarPositions) {
      this._createPillar(pos.x, pos.z);
    }

    // Platform base
    const baseGeo = new THREE.BoxGeometry(16, 0.4, 10);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xa89070,
      roughness: 0.85,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    const baseY = this._getGroundHeight(0, -11);
    base.position.set(0, baseY, -11);
    base.receiveShadow = true;
    base.castShadow = true;
    this._scene.add(base);
  }

  /**
   * Single temple pillar — stone-colored rectangular column with capital.
   */
  private _createPillar(x: number, z: number): void {
    const groundY = this._getGroundHeight(x, z);
    const pillarHeight = 5 + Math.random() * 1.5;

    // Main column
    const colGeo = new THREE.BoxGeometry(0.6, pillarHeight, 0.6);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0xb8a898,
      roughness: 0.75,
    });
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(x, groundY + pillarHeight / 2, z);
    col.castShadow = true;
    col.receiveShadow = true;
    this._scene.add(col);

    // Capital (top block)
    const capGeo = new THREE.BoxGeometry(0.9, 0.3, 0.9);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xc8b898,
      roughness: 0.7,
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(x, groundY + pillarHeight + 0.15, z);
    cap.castShadow = true;
    this._scene.add(cap);

    // Base block
    const baseCapGeo = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const baseCap = new THREE.Mesh(baseCapGeo, capMat.clone());
    baseCap.position.set(x, groundY + 0.1, z);
    this._scene.add(baseCap);

    // Collision
    const pillarBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, groundY + pillarHeight / 2, z),
      new THREE.Vector3(0.8, pillarHeight, 0.8)
    );
    this.collidables.push(pillarBox);
  }

  /**
   * Scatter some rocks on the beach for visual interest.
   */
  private _createRocks(): void {
    const rockPositions = [
      { x: -15, z: -2, s: 1.2 },
      { x: 10, z: -5, s: 0.8 },
      { x: -25, z: 8, s: 1.5 },
      { x: 20, z: 2, s: 1.0 },
      { x: 5, z: -18, s: 1.3 },
      { x: -10, z: -20, s: 0.9 },
    ];

    for (const r of rockPositions) {
      const groundY = this._getGroundHeight(r.x, r.z);
      const rockGeo = new THREE.DodecahedronGeometry(r.s, 0);
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x888880,
        roughness: 0.95,
        flatShading: true,
      });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(r.x, groundY + r.s * 0.4, r.z);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      rock.receiveShadow = true;
      this._scene.add(rock);

      // Rock collision
      const rockBox = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(r.x, groundY + r.s * 0.4, r.z),
        new THREE.Vector3(r.s * 1.5, r.s * 2, r.s * 1.5)
      );
      this.collidables.push(rockBox);
    }
  }

  /**
   * Small decorative seashells scattered on the sand.
   */
  private _createSeashells(): void {
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = Math.random() * 40 - 10;
      const groundY = this._getGroundHeight(x, z);

      const shellGeo = new THREE.SphereGeometry(0.08, 6, 4);
      const shellMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.1, 0.4, 0.7 + Math.random() * 0.2),
        roughness: 0.4,
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      shell.position.set(x, groundY + 0.04, z);
      shell.scale.set(1, 0.5, 1.2);
      this._scene.add(shell);
    }
  }

  /**
   * Get the approximate terrain height at a world position.
   * Mirrors the slope logic used in PlayerController.
   */
  private _getGroundHeight(x: number, z: number): number {
    const slope = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(z, 40, -60, 0.5, -3.5),
      -3.5,
      0.5
    );
    return slope;
  }

  /**
   * Animate the ocean waves each frame.
   * @param dt Delta time
   */
  update(dt: number): void {
    this._oceanTime += dt;
    const geo = this.oceanPlane.geometry;
    const positions = geo.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const origX = this._oceanOriginalY[i * 3];
      const origY = this._oceanOriginalY[i * 3 + 1];

      // Sine-wave displacement for organic water feel
      const wave1 = Math.sin(origX * 0.15 + this._oceanTime * 1.2) * 0.35;
      const wave2 = Math.sin(origY * 0.2 + this._oceanTime * 0.8) * 0.25;
      const wave3 = Math.sin((origX + origY) * 0.1 + this._oceanTime * 1.5) * 0.15;

      positions.setZ(i, wave1 + wave2 + wave3);
    }

    positions.needsUpdate = true;
    geo.computeVertexNormals();

    // Subtle color shift
    const mat = this.oceanPlane.material as THREE.MeshStandardMaterial;
    const hue = 0.55 + Math.sin(this._oceanTime * 0.3) * 0.02;
    mat.color.setHSL(hue, 0.7, 0.4);
  }
}
