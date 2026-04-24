# 🔱 Lessario Engine - Development Roadmap

## 🎯 Global Objective
Building a high-performance, lightweight game engine with C++ for older hardware (i3-2100 / GT 710).

---

## 🚩 Milestone 1: Core Engine & Standalone Export
Goal: Establish the engine's heartbeat and the ability to package projects.

- [x] **Engine Initialization**
    - [x] Application should open and initialize OpenGL 3.3 context.
    - [x] Robust error handling for legacy hardware.
- [x] **Simple Prototype Interface**
    - [x] Basic internal UI (ImGui overlay) — stats + camera controls panel.
    - [x] Viewport to render 3D space — spinning cube with orbit camera.
- [ ] **Export Pipeline**
    - [ ] Implement an "Export" functionality within the engine.
    - [x] **Standalone EXE**: Generate a playable .exe of the current scene.
    - [x] **3D Rendering**: The exported game must support 3D geometry rendering.
    - [ ] **Android APK Export [Later]**: Generate `.apk` targeting high-end specs:
        - *Target Device Profile*: Snapdragon 8 Gen 2 (4nm), 8/16GB LPDDR5X, 1440p 120Hz LTPO AMOLED.
        - *Graphics*: OpenGL ES 3.2 / Vulkan support.

---

## 🌍 Milestone 2: World & Scene System
Goal: Build a living, traversable 3D world with diverse objects and environments.

### 🗺️ World Foundation
- [x] **Scene Graph** — parent-child transform hierarchy for world objects (via EnTT ECS)
- [x] **OBJ / GLTF Model Loader** — load external 3D meshes (tinyobjloader or tinygltf)
- [x] **Texture System** — load PNG/JPG textures (stb_image), UV mapping, sampler2D
- [x] **Lighting** — Blinn-Phong directional + point lights, normals support
- [x] **Skybox** — procedural atmospheric sky gradient with sun glare
- [ ] **Ground / Terrain** — heightmap-based terrain with grass texture tiling

### 🌿 Environment Objects
- [x] **Trees** — low-poly tree mesh (trunk + foliage), instanced rendering for forest density
- [x] **Rocks & Props** — static scenery objects scattered via transform list
- [ ] **Grass** — billboard grass quads with alpha transparency

### 🌊 Water System
- [x] **Sea / Ocean Plane** — large water mesh with scrolling UV animation
- [x] **Water Shader** — Fresnel reflectance, normal map waves, transparency blend
- [ ] **Shore Foam** — depth-based foam effect at shoreline edges

### 🔥 Particle & VFX System
- [x] **Particle Engine** — CPU particle emitter (position, velocity, lifetime, color)
- [x] **Fire Effect** — upward particle burst with orange/yellow color gradient & fade
- [x] **Smoke Effect** — slow grey particle drift on fire extinction (deferred to simple alpha fade)
- [x] **Billboard Particles** — always face camera (view-aligned quads)

### 🧍 Characters
- [ ] **Skinned Mesh Support** — bone/joint transform system for animated models
- [ ] **Character Controller** — WASD movement, gravity, collision stub
- [ ] **Idle Animation** — load + play single looped animation clip (GLTF)
- [ ] **NPC Placement** — static character instances in the world

---

## 🚩 Milestone 3: Gameplay & Interactivity
Goal: A player can walk around the world and interact with it.

- [ ] **First / Third Person Camera** — switchable player-follow camera modes
- [x] **Collision Detection** — GJK/EPA via Bullet, static world collision
- [x] **Physics Integration** — Bullet Physics for rigidbodies & gravity
- [ ] **Interaction System** — raycast click-to-select objects
- [ ] **Day/Night Cycle** — sun angle + sky color interpolation over time
- [ ] **Audio** — OpenAL ambient sounds, fire crackling, wind, water
- [ ] **Scene Serialization** — save/load world state (JSON via nlohmann/json)

---

## 🛠️ Build Status
- [x] Visual Studio Solution Generation (v18 2026 / .slnx)
- [x] GLFW & EnTT & GLM Dependency Management
- [x] OpenGL Loader (GLAD) Integration — vendored in third_party/glad
- [x] Hello World Triangle Render — colored triangle, GLFW window, game loop
- [x] ImGui Integration — dark theme overlays, stats panel, camera controls
- [x] 3D Mesh Rendering — spinning cube (EBO), orbit camera, depth testing
- [ ] Export Pipeline (Standalone EXE packaging)
- [x] Scene Graph & Model Loader (EnTT ECS integrated, tinygltf fetched)
- [x] Texture & Lighting System (Texture class integrated)
- [x] Water Shader
- [x] Fire / Particle System
- [ ] Character & Animation System
- [x] Physics & Collision (Bullet Physics integrated)

