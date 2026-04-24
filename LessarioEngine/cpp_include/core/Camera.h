#ifndef LESSARIO_CAMERA_H
#define LESSARIO_CAMERA_H

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

namespace Lessario {

    // Simple orbit camera — rotates around the origin.
    class Camera {
    public:
        Camera(float fovDeg = 45.0f, float aspect = 16.0f / 9.0f,
               float nearZ = 0.1f, float farZ = 100.0f)
            : m_fov(fovDeg), m_aspect(aspect), m_near(nearZ), m_far(farZ),
              m_yaw(-90.0f), m_pitch(25.0f), m_radius(3.0f) {}

        // Call every frame before drawing
        void setAspect(float aspect) { m_aspect = aspect; }

        void orbit(float dYaw, float dPitch) {
            m_yaw   += dYaw;
            m_pitch  = glm::clamp(m_pitch + dPitch, -89.0f, 89.0f);
        }

        void zoom(float delta) {
            m_radius = glm::clamp(m_radius - delta, 0.5f, 20.0f);
        }

        glm::mat4 view() const {
            glm::vec3 pos = position();
            return glm::lookAt(pos, glm::vec3(0.0f), glm::vec3(0.0f, 1.0f, 0.0f));
        }

        glm::mat4 projection() const {
            return glm::perspective(glm::radians(m_fov), m_aspect, m_near, m_far);
        }

        glm::vec3 position() const {
            float yawR   = glm::radians(m_yaw);
            float pitchR = glm::radians(m_pitch);
            return glm::vec3(
                m_radius * cos(pitchR) * cos(yawR),
                m_radius * sin(pitchR),
                m_radius * cos(pitchR) * sin(yawR)
            );
        }

    private:
        float m_fov, m_aspect, m_near, m_far;
        float m_yaw, m_pitch, m_radius;
    };

} // namespace Lessario

#endif // LESSARIO_CAMERA_H
