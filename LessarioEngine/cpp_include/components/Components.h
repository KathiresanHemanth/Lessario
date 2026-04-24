#ifndef LESSARIO_COMPONENTS_H
#define LESSARIO_COMPONENTS_H

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#define GLM_ENABLE_EXPERIMENTAL
#include <glm/gtx/quaternion.hpp>
#include <memory>
#include <entt/entt.hpp>

// Forward declarations to avoid including heavy headers in components
namespace Lessario {
    class Mesh;
    class Shader;
    class Texture;
}

namespace Lessario {

    struct TransformComponent {
        glm::vec3 Position = { 0.0f, 0.0f, 0.0f };
        glm::vec3 Rotation = { 0.0f, 0.0f, 0.0f }; // In Euler angles (degrees)
        glm::vec3 Scale    = { 1.0f, 1.0f, 1.0f };

        TransformComponent() = default;
        TransformComponent(const TransformComponent&) = default;
        TransformComponent(const glm::vec3& translation) : Position(translation) {}

        glm::mat4 getTransform() const {
            glm::mat4 rotation = glm::toMat4(glm::quat(glm::radians(Rotation)));

            return glm::translate(glm::mat4(1.0f), Position)
                 * rotation
                 * glm::scale(glm::mat4(1.0f), Scale);
        }
    };

    struct MeshRendererComponent {
        // Using raw pointers for now; in a real engine you'd use a Resource Manager 
        // to hand out AssetHandles or std::shared_ptr to avoid life cycle issues.
        Mesh*    mesh    = nullptr;
        Shader*  shader  = nullptr;
        Texture* texture = nullptr;

        glm::vec4 colorOffset = { 1.0f, 1.0f, 1.0f, 1.0f }; // Tint

        MeshRendererComponent() = default;
        MeshRendererComponent(const MeshRendererComponent&) = default;
        MeshRendererComponent(Mesh* m, Shader* s, Texture* t = nullptr)
            : mesh(m), shader(s), texture(t) {}
    };

    struct HierarchyComponent {
        entt::entity parent = entt::null;
        entt::entity firstChild = entt::null;
        entt::entity prevSibling = entt::null;
        entt::entity nextSibling = entt::null;
        
        HierarchyComponent() = default;
        HierarchyComponent(entt::entity p) : parent(p) {}
    };

} // namespace Lessario

// --- Physics Components (Forward Declarations) ---
class btRigidBody;
class btCollisionShape;

namespace Lessario {

    struct RigidBodyComponent {
        btRigidBody* body = nullptr;
        float mass = 1.0f;
        bool isStatic = false;

        RigidBodyComponent() = default;
        RigidBodyComponent(btRigidBody* b, float m = 1.0f) : body(b), mass(m) {}
    };

    enum class ColliderType { Box, Sphere, Capsule, StaticPlane };

    struct ColliderComponent {
        btCollisionShape* shape = nullptr;
        ColliderType type = ColliderType::Box;
        glm::vec3 dimensions = { 1.0f, 1.0f, 1.0f }; // half-extents for Box, (radius, height, 0) for Capsule/Sphere

        ColliderComponent() = default;
        ColliderComponent(btCollisionShape* s, ColliderType t) : shape(s), type(t) {}
    };

} // namespace Lessario

#endif // LESSARIO_COMPONENTS_H
