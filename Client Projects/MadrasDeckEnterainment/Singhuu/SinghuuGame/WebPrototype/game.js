// ═══════════════════════════════════════════════════════════
// SINGHUU: EKAM RUN — FULL GAME ENGINE (Three.js)
// v2.0 — GAMEPLAY OVERHAUL: Temple Run / Subway Surfers Parity
// ═══════════════════════════════════════════════════════════

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ─── DOM References ───
const container = document.getElementById('game-container');
const canvas = document.getElementById('gameCanvas');
const introOverlay = document.getElementById('intro-overlay');
const questionOverlay = document.getElementById('question-overlay');
const factPopup = document.getElementById('fact-popup');
const pauseOverlay = document.getElementById('pause-overlay');
const gameoverOverlay = document.getElementById('gameover-overlay');
const reviveOverlay = document.getElementById('revive-overlay');
const hud = document.getElementById('hud');
const distanceEl = document.getElementById('distanceCount');
const coinCountEl = document.getElementById('coinCount');
const hudLives = document.getElementById('hud-lives');
const hudPower = document.getElementById('hud-power');
const hudMultiplier = document.getElementById('hud-multiplier');
const hudCombo = document.getElementById('hud-combo');
const hudMagnet = document.getElementById('hud-magnet');
const nearMissPopup = document.getElementById('near-miss-popup');
const timerFill = document.getElementById('timer-fill');
const questionText = document.getElementById('question-text');
const obstacleHint = document.getElementById('obstacle-hint');
const answersGrid = document.getElementById('answers-grid');
const factResultIcon = document.getElementById('fact-result-icon');
const factText = document.getElementById('fact-text');

// ─── Constants ───
const LANE_WIDTH = 3.5;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
const PLAYER_GROUND_Y = 0.75;
const SPAWN_Z = -180;
const DESPAWN_Z = 15;
const QUESTION_DIST_INTERVAL = 150;
const JUMP_FORCE = 0.38;
const GRAVITY = 0.012;
const SWAP_COOLDOWN = 2000;
const SLIDE_DURATION = 40;      // frames
const MAGNET_RANGE = 6.0;       // coin attraction radius
const REVIVE_COST = 50;
const REVIVE_TIMER_MS = 5000;
const NEAR_MISS_THRESHOLD = 1.8; // distance for "near miss" detection

// ─── Three.js Core ───
const scene = new THREE.Scene();
const skyColor = new THREE.Color(0x33A1FD);
scene.background = skyColor;
scene.fog = new THREE.FogExp2(0x33A1FD, 0.001); // Light fog, prevents washout

const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 300);
camera.position.set(0, 5.5, 9);
camera.lookAt(0, 0, -10);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ─── Post-Processing (Bloom / Cinematic FX) ───
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.9;
bloomPass.strength = 0.5; 
bloomPass.radius = 0.4;
composer.addPass(bloomPass);

// Advanced Anti-Aliasing (since MSAA is lost with EffectComposer)
const smaaPass = new SMAAPass(container.clientWidth * renderer.getPixelRatio(), container.clientHeight * renderer.getPixelRatio());
composer.addPass(smaaPass);

// OutputPass is CRITICAL in r160 — applies tone mapping + sRGB encoding through the composer
const outputPass = new OutputPass();
composer.addPass(outputPass);

// ─── Environment Mapping (HDRI style PBR Reflections from Scene Engine) ───
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
scene.environment = pmremGenerator.fromScene(scene).texture;
scene.environmentIntensity = 0.5;

// ─── Lighting ───
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfffaea, 1.2);
sunLight.position.set(20, 40, -10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1024, 1024);
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 120;
sunLight.shadow.camera.left = -30;
sunLight.shadow.camera.right = 30;
sunLight.shadow.camera.top = 40;
sunLight.shadow.camera.bottom = -20;
scene.add(sunLight);

const hemisphereLight = new THREE.HemisphereLight(0x33A1FD, 0x5CD135, 0.7);
scene.add(hemisphereLight);

// ─── Asset Loaders & Generators ───
const textureLoader = new THREE.TextureLoader();
// Load Super Singhuu Texture
const superSinghuuTex = textureLoader.load('assets/SuperSinghuu_Front.png');
superSinghuuTex.colorSpace = THREE.SRGBColorSpace;
superSinghuuTex.minFilter = THREE.LinearFilter;

// Procedural Stylized Textures (Removes flat rough colors)
function generateNoiseTex(baseColorHex, darkColorHex, patternType = 'noise') {
    const cvs = document.createElement('canvas');
    cvs.width = 128; cvs.height = 128;
    const ctx = cvs.getContext('2d');
    
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, 128, 128);
    
    ctx.fillStyle = darkColorHex;
    for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        if (patternType === 'grass') {
            ctx.fillRect(x, y, 2 + Math.random()*2, 6 + Math.random()*6); // vertical blades
        } else if (patternType === 'wood') {
            ctx.fillRect(x, y, 8 + Math.random()*15, 1.5); // horizontal bark lines
        } else {
            ctx.fillRect(x, y, 2 + Math.random()*3, 2 + Math.random()*3); // generic dirt noise
        }
    }
    
    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

const texDirt = generateNoiseTex('#DBA463', '#C78C46', 'noise');
const texWood = generateNoiseTex('#795548', '#5D4037', 'wood');
const texRock = generateNoiseTex('#7E7E7E', '#555555', 'noise');

const texGrass = textureLoader.load('assets/textures/grass.jpg');
texGrass.colorSpace = THREE.SRGBColorSpace;
texGrass.wrapS = THREE.RepeatWrapping;
texGrass.wrapT = THREE.RepeatWrapping;

// ─── Character Definitions ───
const CHARACTERS = {
    singu: { name: 'Singu', color: 0xFF8C00, secondaryColor: 0xCC7000, domain: 'meat' },
    thanthiraa: { name: 'Thanthiraa', color: 0xD2691E, secondaryColor: 0xFFEBCD, domain: 'fish' },
    meenukutti: { name: 'Meenukutti', color: 0x00BCD4, secondaryColor: 0xFF5722, domain: 'glide' },
    kongini: { name: 'Kongini', color: 0x424242, secondaryColor: 0x212121, domain: 'brain' },
    muttagose: { name: 'Muttagose', color: 0xFFFFFF, secondaryColor: 0xEEEEEE, domain: 'swift' },
    suttapazham: { name: 'Suttapazham', color: 0xC2B280, secondaryColor: 0x8B4513, domain: 'trek' },
    sssaarapaambu: { name: 'Sssaarapaambu', color: 0x4CAF50, secondaryColor: 0x388E3C, domain: 'stealth' },
    jolly: { name: 'Jolly', color: 0xFFD700, secondaryColor: 0xB8860B, domain: 'dig' },
    magizhnan: { name: 'Magizhnan', color: 0x8D6E63, secondaryColor: 0x5D4037, domain: 'craft' }
};

// ─── Game State ───
let gameState = 'MENU';
let distance = 0;
let coins = 0;
let lives = 3;
let baseSpeed = 0.28;
let gameSpeed = baseSpeed;
let bulletTimeScale = 1.0;
let nextQuestionDist = QUESTION_DIST_INTERVAL;
let activeChar = 'singu';
let party = ['singu', 'thanthiraa', 'meenukutti', 'kongini', 'muttagose', 'suttapazham'];
let swapCooldownEnd = 0;

let playerLane = 1;
let playerTargetX = 0;
let playerVelY = 0;
let isJumping = false;
let isGrounded = true;
let screenShakeIntensity = 0;

// ── Slide State ──
let isSliding = false;
let slideTimer = 0;

// ── Combo & Multiplier ──
let comboCount = 0;
let comboTimer = 0;
let bestCombo = 0;
let scoreMultiplier = 1;
let nearMissCount = 0;
let nearMissTimer = 0;

// ── Magnet ──
let magnetActive = false;
let magnetTimer = 0;

// ── Revive ──
let revivesUsed = 0;
let reviveTimerHandle = null;

// ── Speed Lines VFX ──
let speedLines = [];

let activePower = null;
let powerTimer = 0;
let isSuperForm = false; // Tracks Super Singhuu mode

let questionsAsked = 0;
let questionsCorrect = 0;
let factsLearned = [];
let bestDistance = parseInt(localStorage.getItem('singhuu_best') || '0');

let questionBank = [];
let usedQuestionIds = new Set();

let obstacles = [];
let coinObjects = [];
let powerUpObjects = [];
let trees = [];
let particles = [];
let clouds = [];
let birds = [];

const clock = new THREE.Clock();

// ─── Audio ───
let audioCtx = null;
function initAudio() { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playTone(freq, dur, type = 'square', vol = 0.08) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
}
function sfxCoin() { playTone(880, 0.1, 'sine', 0.06); setTimeout(() => playTone(1320, 0.1, 'sine', 0.06), 60); }
function sfxJump() { playTone(300, 0.15, 'triangle', 0.08); playTone(500, 0.1, 'triangle', 0.05); }
function sfxHit() { playTone(100, 0.3, 'sawtooth', 0.1); }
function sfxPower() { playTone(440, 0.1, 'sine', 0.06); playTone(660, 0.1, 'sine', 0.06); playTone(880, 0.15, 'sine', 0.08); }
function sfxSuper() { playTone(400, 0.2, 'sawtooth', 0.1); setTimeout(() => playTone(800, 0.4, 'triangle', 0.15), 100); }
function sfxSwap() { playTone(600, 0.08, 'sine', 0.05); playTone(800, 0.08, 'sine', 0.05); }
function sfxCorrect() { playTone(523, 0.15, 'sine', 0.08); setTimeout(() => playTone(659, 0.1, 'sine', 0.08), 100); setTimeout(() => playTone(784, 0.2, 'sine', 0.1), 200); }
function sfxWrong() { playTone(200, 0.3, 'sawtooth', 0.06); }
function sfxBulletTime() { playTone(150, 0.5, 'sine', 0.04); }
function sfxSlide() { playTone(200, 0.12, 'sine', 0.04); playTone(150, 0.15, 'sine', 0.03); }
function sfxNearMiss() { playTone(1000, 0.05, 'sine', 0.04); playTone(1500, 0.08, 'sine', 0.05); }
function sfxMagnet() { playTone(660, 0.15, 'sine', 0.05); playTone(880, 0.2, 'triangle', 0.04); }
function sfxCombo() { playTone(600 + comboCount * 50, 0.08, 'sine', 0.04); }
function sfxRevive() { playTone(400, 0.15, 'sine', 0.06); playTone(600, 0.15, 'sine', 0.06); playTone(800, 0.2, 'sine', 0.08); }

// ─── Build the 3D World ───

const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(18, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xFFF9C4, fog: false })
);
sunMesh.position.set(40, 60, -250);
scene.add(sunMesh);

const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, flatShading: true });
function createCloud(x, y, z) {
    const group = new THREE.Group();
    const puffGeo = new THREE.SphereGeometry(1, 7, 7);
    for (let i = 0; i < 4; i++) {
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        puff.position.set(i * 1.5 - 2, Math.random() * 0.5, Math.random() * 1.5);
        const s = 1.5 + Math.random() * 2;
        puff.scale.set(s, s*0.6, s);
        group.add(puff);
    }
    group.position.set(x, y, z);
    scene.add(group);
    clouds.push({ mesh: group, speed: 0.01 + Math.random() * 0.02 });
}
for (let i=0; i<8; i++) {
    createCloud((Math.random()-0.5)*150, 30 + Math.random()*20, -Math.random()*200);
}

const groundSegments = [];
function createGroundSegment(z) {
    const group = new THREE.Group();
    
    texDirt.repeat.set(1, 3);
    const road = new THREE.Mesh(new THREE.PlaneGeometry(LANE_WIDTH * 3 + 2, 60), new THREE.MeshStandardMaterial({ map: texDirt, roughness: 1.0 }));
    road.rotation.x = -Math.PI / 2; road.receiveShadow = true; group.add(road);

    texGrass.repeat.set(4, 8);
    const grassMatCustom = new THREE.MeshStandardMaterial({ map: texGrass, roughness: 0.9 });
    const grassL = new THREE.Mesh(new THREE.PlaneGeometry(30, 60), grassMatCustom);
    grassL.rotation.x = -Math.PI / 2; grassL.position.set(-LANE_WIDTH * 1.5 - 16, 0.05, 0); grassL.receiveShadow = true; group.add(grassL);
    
    const grassR = new THREE.Mesh(new THREE.PlaneGeometry(30, 60), grassMatCustom);
    grassR.rotation.x = -Math.PI / 2; grassR.position.set(LANE_WIDTH * 1.5 + 16, 0.05, 0); grassR.receiveShadow = true; group.add(grassR);

    group.position.z = z;
    scene.add(group);
    return group;
}
for (let i = 0; i < 5; i++) groundSegments.push({ mesh: createGroundSegment(-i * 60), z: -i * 60 });

function createTree(x, z) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.5, 6), new THREE.MeshStandardMaterial({ map: texWood, roughness: 0.9 }));
    trunk.position.y = 1.25; trunk.castShadow = true; group.add(trunk);
    
    const leafMat = new THREE.MeshStandardMaterial({ map: texGrass, flatShading: true });
    for (let i = 0; i < 3; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(2.5 - i * 0.5, 2.5, 6), leafMat);
        leaf.position.y = 2.5 + i * 1.2; leaf.castShadow = true; group.add(leaf);
    }
    group.position.set(x, 0, z);
    const scale = 1.0 + Math.random() * 0.8;
    group.scale.set(scale, scale, scale); scene.add(group);
    return group;
}

function populateTrees() {
    for (let z = 0; z > -250; z -= 8) {
        if (Math.random() > 0.3) {
            trees.push({ mesh: createTree((Math.random() > 0.5 ? 1 : -1) * (LANE_WIDTH * 1.5 + 3 + Math.random() * 12), z), z: z });
        }
    }
}
populateTrees();

const birdMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
function spawnBird() {
    const bird = new THREE.Group();
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 4), birdMat); body.rotation.x = Math.PI/2; bird.add(body);
    const wingL = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.2), birdMat); wingL.position.set(-0.3, 0, 0); bird.add(wingL);
    const wingR = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.2), birdMat); wingR.position.set(0.3, 0, 0); bird.add(wingR);
    bird.position.set((Math.random()-0.5)*40, 8 + Math.random()*8, -100 - Math.random()*50); scene.add(bird);
    birds.push({ mesh: bird, wingL, wingR, speed: 0.1 + Math.random() * 0.1, flapRate: 15 + Math.random()*10 });
}
for(let i=0; i<5; i++) spawnBird();

// ─── Speed Lines VFX System ───
const speedLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
function createSpeedLines() {
    for (let i = 0; i < 20; i++) {
        const geo = new THREE.PlaneGeometry(0.03, 3 + Math.random() * 5);
        const line = new THREE.Mesh(geo, speedLineMat.clone());
        line.position.set(
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            -Math.random() * 50 - 5
        );
        line.visible = false;
        scene.add(line);
        speedLines.push({ mesh: line, baseZ: line.position.z, speed: 2 + Math.random() * 3 });
    }
}
createSpeedLines();

// ─── Player Character Mesh ───
let playerGroup = new THREE.Group();
let playerBody, playerHead, playerMane;
// Base materials for swapping back and forth
let baseBodyMaterials = [];

// ─── External 3D Models (GLTF) ───
const gltfLoader = new GLTFLoader();
const externalModels = {};
let foxMixer = null;

function prepareModel(gltf, charKey, scale) {
    const model = gltf.scene;
    // Auto-center or adjust scale
    model.scale.set(scale, scale, scale);
    if(charKey === 'singu') {
        model.rotation.y = Math.PI / 2; // Horse is turned sideways in three.js example
    }
    model.traverse((child) => {
        if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
    });
    externalModels[charKey] = { scene: model, animations: gltf.animations };
}

// Singu -> Horse
gltfLoader.load('assets/models/Horse.glb', (gltf) => {
    prepareModel(gltf, 'singu', 0.006);
    console.log("🦁 Loaded Singu 3D Model");
});
// Thanthiraa -> Flamingo
gltfLoader.load('assets/models/Flamingo.glb', (gltf) => {
    prepareModel(gltf, 'thanthiraa', 0.015);
    console.log("🦊 Loaded Thanthiraa 3D Model");
});
// Meenukutti -> Parrot
gltfLoader.load('assets/models/Parrot.glb', (gltf) => {
    prepareModel(gltf, 'meenukutti', 0.015);
    console.log("🐦 Loaded Meenukutti 3D Model");
});

function buildPlayerMesh(charKey) {
    while (playerGroup.children.length) playerGroup.remove(playerGroup.children[0]);
    const charDef = CHARACTERS[charKey];
    foxMixer = null;

    if (externalModels[charKey]) {
        // Use the downloaded 3D Model!
        const model = externalModels[charKey].scene;
        playerGroup.add(model);
        
        // Setup Animation
        foxMixer = new THREE.AnimationMixer(model);
        const animClip = externalModels[charKey].animations[0];
        if (animClip) {
            const action = foxMixer.clipAction(animClip);
            action.play();
        }
        
        // Mock body geometry to prevent errors on power transformations
        playerBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1)); 
        playerHead = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1));
        baseBodyMaterials = [new THREE.MeshBasicMaterial()];
        playerBody.material = baseBodyMaterials;
        playerBody.visible = false;
        playerHead.visible = false;
        playerGroup.add(playerBody, playerHead);
        
    } else {
        // Fallback to procedural primitives
        const bodyMat = new THREE.MeshStandardMaterial({ color: charDef.color, roughness: 0.6 });
        baseBodyMaterials = [bodyMat, bodyMat, bodyMat, bodyMat, bodyMat, bodyMat];

        playerBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.7), baseBodyMaterials);
        playerBody.position.y = 0.6; playerBody.castShadow = true; playerGroup.add(playerBody);

        playerHead = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), new THREE.MeshStandardMaterial({ color: charDef.color }));
        playerHead.position.y = 1.6; playerHead.castShadow = true; playerGroup.add(playerHead);

        if (charKey === 'singu') {
            playerMane = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 8, 10), new THREE.MeshStandardMaterial({ color: 0xB8860B }));
            playerMane.position.y = 1.6; playerGroup.add(playerMane);
        }
    }
    
    playerGroup.scale.set(1, 1, 1);
    isSuperForm = false;
    playerGroup.position.set(0, PLAYER_GROUND_Y, 0);
    scene.add(playerGroup);
}

buildPlayerMesh('singu');

// ─── VFX ───
let auraRing = null;
function createAura(color) {
    if(auraRing) playerGroup.remove(auraRing);
    auraRing = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.2, 16), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    auraRing.rotation.x = -Math.PI / 2; auraRing.position.y = 0.1; playerGroup.add(auraRing);
}
function removeAura() {
    if(auraRing) { playerGroup.remove(auraRing); auraRing = null; }
}
function spawnParticle(pos, color, count = 8) {
    for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4, transparent: true }));
        mesh.position.copy(pos); scene.add(mesh);
        particles.push({ mesh, vel: new THREE.Vector3((Math.random() - 0.5)*0.3, Math.random()*0.35, (Math.random() - 0.5)*0.3), life: 50 + Math.random() * 20, rotSpeed: Math.random() * 0.15 });
    }
}

// ─── Obstacle Spawning ───
function createObstacle(lane, type) {
    const group = new THREE.Group();
    let hitboxH = 1.4;
    
    if (type === 'boulder') {
        const boulder = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 8), new THREE.MeshStandardMaterial({ map: texRock }));
        boulder.position.y = 0.9; boulder.castShadow = true; group.add(boulder);
    } else if (type === 'log') {
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 3.2, 8), new THREE.MeshStandardMaterial({ map: texWood }));
        log.rotation.z = Math.PI / 2; log.position.y = 0.35; log.castShadow = true; group.add(log);
        hitboxH = 0.7; 
    } else if (type === 'barrier') {
        // NEW: High barrier — must SLIDE under!
        const bar = new THREE.Mesh(
            new THREE.BoxGeometry(3.0, 0.3, 0.3),
            new THREE.MeshStandardMaterial({ color: 0xE53935, metalness: 0.5, roughness: 0.3 })
        );
        bar.position.y = 1.5; bar.castShadow = true; group.add(bar);
        // Posts
        const postMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6 });
        const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6), postMat);
        postL.position.set(-1.3, 0.75, 0); postL.castShadow = true; group.add(postL);
        const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6), postMat);
        postR.position.set(1.3, 0.75, 0); postR.castShadow = true; group.add(postR);
        // Warning stripes
        const stripe = new THREE.Mesh(
            new THREE.BoxGeometry(3.0, 0.08, 0.32),
            new THREE.MeshStandardMaterial({ color: 0xFFD700 })
        );
        stripe.position.y = 1.38; group.add(stripe);
        hitboxH = 2.0; // tall hitbox — only slides dodge it
    }
    group.position.set(LANES[lane], 0, SPAWN_Z);
    scene.add(group);
    obstacles.push({ mesh: group, lane, type, hitboxH, z: SPAWN_Z, scored: false });
}

function createCoin(lane, z) {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 12), new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8 }));
    coin.position.set(LANES[lane], 1.2, z); coin.rotation.x = Math.PI / 2; coin.castShadow = true; scene.add(coin);
    coinObjects.push({ mesh: coin, lane, collected: false });
}

// ── Power-Up Pickups (3D objects on track) ──
function createPowerUp(lane, z, puType) {
    const group = new THREE.Group();
    let color = 0x2196F3;
    let icon = '🧲';
    if (puType === 'magnet') { color = 0x2196F3; icon = '🧲'; }
    else if (puType === 'shield') { color = 0x4CAF50; icon = '🛡️'; }
    else if (puType === 'multiplier') { color = 0xE040FB; icon = '×2'; }

    // Glowing orb
    const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 12, 12),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, transparent: true, opacity: 0.8 })
    );
    orb.position.y = 1.5; group.add(orb);
    // Outer ring
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.05, 8, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
    );
    ring.position.y = 1.5; ring.rotation.x = Math.PI / 2; group.add(ring);

    group.position.set(LANES[lane], 0, z);
    scene.add(group);
    powerUpObjects.push({ mesh: group, lane, type: puType, collected: false, ring });
}

let lastObstacleZ = -30;
let lastCoinZ = -15;
let lastPowerUpDist = 0;

function spawnWorld() {
    if (distance * 10 - lastObstacleZ > 45 + Math.random() * 35) {
        // Choose obstacle type based on distance (progressive difficulty)
        let type;
        const r = Math.random();
        if (distance > 300 && r < 0.25) {
            type = 'barrier'; // Barriers start appearing after 300m
        } else if (r < 0.55) {
            type = 'boulder';
        } else {
            type = 'log';
        }
        const lane = Math.floor(Math.random() * 3);
        createObstacle(lane, type);
        lastObstacleZ = distance * 10;
        
        // Progressive dual-obstacle spawning
        if (distance > 500 && Math.random() > 0.7) {
            let lane2 = (lane + 1 + Math.floor(Math.random() * 2)) % 3;
            createObstacle(lane2, Math.random() > 0.5 ? 'log' : 'barrier');
        }
        // Triple threat at extreme distances
        if (distance > 1200 && Math.random() > 0.85) {
            let lane3 = (lane + 1) % 3;
            createObstacle(lane3, 'boulder');
        }
    }
    if (distance * 10 - lastCoinZ > 15 + Math.random() * 10) {
        const lane = Math.floor(Math.random() * 3);
        const coinCount = 4 + Math.floor(Math.random() * 3); // 4-6 coins in a row
        for (let i = 0; i < coinCount; i++) createCoin(lane, SPAWN_Z + i * 2.5);
        lastCoinZ = distance * 10;
    }
    // Power-up spawning
    if (distance - lastPowerUpDist > 80 + Math.random() * 60) {
        const lane = Math.floor(Math.random() * 3);
        const types = ['magnet', 'shield', 'multiplier'];
        const puType = types[Math.floor(Math.random() * types.length)];
        createPowerUp(lane, SPAWN_Z, puType);
        lastPowerUpDist = distance;
    }
}

// ─── Combo System ───
function addCombo(reason) {
    comboCount++;
    comboTimer = 120; // 2 seconds to chain
    if (comboCount > bestCombo) bestCombo = comboCount;
    
    // Update multiplier based on combo
    if (comboCount >= 20) scoreMultiplier = 4;
    else if (comboCount >= 10) scoreMultiplier = 3;
    else if (comboCount >= 5) scoreMultiplier = 2;
    else scoreMultiplier = 1;

    sfxCombo();
    hudCombo.textContent = `🔥 ${comboCount} COMBO`;
    hudCombo.classList.remove('hidden');
    
    if (scoreMultiplier > 1) {
        hudMultiplier.textContent = `x${scoreMultiplier}`;
        hudMultiplier.classList.remove('hidden');
    }
}

function breakCombo() {
    comboCount = 0;
    comboTimer = 0;
    scoreMultiplier = 1;
    hudCombo.classList.add('hidden');
    hudMultiplier.classList.add('hidden');
}

function showNearMiss() {
    nearMissCount++;
    nearMissTimer = 40;
    addCombo('near_miss');
    sfxNearMiss();
    
    // Show popup (re-trigger animation)
    nearMissPopup.classList.remove('hidden');
    nearMissPopup.style.animation = 'none';
    nearMissPopup.offsetHeight; // trigger reflow
    nearMissPopup.style.animation = null;
    
    // Award bonus coins
    coins += 2 * scoreMultiplier;
    coinCountEl.textContent = coins;
    
    // Bonus particles
    spawnParticle(playerGroup.position.clone(), 0xFFD700, 6);
}

// ─── Question Engine & Powers ───
async function loadQuestions() {
    try {
        const resp = await fetch('questions.json');
        const data = await resp.json();
        questionBank = data.questions;
    } catch (e) {}
}

function getNextQuestion() {
    const available = questionBank.filter(q => !usedQuestionIds.has(q.id));
    if (!available.length) { usedQuestionIds.clear(); return questionBank[0]; }
    return available[Math.floor(Math.random() * available.length)];
}

let currentQuestion = null;
let questionTimerHandle = null;

function triggerBulletTime() {
    gameState = 'BULLET_TIME';
    sfxBulletTime();

    if(!questionBank.length) return;
    currentQuestion = getNextQuestion();
    usedQuestionIds.add(currentQuestion.id);
    questionsAsked++;

    questionText.textContent = currentQuestion.text;
    obstacleHint.textContent = `Obstacle ahead: ${currentQuestion.obstacle}`;
    answersGrid.innerHTML = '';
    [...currentQuestion.answers].sort(() => Math.random() - 0.5).forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn'; btn.textContent = ans.text;
        btn.addEventListener('click', () => handleAnswer(ans, btn));
        answersGrid.appendChild(btn);
    });

    questionOverlay.classList.remove('hidden');
    timerFill.style.transition = 'none'; timerFill.style.width = '100%';
    requestAnimationFrame(() => { timerFill.style.transition = 'width 10s linear'; timerFill.style.width = '0%'; });
    
    clearTimeout(questionTimerHandle);
    questionTimerHandle = setTimeout(() => { if (gameState === 'BULLET_TIME') handleAnswer(null, null); }, 10500);
}

function handleAnswer(answer, btnEl) {
    clearTimeout(questionTimerHandle);
    const isCorrect = answer && answer.correct;
    answersGrid.querySelectorAll('.answer-btn').forEach(b => {
        b.style.pointerEvents = 'none';
        if (currentQuestion.answers.find(a => a.text === b.textContent)?.correct) b.classList.add('correct-pick');
        else if (b === btnEl && !isCorrect) b.classList.add('wrong-pick');
    });

    if (isCorrect) { questionsCorrect++; sfxCorrect(); addCombo('correct_answer'); } else { sfxWrong(); breakCombo(); }

    factsLearned.push(currentQuestion.fact);
    factResultIcon.textContent = isCorrect ? '✅' : '❌';
    factText.textContent = currentQuestion.fact;
    factPopup.classList.remove('hidden');

    setTimeout(() => {
        activatePower(answer ? answer.type : 'grass', isCorrect);
        questionOverlay.classList.add('hidden');
        factPopup.classList.add('hidden');
    }, 2000);
}

function activatePower(type, wasCorrect) {
    // 💥 SUPER SINGUU TRANSFORMATION 💥
    if (wasCorrect && activeChar === 'singu' && type === 'meat') {
        isSuperForm = true;
        // Apply the special 2D Front Face texture
        const frontMat = new THREE.MeshBasicMaterial({ map: superSinghuuTex, transparent: true });
        const newMats = [...baseBodyMaterials];
        newMats[4] = frontMat; // Z-Positive is front face in Three.js Box
        playerBody.material = newMats;
        
        // Scale him up
        playerGroup.scale.set(1.4, 1.4, 1.4);
        playerHead.visible = false; // Hide primitive head to favor texture
        if(playerMane) playerMane.visible = false;
        
        sfxSuper();
        hudPower.textContent = '🔥 SUPER SINGHUU ACTIVE! 🔥';
        createAura(0xFFD700);
        spawnParticle(playerGroup.position.clone(), 0xFFD700, 20);
    } else {
        hudPower.textContent = '⚡ KNOWLEDGE POWER';
        createAura(0x00FFFF);
        sfxPower();
    }

    activePower = type;
    powerTimer = (wasCorrect ? 250 : 100) * (isSuperForm ? 1.5 : 1);
    hudPower.className = 'power-active';
    bulletTimeScale = 1.0;
    gameState = 'PLAYING';
}

function activatePickupPower(puType) {
    if (puType === 'magnet') {
        magnetActive = true;
        magnetTimer = 300; // 5 seconds at 60fps
        hudMagnet.classList.remove('hidden');
        sfxMagnet();
        createAura(0x2196F3);
    } else if (puType === 'shield') {
        activePower = 'shield';
        powerTimer = 300;
        hudPower.textContent = '🛡️ SHIELD ACTIVE';
        hudPower.className = 'power-active';
        sfxPower();
        createAura(0x4CAF50);
    } else if (puType === 'multiplier') {
        scoreMultiplier = Math.min(scoreMultiplier * 2, 8);
        hudMultiplier.textContent = `x${scoreMultiplier}`;
        hudMultiplier.classList.remove('hidden');
        sfxPower();
        spawnParticle(playerGroup.position.clone(), 0xE040FB, 10);
    }
}

function updateLivesUI() {
    hudLives.innerHTML = '';
    for (let i = 0; i < lives; i++) hudLives.innerHTML += '❤️';
}

function swapCharacter(charKey) {
    if (charKey === activeChar || !party.includes(charKey) || Date.now() < swapCooldownEnd) return;
    activeChar = charKey; swapCooldownEnd = Date.now() + SWAP_COOLDOWN;
    buildPlayerMesh(charKey);
    playerGroup.position.set(LANES[playerLane], PLAYER_GROUND_Y + playerVelY * 10, 0);
    document.querySelectorAll('.swap-btn').forEach(b => b.classList.toggle('active-char', b.dataset.char === charKey));
    sfxSwap(); spawnParticle(playerGroup.position.clone(), CHARACTERS[charKey].color, 12);
}

// ─── Input ───
function movePlayerLane(dir) {
    if (gameState !== 'PLAYING' && gameState !== 'BULLET_TIME') return;
    playerLane = Math.max(0, Math.min(2, playerLane + dir));
    playerTargetX = LANES[playerLane];
}
function jumpPlayer() {
    if (!isGrounded || gameState !== 'PLAYING') return;
    if (isSliding) { isSliding = false; slideTimer = 0; } // Cancel slide to jump
    isGrounded = false; isJumping = true; playerVelY = JUMP_FORCE; sfxJump();
    screenShakeIntensity = 0.05;
}
function slidePlayer() {
    if (!isGrounded || isSliding || gameState !== 'PLAYING') return;
    isSliding = true;
    slideTimer = SLIDE_DURATION;
    sfxSlide();
    screenShakeIntensity = 0.03;
}
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') movePlayerLane(-1);
    if (e.key === 'ArrowRight' || e.key === 'd') movePlayerLane(1);
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') jumpPlayer();
    if (e.key === 'ArrowDown' || e.key === 's') slidePlayer();
    if (['1','2','3'].includes(e.key)) swapCharacter(party[parseInt(e.key)-1]);
});
let tsX = 0, tsY = 0;
container.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; tsY = e.touches[0].clientY; }, { passive: true });
container.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tsX, dy = e.changedTouches[0].clientY - tsY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) movePlayerLane(dx > 0 ? 1 : -1);
    else if (dy < -30) jumpPlayer();
    else if (dy > 30) slidePlayer(); // Swipe down to slide!
}, { passive: true });
document.getElementById('jump-btn').addEventListener('click', jumpPlayer);
document.getElementById('slide-btn').addEventListener('click', slidePlayer);
document.querySelectorAll('.swap-btn').forEach(b => b.addEventListener('click', () => swapCharacter(b.dataset.char)));
document.getElementById('play-btn').addEventListener('click', startGame);
document.getElementById('retry-btn').addEventListener('click', startGame);
document.getElementById('pause-btn').addEventListener('click', togglePause);
document.getElementById('resume-btn').addEventListener('click', togglePause);
document.getElementById('quit-btn').addEventListener('click', () => { pauseOverlay.classList.add('hidden'); endGame(); });
document.getElementById('menu-btn').addEventListener('click', () => { gameoverOverlay.classList.add('hidden'); introOverlay.classList.remove('hidden'); });
document.getElementById('revive-btn').addEventListener('click', revivePlayer);
document.getElementById('revive-skip-btn').addEventListener('click', () => { clearTimeout(reviveTimerHandle); reviveOverlay.classList.add('hidden'); endGame(); });

function togglePause() {
    if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        pauseOverlay.classList.remove('hidden');
    } else if (gameState === 'PAUSED') {
        gameState = 'PLAYING';
        pauseOverlay.classList.add('hidden');
    }
}

function startGame() {
    if (!audioCtx) initAudio();
    distance = 0; coins = 0; lives = 3; gameSpeed = baseSpeed; bulletTimeScale = 1.0;
    nextQuestionDist = QUESTION_DIST_INTERVAL;
    playerLane = 1; playerTargetX = LANES[1]; playerVelY = 0; isJumping = false; isGrounded = true;
    isSliding = false; slideTimer = 0;
    comboCount = 0; comboTimer = 0; bestCombo = 0; scoreMultiplier = 1; nearMissCount = 0;
    magnetActive = false; magnetTimer = 0;
    revivesUsed = 0; screenShakeIntensity = 0;
    obstacles.forEach(o => scene.remove(o.mesh)); obstacles = [];
    coinObjects.forEach(c => scene.remove(c.mesh)); coinObjects = [];
    powerUpObjects.forEach(p => scene.remove(p.mesh)); powerUpObjects = [];
    particles.forEach(p => scene.remove(p.mesh)); particles = [];
    removeAura(); activeChar = party[0]; buildPlayerMesh(activeChar);
    introOverlay.classList.add('hidden'); gameoverOverlay.classList.add('hidden'); reviveOverlay.classList.add('hidden');
    hudCombo.classList.add('hidden'); hudMultiplier.classList.add('hidden'); hudMagnet.classList.add('hidden');
    hud.classList.remove('hidden'); updateLivesUI(); gameState = 'PLAYING';
    lastObstacleZ = -30; lastCoinZ = -15; lastPowerUpDist = 0;
}

function triggerRevive() {
    gameState = 'REVIVE_PROMPT';
    hud.classList.add('hidden');
    reviveOverlay.classList.remove('hidden');
    
    const priceEl = document.getElementById('revive-price');
    const cost = REVIVE_COST * (revivesUsed + 1);
    priceEl.textContent = cost;
    
    const reviveBtn = document.getElementById('revive-btn');
    if (coins < cost) {
        reviveBtn.disabled = true;
        reviveBtn.style.opacity = '0.4';
    } else {
        reviveBtn.disabled = false;
        reviveBtn.style.opacity = '1';
    }
    
    // Timer bar countdown
    const fill = document.getElementById('revive-timer-fill');
    fill.style.transition = 'none';
    fill.style.width = '100%';
    requestAnimationFrame(() => {
        fill.style.transition = `width ${REVIVE_TIMER_MS / 1000}s linear`;
        fill.style.width = '0%';
    });
    
    clearTimeout(reviveTimerHandle);
    reviveTimerHandle = setTimeout(() => {
        if (gameState === 'REVIVE_PROMPT') {
            reviveOverlay.classList.add('hidden');
            endGame();
        }
    }, REVIVE_TIMER_MS + 200);
}

function revivePlayer() {
    clearTimeout(reviveTimerHandle);
    const cost = REVIVE_COST * (revivesUsed + 1);
    if (coins < cost) return;
    
    coins -= cost;
    coinCountEl.textContent = coins;
    revivesUsed++;
    lives = 1;
    
    reviveOverlay.classList.add('hidden');
    hud.classList.remove('hidden');
    updateLivesUI();
    
    // Clear nearby obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].mesh.position.z > -20) {
            scene.remove(obstacles[i].mesh);
            obstacles.splice(i, 1);
        }
    }
    
    sfxRevive();
    spawnParticle(playerGroup.position.clone(), 0x4CAF50, 15);
    createAura(0x4CAF50);
    screenShakeIntensity = 0.2;
    
    // Brief invincibility
    activePower = 'shield';
    powerTimer = 120;
    hudPower.textContent = '🛡️ REVIVE SHIELD';
    hudPower.className = 'power-active';
    
    gameState = 'PLAYING';
}

function endGame() {
    gameState = 'GAMEOVER'; hud.classList.add('hidden');
    
    // Update best distance
    const isNewBest = Math.floor(distance) > bestDistance;
    if (isNewBest) {
        bestDistance = Math.floor(distance);
        localStorage.setItem('singhuu_best', bestDistance.toString());
    }
    
    document.getElementById('go-distance').textContent = Math.floor(distance) + 'm';
    document.getElementById('go-coins').textContent = coins;
    document.getElementById('go-correct').textContent = `${questionsCorrect}/${questionsAsked}`;
    document.getElementById('go-best').textContent = bestDistance + 'm';
    document.getElementById('go-combo').textContent = bestCombo;
    document.getElementById('go-nearmiss').textContent = nearMissCount;
    
    const newBestEl = document.getElementById('go-new-best');
    if (isNewBest) { newBestEl.classList.remove('hidden'); } else { newBestEl.classList.add('hidden'); }
    
    // Populate learned facts
    const learnedList = document.getElementById('learned-list');
    learnedList.innerHTML = '';
    factsLearned.slice(-5).forEach(f => { const li = document.createElement('li'); li.textContent = f; learnedList.appendChild(li); });
    
    gameoverOverlay.classList.remove('hidden'); sfxHit();
}

// ─── Main Update Loop ───
function update() {
    if (gameState === 'PAUSED' || gameState === 'MENU' || gameState === 'GAMEOVER' || gameState === 'REVIVE_PROMPT') return;

    if (gameState === 'BULLET_TIME') {
        bulletTimeScale = Math.max(0.001, bulletTimeScale - 0.05); // Essentially paused
    }

    const effectiveSpeed = gameSpeed * bulletTimeScale;

    if (gameState === 'PLAYING' || gameState === 'BULLET_TIME') {
        distance += effectiveSpeed;
        distanceEl.textContent = Math.floor(distance);
        gameSpeed = baseSpeed + (distance / 4000);

        if (distance >= nextQuestionDist && gameState === 'PLAYING') {
            triggerBulletTime();
            nextQuestionDist = distance + QUESTION_DIST_INTERVAL;
        }

        playerGroup.position.x += (playerTargetX - playerGroup.position.x) * 0.15;

        // ── Jump Physics ──
        if (isJumping) {
            playerVelY -= GRAVITY;
            playerGroup.position.y += playerVelY;
            if (playerGroup.position.y <= PLAYER_GROUND_Y) {
                playerGroup.position.y = PLAYER_GROUND_Y;
                playerVelY = 0; isJumping = false; isGrounded = true;
                screenShakeIntensity = 0.12;
                spawnParticle(playerGroup.position.clone(), 0xaaaaaa, 4);
            }
        }

        // ── Slide Mechanic ──
        if (isSliding) {
            slideTimer--;
            // Squash player visually
            playerGroup.scale.y = 0.4;
            playerGroup.position.y = PLAYER_GROUND_Y * 0.4;
            if (slideTimer <= 0) {
                isSliding = false;
                playerGroup.scale.y = isSuperForm ? 1.4 : 1.0;
                playerGroup.position.y = PLAYER_GROUND_Y;
            }
        }

        if (isGrounded && !isSuperForm && !isSliding) {
            playerBody.position.y = 0.6 + Math.sin(clock.getElapsedTime() * 10) * 0.05;
        }

        // ── Combo Timer ──
        if (comboTimer > 0) {
            comboTimer--;
            if (comboTimer <= 0) breakCombo();
        }

        // ── Magnet Timer ──
        if (magnetTimer > 0) {
            magnetTimer--;
            if (magnetTimer <= 0) {
                magnetActive = false;
                hudMagnet.classList.add('hidden');
            }
        }

        // ── Near Miss Timer (popup display) ──
        if (nearMissTimer > 0) {
            nearMissTimer--;
            if (nearMissTimer <= 0) nearMissPopup.classList.add('hidden');
        }

        if (powerTimer > 0) {
            powerTimer -= bulletTimeScale;
            if (auraRing) auraRing.rotation.z += 0.05;
            if (powerTimer <= 0) {
                activePower = null; removeAura(); hudPower.className = 'power-inactive';
                hudPower.textContent = 'No Power';
                
                // Revert Super Singhuu
                if(isSuperForm) {
                    isSuperForm = false;
                    playerGroup.scale.set(1.0, 1.0, 1.0);
                    playerHead.visible = true;
                    if(playerMane) playerMane.visible = true;
                    playerBody.material = baseBodyMaterials;
                    spawnParticle(playerGroup.position.clone(), 0xFFFFFF, 10);
                }
            }
        }

        clouds.forEach(c => {
            c.mesh.position.z += effectiveSpeed * 0.2; c.mesh.position.x += c.speed;
            if(c.mesh.position.z > 20) { c.mesh.position.z = -200; c.mesh.position.x = (Math.random()-0.5)*150; }
        });
        birds.forEach(b => {
            b.mesh.position.z += effectiveSpeed * 0.5 + 0.1;
            b.wingL.rotation.z = Math.sin(clock.getElapsedTime() * b.flapRate) * 0.5;
            b.wingR.rotation.z = -Math.sin(clock.getElapsedTime() * b.flapRate) * 0.5;
            if(b.mesh.position.z > 20) { b.mesh.position.z = -150 - Math.random()*100; b.mesh.position.x = (Math.random()-0.5)*40; }
        });

        // ── Obstacles: Collision, Near-Miss, and Power Interaction ──
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            obs.mesh.position.z += effectiveSpeed * 1.5;

            // Near-miss detection (obstacle passes player without hitting)
            if (!obs.scored && obs.mesh.position.z > 1.0 && obs.mesh.position.z < 3.0) {
                const horizontalDist = Math.abs(LANES[obs.lane] - playerGroup.position.x);
                if (horizontalDist < NEAR_MISS_THRESHOLD && horizontalDist > 0.8) {
                    showNearMiss();
                }
                obs.scored = true;
            }

            // Safe interaction - No damage during slowdown
            if (effectiveSpeed > 0.01 && obs.mesh.position.z > -1.5 && obs.mesh.position.z < 1.0) {
                const horizontalHit = Math.abs(LANES[obs.lane] - playerGroup.position.x) < (isSuperForm ? 1.8 : 1.2);
                
                // Barrier handling: slides dodge, jumps don't help
                let verticalHit;
                if (obs.type === 'barrier') {
                    verticalHit = !isSliding; // Only sliding dodges barriers
                } else {
                    verticalHit = playerGroup.position.y < PLAYER_GROUND_Y + obs.hitboxH;
                }

                if (horizontalHit && verticalHit) {
                    if (activePower === 'meat' || activePower === 'stealth' || activePower === 'shield' || isSuperForm) {
                        spawnParticle(obs.mesh.position.clone(), 0x888888, 15);
                        scene.remove(obs.mesh); obstacles.splice(i, 1);
                        addCombo('smash');
                        screenShakeIntensity = 0.15;
                        continue;
                    } else {
                        lives--; updateLivesUI(); sfxHit();
                        spawnParticle(playerGroup.position.clone(), 0xFF0000, 10);
                        scene.remove(obs.mesh); obstacles.splice(i, 1);
                        screenShakeIntensity = 0.25;
                        breakCombo();
                        if (lives <= 0) {
                            triggerRevive();
                            return;
                        }
                        continue;
                    }
                }
            }
            if (obs.mesh.position.z > DESPAWN_Z) { scene.remove(obs.mesh); obstacles.splice(i, 1); }
        }

        // ── Coins: Collection with Magnet ──
        for (let i = coinObjects.length - 1; i >= 0; i--) {
            const coin = coinObjects[i];
            coin.mesh.position.z += effectiveSpeed * 1.5; coin.mesh.rotation.y += 0.08;

            // Magnet attraction
            if (magnetActive) {
                const dx = playerGroup.position.x - coin.mesh.position.x;
                const dz = playerGroup.position.z - coin.mesh.position.z;
                const dy = playerGroup.position.y - coin.mesh.position.y;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                if (dist < MAGNET_RANGE) {
                    const pullForce = 0.15 * (1 - dist / MAGNET_RANGE);
                    coin.mesh.position.x += dx * pullForce;
                    coin.mesh.position.y += dy * pullForce;
                    coin.mesh.position.z += dz * pullForce;
                }
            }

            const collectRadius = isSuperForm ? 2.0 : (magnetActive ? 1.8 : 1.0);
            if (Math.abs(coin.mesh.position.x - playerGroup.position.x) < collectRadius && Math.abs(coin.mesh.position.z) < 1.5 && Math.abs(coin.mesh.position.y - playerGroup.position.y) < 2.0) {
                coins += scoreMultiplier;
                coinCountEl.textContent = coins; sfxCoin();
                addCombo('coin');
                scene.remove(coin.mesh); coinObjects.splice(i, 1); continue;
            }
            if (coin.mesh.position.z > DESPAWN_Z) { scene.remove(coin.mesh); coinObjects.splice(i, 1); }
        }

        // ── Power-Up Pickups ──
        for (let i = powerUpObjects.length - 1; i >= 0; i--) {
            const pu = powerUpObjects[i];
            pu.mesh.position.z += effectiveSpeed * 1.5;
            if (pu.ring) pu.ring.rotation.z += 0.04; // Spin the ring

            if (Math.abs(pu.mesh.position.x - playerGroup.position.x) < 1.5 && Math.abs(pu.mesh.position.z) < 2.0) {
                activatePickupPower(pu.type);
                spawnParticle(pu.mesh.position.clone(), 0x2196F3, 12);
                scene.remove(pu.mesh); powerUpObjects.splice(i, 1); continue;
            }
            if (pu.mesh.position.z > DESPAWN_Z) { scene.remove(pu.mesh); powerUpObjects.splice(i, 1); }
        }

        groundSegments.forEach(seg => { seg.mesh.position.z += effectiveSpeed * 1.5; if (seg.mesh.position.z > 60) seg.mesh.position.z -= 300; });
        trees.forEach(t => { t.mesh.position.z += effectiveSpeed * 1.5; if (t.mesh.position.z > 20) { t.mesh.position.z -= 250; t.mesh.position.x = (Math.random() > 0.5 ? 1 : -1) * (LANE_WIDTH * 1.5 + 3 + Math.random() * 12); } });

        spawnWorld();
    }

    // ── Particles ──
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.mesh.position.add(p.vel); p.vel.y -= 0.005; p.life--;
        p.mesh.material.opacity = p.life / 50;
        p.mesh.rotation.x += p.rotSpeed;
        p.mesh.rotation.z += p.rotSpeed;
        const s = 1.0 + (1 - p.life / 50) * 0.5;
        p.mesh.scale.set(s, s, s);
        if (p.life <= 0) { scene.remove(p.mesh); particles.splice(i, 1); }
    }

    // ── Speed Lines VFX ──
    const showSpeedLines = gameSpeed > baseSpeed * 1.5 && gameState === 'PLAYING';
    speedLines.forEach(sl => {
        if (showSpeedLines) {
            sl.mesh.visible = true;
            sl.mesh.position.z += sl.speed;
            sl.mesh.material.opacity = Math.min(0.2, (gameSpeed / baseSpeed - 1.5) * 0.1);
            if (sl.mesh.position.z > 5) sl.mesh.position.z = sl.baseZ;
        } else {
            sl.mesh.visible = false;
        }
    });

    // ── Camera with Dynamic FOV, Shake & Follow ──
    let targetFov = 65;
    if (gameState === 'PLAYING') {
        targetFov = 65 + Math.min((gameSpeed - baseSpeed) * 30, 25);
        if (isSuperForm) targetFov += 15;
        if (isSliding) targetFov += 5;
    }
    camera.fov += (targetFov - camera.fov) * 0.1;
    camera.updateProjectionMatrix();

    camera.position.x += (playerGroup.position.x * 0.25 - camera.position.x) * 0.05;
    if (gameState === 'BULLET_TIME') {
        camera.position.y += (6 - camera.position.y) * 0.03;
        camera.position.z += (11 - camera.position.z) * 0.03;
    } else {
        camera.position.y += (5.5 - camera.position.y) * 0.05;
        camera.position.z += (9 - camera.position.z) * 0.05;
    }

    // Screen Shake
    if (screenShakeIntensity > 0) {
        const sx = (Math.random() - 0.5) * screenShakeIntensity;
        const sy = (Math.random() - 0.5) * screenShakeIntensity;
        camera.position.x += sx;
        camera.position.y += sy;
        screenShakeIntensity *= 0.88;
        if (screenShakeIntensity < 0.005) screenShakeIntensity = 0;
    }

    camera.lookAt(playerGroup.position.x * 0.2, 1, -10);
    
    // Update external 3D model animations
    if (foxMixer && (gameState === 'PLAYING' || gameState === 'BULLET_TIME')) {
        foxMixer.update(clock.getDelta() * bulletTimeScale * (effectiveSpeed / baseSpeed));
    } else {
        clock.getDelta(); // clear delta
    }
}

function animate() { requestAnimationFrame(animate); update(); composer.render(); }
window.addEventListener('resize', () => { camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); composer.setSize(container.clientWidth, container.clientHeight); });
loadQuestions().then(() => { animate(); });
