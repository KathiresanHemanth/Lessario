cmake_minimum_required(VERSION 3.20)
project(LessarioEngine VERSION 0.1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(MSVC)
    # /W4 and /MP apply to all configs
    add_compile_options(/W4 /MP)
    # Release: max opt + static CRT (/MT) so exported .exe needs no MSVC redistributable
    add_compile_options($<$<CONFIG:Release>:/Ox>)
    add_compile_options($<$<CONFIG:Release>:/Oi>)
    add_compile_options($<$<CONFIG:Release>:/Ot>)
    add_compile_options($<$<CONFIG:Release>:/MT>)
    # Debug: debug symbols + runtime checks (dynamic CRT is fine for dev)
    add_compile_options($<$<CONFIG:Debug>:/Od>)
    add_compile_options($<$<CONFIG:Debug>:/RTC1>)
    add_compile_options($<$<CONFIG:Debug>:/Zi>)
    add_compile_options($<$<CONFIG:Debug>:/MDd>)
endif()

include(FetchContent)

# 1. GLFW (Windowing & Input)
FetchContent_Declare(
  glfw
  GIT_REPOSITORY https://github.com/glfw/glfw.git
  GIT_TAG 3.4
)
set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(glfw)

# 2. GLM (Math)
FetchContent_Declare(
  glm
  GIT_REPOSITORY https://github.com/g-truc/glm.git
  GIT_TAG 1.0.1
)
set(GLM_BUILD_TESTS OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(glm)

# 3. EnTT (ECS)
FetchContent_Declare(
  entt
  GIT_REPOSITORY https://github.com/skypjack/entt.git
  GIT_TAG v3.13.1
)
FetchContent_MakeAvailable(entt)

# 4. GLAD (vendored — OpenGL 3.3 Core, no Python/network required)
add_library(glad STATIC third_party/glad/src/glad.c)
target_include_directories(glad PUBLIC third_party/glad/include)

# 5. ImGui (docking branch — built manually with GLFW + OpenGL3 backends)
FetchContent_Declare(
  imgui
  GIT_REPOSITORY https://github.com/ocornut/imgui.git
  GIT_TAG v1.91.9
)
FetchContent_MakeAvailable(imgui)
add_library(imgui STATIC
    ${imgui_SOURCE_DIR}/imgui.cpp
    ${imgui_SOURCE_DIR}/imgui_draw.cpp
    ${imgui_SOURCE_DIR}/imgui_tables.cpp
    ${imgui_SOURCE_DIR}/imgui_widgets.cpp
    ${imgui_SOURCE_DIR}/backends/imgui_impl_glfw.cpp
    ${imgui_SOURCE_DIR}/backends/imgui_impl_opengl3.cpp
)
target_include_directories(imgui PUBLIC
    ${imgui_SOURCE_DIR}
    ${imgui_SOURCE_DIR}/backends
)
target_link_libraries(imgui PUBLIC glfw glad)

# 6. stb (single-header image loading)
FetchContent_Declare(
  stb
  GIT_REPOSITORY https://github.com/nothings/stb.git
  GIT_TAG master
)
FetchContent_MakeAvailable(stb)

# 7. tinygltf (header-only GLTF model loading)
FetchContent_Declare(
  tinygltf
  GIT_REPOSITORY https://github.com/syoyo/tinygltf.git
  GIT_TAG v2.9.3
)
FetchContent_MakeAvailable(tinygltf)

# 8. Bullet Physics (3D Physics Engine)
FetchContent_Declare(
  bullet3
  GIT_REPOSITORY https://github.com/bulletphysics/bullet3.git
  GIT_TAG        3.25
)
# Disable demos and tests to keep build times lean
set(BUILD_UNIT_TESTS OFF CACHE BOOL "" FORCE)
set(BUILD_CPU_DEMOS OFF CACHE BOOL "" FORCE)
set(BUILD_BULLET2_DEMOS OFF CACHE BOOL "" FORCE)
set(BUILD_EXTRAS OFF CACHE BOOL "" FORCE)
set(INSTALL_LIBS OFF CACHE BOOL "" FORCE)
set(USE_MSVC_RUNTIME_LIBRARY_DLL OFF CACHE BOOL "" FORCE) # Bullet 3 by default tries to force /MT, we want consistency

FetchContent_MakeAvailable(bullet3)

# --- ENGINE CONFIG ---
include_directories(include)
include_directories(${stb_SOURCE_DIR})
include_directories(${tinygltf_SOURCE_DIR})
include_directories(${bullet3_SOURCE_DIR}/src)

# Milestone 1: GLAD ✅  ImGui ✅  Triangle ✅  Camera+3D Mesh ➡️

file(GLOB_RECURSE SOURCES "src/*.cpp")
add_executable(${PROJECT_NAME} ${SOURCES})

# Target Link Libraries
target_link_libraries(${PROJECT_NAME} PRIVATE 
    glfw
    glm::glm
    EnTT::EnTT
    glad
    imgui
    opengl32
    BulletDynamics
    BulletCollision
    LinearMath
)

# Bake the source directory path for finding internal tools like export scripts
target_compile_definitions(${PROJECT_NAME} PRIVATE 
    LESSARIO_PROJECT_DIR="${CMAKE_CURRENT_SOURCE_DIR}"
)

# Copy assets only if the source directory exists
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND}
        -DSRC="${CMAKE_CURRENT_SOURCE_DIR}/assets"
        -DDST="$<TARGET_FILE_DIR:${PROJECT_NAME}>/assets"
        -P "${CMAKE_CURRENT_SOURCE_DIR}/cmake/CopyIfExists.cmake"
    COMMENT "Copying assets to output directory..."
)

# ============================================================
# EXPORT / INSTALL PIPELINE  (cmake --install build --config Release)
# ============================================================
set(CMAKE_INSTALL_PREFIX "${CMAKE_SOURCE_DIR}/export/windows"
    CACHE PATH "Windows export destination" FORCE)

# Install the executable
install(TARGETS ${PROJECT_NAME}
    RUNTIME DESTINATION .
)

# Install assets folder
install(DIRECTORY "${CMAKE_SOURCE_DIR}/assets/"
    DESTINATION assets
    OPTIONAL                          # won't fail if assets/ is empty
)

# Install any runtime DLLs (e.g. if GLFW is built as shared)
install(FILES $<TARGET_RUNTIME_DLLS:${PROJECT_NAME}>
    DESTINATION .
    OPTIONAL
)

# ============================================================
# CPack — produces export/LessarioEngine-win64.zip
# ============================================================
set(CPACK_GENERATOR                 "ZIP")
set(CPACK_PACKAGE_NAME              "LessarioEngine")
set(CPACK_PACKAGE_VERSION           "${PROJECT_VERSION}")
set(CPACK_PACKAGE_VENDOR            "Lessario Studios")
set(CPACK_PACKAGE_DESCRIPTION       "Lessario Engine ${PROJECT_VERSION} — Windows 64-bit")
set(CPACK_PACKAGE_FILE_NAME         "LessarioEngine-${PROJECT_VERSION}-win64")
set(CPACK_INSTALL_CMAKE_PROJECTS    "${CMAKE_BINARY_DIR};${PROJECT_NAME};ALL;/")
set(CPACK_OUTPUT_FILE_PREFIX        "${CMAKE_SOURCE_DIR}/export")
include(CPack)
