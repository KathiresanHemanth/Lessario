#ifndef LESSARIO_SHADER_H
#define LESSARIO_SHADER_H

#include <string>
#include <glm/glm.hpp>

namespace Lessario {

    class Shader {
    public:
        // Reads shaders from file paths
        Shader(const std::string& vertexPath, const std::string& fragmentPath);
        // Generates shader from strings (useful for built-in shaders)
        Shader(const char* vertexSource, const char* fragmentSource);
        ~Shader();

        void bind() const;
        void unbind() const;

        unsigned int getID() const { return m_rendererID; }

        // Uniform utility functions
        void setBool(const std::string& name, bool value) const;
        void setInt(const std::string& name, int value) const;
        void setFloat(const std::string& name, float value) const;
        
        void setVec2(const std::string& name, const glm::vec2& value) const;
        void setVec3(const std::string& name, const glm::vec3& value) const;
        void setVec4(const std::string& name, const glm::vec4& value) const;
        
        void setMat3(const std::string& name, const glm::mat3& mat) const;
        void setMat4(const std::string& name, const glm::mat4& mat) const;

    private:
        unsigned int m_rendererID;
        
        void compile(const char* vertexSource, const char* fragmentSource);
        void checkCompileErrors(unsigned int shader, const std::string& type) const;
    };

} // namespace Lessario

#endif // LESSARIO_SHADER_H
