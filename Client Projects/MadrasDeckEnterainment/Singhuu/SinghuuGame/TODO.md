# Singhuu: Ekam Run — Development Roadmap & TODO

> *Tracking development from Web Prototype to Android/iOS Production.*

---

## 🟢 Milestone 1: Core Mechanics (Web Prototype)
*The goal is to prove the 'Ekam System' works and feels fun in a browser.*

- [x] **Project Initialization** (Git repo, GDD, Technical stack)
- [x] **Basic 3D Engine** (Three.js setup, 3D lane system)
- [x] **Character Control** (Lane swapping via swipe/keys)
- [x] **Bullet-Time Logic** (Dynamic time-scaling when questions trigger)
- [x] **Ekam Trinity System** (Answer mapping to active gameplay powers)
- [x] **Dynamic Question Engine** (Randomize questions from a JSON bank)
- [x] **Basic Obstacle Variety** (Add jumping mechanics and different hazard types)

---

## 🟠 Milestone 2: Technical Art & Polish (Web Prototype)
*Bringing the "Chutti TV" aesthetic to the browser for external showcase.*

- [x] **Character Model Implementation** (Procedurally generated 3D primitives for Singu/Thanthiraa/Meenukutti to serve as placeholders for final Maya models)
- [x] **Environment Decoration** (Procedural forest tiles, trees, and path variations)
- [x] **UI/UX Refinement** (Finalize the HUD, buttons, and question styling)
- [x] **VFX Overhaul** (Speed trails, smash effects, and power-up auras)
- [x] **Audio Integration** (Web Audio synthesized runner music, and bullet-time SFX)

---

## 🟡 Milestone 3: Vertical Slice (PC Showcase)
*Final high-fidelity version of the prototype meant for pitching to Sun Network.*

- [x] **Full Game Loop** (Start menu → Run → Stats → Play again)
- [x] **Performance Optimization** (Stable 60fps on average hardware)
- [x] **Character Swapping** (Implement the 'Council' system—swap between characters)
- [x] **Offline 3D Models** (Local GLTFLoader parsing for Horse, Flamingo, Parrot)
- [ ] **Full Character Roster Expansion** (Add Kongini, Muttagose, Suttapazham, Sssaarapaambu, Jolly, Magizhnan to selection pool)
- [ ] **Advanced Three.js Post-Processing** (UnrealBloomPass, SMAA, cinematic shaders)
- [ ] **Intro/Outro Scenes** (Cinematic story intro to frame the forest rescue)

---

## 🔴 Milestone 4: Production Export (Android Alpha)
*Transitioning the logic from Web to Unity or your custom engine for Mobile.*

- [ ] **Engine Porting** (Rewrite core logic for native Mobile performance)
- [ ] **Mobile Control Optimization** (Fine-tuning swipe sensitivity and haptics)
- [ ] **Android SDK Integration** (Google Play Services, Cloud Saves)
- [ ] **Initial Monetization** (Implement Rewarded Ads for extra lives)

---

## 🚀 Milestone 5: Global Launch & Scaling
*Post-launch content and cross-platform release.*

- [ ] **Episode Sync** (Weekly question pack updates tied to TV air dates)
- [ ] **iOS Conversion** (Optimization for Apple Metal and App Store release)
- [ ] **Progression System** (Character leveling and skill trees)
- [ ] **In-App Shop** (Cosmetic skins and question pack purchases)

---

### Current Focus:
**Streamlined Singhuu Experience:** 
- Simplify the main menu to only feature **Start** and **Exit** buttons. 
- Remove the character swap system and focus entirely on a single playable character: **Singhuu**. 
- Implement a transformation mechanic where Singhuu transforms into **Super Singhuu** after answering a question correctly.
- **Pending Asset Integration:** Awaiting rigged 3D models for Singhuu and Super Singhuu from the user. Will generate animations via Mixamo if needed.
