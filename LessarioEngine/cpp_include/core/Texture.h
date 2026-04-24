#ifndef LESSARIO_TEXTURE_H
#define LESSARIO_TEXTURE_H

#include <string>

namespace Lessario {

    class Texture {
    public:
        // Load a texture from file (JPG, PNG, etc using stb_image)
        Texture(const std::string& path);
        
        // Create an empty texture or manual texture from data
        Texture(int width, int height, unsigned char* data, int channels = 4);
        
        ~Texture();

        void bind(unsigned int slot = 0) const;
        void unbind() const;

        unsigned int getID() const { return m_rendererID; }
        int getWidth() const { return m_width; }
        int getHeight() const { return m_height; }

    private:
        unsigned int m_rendererID;
        int m_width, m_height, m_BPP; // Bits per pixel
    };

} // namespace Lessario

#endif // LESSARIO_TEXTURE_H
