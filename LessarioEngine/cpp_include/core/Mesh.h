#ifndef LESSARIO_MESH_H
#define LESSARIO_MESH_H

#include <vector>
#include <memory>
#include <glm/glm.hpp>

namespace Lessario {

    struct Vertex {
        glm::vec3 Position;
        glm::vec3 Normal;
        glm::vec2 TexCoords;
        glm::vec3 Color; // Kept for backwards compatibility with our colored cube
    };

    class Mesh {
    public:
        // Create mesh from given vertices and indices
        Mesh(const std::vector<Vertex>& vertices, const std::vector<unsigned int>& indices);
        ~Mesh();

        void draw() const;

        unsigned int getVAO() const { return m_VAO; }
        size_t getIndexCount() const { return m_indices.size(); }

        // Procedural Geometry Generators
        static std::unique_ptr<Mesh> createCylinder(float radius, float height, int segments, const glm::vec3& color);
        static std::unique_ptr<Mesh> createCone(float radius, float height, int segments, const glm::vec3& color);

    private:
        std::vector<Vertex> m_vertices;
        std::vector<unsigned int> m_indices;

        unsigned int m_VAO, m_VBO, m_EBO;

        void setupMesh();
    };

} // namespace Lessario

#endif // LESSARIO_MESH_H
