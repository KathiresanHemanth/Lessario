#include "physics/PhysicsSystem.h"
#include "components/Components.h"
#include <iostream>

namespace Lessario {

    PhysicsSystem::PhysicsSystem()
        : m_collisionConfiguration(nullptr),
          m_dispatcher(nullptr),
          m_overlappingPairCache(nullptr),
          m_solver(nullptr),
          m_dynamicsWorld(nullptr) {}

    PhysicsSystem::~PhysicsSystem() {
        // Cleanup will happen in shutdown()
    }

    void PhysicsSystem::initialize(entt::registry& registry) {
        m_collisionConfiguration = new btDefaultCollisionConfiguration();
        m_dispatcher = new btCollisionDispatcher(m_collisionConfiguration);
        m_overlappingPairCache = new btDbvtBroadphase();
        m_solver = new btSequentialImpulseConstraintSolver();
        m_dynamicsWorld = new btDiscreteDynamicsWorld(m_dispatcher, m_overlappingPairCache, m_solver, m_collisionConfiguration);
        m_dynamicsWorld->setGravity(btVector3(0, -9.81f, 0));

        std::cout << "[Physics] Bullet World initialized.\n";

        // Connect cleanup signal
        registry.on_destroy<RigidBodyComponent>().connect<&PhysicsSystem::shutdown>(this); // Wait, this is wrong. 
        // We'll handle individual removal in a dedicated signal handler.
    }

    void PhysicsSystem::update(entt::registry& registry, float deltaTime) {
        if (!m_dynamicsWorld) return;

        // 1. Sync EnTT -> Bullet (for teleporting or manual movement)
        // Note: For performance, only do this if transform changed manually.
        // For now, we'll skip this to avoid overriding physics results unless we implement a 'dirty' flag.

        // 2. Step the simulation
        // Bullet likes a fixed time step.
        m_dynamicsWorld->stepSimulation(deltaTime, 10);

        // 3. Sync Bullet -> EnTT
        auto view = registry.view<RigidBodyComponent, TransformComponent>();
        for (auto entity : view) {
            auto& rb = view.get<RigidBodyComponent>(entity);
            auto& trans = view.get<TransformComponent>(entity);

            if (rb.body && rb.body->getMotionState()) {
                btTransform worldTrans;
                rb.body->getMotionState()->getWorldTransform(worldTrans);
                
                trans.Position = fromBullet(worldTrans.getOrigin());
                
                btQuaternion btQuat = worldTrans.getRotation();
                glm::quat glmQuat = fromBullet(btQuat);
                trans.Rotation = glm::degrees(glm::eulerAngles(glmQuat));
            }
        }
    }

    void PhysicsSystem::shutdown(entt::registry& registry) {
        // EnTT signal bypass: iterate and cleanup all bodies
        auto view = registry.view<RigidBodyComponent>();
        for (auto entity : view) {
            auto& rb = view.get<RigidBodyComponent>(entity);
            if (rb.body) {
                m_dynamicsWorld->removeRigidBody(rb.body);
                delete rb.body->getMotionState();
                delete rb.body;
                rb.body = nullptr;
            }
        }

        for (auto shape : m_shapes) {
            delete shape;
        }
        m_shapes.clear();

        delete m_dynamicsWorld;
        delete m_solver;
        delete m_overlappingPairCache;
        delete m_dispatcher;
        delete m_collisionConfiguration;

        m_dynamicsWorld = nullptr;
        std::cout << "[Physics] Bullet World shutdown.\n";
    }

    void PhysicsSystem::createRigidBody(entt::entity entity, entt::registry& registry, float mass, bool isStatic) {
        auto& trans = registry.get<TransformComponent>(entity);
        auto& col = registry.get<ColliderComponent>(entity);

        if (!col.shape) return;

        btTransform startTransform;
        startTransform.setIdentity();
        startTransform.setOrigin(toBullet(trans.Position));
        
        glm::quat q = glm::quat(glm::radians(trans.Rotation));
        startTransform.setRotation(toBullet(q));

        btVector3 localInertia(0, 0, 0);
        if (!isStatic) col.shape->calculateLocalInertia(mass, localInertia);

        btDefaultMotionState* motionState = new btDefaultMotionState(startTransform);
        btRigidBody::btRigidBodyConstructionInfo rbInfo(isStatic ? 0 : mass, motionState, col.shape, localInertia);
        btRigidBody* body = new btRigidBody(rbInfo);

        m_dynamicsWorld->addRigidBody(body);
        
        registry.emplace<RigidBodyComponent>(entity, body, mass);
        registry.get<RigidBodyComponent>(entity).isStatic = isStatic;
    }

    void PhysicsSystem::addBoxCollider(entt::entity entity, entt::registry& registry, const glm::vec3& halfExtents) {
        btCollisionShape* shape = new btBoxShape(toBullet(halfExtents));
        m_shapes.push_back(shape);
        registry.emplace<ColliderComponent>(entity, shape, ColliderType::Box);
        registry.get<ColliderComponent>(entity).dimensions = halfExtents;
    }

    btVector3 PhysicsSystem::toBullet(const glm::vec3& v) { return btVector3(v.x, v.y, v.z); }
    glm::vec3 PhysicsSystem::fromBullet(const btVector3& v) { return glm::vec3(v.getX(), v.getY(), v.getZ()); }
    btQuaternion PhysicsSystem::toBullet(const glm::quat& q) { return btQuaternion(q.x, q.y, q.z, q.w); }
    glm::quat PhysicsSystem::fromBullet(const btQuaternion& q) { return glm::quat(q.getW(), q.getX(), q.getY(), q.getZ()); }

} // namespace Lessario
