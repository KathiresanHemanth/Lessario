#include "core/Engine.h"

#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <imgui.h>
#include <imgui_impl_glfw.h>
#include <imgui_impl_opengl3.h>
#include <iostream>
#include <vector>

#include "core/Mesh.h"
#include "core/Shader.h"
#include "core/Texture.h"
#include "components/Components.h"
#include "world/Water.h"
#include "world/Skybox.h"
#include "vfx/ParticleSystem.h"
#include "physics/PhysicsSystem.h"

namespace Lessario {

// ---------------------------------------------------------------------------
// Shaders — Standard Lit Shader
// ---------------------------------------------------------------------------
static const char* VERT_SRC = R"glsl(
#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aTexCoords;
layout(location = 3) in vec3 aColor;

uniform mat4 uMVP;
uniform mat4 uModel; // Need model matrix for normal transformation

out vec3 vFragPos;
out vec3 vNormal;
out vec3 vColor;

void main() {
    vFragPos = vec3(uModel * vec4(aPos, 1.0));
    // Simple normal transform (assuming uniform scaling for now)
    vNormal = normalize(mat3(uModel) * aNormal);
    vColor = aColor;
    
    gl_Position = uMVP * vec4(aPos, 1.0);
}
)glsl";

static const char* FRAG_SRC = R"glsl(
#version 330 core
in vec3 vFragPos;
in vec3 vNormal;
in vec3 vColor;

out vec4 FragColor;

uniform vec3 uCameraPos;
uniform vec3 uLightDir;
uniform vec3 uLightColor;

void main() {
    // Ambient
    float ambientStrength = 0.2;
    vec3 ambient = ambientStrength * uLightColor;
  	
    // Diffuse 
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(-uLightDir);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor;
    
    // Specular (Blinn-Phong)
    float specularStrength = 0.5;
    vec3 viewDir = normalize(uCameraPos - vFragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    float spec = pow(max(dot(norm, halfwayDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * uLightColor;  
        
    vec3 result = (ambient + diffuse + specular) * vColor;
    FragColor = vec4(result, 1.0);
}
)glsl";

// ---------------------------------------------------------------------------
// Particle Shaders (Billboarding + Instancing)
// ---------------------------------------------------------------------------
static const char* PARTICLE_VERT = R"glsl(
#version 330 core
layout (location = 0) in vec4 aQuad; // vec2 pos, vec2 texCoords
layout (location = 1) in vec3 aInstancePos;
layout (location = 2) in float aInstanceScale;
layout (location = 3) in vec4 aInstanceColor;

uniform mat4 uProjection;
uniform mat4 uView;

out vec2 vTexCoords;
out vec4 vColor;

void main() {
    vTexCoords = aQuad.zw;
    vColor = aInstanceColor;

    // Billboarding: extract camera up and right from view matrix
    vec3 cameraRight = vec3(uView[0][0], uView[1][0], uView[2][0]);
    vec3 cameraUp = vec3(uView[0][1], uView[1][1], uView[2][1]);
    
    vec3 vertexPos = aInstancePos 
                   + cameraRight * aQuad.x * aInstanceScale 
                   + cameraUp * aQuad.y * aInstanceScale;
                   
    gl_Position = uProjection * uView * vec4(vertexPos, 1.0);
}
)glsl";

static const char* PARTICLE_FRAG = R"glsl(
#version 330 core
in vec2 vTexCoords;
in vec4 vColor;

out vec4 FragColor;

void main() {
    // Make particles circular with soft edges
    vec2 circCoord = 2.0 * vTexCoords - 1.0;
    float dist = dot(circCoord, circCoord);
    if(dist > 1.0) discard;
    
    float alpha = (1.0 - dist) * vColor.a;
    FragColor = vec4(vColor.rgb, alpha);
}
)glsl";

// ---------------------------------------------------------------------------
// Static callback trampolines
// ---------------------------------------------------------------------------
static Engine* s_instance = nullptr;

void Engine::onFramebufferResize(GLFWwindow*, int w, int h) {
    glViewport(0, 0, w, h);
    if (s_instance) {
        s_instance->m_width  = w;
        s_instance->m_height = h;
        s_instance->m_camera.setAspect(static_cast<float>(w) / static_cast<float>(h));
    }
}

void Engine::onScroll(GLFWwindow*, double /*xoff*/, double yoff) {
    if (s_instance && !s_instance->m_cameraLocked) s_instance->m_camera.zoom(static_cast<float>(yoff) * 0.3f);
}

void Engine::onMouseButton(GLFWwindow*, int btn, int action, int /*mods*/) {
    if (!s_instance || s_instance->m_cameraLocked) return;
    if (btn == GLFW_MOUSE_BUTTON_LEFT) {
        s_instance->m_dragging = (action == GLFW_PRESS);
        if (s_instance->m_dragging)
            glfwGetCursorPos(s_instance->m_window,
                             &s_instance->m_lastMouseX,
                             &s_instance->m_lastMouseY);
    }
}

void Engine::onCursorPos(GLFWwindow*, double x, double y) {
    if (!s_instance || s_instance->m_cameraLocked || !s_instance->m_dragging) return;
    if (ImGui::GetIO().WantCaptureMouse) return;
    float dx = static_cast<float>(x - s_instance->m_lastMouseX) * 0.4f;
    // float dy = static_cast<float>(y - s_instance->m_lastMouseY) * 0.4f;
    s_instance->m_camera.orbit(dx, 0.0f); // Lock to vertical axis (horizontal rotation) only
    s_instance->m_lastMouseX = x;
    s_instance->m_lastMouseY = y;
}

// ---------------------------------------------------------------------------
// Constructor / Destructor
// ---------------------------------------------------------------------------
Engine::Engine(const std::string& title, int width, int height)
    : m_title(title), m_width(width), m_height(height),
      m_isRunning(false), m_window(nullptr),
      m_camera(45.0f, static_cast<float>(width) / static_cast<float>(height)),
      m_dragging(false), m_lastMouseX(0), m_lastMouseY(0),
      m_fps(0.0f), m_frameTime(0.0f), m_entityCount(0), 
      m_lightDir(glm::vec3(-0.2f, -1.0f, -0.3f)),
      m_cameraLocked(true) {
    s_instance = this;
}

Engine::~Engine() { shutdown(); }

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
bool Engine::initialize() {
    if (!glfwInit()) {
        std::cerr << "[Engine] GLFW init failed.\n";
        return false;
    }

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    m_window = glfwCreateWindow(m_width, m_height, m_title.c_str(), nullptr, nullptr);
    if (!m_window) {
        std::cerr << "[Engine] Window creation failed.\n";
        glfwTerminate();
        return false;
    }

    glfwMakeContextCurrent(m_window);
    glfwSwapInterval(1);

    glfwSetFramebufferSizeCallback(m_window, onFramebufferResize);
    glfwSetScrollCallback(m_window,          onScroll);
    glfwSetMouseButtonCallback(m_window,     onMouseButton);
    glfwSetCursorPosCallback(m_window,       onCursorPos);

    if (!initOpenGL())  return false;
    
    initImGui();
    
    m_physicsSystem = std::make_unique<PhysicsSystem>();
    m_physicsSystem->initialize(m_registry);

    initScene(); // Initialize ECS Scene

    m_isRunning = true;
    std::cout << "[Engine] " << glGetString(GL_VERSION)
              << " | " << glGetString(GL_RENDERER) << "\n";
    return true;
}

// ---------------------------------------------------------------------------
// Scene Initialization
// ---------------------------------------------------------------------------
void Engine::initScene() {
    // 1. Setup Shader
    m_cubeShader = std::make_unique<Shader>(VERT_SRC, FRAG_SRC);

    // 2. Setup Mesh (using our new Vertex format)
    std::vector<Vertex> vertices;
    const float rawVerts[] = {
        // Front face (blue tones)
        -0.5f, -0.5f,  0.5f,  0.20f, 0.50f, 1.00f,
         0.5f, -0.5f,  0.5f,  0.30f, 0.60f, 1.00f,
         0.5f,  0.5f,  0.5f,  0.10f, 0.40f, 0.90f,
        -0.5f,  0.5f,  0.5f,  0.15f, 0.45f, 0.95f,
        // Back face (violet tones)
        -0.5f, -0.5f, -0.5f,  0.70f, 0.10f, 0.90f,
         0.5f, -0.5f, -0.5f,  0.80f, 0.15f, 0.85f,
         0.5f,  0.5f, -0.5f,  0.60f, 0.05f, 0.80f,
        -0.5f,  0.5f, -0.5f,  0.65f, 0.08f, 0.88f,
    };
    
    for (int i = 0; i < 8; ++i) {
        Vertex v;
        v.Position = glm::vec3(rawVerts[i*6], rawVerts[i*6+1], rawVerts[i*6+2]);
        
        // Compute pseudo-normals for the cube based on the face it belongs to
        glm::vec3 normal(0.0f);
        if(i < 4) normal = glm::vec3(0,0,1);     // front
        else normal = glm::vec3(0,0,-1);         // back
        // For a true lit cube we'd need 24 independent vertices (4 per face) with distinct normals. 
        // We'll just assign a generic normal here since this is a test cube.
        v.Normal = glm::normalize(v.Position);

        v.TexCoords = glm::vec2(0.0f);
        v.Color = glm::vec3(rawVerts[i*6+3], rawVerts[i*6+4], rawVerts[i*6+5]);
        vertices.push_back(v);
    }

    std::vector<unsigned int> indices = {
        0,1,2, 2,3,0,   // front
        4,5,6, 6,7,4,   // back
        3,2,6, 6,7,3,   // top
        0,1,5, 5,4,0,   // bottom
        0,3,7, 7,4,0,   // left
        1,2,6, 6,5,1,   // right
    };

    m_cubeMesh = std::make_unique<Mesh>(vertices, indices);

    // 3. Create Root Entity (Spinning Cube)
    auto rootEntity = m_registry.create();
    m_registry.emplace<TransformComponent>(rootEntity, glm::vec3(0.0f, 1.0f, 0.0f));
    m_registry.emplace<MeshRendererComponent>(rootEntity, m_cubeMesh.get(), m_cubeShader.get(), nullptr);
    m_entityCount++;

    // 3.5 Create Child Entity (Orbiting Cube)
    auto childEntity = m_registry.create();
    auto& childTransform = m_registry.emplace<TransformComponent>(childEntity, glm::vec3(2.0f, 0.0f, 0.0f));
    childTransform.Scale = glm::vec3(0.5f);
    m_registry.emplace<HierarchyComponent>(childEntity, rootEntity);
    m_registry.emplace<MeshRendererComponent>(childEntity, m_cubeMesh.get(), m_cubeShader.get(), nullptr);
    m_entityCount++;

    // 4. Create Water Entity
    m_waterShader = std::make_unique<Shader>(Water::getVertexShaderSource(), Water::getFragmentShaderSource());
    m_waterMesh = Water::generatePlane(100.0f, 100); // 100x100 units with 100 quads

    auto waterEntity = m_registry.create();
    // Lower water slightly to avoid Z-fighting with the origin
    m_registry.emplace<TransformComponent>(waterEntity, glm::vec3(0.0f, -0.5f, 0.0f));
    m_registry.emplace<MeshRendererComponent>(waterEntity, m_waterMesh.get(), m_waterShader.get(), nullptr);
    m_entityCount++;

    // 5. Setup Fire Particle System
    m_particleShader = std::make_unique<Shader>(PARTICLE_VERT, PARTICLE_FRAG);
    m_fireParticles = std::make_unique<ParticleSystem>(2000);

    // 6. Setup Skybox
    m_skybox = std::make_unique<Skybox>();

    // 7. Generate Procedural Forest
    m_treeTrunkMesh = Mesh::createCylinder(0.2f, 1.0f, 8, glm::vec3(0.4f, 0.25f, 0.15f));
    m_treeFoliageMesh = Mesh::createCone(0.8f, 2.0f, 8, glm::vec3(0.2f, 0.5f, 0.2f));
    
    for(int i = 0; i < 50; ++i) {
        float rx = ((rand() % 100) / 100.0f - 0.5f) * 40.0f;
        float rz = ((rand() % 100) / 100.0f - 0.5f) * 40.0f;
        // Don't spawn perfectly at origin to leave room for the spinning cube and fire
        if(abs(rx) < 2.0f && abs(rz) < 2.0f) continue;
        
        // Trunk
        auto trunkEntity = m_registry.create();
        m_registry.emplace<TransformComponent>(trunkEntity, glm::vec3(rx, 0.0f, rz));
        m_registry.emplace<MeshRendererComponent>(trunkEntity, m_treeTrunkMesh.get(), m_cubeShader.get(), nullptr);
        m_entityCount++;

        // Foliage (Child of Trunk)
        auto foliageEntity = m_registry.create();
        auto& folTrans = m_registry.emplace<TransformComponent>(foliageEntity, glm::vec3(0.0f, 1.0f, 0.0f)); // Local offset ABOVE trunk
        m_registry.emplace<HierarchyComponent>(foliageEntity, trunkEntity);
        m_registry.emplace<MeshRendererComponent>(foliageEntity, m_treeFoliageMesh.get(), m_cubeShader.get(), nullptr);
        m_entityCount++;
    }

    // 8. Setup Physics Scene (Floor + Falling Cube)
    // Create a static ground collider at y = -0.5 (where the water plane is)
    auto groundEntity = m_registry.create();
    m_registry.emplace<TransformComponent>(groundEntity, glm::vec3(0.0f, -0.51f, 0.0f));
    m_physicsSystem->addBoxCollider(groundEntity, m_registry, glm::vec3(50.0f, 0.1f, 50.0f));
    m_physicsSystem->createRigidBody(groundEntity, m_registry, 0.0f, true); // mass 0 = static

    // Create a dynamic falling box
    auto fallingBox = m_registry.create();
    m_registry.emplace<TransformComponent>(fallingBox, glm::vec3(0.0f, 10.0f, 0.0f));
    m_registry.emplace<MeshRendererComponent>(fallingBox, m_cubeMesh.get(), m_cubeShader.get(), nullptr);
    m_physicsSystem->addBoxCollider(fallingBox, m_registry, glm::vec3(0.5f, 0.5f, 0.5f));
    m_physicsSystem->createRigidBody(fallingBox, m_registry, 1.0f, false);
    m_entityCount++;
}

void Engine::run() {
    double lastTime = glfwGetTime();

    while (m_isRunning && !glfwWindowShouldClose(m_window)) {
        double now      = glfwGetTime();
        float  dt       = static_cast<float>(now - lastTime);
        lastTime        = now;
        m_frameTime     = dt * 1000.0f;
        m_fps           = (dt > 0.0f) ? 1.0f / dt : 0.0f;

        processInput();
        update(dt);
        render();
    }
}

void Engine::shutdown() {
    if (m_physicsSystem) {
        m_physicsSystem->shutdown(m_registry);
    }

    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    ImGui::DestroyContext();

    // Smart pointers handle mesh/shader cleanup automatically
    // The registry cleans up entities automatically

    if (m_window) { glfwDestroyWindow(m_window); m_window = nullptr; }
    glfwTerminate();
}

void Engine::processInput() {
    glfwPollEvents();
    if (glfwGetKey(m_window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        m_isRunning = false;
}

void Engine::update(float dt) {
    if (m_physicsSystem) {
        m_physicsSystem->update(m_registry, dt);
    }

    // Basic automatic rotation logic for all entities with a Transform to prove ECS works
    // Filter out RigidBody entities so physics can take over their movement
    double angle = glfwGetTime() * 45.0; // 45 deg/sec
    auto view = m_registry.view<TransformComponent>(entt::exclude<RigidBodyComponent>);
    for (auto entity : view) {
        auto& transform = view.get<TransformComponent>(entity);
        // Slowly spin it over time.
        // In a real game, this might be handled by an Animate or Spin script component
        transform.Rotation = glm::vec3(angle * 0.3f, angle, angle * 0.2f);
    }

    // Update particles and emit new ones (simple fire)
    m_fireParticles->update(dt);
    
    // Emit 5 particles per frame
    for(int i = 0; i < 5; ++i) {
        // Random spread for fire
        float rx = ((rand() % 100) / 100.0f - 0.5f) * 0.5f;
        float rz = ((rand() % 100) / 100.0f - 0.5f) * 0.5f;
        float ry = ((rand() % 100) / 100.0f) * 2.0f; // Upward velocity multiplier
        
        glm::vec3 pos(rx, 0.0f, rz);
        glm::vec3 vel(rx * 0.5f, 1.5f + ry, rz * 0.5f);
        
        // Fire colors (orange/yellow -> red -> fade to alpha)
        float rCol = (rand() % 100) / 100.0f;
        glm::vec4 color(1.0f, 0.5f + rCol * 0.5f, 0.1f, 1.0f);
        
        float scale = 0.2f + ((rand() % 100) / 100.0f) * 0.3f;
        float life = 1.0f + ((rand() % 100) / 100.0f) * 1.5f;
        
        m_fireParticles->emit(pos, vel, color, life, scale);
    }
}

void Engine::render() {
    glClearColor(0.05f, 0.07f, 0.12f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // --- ECS Render Loop ---
    auto view = m_registry.view<TransformComponent, MeshRendererComponent>();
    for (auto entity : view) {
        auto& transform = view.get<TransformComponent>(entity);
        auto& renderer  = view.get<MeshRendererComponent>(entity);

        if (renderer.mesh && renderer.shader) {
            renderer.shader->bind();

            // Calculate Global Transform
            glm::mat4 model = transform.getTransform();
            
            // Walk up the hierarchy if it exists
            entt::entity current = entity;
            while(m_registry.all_of<HierarchyComponent>(current)) {
                auto& hierarchy = m_registry.get<HierarchyComponent>(current);
                if(hierarchy.parent != entt::null && m_registry.all_of<TransformComponent>(hierarchy.parent)) {
                    auto& parentTransform = m_registry.get<TransformComponent>(hierarchy.parent);
                    model = parentTransform.getTransform() * model;
                    current = hierarchy.parent;
                } else {
                    break;
                }
            }

            glm::mat4 mvp = m_camera.projection() * m_camera.view() * model;
            
            renderer.shader->setMat4("uMVP", mvp);
            renderer.shader->setMat4("uModel", model);

            // Lighting Uniforms
            renderer.shader->setVec3("uLightDir", m_lightDir);
            renderer.shader->setVec3("uLightColor", glm::vec3(1.0f, 0.95f, 0.9f)); // Warm sunlight

            // Set global uniforms that might be in the shader (like for Water)
            // glGetUniformLocation returns -1 if the uniform doesn't exist, which is fine, 
            // but setting it via our abstraction will just glUniform*(...) silently if location is valid.
            // A dedicated material system would manage this better, but this works for Milestone 2.
            float time = static_cast<float>(glfwGetTime());
            renderer.shader->setFloat("uTime", time);
            renderer.shader->setVec3("uCameraPos", m_camera.position());

            // Bind texture if one exists
            if (renderer.texture) {
                renderer.texture->bind(0);
            }

            renderer.mesh->draw();
            renderer.shader->unbind();
        }
    }

    // --- Draw Skybox ---
    m_skybox->draw(m_camera.projection(), m_camera.view(), m_lightDir);

    // --- Draw Particle System ---
    // Make sure to additively blend fire particles
    glBlendFunc(GL_SRC_ALPHA, GL_ONE); 
    
    m_particleShader->bind();
    m_particleShader->setMat4("uProjection", m_camera.projection());
    m_particleShader->setMat4("uView", m_camera.view());
    m_fireParticles->draw(*m_particleShader);
    
    // Reset blend func back to normal alpha blending
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    // --- ImGui overlay ---
    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplGlfw_NewFrame();
    ImGui::NewFrame();

    // Stats panel
    ImGui::SetNextWindowPos(ImVec2(10, 10), ImGuiCond_Always);
    ImGui::SetNextWindowSize(ImVec2(260, 0), ImGuiCond_Always);
    ImGui::SetNextWindowBgAlpha(0.75f);
    ImGui::Begin("##stats", nullptr, ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoSavedSettings);
    ImGui::TextColored(ImVec4(1.0f, 0.6f, 0.1f, 1.0f), "Lessario Engine  v0.2.0");
    ImGui::Separator();
    ImGui::Text("FPS       : %.1f", m_fps);
    ImGui::Text("Frame     : %.2f ms", m_frameTime);
    ImGui::Text("GPU       : %s", glGetString(GL_RENDERER));
    ImGui::Text("Entities  : %zu", m_entityCount);
    ImGui::End();

    // Camera control panel
    ImGui::SetNextWindowPos(ImVec2(10, static_cast<float>(m_height) - 120.0f), ImGuiCond_Always);
    ImGui::SetNextWindowSize(ImVec2(260, 0), ImGuiCond_Always);
    ImGui::SetNextWindowBgAlpha(0.75f);
    ImGui::Begin("##camera", nullptr, ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoSavedSettings);
    ImGui::TextColored(ImVec4(0.4f, 0.8f, 1.0f, 1.0f), "Camera Controls");
    ImGui::Separator();
    
    ImGui::Checkbox("Lock Camera", &m_cameraLocked);
    ImGui::Separator();

    if (m_cameraLocked) {
        ImGui::TextDisabled("Controls Disabled");
    } else {
        ImGui::BulletText("LMB Drag  — orbit");
        ImGui::BulletText("Scroll    — zoom");
    }
    ImGui::BulletText("ESC       — exit");
    glm::vec3 cp = m_camera.position();
    ImGui::Text("Pos: (%.2f, %.2f, %.2f)", cp.x, cp.y, cp.z);
    ImGui::End();

    // Export panel
    static int  s_exportStatus = 0;
    static char s_exportMsg[128]  = "Ready";
    ImGui::SetNextWindowPos(ImVec2(static_cast<float>(m_width) - 280.0f, 10.0f), ImGuiCond_Always);
    ImGui::SetNextWindowSize(ImVec2(270.0f, 0.0f), ImGuiCond_Always);
    ImGui::SetNextWindowBgAlpha(0.80f);
    ImGui::Begin("##export", nullptr, ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoSavedSettings);
    ImGui::TextColored(ImVec4(0.2f, 1.0f, 0.5f, 1.0f), "Export Pipeline");
    ImGui::Separator();

    bool busy = (s_exportStatus == 1);
    if (busy) ImGui::BeginDisabled();
    if (ImGui::Button("  Export  Windows  x64  ", ImVec2(-1, 0))) {
        s_exportStatus = 1;
        snprintf(s_exportMsg, sizeof(s_exportMsg), "Building Release...");
        std::string cmd = "powershell -ExecutionPolicy Bypass -NonInteractive -File \"" + 
                          std::string(LESSARIO_PROJECT_DIR) + 
                          "/export_windows.ps1\" -NoZip > export_log.txt 2>&1";
        int rc = system(cmd.c_str());
        s_exportStatus = (rc == 0) ? 2 : 3;
        snprintf(s_exportMsg, sizeof(s_exportMsg), rc == 0 ? "Done! -> export/windows/" : "Failed — see export_log.txt");
    }
    if (busy) ImGui::EndDisabled();

    ImVec4 col = (s_exportStatus == 2) ? ImVec4(0.2f,1.0f,0.4f,1.0f) : (s_exportStatus == 3) ? ImVec4(1.0f,0.3f,0.3f,1.0f) : (s_exportStatus == 1) ? ImVec4(1.0f,0.8f,0.0f,1.0f) : ImVec4(0.6f,0.6f,0.6f,1.0f);
    ImGui::TextColored(col, "%s", s_exportMsg);
    ImGui::Separator();
    ImGui::TextDisabled("Platforms:");
    ImGui::BulletText("Windows x64  [available]");
    ImGui::BulletText("Android ARM64 [planned]");
    ImGui::End();

    ImGui::Render();
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());

    glfwSwapBuffers(m_window);
}

bool Engine::initOpenGL() {
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        std::cerr << "[Engine] GLAD failed to load OpenGL.\n";
        return false;
    }
    glEnable(GL_DEPTH_TEST);
    
    // Enable alpha blending for water and particles
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    
    glViewport(0, 0, m_width, m_height);
    return true;
}

void Engine::initImGui() {
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    io.IniFilename = nullptr; // Don't save layout

    ImGui::StyleColorsDark();
    ImGuiStyle& style = ImGui::GetStyle();
    style.WindowRounding   = 6.0f;
    style.FrameRounding    = 4.0f;
    style.GrabRounding     = 4.0f;
    style.WindowBorderSize = 0.0f;
    style.Colors[ImGuiCol_WindowBg]  = ImVec4(0.06f, 0.08f, 0.14f, 0.90f);
    style.Colors[ImGuiCol_TitleBg]   = ImVec4(0.10f, 0.14f, 0.25f, 1.00f);
    style.Colors[ImGuiCol_TitleBgActive] = ImVec4(0.14f, 0.22f, 0.40f, 1.00f);

    ImGui_ImplGlfw_InitForOpenGL(m_window, true);
    ImGui_ImplOpenGL3_Init("#version 330");
}

} // namespace Lessario
