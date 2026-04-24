#ifndef LESSARIO_ENGINE_H
#define LESSARIO_ENGINE_H

#include <string>
#include "core/Camera.h"

#include <entt/entt.hpp>
#include <memory>

struct GLFWwindow;

namespace Lessario {

    class Mesh;
    class Shader;
    class Texture;
    class ParticleSystem;
    class Skybox;
    class PhysicsSystem;

    class Engine {
    public:
        Engine(const std::string& title, int width, int height);
        ~Engine();

        bool initialize();
        void run();
        void shutdown();

    private:
        // --- Lifecycle ---
        void processInput();
        void update(float deltaTime);
        void render();

        // --- Init helpers ---
        bool initOpenGL();
        void initImGui();
        void initScene(); // Creates the ECS scene

        // --- Input callbacks (static -> member dispatch) ---
        static void onFramebufferResize(GLFWwindow* w, int width, int height);
        static void onScroll(GLFWwindow* w, double xoff, double yoff);
        static void onMouseButton(GLFWwindow* w, int btn, int action, int mods);
        static void onCursorPos(GLFWwindow* w, double x, double y);

        // --- Window / state ---
        std::string  m_title;
        int          m_width, m_height;
        bool         m_isRunning;
        GLFWwindow*  m_window;

        // --- Camera ---
        Camera       m_camera;
        bool         m_dragging;
        bool         m_cameraLocked;
        double       m_lastMouseX, m_lastMouseY;

        // --- ECS and Resources ---
        entt::registry m_registry;
        
        // Systems
        std::unique_ptr<PhysicsSystem> m_physicsSystem;

        // Resource storage (in a real engine this goes to an Asset Manager)
        std::unique_ptr<Mesh> m_cubeMesh;
        std::unique_ptr<Shader> m_cubeShader;
        std::unique_ptr<Mesh> m_waterMesh;
        std::unique_ptr<Shader> m_waterShader;
        
        // Procedural Environment Meshes
        std::unique_ptr<Mesh> m_treeTrunkMesh;
        std::unique_ptr<Mesh> m_treeFoliageMesh;
        std::unique_ptr<Mesh> m_rockMesh;
        
        // Particle System
        std::unique_ptr<ParticleSystem> m_fireParticles;
        std::unique_ptr<Shader> m_particleShader;

        // Environment
        std::unique_ptr<Skybox> m_skybox;
        glm::vec3 m_lightDir;

        std::unique_ptr<Texture> m_dummyTexture; // We'll add this later

        // --- Stats ---
        float        m_fps;
        float        m_frameTime;
        size_t       m_entityCount;
    };

} // namespace Lessario

#endif // LESSARIO_ENGINE_H
