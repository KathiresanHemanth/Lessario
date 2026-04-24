use glam::{Mat4, Quat, Vec3};
use hecs::Entity;

pub struct TransformComponent {
    pub position: Vec3,
    pub rotation: Vec3, // Euler angles
    pub scale: Vec3,
}

impl TransformComponent {
    pub fn new(position: Vec3) -> Self {
        Self {
            position,
            rotation: Vec3::ZERO,
            scale: Vec3::ONE,
        }
    }

    pub fn get_transform(&self) -> Mat4 {
        Mat4::from_scale_rotation_translation(
            self.scale,
            Quat::from_euler(glam::EulerRot::XYZ, self.rotation.x, self.rotation.y, self.rotation.z),
            self.position,
        )
    }
}

pub struct HierarchyComponent {
    pub parent: Entity,
}

pub struct MeshRendererComponent {
    pub mesh_id: usize,
    pub shader_id: usize,
    pub texture_id: Option<usize>,
}

pub struct RigidBodyComponent {
    // Stores handle to rapier rigidbody
    pub handle: rapier3d::dynamics::RigidBodyHandle,
}

pub struct ColliderComponent {
    // Stores handle to rapier collider
    pub handle: rapier3d::geometry::ColliderHandle,
}
