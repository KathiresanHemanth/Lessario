#include <iostream>
#include "core/Engine.h"

int main() {
    // 720p is the sweet spot for GT 710 performance
    Lessario::Engine engine("Lessario Engine v0.1.0", 1280, 720);

    if (!engine.initialize()) {
        std::cerr << "[Lessario] Failed to initialize engine.\n";
        return -1;
    }

    engine.run();
    engine.shutdown();

    return 0;
}
