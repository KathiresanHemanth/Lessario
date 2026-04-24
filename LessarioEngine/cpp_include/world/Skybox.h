#ifndef LESSARIO_SKYBOX_H
#define LESSARIO_SKYBOX_H

#include <memory>
#include <glm/glm.hpp>
#include "core/Shader.h"

namespace Lessario {

    class Skybox {
    public:
        Skybox();
        ~Skybox();

        // Pass the MVP matrix (Projection * View without Translation) to render the sky infinitely far
        void draw(const glm::mat4& projection, const glm::mat4& view, const glm::vec3& lightDir);

    private:
        unsigned int m_VAO, m_VBO;
        std::unique_ptr<Shader> m_shader;
    };

} // namespace Lessario

#endif // LESSARIO_SKYBOX_H
