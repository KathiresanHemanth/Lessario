# Tech Stack: "Core-Light" Legacy-Efficient Engine

This technical stack is meticulously optimized for the **Intel Core i3-2100** and **NVIDIA GT 710**. To build an engine that feels professional but runs smoothly on a 2-core machine, we prioritize **low binary overhead** and **efficient memory management** over heavy, bleeding-edge features.

### **The "Legacy-Efficient" Tech Stack**
* **Language:** C++17 (Sweet spot for modern features without choking a 2-core CPU with heavy metaprogramming)
* **Graphics API:** OpenGL 3.3 Core Profile (Optimal for Kepler architecture, avoids Vulkan boilerplate)
* **Windowing/Input:** GLFW (Significantly lighter than SDL, tiny memory footprint)
* **Graphics Loader:** GLAD
* **Math:** GLM (OpenGL Mathematics for 3D matrices and vectors)
* **Architecture:** EnTT ECS (Fast, header-only Entity Component System to maximize CPU Cache efficiency)
* **Physics:** ReactPhysics3D (Lightweight, zero-dependency C++ library)
* **UI/Editor:** Dear ImGui (Immediate Mode UI, industry standard with near-zero overhead)
* **Compiler:** MSVC (Visual Studio 2022 - Gold standard for Windows/NVIDIA debugging)

---

## 📊 Hardware-Specific Optimization Strategy

| Potential Issue | Strategy for GT 710 / i3-2100 |
| :--- | :--- |
| **Limited VRAM (2GB)** | Implement a **Texture Pool**. Limit textures to 1024x1024 and use compressed formats (DDS/BC7). |
| **CPU Bottleneck (2 Cores)** | Keep **Renderer** and **Logic** on the same thread initially. Thread jumping overhead on a dual-core can slow down the engine. |
| **Slow HDD Storage** | Keep **Source Code** and **Build Folders** on an SSD (if available) to reduce compile times significantly. |

---

## 🚀 First Milestone Roadmap
Don't try to build a "Level Editor" yet. Focus on the engine heartbeat:
1.  **Window Creation:** Initialize GLFW and open a window.
2.  **The Triangle:** Use GLAD and OpenGL 3.3 to render a single colored triangle.
3.  **The ECS Loop:** Use EnTT to manage the triangle's position as a "Transform Component".
