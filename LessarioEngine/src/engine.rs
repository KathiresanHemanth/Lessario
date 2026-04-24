use glfw::{Action, Context, Key, WindowEvent};
use hecs::World;
use crate::core_engine::camera::Camera;
use crate::physics::PhysicsSystem;
use crate::vfx::ParticleSystem;

pub struct Engine {
    title: String,
    width: u32,
    height: u32,
    glfw: glfw::Glfw,
    window: Option<glfw::Window>,
    events: Option<std::sync::mpsc::Receiver<(f64, WindowEvent)>>,
    world: World,
    camera: Camera,
    physics: PhysicsSystem,
    particles: ParticleSystem,
    is_running: bool,
}

impl Engine {
    pub fn new(title: &str, width: u32, height: u32) -> Self {
        let glfw = glfw::init(glfw::FAIL_ON_ERRORS).unwrap();

        Self {
            title: title.to_string(),
            width,
            height,
            glfw,
            window: None,
            events: None,
            world: World::new(),
            camera: Camera::new(45.0, width as f32 / height as f32),
            physics: PhysicsSystem::new(),
            particles: ParticleSystem::new(2000),
            is_running: false,
        }
    }

    pub fn initialize(&mut self) -> bool {
        self.glfw.window_hint(glfw::WindowHint::ContextVersion(3, 3));
        self.glfw.window_hint(glfw::WindowHint::OpenGlProfile(glfw::OpenGlProfileHint::Core));

        let (mut window, events) = match self.glfw.create_window(
            self.width,
            self.height,
            &self.title,
            glfw::WindowMode::Windowed,
        ) {
            Some(w) => w,
            None => return false,
        };

        window.make_current();
        window.set_key_polling(true);
        window.set_framebuffer_size_polling(true);
        window.set_cursor_pos_polling(true);
        window.set_mouse_button_polling(true);
        window.set_scroll_polling(true);

        gl::load_with(|symbol| window.get_proc_address(symbol) as *const _);

        unsafe {
            gl::Enable(gl::DEPTH_TEST);
            gl::Enable(gl::BLEND);
            gl::BlendFunc(gl::SRC_ALPHA, gl::ONE_MINUS_SRC_ALPHA);
        }

        self.window = Some(window);
        self.events = Some(events);
        self.is_running = true;

        true
    }

    pub fn run(&mut self) {
        let mut last_time = self.glfw.get_time();

        while self.is_running && !self.window.as_ref().unwrap().should_close() {
            let now = self.glfw.get_time();
            let dt = (now - last_time) as f32;
            last_time = now;

            self.process_input();
            self.update(dt);
            self.render();

            self.window.as_mut().unwrap().swap_buffers();
            self.glfw.poll_events();
        }
    }

    pub fn shutdown(&mut self) {
        // Cleanup resources
    }

    fn process_input(&mut self) {
        if let Some(events) = self.events.take() {
            for (_, event) in glfw::flush_messages(&events) {
                match event {
                    WindowEvent::Key(Key::Escape, _, Action::Press, _) => {
                        self.window.as_mut().unwrap().set_should_close(true);
                    }
                    WindowEvent::FramebufferSize(width, height) => {
                        unsafe { gl::Viewport(0, 0, width, height) };
                        self.camera.set_aspect(width as f32 / height as f32);
                    }
                    _ => {}
                }
            }
            self.events = Some(events);
        }
    }

    fn update(&mut self, dt: f32) {
        self.physics.update(dt);
        self.particles.update(dt);
    }

    fn render(&mut self) {
        unsafe {
            gl::ClearColor(0.05, 0.07, 0.12, 1.0);
            gl::Clear(gl::COLOR_BUFFER_BIT | gl::DEPTH_BUFFER_BIT);
        }
    }
}
