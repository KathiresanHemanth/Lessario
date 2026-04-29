# 🧩 Tech Stack — AR Robot Filter App

**Finalized Stack**: Unity 2022 LTS → Unity 6 + URP + MediaPipe  
**Target Device**: OnePlus 11 (Snapdragon 8 Gen 2) — Android APK  
**Dev Machine**: DESKTOP-NIC30FP (Intel i3-2100 / 16GB RAM / GT 710)

---

## 💻 Development Machine Specs

| Component | Spec | Dev Status |
|---|---|---|
| Device | DESKTOP-NIC30FP | — |
| CPU | Intel Core i3-2100 @ 3.10GHz (Dual-core, 2011) | ⚠️ Weak — close background apps |
| RAM | 16.0 GB | ✅ Sufficient |
| Storage | 466 GB HDD + 233 GB SSD (Samsung 870 EVO) | ✅ Install Unity on SSD |
| GPU | NVIDIA GeForce GT 710 (2 GB VRAM) | ⚠️ Use Unity 2022 LTS (not Unity 6) |
| OS | Windows 64-bit (x64) | ✅ OK |

> **Note:** Unity 6's GPU Resident Drawer and VFX Graph preview require 4GB+ VRAM. Use **Unity 2022 LTS** for development on this machine. The final APK targets OnePlus 11 (Snapdragon 8 Gen 2) and will take full advantage of Unity 6 features once a higher-spec dev machine is available.

---

## 🔧 Stack at a Glance

| Layer | Technology |
|---|---|
| Engine | **Unity 2022 LTS** (dev) → Unity 6 (future) |
| Render Pipeline | URP (Universal Render Pipeline) with Render Graph |
| AR Tracking | MediaPipeUnityPlugin (Pose + Face + Hand Landmarker) |
| 3D Rendering | URP + GPU Resident Drawer + STP Upscaling |
| Robot Model | FBX/GLB (Mixamo humanoid-rigged) |
| Bone Mapping | Unity Animation Rigging + custom IK retargeting |
| Camera | WebCamTexture / AR Foundation |
| VFX | VFX Graph + Shader Graph |
| Post-Processing | URP Volume (Bloom, Chromatic Aberration, STP) |
| Build | IL2CPP → Android APK (ARM64) |
| Min Android API | API 33 (Android 13+) |
| Target Device | OnePlus 11 (Snapdragon 8 Gen 2) |

---

## ⚡ Why Unity 6?

Unity 6 (released October 2024) introduces major mobile performance improvements that are critical for real-time AR filter apps:

| Unity 6 Feature | Benefit for This App |
|---|---|
| **Render Graph** | Dynamic render pass optimization — lower frame times on mobile |
| **GPU Resident Drawer** | Offloads draw calls to GPU — critical for smooth AR robot overlay |
| **GPU Occlusion Culling** | Automatically reduces overdraw — better battery life |
| **STP (Spatial Temporal Post-Processing)** | Render at 75% resolution and upscale with minimal quality loss → free FPS gain |
| **Shader Graph UI Canvas** | SDF-based, resolution-independent HUD elements for the futuristic overlay |
| **URP as Standard** | Built-in Render Pipeline deprecated in Unity 6 — URP is the official path forward |
| **Deferred+ Rendering Path** | Cluster-based light culling — more dynamic lights in the AR scene |
| **IL2CPP Backend** | C# compiled to native ARM64 → significantly faster than Mono on mobile |

---

## 🤖 Why Unity over Alternatives?

| Stack | Why Not? |
|---|---|
| React Native + Three.js | JS bridge adds latency; poor real-time 3D performance on mobile |
| Native Kotlin + Filament | Best raw performance but requires writing all bone mapping math from scratch — much longer dev time |
| Flutter + Flame 3D | 3D rendering in Flutter is immature; no production-ready avatar/skeleton support |
| **Unity 6 + MediaPipe** ✅ | Industry standard for mobile AR filters (Snapchat/Instagram/TikTok); asset ecosystem; built-in VFX tools |

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `MediaPipeUnityPlugin` | Pose, Face, Hand landmark tracking via MediaPipe Tasks |
| `Unity Animation Rigging` | IK-based bone retargeting from MediaPipe landmarks |
| `Unity VFX Graph` | Particle systems — sparks, scan-lines, glow effects |
| `Unity Shader Graph` | Custom PBR robot materials and HUD shaders |
| `Unity URP Post-Processing` | Bloom, Chromatic Aberration, STP upscaling |
| `AR Foundation` | WebCamTexture / camera access abstraction |

---

## 🏗️ Build Configuration

```
Backend:        IL2CPP
Architecture:   ARM64
Min API:        33 (Android 13)
Target:         API 33+
Scripting:      C# (.NET 7)
Rendering:      URP (Render Graph enabled)
Texture Format: ASTC (GPU compressed, optimal for Adreno 740)
```

> **Note:** The Snapdragon 8 Gen 2's Adreno 740 GPU fully supports ASTC texture compression — use it for all robot textures to save memory and improve rendering speed.

---

## 🔗 References

- [MediaPipeUnityPlugin](https://github.com/homuler/MediaPipeUnityPlugin)
- [Unity 6 URP What's New](https://docs.unity3d.com/6000.0/Documentation/Manual/urp/whats-new/urp-whats-new.html)
- [Unity Animation Rigging](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.3/manual/index.html)
- [Mixamo Auto-Rigger](https://www.mixamo.com/)
- [MediaPipe Pose Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker)
- [MediaPipe Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker)
