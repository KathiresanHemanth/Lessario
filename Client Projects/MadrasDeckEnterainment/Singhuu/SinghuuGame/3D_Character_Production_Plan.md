# 3D Character Production & Technical Plan

This document outlines the requirements and workflow for replacing the current placeholder characters in the Singhuu game with high-fidelity 3D assets based on the *Nama Thala Singhuu* animated series artwork.

## 1. Primary Model Format: **GLB (GLTF 2.0)**
For the Three.js web engine, **GLB** is mandatory as it provides the optimal balance of visual fidelity and performance.

*   **PBR Materials**: Each character must use Physically Based Rendering materials to capture the sheen of fur, the weave of fabric (Singhuu's shirt/denim), and eye reflections.
*   **Asset Bundling**: Meshes, UV-mapped textures, skeletal rigs, and animation clips must be contained within a single `.glb` file per character.
*   **Compression**: Use DRACO or Meshopt compression to keep file sizes under 5MB per character where possible.

## 2. Rigging & Animation (Humanoid)
Singhu uses a **Standard Humanoid Rig**. This allows for natural bipedal movement despite his lion head.

### Required Animation Clips
To ensure compatibility with the `game.js` state machine, the Singhu GLB **MUST** include these exact clip names:

*   `Idle`: Breathing/standing pose.
*   `Run`: Upright athletic sprint.
*   `Jump`: Leap with active "air" pose.
*   `Slide`: Baseball-style slide (lowering his profile to pass under barriers).
*   `Celebrate`: Victory roar or gesture for correct quiz answers.

## 3. Visual Specifications
Based on the character sheets, the 3D style should be **"Stylized High-Fidelity"** (resembling modern CGI series like Zootopia).

*   **Polycount Target**: 15,000 – 25,000 triangles.
*   **Texture Maps**:
    *   **Albedo/BaseColor**: 2K resolution (2048x2048).
    *   **Normal Map**: High priority for mane and fabric detail.
*   **Character Proportions**: Humanoid body (approx. 6-headed height) with a stylized lion head.

## 4. Single-Character Workflow
1.  **AI-to-3D Base**: Generate initial 3D mesh from the [Singhu Sheet](file:///c:/Users/khkum/Documents/GitHub/Lessario/Client%20Projects/MadrasDeckEnterainment/Singhuu/SinghuuGame/SinghuuAIAnimatedSeries/Main%20Files/Animals%20Sheets/Singhuu/1_3_view_charistmatic_202604021635.png).
2.  **Manual Cleanup**: Refine mane geometry for better silhouette.
3.  **Rigging**: Use **Mixamo** for standard bipedal rigging (auto-rigger).
4.  **Integration**: Export as `singhu.glb` and place in `WebPrototype/assets/models/`.

## 5. Submission Checklist: Demo Package
For the final demo submission, the following files must be organized and verified:

### A. Core 3D Asset
*   [ ] `WebPrototype/assets/models/singhu.glb`: The final character file (must contain textures and all 5 animation clips).

### B. Playable Game Engine
*   [ ] `WebPrototype/index.html`: The main entry point.
*   [ ] `WebPrototype/game.js`: The engine logic (updated to load the new `singhu.glb`).
*   [ ] `WebPrototype/questions.json`: The quiz bank for the Ekam system.

### C. Technical Documentation
*   [ ] `3D_Character_Production_Plan.md`: This technical roadmap.
*   [ ] `GDD.md`: The core Game Design Document.

### D. Visual References
*   [ ] `Gameplay_Screenshot.png`: A high-res capture of Singhu active in the game world.
*   [ ] `Singhu_Reference.png`: The original AI-generated character sheet.

---
*Created on: April 24, 2026*
