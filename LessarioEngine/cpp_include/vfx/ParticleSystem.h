#ifndef LESSARIO_PARTICLESYSTEM_H
#define LESSARIO_PARTICLESYSTEM_H

#include <glm/glm.hpp>
#include <vector>
#include <memory>
#include "core/Shader.h"

namespace Lessario {

    struct Particle {
        glm::vec3 Position;
        glm::vec3 Velocity;
        glm::vec4 Color;
        float Life;
        float StartingLife;
        float Scale;
    };

    class ParticleSystem {
    public:
        ParticleSystem(int maxParticles = 1000);
        ~ParticleSystem();

        void update(float dt);
        void emit(const glm::vec3& position, const glm::vec3& velocity, const glm::vec4& color, float life, float scale);
        
        // This will bind its own VAO and draw instanced
        void draw(const Shader& shader) const;

    private:
        int m_maxParticles;
        std::vector<Particle> m_particles;

        // OpenGL resources
        unsigned int m_VAO, m_quadVBO, m_instanceVBO;
    };

} // namespace Lessario

#endif // LESSARIO_PARTICLESYSTEM_H
