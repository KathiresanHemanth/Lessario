#ifndef LESSARIO_MODELLOADER_H
#define LESSARIO_MODELLOADER_H

#include <string>
#include <entt/entt.hpp>

namespace Lessario {

    class ModelLoader {
    public:
        // Load a GLTF/GLB model into the Scene Graph governed by the given registry.
        // Returns the root entity of the loaded model.
        static entt::entity loadModel(const std::string& path, entt::registry& registry);
    };

} // namespace Lessario

#endif // LESSARIO_MODELLOADER_H
