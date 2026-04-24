#ifndef LESSARIO_WATER_H
#define LESSARIO_WATER_H

#include "core/Mesh.h"
#include <memory>

namespace Lessario {

    class Water {
    public:
        // size: total width/depth. resolution: number of quads per side
        static std::unique_ptr<Mesh> generatePlane(float size, int resolution);
        
        static const char* getVertexShaderSource();
        static const char* getFragmentShaderSource();
    };

}

#endif // LESSARIO_WATER_H
