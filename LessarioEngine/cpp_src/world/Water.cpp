#include "world/Water.h"

namespace Lessario {

    std::unique_ptr<Mesh> Water::generatePlane(float size, int resolution) {
        std::vector<Vertex> vertices;
        std::vector<unsigned int> indices;

        float step = size / resolution;
        float halfSize = size / 2.0f;

        // Generate vertices
        for (int z = 0; z <= resolution; ++z) {
            for (int x = 0; x <= resolution; ++x) {
                Vertex v;
                v.Position = glm::vec3((x * step) - halfSize, 0.0f, (z * step) - halfSize);
                v.Normal = glm::vec3(0.0f, 1.0f, 0.0f);
                v.TexCoords = glm::vec2((float)x / resolution, (float)z / resolution);
                v.Color = glm::vec3(0.0f, 0.4f, 0.8f); // Basic blue
                vertices.push_back(v);
            }
        }

        // Generate indices
        for (int z = 0; z < resolution; ++z) {
            for (int x = 0; x < resolution; ++x) {
                int topLeft = (z * (resolution + 1)) + x;
                int topRight = topLeft + 1;
                int bottomLeft = ((z + 1) * (resolution + 1)) + x;
                int bottomRight = bottomLeft + 1;

                indices.push_back(topLeft);
                indices.push_back(bottomLeft);
                indices.push_back(topRight);

                indices.push_back(topRight);
                indices.push_back(bottomLeft);
                indices.push_back(bottomRight);
            }
        }

        return std::make_unique<Mesh>(vertices, indices);
    }

    const char* Water::getVertexShaderSource() {
        return R"glsl(
#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aTexCoords;

uniform mat4 uMVP;
uniform float uTime;

out vec3 vFragPos;
out vec3 vNormal;
out vec2 vTexCoords;

void main() {
    vTexCoords = aTexCoords;
    vNormal = aNormal;
    
    vec3 pos = aPos;
    // Simple sine wave displacement
    float wave = sin(pos.x * 2.0 + uTime) * 0.2 + cos(pos.z * 1.5 + uTime * 0.8) * 0.2;
    pos.y += wave;

    vFragPos = pos;
    gl_Position = uMVP * vec4(pos, 1.0);
}
)glsl";
    }

    const char* Water::getFragmentShaderSource() {
        return R"glsl(
#version 330 core
in vec3 vFragPos;
in vec3 vNormal;
in vec2 vTexCoords;

out vec4 FragColor;

uniform vec3 uCameraPos;

void main() {
    // Basic water coloring based on depth and fresnel
    vec3 waterColor = vec3(0.05, 0.25, 0.45);
    vec3 shallowColor = vec3(0.1, 0.6, 0.8);
    
    // Fake normal for lighting
    vec3 viewDir = normalize(uCameraPos - vFragPos);
    float fresnel = dot(viewDir, vec3(0.0, 1.0, 0.0));
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    
    vec3 finalColor = mix(waterColor, shallowColor, fresnel);
    
    FragColor = vec4(finalColor, 0.85); // slight transparency
}
)glsl";
    }

} // namespace Lessario
