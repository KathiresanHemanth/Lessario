import * as THREE from "three";

/**
 * PlayerController — Third-person humanoid character with WASD movement,
 * gravity, jumping, and sword attachment. Built from Three.js primitives.
 */
export class PlayerController {
  public group: THREE.Group;
  public velocity: THREE.Vector3;
  public isGrounded: boolean;

  // Internal refs
  private _body: THREE.Mesh;
  private _head: THREE.Mesh;
  private _leftArm: THREE.Mesh;
  private _rightArm: THREE.Mesh;
  private _leftLeg: THREE.Mesh;
  private _rightLeg: THREE.Mesh;
  private _sword: THREE.Group;

  // Movement config
  private readonly MOVE_SPEED = 8;
  private readonly JUMP_FORCE = 12;
  private readonly GRAVITY = -28;
  private readonly GROUND_Y = 0;

  // Input state
  private _keys: { [key: string]: boolean } = {};
  private _animTime = 0;

  // Bounding box for collision
  public boundingBox: THREE.Box3;

  constructor() {
    this.group = new THREE.Group();
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;
    this.boundingBox = new THREE.Box3();

    // === Build Humanoid ===

    // Body (torso)
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.0, 0.5);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.6 }); // Royal blue tunic
    this._body = new THREE.Mesh(bodyGeo, bodyMat);
    this._body.position.y = 1.5;
    this._body.castShadow = true;
    this.group.add(this._body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.5 }); // Skin tone
    this._head = new THREE.Mesh(headGeo, headMat);
    this._head.position.y = 2.3;
    this._head.castShadow = true;
    this.group.add(this._head);

    // Hair (small cap on head)
    const hairGeo = new THREE.SphereGeometry(0.3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 2.35;
    this.group.add(hair);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.1, 2.33, 0.24);
    this.group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.1, 2.33, 0.24);
    this.group.add(rightEye);

    // Left arm
    const armGeo = new THREE.BoxGeometry(0.22, 0.8, 0.22);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.5 });
    this._leftArm = new THREE.Mesh(armGeo, armMat);
    this._leftArm.position.set(-0.55, 1.5, 0);
    this._leftArm.castShadow = true;
    this.group.add(this._leftArm);

    // Right arm
    this._rightArm = new THREE.Mesh(armGeo, armMat.clone());
    this._rightArm.position.set(0.55, 1.5, 0);
    this._rightArm.castShadow = true;
    this.group.add(this._rightArm);

    // Left leg
    const legGeo = new THREE.BoxGeometry(0.28, 0.8, 0.28);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.7 }); // Brown boots/pants
    this._leftLeg = new THREE.Mesh(legGeo, legMat);
    this._leftLeg.position.set(-0.2, 0.6, 0);
    this._leftLeg.castShadow = true;
    this.group.add(this._leftLeg);

    // Right leg
    this._rightLeg = new THREE.Mesh(legGeo, legMat.clone());
    this._rightLeg.position.set(0.2, 0.6, 0);
    this._rightLeg.castShadow = true;
    this.group.add(this._rightLeg);

    // Belt
    const beltGeo = new THREE.BoxGeometry(0.85, 0.12, 0.55);
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = 1.0;
    this.group.add(belt);

    // === Sword ===
    this._sword = new THREE.Group();

    // Blade
    const bladeGeo = new THREE.BoxGeometry(0.06, 1.0, 0.02);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.9,
      roughness: 0.2,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.5;
    blade.castShadow = true;
    this._sword.add(blade);

    // Guard (crossguard)
    const guardGeo = new THREE.BoxGeometry(0.25, 0.06, 0.06);
    const guardMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });
    const guard = new THREE.Mesh(guardGeo, guardMat);
    guard.position.y = 0.0;
    this._sword.add(guard);

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = -0.18;
    this._sword.add(handle);

    // Pommel
    const pommelGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const pommelMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });
    const pommel = new THREE.Mesh(pommelGeo, pommelMat);
    pommel.position.y = -0.35;
    this._sword.add(pommel);

    // Attach sword to right side
    this._sword.position.set(0.7, 1.2, 0.15);
    this._sword.rotation.z = -0.3;
    this.group.add(this._sword);

    // Initial position
    this.group.position.set(0, 0, 5);
  }

  /**
   * Bind keyboard listeners.
   */
  bindInput(): void {
    const onKeyDown = (e: KeyboardEvent) => {
      this._keys[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this._keys[e.code] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Store refs for cleanup
    (this as any)._onKeyDown = onKeyDown;
    (this as any)._onKeyUp = onKeyUp;
  }

  /**
   * Unbind keyboard listeners.
   */
  unbindInput(): void {
    window.removeEventListener("keydown", (this as any)._onKeyDown);
    window.removeEventListener("keyup", (this as any)._onKeyUp);
  }

  /**
   * Get the terrain height at the player's position (for a slope).
   * The beach slopes down along -Z.
   */
  getGroundHeight(x: number, z: number): number {
    // Beach slopes from y=0 at z=40 down to y=-3 at z=-60 (gentle slope into ocean)
    const slope = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(z, 40, -60, 0.5, -3.5), -3.5, 0.5);
    return slope;
  }

  /**
   * Update player position, physics, and animation.
   * @param dt Delta time in seconds
   * @param camYaw Current camera yaw angle in radians
   * @param collidables Array of bounding boxes to check collision against
   */
  update(dt: number, camYaw: number, collidables: THREE.Box3[]): void {
    const moveDir = new THREE.Vector3();

    // Gather WASD input
    if (this._keys["KeyW"] || this._keys["ArrowUp"]) moveDir.z -= 1;
    if (this._keys["KeyS"] || this._keys["ArrowDown"]) moveDir.z += 1;
    if (this._keys["KeyA"] || this._keys["ArrowLeft"]) moveDir.x -= 1;
    if (this._keys["KeyD"] || this._keys["ArrowRight"]) moveDir.x += 1;

    const isMoving = moveDir.lengthSq() > 0;

    if (isMoving) {
      moveDir.normalize();

      // Rotate movement direction relative to camera yaw
      const sin = Math.sin(camYaw);
      const cos = Math.cos(camYaw);
      const rotatedX = moveDir.x * cos - moveDir.z * sin;
      const rotatedZ = moveDir.x * sin + moveDir.z * cos;
      moveDir.x = rotatedX;
      moveDir.z = rotatedZ;

      // Horizontal velocity
      this.velocity.x = moveDir.x * this.MOVE_SPEED;
      this.velocity.z = moveDir.z * this.MOVE_SPEED;

      // Face the movement direction
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      // Smooth rotation toward movement direction
      let angleDiff = targetAngle - this.group.rotation.y;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.group.rotation.y += angleDiff * Math.min(1, dt * 12);
    } else {
      // Decelerate
      this.velocity.x *= 0.85;
      this.velocity.z *= 0.85;
      if (Math.abs(this.velocity.x) < 0.01) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.01) this.velocity.z = 0;
    }

    // Jump
    if (this._keys["Space"] && this.isGrounded) {
      this.velocity.y = this.JUMP_FORCE;
      this.isGrounded = false;
    }

    // Gravity
    this.velocity.y += this.GRAVITY * dt;

    // Tentative new position
    const newPos = this.group.position.clone();
    newPos.x += this.velocity.x * dt;
    newPos.z += this.velocity.z * dt;
    newPos.y += this.velocity.y * dt;

    // Ground collision (dynamic ground height based on slope)
    const groundY = this.getGroundHeight(newPos.x, newPos.z);
    if (newPos.y <= groundY) {
      newPos.y = groundY;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // Clamp to world bounds
    newPos.x = THREE.MathUtils.clamp(newPos.x, -80, 80);
    newPos.z = THREE.MathUtils.clamp(newPos.z, -80, 80);

    // Build player bounding box at tentative position
    const playerMin = new THREE.Vector3(newPos.x - 0.4, newPos.y, newPos.z - 0.25);
    const playerMax = new THREE.Vector3(newPos.x + 0.4, newPos.y + 2.5, newPos.z + 0.25);
    const playerBox = new THREE.Box3(playerMin, playerMax);

    // Check collision with collidable objects — push back
    for (const colBox of collidables) {
      if (playerBox.intersectsBox(colBox)) {
        // Simple pushback: revert to old position
        newPos.x = this.group.position.x;
        newPos.z = this.group.position.z;
        this.velocity.x = 0;
        this.velocity.z = 0;
        break;
      }
    }

    this.group.position.copy(newPos);

    // Update bounding box
    this.boundingBox.setFromCenterAndSize(
      new THREE.Vector3(this.group.position.x, this.group.position.y + 1.25, this.group.position.z),
      new THREE.Vector3(0.8, 2.5, 0.5)
    );

    // === Walk Animation ===
    if (isMoving && this.isGrounded) {
      this._animTime += dt * 8;
      const swing = Math.sin(this._animTime) * 0.5;
      this._leftArm.rotation.x = swing;
      this._rightArm.rotation.x = -swing;
      this._leftLeg.rotation.x = -swing;
      this._rightLeg.rotation.x = swing;
      // Subtle body bob
      this._body.position.y = 1.5 + Math.abs(Math.sin(this._animTime * 2)) * 0.05;
    } else {
      // Idle — ease back to rest
      this._leftArm.rotation.x *= 0.9;
      this._rightArm.rotation.x *= 0.9;
      this._leftLeg.rotation.x *= 0.9;
      this._rightLeg.rotation.x *= 0.9;
      this._body.position.y = 1.5;
    }

    // Jump animation
    if (!this.isGrounded) {
      this._leftArm.rotation.x = -0.8;
      this._rightArm.rotation.x = -0.8;
    }
  }
}
