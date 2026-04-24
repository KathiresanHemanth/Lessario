#include "vfx/ParticleSystem.h"
#include <glad/glad.h>
#include <algorithm>

namespace Lessario {

    ParticleSystem::ParticleSystem(int maxParticles)
        : m_maxParticles(maxParticles), m_VAO(0), m_quadVBO(0), m_instanceVBO(0) {
        
        m_particles.resize(m_maxParticles);

        // Quad vertices (positions and UVs)
        float quadVertices[] = {
            // Pos        // UV
            -0.5f,  0.5f, 0.0f, 1.0f,
             0.5f, -0.5f, 1.0f, 0.0f,
            -0.5f, -0.5f, 0.0f, 0.0f,

            -0.5f,  0.5f, 0.0f, 1.0f,
             0.5f,  0.5f, 1.0f, 1.0f,
             0.5f, -0.5f, 1.0f, 0.0f
        };

        glGenVertexArrays(1, &m_VAO);
        glGenBuffers(1, &m_quadVBO);
        glGenBuffers(1, &m_instanceVBO);

        glBindVertexArray(m_VAO);
        
        // 1. Static Quad VBO
        glBindBuffer(GL_ARRAY_BUFFER, m_quadVBO);
        glBufferData(GL_ARRAY_BUFFER, sizeof(quadVertices), quadVertices, GL_STATIC_DRAW);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(0, 4, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)0);

        // 2. Dynamic Instance VBO
        // Structure: vec3 Position (12), float Scale (4), vec4 Color (16) = 32 bytes per instance
        glBindBuffer(GL_ARRAY_BUFFER, m_instanceVBO);
        glBufferData(GL_ARRAY_BUFFER, m_maxParticles * 32, nullptr, GL_DYNAMIC_DRAW);
        
        glEnableVertexAttribArray(1);
        glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 32, (void*)0);
        glVertexAttribDivisor(1, 1); // Tell OpenGL this is per-instance

        glEnableVertexAttribArray(2);
        glVertexAttribPointer(2, 1, GL_FLOAT, GL_FALSE, 32, (void*)12);
        glVertexAttribDivisor(2, 1);

        glEnableVertexAttribArray(3);
        glVertexAttribPointer(3, 4, GL_FLOAT, GL_FALSE, 32, (void*)16);
        glVertexAttribDivisor(3, 1);

        glBindVertexArray(0);
    }

    ParticleSystem::~ParticleSystem() {
        glDeleteBuffers(1, &m_instanceVBO);
        glDeleteBuffers(1, &m_quadVBO);
        glDeleteVertexArrays(1, &m_VAO);
    }

    void ParticleSystem::update(float dt) {
        for (auto& p : m_particles) {
            if (p.Life > 0.0f) {
                p.Life -= dt;
                if (p.Life > 0.0f) {
                    p.Position += p.Velocity * dt;
                    // Example fake physics: shrink over time and fade out
                    float lifeRatio = p.Life / p.StartingLife;
                    p.Color.a = lifeRatio;
                }
            }
        }
    }

    void ParticleSystem::emit(const glm::vec3& position, const glm::vec3& velocity, const glm::vec4& color, float life, float scale) {
        // Find a dead particle
        for (auto& p : m_particles) {
            if (p.Life <= 0.0f) {
                p.Position = position;
                p.Velocity = velocity;
                p.Color = color;
                p.Life = life;
                p.StartingLife = life;
                p.Scale = scale;
                return; // Emitted one, done
            }
        }
    }

    void ParticleSystem::draw(const Shader& shader) const {
        // Collect active particles data
        std::vector<float> instanceData;
        int activeCount = 0;
        
        for (const auto& p : m_particles) {
            if (p.Life > 0.0f) {
                instanceData.push_back(p.Position.x);
                instanceData.push_back(p.Position.y);
                instanceData.push_back(p.Position.z);
                instanceData.push_back(p.Scale);
                instanceData.push_back(p.Color.r);
                instanceData.push_back(p.Color.g);
                instanceData.push_back(p.Color.b);
                instanceData.push_back(p.Color.a);
                activeCount++;
            }
        }

        if (activeCount == 0) return;

        glBindBuffer(GL_ARRAY_BUFFER, m_instanceVBO);
        glBufferSubData(GL_ARRAY_BUFFER, 0, instanceData.size() * sizeof(float), instanceData.data());

        shader.bind();
        glBindVertexArray(m_VAO);
        
        // Disable depth writing so particles don't occlude each other weirdly when blended
        glDepthMask(GL_FALSE);
        glDrawArraysInstanced(GL_TRIANGLES, 0, 6, activeCount);
        glDepthMask(GL_TRUE);
        
        glBindVertexArray(0);
        shader.unbind();
    }

} // namespace Lessario
