use glam::{Vec2, Vec3};
use gl::types::*;

// A macro to get offset of a struct field
macro_rules! offset_of {
    ($ty:ty, $field:ident) => {
        unsafe { &(*(std::ptr::null::<$ty>())).$field as *const _ as usize }
    }
}

#[repr(C)]
pub struct Vertex {
    pub position: Vec3,
    pub normal: Vec3,
    pub tex_coords: Vec2,
    pub color: Vec3,
}

pub struct Mesh {
    vao: GLuint,
    vbo: GLuint,
    ebo: GLuint,
    indices_count: GLsizei,
}

impl Mesh {
    pub fn new(vertices: &[Vertex], indices: &[u32]) -> Self {
        let mut vao = 0;
        let mut vbo = 0;
        let mut ebo = 0;

        unsafe {
            gl::GenVertexArrays(1, &mut vao);
            gl::GenBuffers(1, &mut vbo);
            gl::GenBuffers(1, &mut ebo);

            gl::BindVertexArray(vao);

            gl::BindBuffer(gl::ARRAY_BUFFER, vbo);
            let size = (vertices.len() * std::mem::size_of::<Vertex>()) as isize;
            gl::BufferData(gl::ARRAY_BUFFER, size, vertices.as_ptr() as *const _, gl::STATIC_DRAW);

            gl::BindBuffer(gl::ELEMENT_ARRAY_BUFFER, ebo);
            let size = (indices.len() * std::mem::size_of::<u32>()) as isize;
            gl::BufferData(gl::ELEMENT_ARRAY_BUFFER, size, indices.as_ptr() as *const _, gl::STATIC_DRAW);

            let stride = std::mem::size_of::<Vertex>() as i32;

            gl::EnableVertexAttribArray(0);
            gl::VertexAttribPointer(0, 3, gl::FLOAT, gl::FALSE, stride, offset_of!(Vertex, position) as *const _);

            gl::EnableVertexAttribArray(1);
            gl::VertexAttribPointer(1, 3, gl::FLOAT, gl::FALSE, stride, offset_of!(Vertex, normal) as *const _);

            gl::EnableVertexAttribArray(2);
            gl::VertexAttribPointer(2, 2, gl::FLOAT, gl::FALSE, stride, offset_of!(Vertex, tex_coords) as *const _);

            gl::EnableVertexAttribArray(3);
            gl::VertexAttribPointer(3, 3, gl::FLOAT, gl::FALSE, stride, offset_of!(Vertex, color) as *const _);

            gl::BindVertexArray(0);
        }

        Self {
            vao,
            vbo,
            ebo,
            indices_count: indices.len() as GLsizei,
        }
    }

    pub fn draw(&self) {
        unsafe {
            gl::BindVertexArray(self.vao);
            gl::DrawElements(gl::TRIANGLES, self.indices_count, gl::UNSIGNED_INT, std::ptr::null());
            gl::BindVertexArray(0);
        }
    }
}

impl Drop for Mesh {
    fn drop(&mut self) {
        unsafe {
            gl::DeleteVertexArrays(1, &self.vao);
            gl::DeleteBuffers(1, &self.vbo);
            gl::DeleteBuffers(1, &self.ebo);
        }
    }
}
