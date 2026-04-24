#include "core/Texture.h"
#include <glad/glad.h>
#include <stb_image.h>
#include <iostream>

namespace Lessario {

    Texture::Texture(const std::string& path)
        : m_rendererID(0), m_width(0), m_height(0), m_BPP(0) {
        
        stbi_set_flip_vertically_on_load(1);
        unsigned char* localBuffer = stbi_load(path.c_str(), &m_width, &m_height, &m_BPP, 4);

        glGenTextures(1, &m_rendererID);
        glBindTexture(GL_TEXTURE_2D, m_rendererID);

        // Standard texture parameters (repeat wrap, linear filtering)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

        if (localBuffer) {
            glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8, m_width, m_height, 0, GL_RGBA, GL_UNSIGNED_BYTE, localBuffer);
            stbi_image_free(localBuffer);
            std::cout << "[Texture] Loaded: " << path << " (" << m_width << "x" << m_height << ")\n";
        } else {
            std::cerr << "[Texture] Failed to load texture: " << path << std::endl;
        }
    }

    Texture::Texture(int width, int height, unsigned char* data, int channels)
        : m_rendererID(0), m_width(width), m_height(height), m_BPP(channels) {
        
        glGenTextures(1, &m_rendererID);
        glBindTexture(GL_TEXTURE_2D, m_rendererID);

        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

        GLenum format = (channels == 4) ? GL_RGBA : GL_RGB;
        GLenum internalFormat = (channels == 4) ? GL_RGBA8 : GL_RGB8;

        glTexImage2D(GL_TEXTURE_2D, 0, internalFormat, m_width, m_height, 0, format, GL_UNSIGNED_BYTE, data);
    }

    Texture::~Texture() {
        glDeleteTextures(1, &m_rendererID);
    }

    void Texture::bind(unsigned int slot) const {
        glActiveTexture(GL_TEXTURE0 + slot);
        glBindTexture(GL_TEXTURE_2D, m_rendererID);
    }

    void Texture::unbind() const {
        glBindTexture(GL_TEXTURE_2D, 0);
    }

} // namespace Lessario
