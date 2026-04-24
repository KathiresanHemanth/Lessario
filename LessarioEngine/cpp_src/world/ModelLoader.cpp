#include "world/ModelLoader.h"
#include <tiny_gltf.h>
#include <iostream>
#include <glm/gtc/type_ptr.hpp>

#include "core/Mesh.h"
#include "components/Components.h"

namespace Lessario {

    // Forward declare helper to walk hierarchy
    static void processNode(tinygltf::Model& model, int nodeIndex, entt::registry& registry, entt::entity parentEntity, entt::entity& outEntity);

    entt::entity ModelLoader::loadModel(const std::string& path, entt::registry& registry) {
        tinygltf::Model model;
        tinygltf::TinyGLTF loader;
        std::string err;
        std::string warn;

        bool ret = false;
        if (path.find(".glb") != std::string::npos) {
            ret = loader.LoadBinaryFromFile(&model, &err, &warn, path);
        } else {
            ret = loader.LoadASCIIFromFile(&model, &err, &warn, path);
        }

        if (!warn.empty()) std::cout << "[GLTF Warn] " << warn << "\n";
        if (!err.empty())  std::cerr << "[GLTF Error] " << err << "\n";
        if (!ret) return entt::null;

        entt::entity rootEntity = registry.create();
        registry.emplace<TransformComponent>(rootEntity);

        if (model.scenes.empty()) return rootEntity;

        const tinygltf::Scene& scene = model.scenes[model.defaultScene > -1 ? model.defaultScene : 0];
        
        for (int nodeIndex : scene.nodes) {
            entt::entity childEntity = entt::null;
            processNode(model, nodeIndex, registry, rootEntity, childEntity);
            if (childEntity != entt::null) {
                // Link child to root
                registry.emplace<HierarchyComponent>(childEntity, rootEntity);
            }
        }

        return rootEntity;
    }

    static void processNode(tinygltf::Model& model, int nodeIndex, entt::registry& registry, entt::entity parentEntity, entt::entity& outEntity) {
        const tinygltf::Node& node = model.nodes[nodeIndex];
        
        outEntity = registry.create();
        auto& transform = registry.emplace<TransformComponent>(outEntity);

        // Apply local transforms
        if (!node.translation.empty()) transform.Position = glm::vec3(node.translation[0], node.translation[1], node.translation[2]);
        if (!node.scale.empty())       transform.Scale    = glm::vec3(node.scale[0], node.scale[1], node.scale[2]);
        if (!node.rotation.empty()) {
            // GLTF quaternion: x, y, z, w
            glm::quat q(node.rotation[3], node.rotation[0], node.rotation[1], node.rotation[2]);
            transform.Rotation = glm::degrees(glm::eulerAngles(q));
        }

        // Process Mesh
        if (node.mesh > -1) {
            const tinygltf::Mesh& gltfMesh = model.meshes[node.mesh];
            
            // For MVP, just process the first primitive. A robust loader processes them all.
            if (!gltfMesh.primitives.empty()) {
                const tinygltf::Primitive& primitive = gltfMesh.primitives[0];
                
                std::vector<Vertex> vertices;
                std::vector<unsigned int> indices;

                // Position
                if (primitive.attributes.find("POSITION") != primitive.attributes.end()) {
                    const tinygltf::Accessor& posAccessor = model.accessors[primitive.attributes.at("POSITION")];
                    const tinygltf::BufferView& posView = model.bufferViews[posAccessor.bufferView];
                    const float* posData = reinterpret_cast<const float*>(&model.buffers[posView.buffer].data[posAccessor.byteOffset + posView.byteOffset]);
                    
                    for (size_t i = 0; i < posAccessor.count; ++i) {
                        Vertex v;
                        v.Position = glm::vec3(posData[i * 3 + 0], posData[i * 3 + 1], posData[i * 3 + 2]);
                        v.Normal = glm::vec3(0.0f, 1.0f, 0.0f); // Default
                        v.Color = glm::vec3(0.6f);             // Default
                        vertices.push_back(v);
                    }
                }

                // Indices
                if (primitive.indices > -1) {
                    const tinygltf::Accessor& indAccessor = model.accessors[primitive.indices];
                    const tinygltf::BufferView& indView = model.bufferViews[indAccessor.bufferView];
                    const unsigned char* indData = &model.buffers[indView.buffer].data[indAccessor.byteOffset + indView.byteOffset];

                    for (size_t i = 0; i < indAccessor.count; ++i) {
                        if (indAccessor.componentType == TINYGLTF_PARAMETER_TYPE_UNSIGNED_SHORT) {
                            const unsigned short* buf = reinterpret_cast<const unsigned short*>(indData);
                            indices.push_back(buf[i]);
                        } else if (indAccessor.componentType == TINYGLTF_PARAMETER_TYPE_UNSIGNED_INT) {
                            const unsigned int* buf = reinterpret_cast<const unsigned int*>(indData);
                            indices.push_back(buf[i]);
                        }
                    }
                }

                // Create leak-prone new Mesh pointer purely for demonstration logic here.
                // In a real engine, we use AssetManager handling lifetimes. We will construct a smart pointer and attach it to a static registry for now.
                static std::vector<std::unique_ptr<Mesh>> loadedMeshes;
                loadedMeshes.push_back(std::make_unique<Mesh>(vertices, indices));
                
                // Add MeshRendererComponent. NOTE: We lack a persistent loaded Shader here, 
                // so we will rely on Engine loop to override it or use a default one later!
                registry.emplace<MeshRendererComponent>(outEntity, loadedMeshes.back().get(), nullptr, nullptr);
            }
        }

        // Children
        for (int childIndex : node.children) {
            entt::entity childEntity = entt::null;
            processNode(model, childIndex, registry, outEntity, childEntity);
            if (childEntity != entt::null) {
                registry.emplace<HierarchyComponent>(childEntity, outEntity);
            }
        }
    }

} // namespace Lessario
