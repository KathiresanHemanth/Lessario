use glam::{Mat4, Vec3};

pub struct Camera {
    position: Vec3,
    front: Vec3,
    up: Vec3,
    right: Vec3,
    world_up: Vec3,
    yaw: f32,
    pitch: f32,
    fov: f32,
    aspect: f32,
}

impl Camera {
    pub fn new(fov: f32, aspect: f32) -> Self {
        let mut cam = Self {
            position: Vec3::new(0.0, 0.0, 3.0),
            front: Vec3::new(0.0, 0.0, -1.0),
            up: Vec3::Y,
            right: Vec3::X,
            world_up: Vec3::Y,
            yaw: -90.0,
            pitch: 0.0,
            fov,
            aspect,
        };
        cam.update_vectors();
        cam
    }

    pub fn set_aspect(&mut self, aspect: f32) {
        self.aspect = aspect;
    }

    pub fn position(&self) -> Vec3 {
        self.position
    }

    pub fn view(&self) -> Mat4 {
        Mat4::look_at_rh(self.position, self.position + self.front, self.up)
    }

    pub fn projection(&self) -> Mat4 {
        Mat4::perspective_rh_gl(self.fov.to_radians(), self.aspect, 0.1, 100.0)
    }

    pub fn zoom(&mut self, yoffset: f32) {
        self.fov -= yoffset;
        if self.fov < 1.0 { self.fov = 1.0; }
        if self.fov > 45.0 { self.fov = 45.0; }
    }

    pub fn orbit(&mut self, xoffset: f32, yoffset: f32) {
        self.yaw += xoffset;
        self.pitch += yoffset;

        if self.pitch > 89.0 { self.pitch = 89.0; }
        if self.pitch < -89.0 { self.pitch = -89.0; }

        self.update_vectors();
    }

    fn update_vectors(&mut self) {
        let front = Vec3::new(
            self.yaw.to_radians().cos() * self.pitch.to_radians().cos(),
            self.pitch.to_radians().sin(),
            self.yaw.to_radians().sin() * self.pitch.to_radians().cos(),
        );
        self.front = front.normalize();
        self.right = self.front.cross(self.world_up).normalize();
        self.up = self.right.cross(self.front).normalize();
    }
}
