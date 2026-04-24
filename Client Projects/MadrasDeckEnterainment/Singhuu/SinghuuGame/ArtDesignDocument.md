# Art Design Document (ADD): Singhuu Game

> *Art, Audio, and UI/UX Style Guide for "Nama Thala Singhuu: Ekam Run"*

---

## 1. Visual Style Overview

**Art Direction:** Vibrant, stylized 3D with a "Painted Nature" aesthetic.
**Inspiration:** Crash Bandicoot 4, Rayman Origins, modern Disney/Pixar TV series shading.
**Tone:** Energetic, educational, and deeply rooted in Tamil Nadu's Western Ghats biome. It must appeal heavily to children (4-12) without feeling overly juvenile or cheap.

* The world should feel alive, rich in color, and distinctly Indian in flora/fauna.
* Textures use a painterly look rather than hyper-realism.
* Lighting is dynamic with strong use of god rays in the dense canopy, and glowing bioluminescence in caves.

---

## 2. Character Art Guidelines

All characters MUST remain strictly on-model with the *Nama Thala Singhuu* animated TV series.

### Singu (Lion/Raja)
- **Palette:** Warm gold, deep fiery orange mane.
- **Silhouette:** Sturdy, broad-chested, conveying strength and leadership.
- **Animations:** Confident strides, powerful roars, protective gestures.

### Thanthiraa (Fox)
- **Palette:** Burnt orange, sleek white accents.
- **Silhouette:** Lean, sharp angles, conveying speed and cunning.
- **Animations:** Darting movements, agile flips, sly expressions.

### Meenukutti (Kingfisher)
- **Palette:** Iridescent cyan and sapphire blue, bright orange chest.
- **Silhouette:** Streamlined, aerodynamic.
- **Animations:** Flitting wings, sharp hovering, energetic diving.

*All characters share a common "rig skeleton" baseline for generic running, but feature personalized custom animations for abilities (e.g., Singu's Royal Roar vs. Thanthiraa's Dash).*

---

## 3. Environment Art

The environments are built using a modular tile system to support the Endless Runner format. 

### Key Biomes
1. **The Dense Forest:** Rich greens, winding roots, sunlight filtering through canopy leaves.
2. **The Healing Mountain:** Cool greys, morning mist, vibrant rare herbs in hidden corners.
3. **The Valley of Collision:** Golden hour lighting, dust particle effects, wide-open savanna fields.
4. **The Dark Cave:** Deep blue ambiance, glowing crystals, torch-lit pathways.

### Obstacle Readability
- **Hazards** MUST have high contrast with the background. For example, a brown boulder in a brown environment requires a subtle glowing edge or rim lighting so the player spots it instantly at high speeds.

---

## 4. UI / UX Design

### Core Principles
- **Kid-Friendly:** Large, readable buttons. No confusing nested menus.
- **Color Coding:** 
  - Green/Gold: Positive actions (Play, Upgrade, Accept).
  - Red/Orange: Destructive or negative actions (Cancel, Quit).
  - Blue: Informational panels.
- **Iconography:** Use visual icons instead of heavy text where possible. (e.g., an icon of a Wing instead of the word "Glide").

### HUD (Heads Up Display)
- **Top Left:** Current Distance and Coin Count.
- **Top Right:** Pause button (distinct, away from action zones).
- **Bottom:** The Council Swap portraits (3 characters). Tap to swap.
- **Center Screen (Contextual):** Bullet-time question prompts overlay the screen slightly fading the background to ensure readability.

---

## 5. Visual Effects (VFX)

- **Bullet-Time Mode:** When a question pops up, the screen's edges distort slightly (chromatic aberration or a soft vignette), and the color palette shifts to a deeper contrast to focus the player's attention.
- **Ability Casts:** 
  - *Strength (Singu):* Shockwave ripples and rock debris.
  - *Speed (Thanthiraa):* Motion blur trail and wind streaks.
  - *Magic/Healing:* Green particle sparkles and an uplifting aura ring.
- **Collectibles:** Coins spin with a bright glitter effect when collected to provide visceral satisfaction.

---

## 6. Audio Design

### Music
- **Main Theme:** Upbeat, fusion of traditional Tamil folk instruments (Parai, Thavil, Flute) mixed with modern energetic synths.
- **Ingame:** Changes dynamically per biome. E.g., The Valley of Collision uses faster drum beats; The Healing Mountain uses soothing bamboo flutes.

### Sound Effects (SFX)
- **UI:** Crisp, wooden or stone "clack" sounds, avoiding generic sci-fi beeps.
- **Abilities:** Distinct audio cues for each character's ability so the player knows what was activated without looking.
- **Voice Over (VO):** Core catchphrases from the Chutti TV series voice actors used during successful swaps, high-score milestones, and perfect question answers.

---

*Document version: 1.0. Maintained alongside the GDD.*
