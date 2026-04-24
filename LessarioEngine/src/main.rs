mod engine;
mod core_engine;
mod components;
mod physics;
mod vfx;
mod world;

use engine::Engine;

fn main() {
    let mut engine = Engine::new("Lessario Engine v0.1.0", 1280, 720);

    if !engine.initialize() {
        eprintln!("[Lessario] Failed to initialize engine.");
        return;
    }

    engine.run();
    engine.shutdown();
}
