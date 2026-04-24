import * as THREE from "three";
// @ts-ignore - WebGPU types
import { WebGPURenderer } from "three/webgpu";

/**
 * GameSetup — Initializes the WebGPU renderer, scene, camera, lighting, and sky.
 * Handles the core rendering pipeline for the Thiruchendur coastal game.
 */
export class GameSetup {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer!: WebGPURenderer;
  public clock: THREE.Clock;
  public sunLight: THREE.DirectionalLight;

  private _isInitialized = false;

  constructor() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 8, 15);

    // Clock
    this.clock = new THREE.Clock();

    // Sky gradient background
    this._createSkyGradient();

    // Lighting
    // Warm ambient fill
    const ambient = new THREE.AmbientLight(0xffe8c8, 0.6);
    this.scene.add(ambient);

    // Hemisphere light for sky/ground color bleed
    const hemi = new THREE.HemisphereLight(0x87ceeb, 0xffd69e, 0.4);
    this.scene.add(hemi);

    // Directional sunlight with soft shadows
    this.sunLight = new THREE.DirectionalLight(0xfff5e0, 2.0);
    this.sunLight.position.set(30, 50, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -80;
    this.sunLight.shadow.camera.right = 80;
    this.sunLight.shadow.camera.top = 80;
    this.sunLight.shadow.camera.bottom = -80;
    this.sunLight.shadow.bias = -0.0005;
    this.sunLight.shadow.radius = 3; // Soft shadow edges
    this.scene.add(this.sunLight);

    // Fog for depth
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.003);
  }

  /**
   * Create a vertical sky gradient from deep blue (top) to warm horizon.
   */
  private _createSkyGradient(): void {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#1a6dd4");    // Deep sky blue
    gradient.addColorStop(0.3, "#54b8f5");  // Mid sky
    gradient.addColorStop(0.6, "#87ceeb");  // Light sky
    gradient.addColorStop(0.85, "#ffe8c0"); // Warm horizon
    gradient.addColorStop(1.0, "#ffd69e");  // Golden horizon
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    this.scene.background = texture;
  }

  /**
   * Async WebGPU renderer initialization.
   */
  async init(container: HTMLElement): Promise<void> {
    this.renderer = new WebGPURenderer({ antialias: true });
    await this.renderer.init();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    container.appendChild(this.renderer.domElement);
    this._isInitialized = true;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Render one frame.
   */
  render(): void {
    if (!this._isInitialized) return;
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handle window resize.
   */
  onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    if (this._isInitialized) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  /**
   * Cleanup resources.
   */
  dispose(container: HTMLElement): void {
    if (this._isInitialized && this.renderer.domElement) {
      container.removeChild(this.renderer.domElement);
    }
  }
}
