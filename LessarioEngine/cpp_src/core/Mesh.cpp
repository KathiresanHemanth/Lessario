#include "core/Mesh.h"
#include <glad/glad.h>
#include <cstddef>
#include <memory>
#include <glm/gtc/constants.hpp>

namespace Lessario {

    Mesh::Mesh(const std::vector<Vertex>& vertices, const std::vector<unsigned int>& indices)
        : m_vertices(vertices), m_indices(indices), m_VAO(0), m_VBO(0), m_EBO(0) {
        setupMesh();
    }

    Mesh::~Mesh() {
        if (m_EBO) glDeleteBuffers(1, &m_EBO);
        if (m_VBO) glDeleteBuffers(1, &m_VBO);
        if (m_VAO) glDeleteVertexArrays(1, &m_VAO);
    }

    void Mesh::setupMesh() {
        glGenVertexArrays(1, &m_VAO);
        glGenBuffers(1, &m_VBO);
        glGenBuffers(1, &m_EBO);

        glBindVertexArray(m_VAO);

        // Load data into vertex buffers
        glBindBuffer(GL_ARRAY_BUFFER, m_VBO);
        glBufferData(GL_ARRAY_BUFFER, m_vertices.size() * sizeof(Vertex), &m_vertices[0], GL_STATIC_DRAW);

        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m_EBO);
        glBufferData(GL_ELEMENT_ARRAY_BUFFER, m_indices.size() * sizeof(unsigned int), &m_indices[0], GL_STATIC_DRAW);

        // Set the vertex attribute pointers
        // Vertex Positions (Attribute 0)
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)0);
        // Vertex Normals (Attribute 1)
        glEnableVertexAttribArray(1);
        glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, Normal));
        // Vertex Texture Coords (Attribute 2)
        glEnableVertexAttribArray(2);
        glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, TexCoords));
        // Vertex Color (Attribute 3)
        glEnableVertexAttribArray(3);
        glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, Color));

        glBindVertexArray(0);
    }

    void Mesh::draw() const {
        glBindVertexArray(m_VAO);
        glDrawElements(GL_TRIANGLES, static_cast<int>(m_indices.size()), GL_UNSIGNED_INT, nullptr);
        glBindVertexArray(0);
    }

    std::unique_ptr<Mesh> Mesh::createCylinder(float radius, float height, int segments, const glm::vec3& color) {
        std::vector<Vertex> vertices;
        std::vector<unsigned int> indices;
        
        float halfHeight = height / 2.0f;
        float angleStep = glm::two_pi<float>() / segments;

        // Top center point
        vertices.push_back({{0.0f, halfHeight, 0.0f}, {0.0f, 1.0f, 0.0f}, {0.5f, 0.5f}, color});
        // Bottom center point
        vertices.push_back({{0.0f, -halfHeight, 0.0f}, {0.0f, -1.0f, 0.0f}, {0.5f, 0.5f}, color});

        for(int i = 0; i <= segments; ++i) {
            float angle = i * angleStep;
            float c = cos(angle);
            float s = sin(angle);
            float u = (float)i / segments;
            
            glm::vec3 normal(c, 0.0f, s); // Cylinder side normal
            // Top rim vertex
            vertices.push_back({{radius * c, halfHeight, radius * s}, normal, {u, 1.0f}, color});
            // Bottom rim vertex
            vertices.push_back({{radius * c, -halfHeight, radius * s}, normal, {u, 0.0f}, color});
        }

        int topCenter = 0;
        int bottomCenter = 1;
        int rimStart = 2;

        for(int i = 0; i < segments; ++i) {
            int top1 = rimStart + (i * 2);
            int bot1 = top1 + 1;
            int top2 = rimStart + ((i + 1) * 2);
            int bot2 = top2 + 1;

            // Side quad (2 triangles)
            indices.push_back(top1); indices.push_back(bot1); indices.push_back(top2);
            indices.push_back(top2); indices.push_back(bot1); indices.push_back(bot2);
            
            // Top cap
            indices.push_back(topCenter); indices.push_back(top1); indices.push_back(top2);
            // Bottom cap
            indices.push_back(bottomCenter); indices.push_back(bot2); indices.push_back(bot1);
        }

        return std::make_unique<Mesh>(vertices, indices);
    }

    std::unique_ptr<Mesh> Mesh::createCone(float radius, float height, int segments, const glm::vec3& color) {
        std::vector<Vertex> vertices;
        std::vector<unsigned int> indices;

        float halfHeight = height / 2.0f;
        float angleStep = glm::two_pi<float>() / segments;

        // Tip
        vertices.push_back({{0.0f, halfHeight, 0.0f}, {0.0f, 1.0f, 0.0f}, {0.5f, 1.0f}, color});
        // Bottom center
        vertices.push_back({{0.0f, -halfHeight, 0.0f}, {0.0f, -1.0f, 0.0f}, {0.5f, 0.5f}, color});
        
        int tip = 0;
        int bottomCenter = 1;
        int baseStart = 2;

        for(int i = 0; i <= segments; ++i) {
            float angle = i * angleStep;
            float c = cos(angle);
            float s = sin(angle);
            float u = (float)i / segments;
            // Fake slope normal
            glm::vec3 normal = glm::normalize(glm::vec3(c * height, radius, s * height));
            vertices.push_back({{radius * c, -halfHeight, radius * s}, normal, {u, 0.0f}, color});
        }

        for(int i = 0; i < segments; ++i) {
            int base1 = baseStart + i;
            int base2 = baseStart + i + 1;
            
            // Side
            indices.push_back(tip); indices.push_back(base1); indices.push_back(base2);
            // Bottom cap
            indices.push_back(bottomCenter); indices.push_back(base2); indices.push_back(base1);
        }

        return std::make_unique<Mesh>(vertices, indices);
    }

} // namespace Lessario
