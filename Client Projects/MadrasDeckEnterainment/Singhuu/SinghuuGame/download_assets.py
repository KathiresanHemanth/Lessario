import urllib.request
import os

print("Starting download script...")

ASSETS_DIR = "WebPrototype/assets/models"
FOX_DIR = "WebPrototype/assets/models/Fox"
TEX_DIR = "WebPrototype/assets/textures"

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(FOX_DIR, exist_ok=True)
os.makedirs(TEX_DIR, exist_ok=True)

files = {
    # Meenukutti -> Parrot
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Parrot.glb": ASSETS_DIR + "/Parrot.glb",
    # Singu -> Horse (Animated Quadruped Placeholder)
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Horse.glb": ASSETS_DIR + "/Horse.glb",
    # Thanthiraa -> Fox (Requires 3 files)
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Fox/glTF/Fox.gltf": FOX_DIR + "/Fox.gltf",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Fox/glTF/Fox.bin": FOX_DIR + "/Fox.bin",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Fox/glTF/Texture.png": FOX_DIR + "/Texture.png",
    # Textures
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/grasslight-big.jpg": TEX_DIR + "/grass.jpg"
}

for url, path in files.items():
    if not os.path.exists(path):
        print(f"Downloading {path.split('/')[-1]}...")
        urllib.request.urlretrieve(url, path)
    else:
        print(f"Already exists: {path}")

print("All 3D Models and Textures downloaded successfully locally!")
