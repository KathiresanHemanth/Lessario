# Google AI Studio — Nama Thala Singhuu: Forest Run
## Prototype Generation Prompt

---

## HOW TO USE THIS IN GOOGLE AI STUDIO

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **"New Prompt"** → Choose **"Code generation"** or a **Gemini 2.5 Pro** model
3. Paste the **SYSTEM PROMPT** block into the **System Instructions** field
4. Paste the **USER PROMPT** block into the chat input
5. Click **Run** — the model will generate a single, self-contained HTML file
6. Click **"Run code"** or copy the output into a `.html` file and open in Chrome

---

## ✅ SYSTEM PROMPT
*(Paste into System Instructions)*

```
You are an expert HTML5 game developer specializing in mobile-first 2D games using vanilla JavaScript and the HTML5 Canvas API. You write clean, well-commented, self-contained single-file HTML games that run in any modern browser without external dependencies.

Your output must ALWAYS be a single complete HTML file with all CSS and JavaScript embedded inline. The game must be immediately playable when the file is opened in a browser with no build step, no npm, no external libraries.

Follow these coding standards:
- Use requestAnimationFrame for the game loop
- Use HTML5 Canvas (2D context) for all rendering
- Keep all game state in a clean JavaScript object
- Support both keyboard (desktop) and touch (mobile) input
- Draw all characters and environments using Canvas primitives (rectangles, circles, arcs, bezier curves) — no external images required for the prototype
- Use vibrant, saturated colors that feel alive and energetic
- Include clear comments explaining each game system
```

---

## 🎮 USER PROMPT
*(Paste into the chat input and send)*

```
Build me a complete, playable HTML5 prototype of "Nama Thala Singhuu: Forest Run" — a 2.5D side-scrolling endless runner game based on a Tamil animated cartoon series for kids (ages 4–12) airing on Chutti TV (Sun Network, Tamil Nadu).

---

## GAME OVERVIEW

**Genre:** Endless Runner with Real-Time Character Swap
**USP:** The player has a party of 3 animal characters and can tap/press a key to swap between them mid-run. Each character has a unique active ability that handles different obstacle types.

---

## CORE MECHANICS

### Runner Loop
- The world scrolls left automatically. Speed increases gradually over time.
- Player can JUMP (swipe up / Space / ArrowUp) to clear ground obstacles
- Player can SLIDE (swipe down / ArrowDown / S) to duck under air obstacles
- If the player collides with an obstacle, the run ends → show score screen

### Character Swap System (THE USP)
- Player carries 3 characters: Singu, Thanthiraa, Meenukutti
- Press TAB (desktop) or tap the character portrait (mobile) to cycle through the party
- Swap has a 2-second cooldown shown as a progress bar under the portrait
- Each character has a different silhouette color so the player always knows who is active

### Active Abilities (press SHIFT or double-tap)
- Singu (Lion, gold): ROYAL ROAR — destroys all obstacles on screen for 2 seconds. Cooldown 8s.
- Thanthiraa (Fox, orange): DASH BURST — invincible forward dash covering 3x normal distance. Cooldown 6s.
- Meenukutti (Bird, cyan): SKY GLIDE — float above all ground obstacles for 3 seconds. Cooldown 7s.

---

## OBSTACLES

Generate obstacles procedurally. Vary the types to require different responses:
1. **Log** (brown rectangle on ground) → JUMP over it
2. **Low Branch** (dark green bar at head height) → SLIDE under it
3. **Rock** (grey pentagon on ground) → JUMP or use ROAR
4. **Charging Buffalo** (dark brown shape rushing from right) → DASH or ROAR clears it
5. **Beehive Drop** (yellow circle falling from top) → move left/right or GLIDE past it

---

## COLLECTIBLES

- **Forest Coins** — small gold circles scattered along the path. Collecting 10 = +1 score multiplier (max 5x).
- **Rare Herb** — glowing green oval. Collecting it triggers a brief 3-second slow-motion effect and +50 bonus points.
- **Power Crystal** — purple diamond. Instantly resets all cooldowns.

---

## CHARACTERS TO DRAW (Canvas Primitives Only)

Draw simplified cartoon animal silhouettes using Canvas shapes:

**Singu (Lion)**
- Body: large gold rectangle (40×30px) with rounded corners
- Head: gold circle (25px) with small triangular ears
- Mane: dark orange arc around the head
- Expression: two white dot eyes, small curved smile

**Thanthiraa (Fox)**
- Body: slim orange rectangle (35×25px)
- Head: pointed orange triangle-ish shape with large ears
- Tail: curved orange arc behind the body with white tip
- Eyes: white dots, alert expression

**Meenukutti (Bird)**
- Body: small cyan teardrop/ellipse (25×20px)
- Wings: two cyan arcs on each side, flapping animation (alternate Y offset each frame)
- Beak: small orange triangle
- Eyes: white dot with black pupil

---

## ENVIRONMENT

Draw a parallax scrolling background with 3 layers (different scroll speeds):
- Layer 1 (slowest, 0.2x): Deep forest silhouette — tall dark green rectangles of varying heights as trees
- Layer 2 (medium, 0.5x): Mid-ground — lighter green rounded treetops
- Layer 3 (fastest, 1x): Ground — a brown/tan strip at the bottom with a bright green grass line on top

Sky: gradient from deep blue (#1a2a4a) at top to warm orange (#f4a261) at horizon — jungle sunrise feel.

---

## HUD (Heads Up Display)

Top left: Current score (white bold text, large)
Top right: Distance run in meters (e.g. "342m")
Bottom left: Stack of 3 character portraits (colored squares with initials S/T/M). Active character has a glowing white border. TAP to swap.
Bottom right: Active ability icon with cooldown ring indicator. Tap to use ability.
Below portrait stack: Swap cooldown bar (fills up over 2 seconds after a swap)

---

## SCREENS

**Start Screen:**
- Title: "Nama Thala Singhuu: Forest Run" in bold Tamil-inspired font styling
- Subtitle: "Tap to Start / Press Space"
- Show all 3 characters animated (bobbing up and down)
- Vibrant forest background

**Game Over Screen:**
- "Run Over!" title
- Show: Distance, Score, Coins collected, Best Distance
- Two buttons: "Play Again" and "Share Score" (share just shows an alert with the score string for prototype)

---

## SCORING

- +1 point every 10 meters run
- +5 per coin collected
- +50 per Rare Herb
- Score multiplier (1x–5x) applied to distance points only
- High score persisted in localStorage

---

## TECHNICAL REQUIREMENTS

- Single HTML file, no external dependencies
- Canvas size: 800×400px, centered on screen, scales to fit mobile viewport
- Target 60fps via requestAnimationFrame
- Touch support: tap upper half = jump, tap lower half = slide, tap character portrait = swap, tap ability icon = use ability
- All game state in a `gameState` object with clear properties
- Restart without page reload

---

Build the complete, fully playable game now. Output only the HTML file. Make it look polished and colorful — this is for Tamil kids so the visuals should be vibrant, joyful, and energetic.
```
