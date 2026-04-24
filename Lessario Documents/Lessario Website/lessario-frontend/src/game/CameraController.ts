import * as THREE from "three";

/**
 * CameraController — Smooth third-person orbit camera that follows the player.
 * Mouse controls yaw/pitch orbit; the camera stays at a fixed distance.
 */
export class CameraController {
  public yaw: number = 0;   // Horizontal orbit angle
  public pitch: number = 0.3; // Vertical angle (radians above horizon)

  private readonly DISTANCE = 10;
  private readonly MIN_PITCH = -0.2;
  private readonly MAX_PITCH = 1.2;
  private readonly MOUSE_SENSITIVITY = 0.003;
  private readonly SMOOTH_FACTOR = 6;

  private _camera: THREE.PerspectiveCamera;
  private _isPointerLocked = false;
  private _targetPosition = new THREE.Vector3();

  constructor(camera: THREE.PerspectiveCamera) {
    this._camera = camera;
  }

  /**
   * Bind mouse controls — pointer lock on canvas click for smooth orbit.
   */
  bindInput(canvas: HTMLElement): void {
    // Click canvas to lock pointer
    const onClick = () => {
      canvas.requestPointerLock();
    };
    canvas.addEventListener("click", onClick);

    const onPointerLockChange = () => {
      this._isPointerLocked = document.pointerLockElement === canvas;
    };
    document.addEventListener("pointerlockchange", onPointerLockChange);

    const onMouseMove = (e: MouseEvent) => {
      if (!this._isPointerLocked) return;
      this.yaw -= e.movementX * this.MOUSE_SENSITIVITY;
      this.pitch -= e.movementY * this.MOUSE_SENSITIVITY;
      this.pitch = THREE.MathUtils.clamp(this.pitch, this.MIN_PITCH, this.MAX_PITCH);
    };
    document.addEventListener("mousemove", onMouseMove);

    // Store refs for cleanup
    (this as any)._onClick = onClick;
    (this as any)._onPointerLockChange = onPointerLockChange;
    (this as any)._onMouseMove = onMouseMove;
    (this as any)._canvas = canvas;
  }

  /**
   * Unbind mouse controls.
   */
  unbindInput(): void {
    const canvas = (this as any)._canvas;
    if (canvas) {
      canvas.removeEventListener("click", (this as any)._onClick);
    }
    document.removeEventListener("pointerlockchange", (this as any)._onPointerLockChange);
    document.removeEventListener("mousemove", (this as any)._onMouseMove);
  }

  /**
   * Update camera position to orbit around the target (player).
   * @param dt Delta time
   * @param targetPos The player's world position
   */
  update(dt: number, targetPos: THREE.Vector3): void {
    // Target look-at point is slightly above the player
    const lookTarget = targetPos.clone().add(new THREE.Vector3(0, 2.0, 0));

    // Compute orbit position
    const offsetX = Math.sin(this.yaw) * Math.cos(this.pitch) * this.DISTANCE;
    const offsetY = Math.sin(this.pitch) * this.DISTANCE;
    const offsetZ = Math.cos(this.yaw) * Math.cos(this.pitch) * this.DISTANCE;

    const desiredPos = new THREE.Vector3(
      lookTarget.x + offsetX,
      lookTarget.y + offsetY,
      lookTarget.z + offsetZ
    );

    // Clamp camera Y to not go below ground + 1
    desiredPos.y = Math.max(desiredPos.y, targetPos.y + 1.5);

    // Smooth interpolation
    const t = 1 - Math.exp(-this.SMOOTH_FACTOR * dt);
    this._camera.position.lerp(desiredPos, t);
    this._targetPosition.lerp(lookTarget, t);

    this._camera.lookAt(this._targetPosition);
  }
}
