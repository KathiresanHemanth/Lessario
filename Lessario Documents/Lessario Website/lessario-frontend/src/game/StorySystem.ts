import * as THREE from "three";

/**
 * StorySystem — NPC, quest logic, relic collectible, interaction prompts.
 * Manages the two-state dialogue quest and proximity detection.
 */

export type StoryState = "quest_available" | "quest_active" | "quest_complete";

export interface StoryCallbacks {
  onShowPrompt: (text: string) => void;
  onHidePrompt: () => void;
  onShowDialogue: (speaker: string, text: string) => void;
  onHideDialogue: () => void;
  onQuestUpdate: (state: StoryState) => void;
  onRelicCollected: () => void;
}

export class StorySystem {
  public npcGroup: THREE.Group;
  public relicMesh: THREE.Mesh | null = null;
  public state: StoryState = "quest_available";

  private _scene: THREE.Scene;
  private _callbacks: StoryCallbacks;
  private _npcPosition: THREE.Vector3;
  private _relicPosition: THREE.Vector3;
  private _isNearNPC = false;
  private _isDialogueOpen = false;
  private _relicCollected = false;
  private _glowTime = 0;

  // Interaction distances
  private readonly NPC_INTERACT_DIST = 4;
  private readonly RELIC_COLLECT_DIST = 2;

  constructor(scene: THREE.Scene, callbacks: StoryCallbacks) {
    this._scene = scene;
    this._callbacks = callbacks;

    // NPC stands near the temple pillars
    this._npcPosition = new THREE.Vector3(8, 0, -10);
    this._relicPosition = new THREE.Vector3(-8, -2.0, -35);

    // Build NPC
    this.npcGroup = this._createNPC();

    // Spawn the sacred relic (glowing sphere by the water)
    this._spawnRelic();
  }

  /**
   * Create the NPC — a distinct robed figure made from primitives.
   */
  private _createNPC(): THREE.Group {
    const group = new THREE.Group();
    const groundY = this._getGroundHeight(this._npcPosition.x, this._npcPosition.z);

    // Robe body (tall cylinder)
    const robeGeo = new THREE.CylinderGeometry(0.45, 0.6, 1.8, 8);
    const robeMat = new THREE.MeshStandardMaterial({
      color: 0xff6b35, // Saffron robe
      roughness: 0.6,
    });
    const robe = new THREE.Mesh(robeGeo, robeMat);
    robe.position.y = 0.9;
    robe.castShadow = true;
    group.add(robe);

    // Head
    const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xDEB887,
      roughness: 0.5,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.1;
    head.castShadow = true;
    group.add(head);

    // Turban/headwrap
    const turbanGeo = new THREE.SphereGeometry(0.35, 12, 8);
    const turbanMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });
    const turban = new THREE.Mesh(turbanGeo, turbanMat);
    turban.position.y = 2.25;
    turban.scale.set(1, 0.7, 1);
    group.add(turban);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x2c1810 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.1, 2.12, 0.26);
    group.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.1, 2.12, 0.26);
    group.add(rightEye);

    // Staff (thin cylinder)
    const staffGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.8, 6);
    const staffMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const staff = new THREE.Mesh(staffGeo, staffMat);
    staff.position.set(0.5, 1.4, 0);
    staff.castShadow = true;
    group.add(staff);

    // Staff ornament (top)
    const ornGeo = new THREE.OctahedronGeometry(0.12, 0);
    const ornMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.3,
      metalness: 0.8,
    });
    const ornament = new THREE.Mesh(ornGeo, ornMat);
    ornament.position.set(0.5, 2.85, 0);
    group.add(ornament);

    // NPC name indicator — floating diamond above head
    const indicatorGeo = new THREE.OctahedronGeometry(0.15, 0);
    const indicatorMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      emissive: 0xFFD700,
      emissiveIntensity: 0.6,
    });
    const indicator = new THREE.Mesh(indicatorGeo, indicatorMat);
    indicator.position.y = 2.8;
    indicator.name = "npc_indicator";
    group.add(indicator);

    group.position.set(this._npcPosition.x, groundY, this._npcPosition.z);
    // Face the player starting position
    group.rotation.y = Math.PI * 0.4;

    this._scene.add(group);
    return group;
  }

  /**
   * Spawn the sacred relic — glowing golden sphere.
   */
  private _spawnRelic(): void {
    const groundY = this._getGroundHeight(this._relicPosition.x, this._relicPosition.z);

    const relicGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const relicMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      metalness: 0.7,
      roughness: 0.2,
    });
    this.relicMesh = new THREE.Mesh(relicGeo, relicMat);
    this.relicMesh.position.set(
      this._relicPosition.x,
      groundY + 0.8,
      this._relicPosition.z
    );
    this.relicMesh.castShadow = true;

    // Glow ring
    const ringGeo = new THREE.TorusGeometry(0.6, 0.05, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(this.relicMesh.position);
    ring.name = "relic_ring";
    this._scene.add(ring);

    // Point light for glow effect
    const glowLight = new THREE.PointLight(0xffd700, 2, 8);
    glowLight.position.copy(this.relicMesh.position);
    glowLight.name = "relic_glow_light";
    this._scene.add(glowLight);

    this._scene.add(this.relicMesh);
  }

  /**
   * Handle 'E' key press for interaction.
   */
  bindInput(): void {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE") {
        this._onInteract();
      }
      // Close dialogue with any key after reading
      if (this._isDialogueOpen && e.code !== "KeyE") {
        // Allow closing only with E or Escape
      }
      if (e.code === "Escape" && this._isDialogueOpen) {
        this._closeDialogue();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    (this as any)._onKeyDown = onKeyDown;
  }

  unbindInput(): void {
    window.removeEventListener("keydown", (this as any)._onKeyDown);
  }

  /**
   * Handle player pressing E near the NPC.
   */
  private _onInteract(): void {
    if (!this._isNearNPC) return;

    if (this._isDialogueOpen) {
      this._closeDialogue();
      return;
    }

    this._isDialogueOpen = true;

    if (this.state === "quest_available") {
      this._callbacks.onShowDialogue(
        "Temple Priest",
        "The ocean waves have washed away my sacred relic. Please find it! It glows with golden light — look near the water's edge, far to the southwest."
      );
      this.state = "quest_active";
      this._callbacks.onQuestUpdate(this.state);
    } else if (this.state === "quest_active" && !this._relicCollected) {
      this._callbacks.onShowDialogue(
        "Temple Priest",
        "Please hurry! The sacred relic glows golden — search near the water to the southwest."
      );
    } else if (this.state === "quest_complete") {
      this._callbacks.onShowDialogue(
        "Temple Priest",
        "May the heavens bless you, brave warrior! The temple is forever in your debt. 🙏"
      );
    }
  }

  private _closeDialogue(): void {
    this._isDialogueOpen = false;
    this._callbacks.onHideDialogue();
  }

  /**
   * Update NPC animation, proximity checks, and relic state.
   * @param dt Delta time
   * @param playerPos Player world position
   */
  update(dt: number, playerPos: THREE.Vector3): void {
    this._glowTime += dt;

    // === NPC Animation ===
    // Floating indicator bob
    const indicator = this.npcGroup.getObjectByName("npc_indicator");
    if (indicator) {
      indicator.position.y = 2.8 + Math.sin(this._glowTime * 2) * 0.15;
      indicator.rotation.y += dt * 2;
    }

    // NPC faces the player when nearby
    const toPlayer = new THREE.Vector2(
      playerPos.x - this.npcGroup.position.x,
      playerPos.z - this.npcGroup.position.z
    );
    const distToNPC = toPlayer.length();

    if (distToNPC < this.NPC_INTERACT_DIST * 1.5) {
      const targetYaw = Math.atan2(toPlayer.x, toPlayer.y);
      let diff = targetYaw - this.npcGroup.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.npcGroup.rotation.y += diff * Math.min(1, dt * 3);
    }

    // === Proximity Prompts ===
    if (distToNPC < this.NPC_INTERACT_DIST) {
      if (!this._isNearNPC) {
        this._isNearNPC = true;
        if (!this._isDialogueOpen) {
          this._callbacks.onShowPrompt("Press E to Talk");
        }
      }
    } else {
      if (this._isNearNPC) {
        this._isNearNPC = false;
        this._callbacks.onHidePrompt();
        if (this._isDialogueOpen) {
          this._closeDialogue();
        }
      }
    }

    // === Relic ===
    if (this.relicMesh && !this._relicCollected && this.state === "quest_active") {
      // Animate relic: hover + spin
      const groundY = this._getGroundHeight(this._relicPosition.x, this._relicPosition.z);
      this.relicMesh.position.y = groundY + 0.8 + Math.sin(this._glowTime * 2) * 0.3;
      this.relicMesh.rotation.y += dt * 2;

      // Rotate ring
      const ring = this._scene.getObjectByName("relic_ring");
      if (ring) {
        ring.position.y = this.relicMesh.position.y;
        ring.rotation.z += dt * 1.5;
      }

      // Pulse glow light
      const glowLight = this._scene.getObjectByName("relic_glow_light") as THREE.PointLight | null;
      if (glowLight) {
        glowLight.intensity = 2 + Math.sin(this._glowTime * 3) * 1;
        glowLight.position.y = this.relicMesh.position.y;
      }

      // Check if player picks up the relic
      const distToRelic = playerPos.distanceTo(this.relicMesh.position);
      if (distToRelic < this.RELIC_COLLECT_DIST) {
        this._collectRelic();
      }
    }
  }

  /**
   * Player collects the relic.
   */
  private _collectRelic(): void {
    this._relicCollected = true;
    this.state = "quest_complete";
    this._callbacks.onQuestUpdate(this.state);
    this._callbacks.onRelicCollected();

    // Remove relic from scene
    if (this.relicMesh) {
      this._scene.remove(this.relicMesh);
      this.relicMesh = null;
    }
    const ring = this._scene.getObjectByName("relic_ring");
    if (ring) this._scene.remove(ring);
    const glowLight = this._scene.getObjectByName("relic_glow_light");
    if (glowLight) this._scene.remove(glowLight);
  }

  /**
   * Mirror of the terrain height calculation.
   */
  private _getGroundHeight(x: number, z: number): number {
    return THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(z, 40, -60, 0.5, -3.5),
      -3.5,
      0.5
    );
  }

  get isDialogueOpen(): boolean {
    return this._isDialogueOpen;
  }
}
