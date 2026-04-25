# 🤖 AR Robot Filter App

## 🎯 Goal
Replace a human's facial and body motion captured from a camera/video feed with a real-time 3D robot avatar — similar to Snapchat filters but for the **full body and face**.

**Target Device**: OnePlus 11 (Snapdragon 8 Gen 2)  
**Platform**: Native Android APK

---

## 🧩 Tech Stack Options

### Option A — Unity 6 + MediaPipe ⭐ RECOMMENDED
**Best for**: High-quality 3D rendering + largest asset ecosystem

| Layer | Technology |
|---|---|
| Engine | **Unity 6** (C#) |
| Render Pipeline | URP with Render Graph |
| AR Tracking | MediaPipeUnityPlugin (Pose + Face + Hand) |
| 3D Rendering | URP + GPU Resident Drawer + STP Upscaling |
| Robot Model | GLB/FBX (Mixamo-rigged) |
| Bone Mapping | Custom IK retargeting via Unity Animation Rigging |
| Camera | Unity WebCamTexture / AR Foundation |
| VFX | Unity VFX Graph / Shader Graph |
| Build | Unity → Android APK (IL2CPP, ARM64) |
| Min API | Android 13+ (API 33) |
| Target | OnePlus 11 (Snapdragon 8 Gen 2) |

**Pros**:
- Industry standard for mobile 3D/AR — this is what Snapchat, Instagram, and TikTok effects are built on
- Massive ecosystem of rigged 3D robot models (Unity Asset Store, Sketchfab)
- Built-in VFX tools (particle systems, shader graph, post-processing)
- Profiler and performance tools included
- Direct APK export

**Cons**:
- Requires Unity Editor (separate IDE)
- Larger APK size (~50-100MB)
- C# instead of JS/Kotlin

---

### Option B — Native Kotlin + MediaPipe + Filament/SceneView
**Best for**: Smallest APK size + maximum native performance

| Layer | Technology |
|---|---|
| Language | Kotlin |
| UI | Jetpack Compose |
| AR Tracking | MediaPipe Tasks Vision (`tasks-vision`) |
| 3D Rendering | SceneView (Filament wrapper) |
| Camera | CameraX |
| Bone Mapping | Custom quaternion math (manual) |
| VFX | Custom OpenGL shaders |
| Build | Android Studio → APK (Gradle) |
| Target | Android 13+ / OnePlus 11 |

**Pros**:
- Best raw performance (direct hardware access, no engine overhead)
- Smallest APK size (~15-25MB)
- First-class MediaPipe support (Google's own Android API)
- Modern Kotlin/Compose development

**Cons**:
- Must write bone-mapping math from scratch (quaternion calculations)
- SceneView has a smaller community than Unity for avatar work
- VFX must be hand-coded (no visual graph tools)
- Significantly more development time for 3D features

---

### Option C — Flutter + MediaPipe + Flame 3D
**Best for**: Cross-platform (if iOS is needed later)

| Layer | Technology |
|---|---|
| Framework | Flutter (Dart) |
| AR Tracking | MediaPipe Tasks (via platform channels) |
| 3D Rendering | `flutter_3d_controller` / custom OpenGL |
| Camera | `camera` package |
| Build | Flutter → APK |

**Pros**:
- Cross-platform (Android + iOS from one codebase)
- Growing ecosystem

**Cons**:
- ❌ 3D rendering in Flutter is **immature** — not production-ready for real-time AR
- ❌ No mature avatar/skeleton animation support
- ❌ Poor fit for this use case

---

## ✅ Recommendation: **Option A — Unity + MediaPipe**

Unity is the clear winner for a Snapchat-like full-body AR filter because:
1. **3D quality** — URP rendering, PBR materials, and VFX Graph produce premium visuals
2. **Asset ecosystem** — Thousands of rigged robot models ready to use
3. **MediaPipeUnityPlugin** — Mature, open-source, actively maintained
4. **Performance** — Unity's IL2CPP backend compiles to native ARM, runs at 60 FPS on Snapdragon 8 Gen 2
5. **Industry standard** — This is how professional filter apps are built

---

## 🗺️ Milestones (Unity Stack)

### Milestone 1 — Project Setup & Camera Feed
Get Unity project running with a live camera feed on OnePlus 11.

- [ ] **Task 1.1** — Create Unity 2022 LTS project with URP template
- [ ] **Task 1.2** — Configure Android build settings (API 33+, ARM64, IL2CPP)
- [ ] **Task 1.3** — Install MediaPipeUnityPlugin via Unity Package Manager
- [ ] **Task 1.4** — Set up WebCamTexture for live camera preview
- [ ] **Task 1.5** — Handle camera permissions and orientation
- [ ] **Task 1.6** — Build & deploy test APK to OnePlus 11

---

### Milestone 2 — Motion Tracking Pipeline
Capture and process human pose, face, and hand landmarks in real-time.

- [ ] **Task 2.1** — Initialize MediaPipe Pose Landmarker (33 body joints)
- [ ] **Task 2.2** — Initialize MediaPipe Face Landmarker (478 face landmarks)
- [ ] **Task 2.3** — Initialize MediaPipe Hand Landmarker (21 hand joints × 2)
- [ ] **Task 2.4** — Extract and normalize landmark data per frame
- [ ] **Task 2.5** — Apply One Euro Filter for jitter smoothing
- [ ] **Task 2.6** — Validate tracking at 30-60 FPS on device
- [ ] **Task 2.7** — Debug visualization — draw skeleton/landmarks on screen

---

### Milestone 3 — 3D Robot Model & Bone Mapping
Load a rigged robot and drive it with live tracking data.

- [ ] **Task 3.1** — Source/create a humanoid-rigged robot model (FBX/GLB)
  - Subtask: Apply Mixamo auto-rig if needed
  - Subtask: Set up as Unity Humanoid Avatar
- [ ] **Task 3.2** — Import model into Unity with Humanoid rig configuration
- [ ] **Task 3.3** — Map MediaPipe landmarks → bone rotations
  - Subtask: Spine chain (hips → spine → chest → neck → head)
  - Subtask: Arms (shoulder → elbow → wrist → fingers)
  - Subtask: Legs (hip → knee → ankle → toes)
- [ ] **Task 3.4** — Map face landmarks → blendshapes (52+ ARKit-compatible)
  - Subtask: Eye blink (left/right)
  - Subtask: Jaw open / mouth shapes
  - Subtask: Eyebrow raise
- [ ] **Task 3.5** — Position robot to match user's screen position
- [ ] **Task 3.6** — Apply PBR materials (metallic body, emissive joints, glowing eyes)

---

### Milestone 4 — AR Overlay & VFX
Composite the robot over the camera feed with premium visual effects.

- [ ] **Task 4.1** — Render robot on transparent layer over camera feed
- [ ] **Task 4.2** — Add URP post-processing (bloom, chromatic aberration)
- [ ] **Task 4.3** — Add VFX Graph effects:
  - Subtask: Glow/emissive outlines on robot joints
  - Subtask: Scan-line sweep effect across body
  - Subtask: Spark particles on fast movements
  - Subtask: "Boot-up" animation on filter activation
- [ ] **Task 4.4** — Add futuristic HUD overlay (scanning indicator, sync status)
- [ ] **Task 4.5** — Robot skin themes (Cyberpunk Blue, Stealth Black, Neon Red, Chrome)
- [ ] **Task 4.6** — Option to toggle camera background ON/OFF

---

### Milestone 5 — APK Build & Polish
Package, optimize, and finalize for distribution.

- [ ] **Task 5.1** — Performance profiling with Unity Profiler
  - Subtask: Target 60 FPS on OnePlus 11
  - Subtask: Monitor thermal throttling
  - Subtask: Optimize draw calls and shader complexity
- [ ] **Task 5.2** — Design splash screen + app icon
- [ ] **Task 5.3** — Build UI (Start/Stop filter, theme switcher, camera flip)
- [ ] **Task 5.4** — Add screenshot / screen recording feature
- [ ] **Task 5.5** — End-to-end testing on OnePlus 11
  - Subtask: Full-body tracking (standing, walking, waving)
  - Subtask: Face tracking (blink, mouth open, head tilt)
  - Subtask: Different lighting conditions
  - Subtask: Front + rear camera
- [ ] **Task 5.6** — Generate signed release APK
- [ ] **Task 5.7** — Install and demo on device

---

## 📌 Notes
- The robot must follow the **entire body** — not just the face like standard Snapchat filters.
- Smoothing (One Euro Filter) is critical — raw landmark data is noisy and causes jitter.
- The robot model must use a **standard humanoid rig** (Mixamo-compatible preferred).
- Unity's IL2CPP backend should be used for production builds (much faster than Mono).
- MediaPipeUnityPlugin GitHub: https://github.com/homuler/MediaPipeUnityPlugin
