#include "world/Skybox.h"
#include <glad/glad.h>
#include <vector>

namespace Lessario {

    static const char* SKYBOX_VERT = R"glsl(
#version 330 core
layout (location = 0) in vec3 aPos;

out vec3 vTexCoords;

uniform mat4 uProjection;
uniform mat4 uView;

void main() {
    vTexCoords = aPos;
    // Remove translation from the view matrix so skybox is always centered at camera
    mat4 rotView = mat4(mat3(uView));
    vec4 pos = uProjection * rotView * vec4(aPos, 1.0);
    // Force z to 1.0 after perspective divide so it always renders behind everything
    gl_Position = pos.xyww;
}
    )glsl";

    static const char* SKYBOX_FRAG = R"glsl(
#version 330 core
in vec3 vTexCoords;
out vec4 FragColor;

uniform vec3 uLightDir;

void main() {
    vec3 dir = normalize(vTexCoords);
    
    // Simple procedural sky colors
    vec3 skyTop = vec3(0.15, 0.45, 0.85);
    vec3 skyBottom = vec3(0.65, 0.85, 1.0);
    vec3 sunColor = vec3(1.0, 0.95, 0.8);
    
    // Mix top and bottom based on Y
    float t = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 skyColor = mix(skyBottom, skyTop, t);
    
    // Add sun glow
    vec3 lDir = normalize(-uLightDir);
    float sun = max(dot(dir, lDir), 0.0);
    sun = pow(sun, 128.0); // sharp sun
    float glow = pow(max(dot(dir, lDir), 0.0), 16.0); // soft glow
    
    vec3 finalColor = skyColor + sunColor * sun + sunColor * glow * 0.5;
    
    // Slight haze at horizon
    float horizon = 1.0 - abs(dir.y);
    horizon = pow(horizon, 4.0);
    finalColor = mix(finalColor, vec3(0.8, 0.9, 1.0), horizon * 0.5);
    
    FragColor = vec4(finalColor, 1.0);
}
    )glsl";

    Skybox::Skybox() {
        m_shader = std::make_unique<Shader>(SKYBOX_VERT, SKYBOX_FRAG);

        float skyboxVertices[] = {
            // positions          
            -1.0f,  1.0f, -1.0f,
            -1.0f, -1.0f, -1.0f,
             1.0f, -1.0f, -1.0f,
             1.0f, -1.0f, -1.0f,
             1.0f,  1.0f, -1.0f,
            -1.0f,  1.0f, -1.0f,

            -1.0f, -1.0f,  1.0f,
            -1.0f, -1.0f, -1.0f,
            -1.0f,  1.0f, -1.0f,
            -1.0f,  1.0f, -1.0f,
            -1.0f,  1.0f,  1.0f,
            -1.0f, -1.0f,  1.0f,

             1.0f, -1.0f, -1.0f,
             1.0f, -1.0f,  1.0f,
             1.0f,  1.0f,  1.0f,
             1.0f,  1.0f,  1.0f,
             1.0f,  1.0f, -1.0f,
             1.0f, -1.0f, -1.0f,

            -1.0f, -1.0f,  1.0f,
            -1.0f,  1.0f,  1.0f,
             1.0f,  1.0f,  1.0f,
             1.0f,  1.0f,  1.0f,
             1.0f, -1.0f,  1.0f,
            -1.0f, -1.0f,  1.0f,

            -1.0f,  1.0f, -1.0f,
             1.0f,  1.0f, -1.0f,
             1.0f,  1.0f,  1.0f,
             1.0f,  1.0f,  1.0f,
            -1.0f,  1.0f,  1.0f,
            -1.0f,  1.0f, -1.0f,

            -1.0f, -1.0f, -1.0f,
            -1.0f, -1.0f,  1.0f,
             1.0f, -1.0f, -1.0f,
             1.0f, -1.0f, -1.0f,
            -1.0f, -1.0f,  1.0f,
             1.0f, -1.0f,  1.0f
        };

        glGenVertexArrays(1, &m_VAO);
        glGenBuffers(1, &m_VBO);
        glBindVertexArray(m_VAO);
        glBindBuffer(GL_ARRAY_BUFFER, m_VBO);
        glBufferData(GL_ARRAY_BUFFER, sizeof(skyboxVertices), &skyboxVertices, GL_STATIC_DRAW);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
        glBindVertexArray(0);
    }

    Skybox::~Skybox() {
        glDeleteBuffers(1, &m_VBO);
        glDeleteVertexArrays(1, &m_VAO);
    }

    void Skybox::draw(const glm::mat4& projection, const glm::mat4& view, const glm::vec3& lightDir) {
        // Change depth function so depth test passes when values are equal to depth buffer's content
        glDepthFunc(GL_LEQUAL); 
        m_shader->bind();
        m_shader->setMat4("uProjection", projection);
        m_shader->setMat4("uView", view);
        m_shader->setVec3("uLightDir", lightDir);

        glBindVertexArray(m_VAO);
        glDrawArrays(GL_TRIANGLES, 0, 36);
        glBindVertexArray(0);
        m_shader->unbind();
        glDepthFunc(GL_LESS); // Set depth function back to default
    }

} // namespace Lessario
