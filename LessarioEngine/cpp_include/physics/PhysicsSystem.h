#ifndef LESSARIO_PHYSICSSYSTEM_H
#define LESSARIO_PHYSICSSYSTEM_H

#include <entt/entt.hpp>
#include <glm/glm.hpp>
#include <btBulletDynamicsCommon.h>
#include <memory>
#include <vector>

namespace Lessario {

    class PhysicsSystem {
    public:
        PhysicsSystem();
        ~PhysicsSystem();

        void initialize(entt::registry& registry);
        void update(entt::registry& registry, float deltaTime);
        void shutdown(entt::registry& registry);

        // Helper to create a rigid body for an entity
        void createRigidBody(entt::entity entity, entt::registry& registry, float mass, bool isStatic);
        
        // Helper to add a box collider
        void addBoxCollider(entt::entity entity, entt::registry& registry, const glm::vec3& halfExtents);

        // Math utilities
        static btVector3 toBullet(const glm::vec3& v);
        static glm::vec3 fromBullet(const btVector3& v);
        static btQuaternion toBullet(const glm::quat& q);
        static glm::quat fromBullet(const btQuaternion& q);

    private:
        btDefaultCollisionConfiguration* m_collisionConfiguration;
        btCollisionDispatcher*           m_dispatcher;
        btBroadphaseInterface*           m_overlappingPairCache;
        btSequentialImpulseConstraintSolver* m_solver;
        btDiscreteDynamicsWorld*         m_dynamicsWorld;

        // Keep track of shapes to clean them up (Bullet doesn't manage shape memory)
        std::vector<btCollisionShape*> m_shapes;
    };

} // namespace Lessario

#endif // LESSARIO_PHYSICSSYSTEM_H
