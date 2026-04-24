pub struct Shader;
impl Shader {
    pub fn new(_vs: &str, _fs: &str) -> Self { Self }
    pub fn bind(&self) {}
    pub fn unbind(&self) {}
}

pub struct Texture;
impl Texture {
    pub fn new(_path: &str) -> Self { Self }
    pub fn bind(&self, _slot: u32) {}
}
