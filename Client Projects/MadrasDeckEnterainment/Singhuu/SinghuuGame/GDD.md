# Singhuu: Ekam Run
**Game Design Document (GDD) v3.0**

> *Ekam (ஏகம்) — Tamil for "One/Unity". Knowledge and action are one.*
> *Based on the "Nama Thala Singhuu" AI-animated series on Sun Network's Chutti TV.*

---

## 1. Game Overview

| Aspect | Detail |
|--------|--------|
| **Title** | Singhuu: Ekam Run |
| **Genre** | Endless Runner × Edugaming (Knowledge = Power) |
| **Platform** | Web (Prototyping) → Mobile: Android First, iOS Later (Scaling) |
| **Target Audience** | Children aged 4–12 (Chutti TV viewers, Tamil Nadu) |
| **Theme** | Forest conservation, Tamil wildlife, animal ecology |
| **Revenue Model** | Free-to-Play + Rewarded Ads + Question Pack IAP |
| **Engine** | Three.js (Web prototype) → Unity (production) |
| **USP** | **The Ekam System** — your answer to a trivia question becomes your gameplay power, mapped to real-world properties |

---

## 2. The Core Innovation — The Ekam System

> **"The game where knowledge is literally your weapon."**

No existing kids' game links trivia answers to *contextual, real-world-property-based gameplay effects*. This is the differentiator.

### How It Works

Every ~200m the world doesn't completely pause; instead, it enters "bullet time" (extreme slow-motion) and a question appears on-screen. The player must act quickly without losing the flow of the run. The answer the player selects **immediately becomes an active power** for the next stretch of obstacles — not just "right/wrong" but *what that answer actually is in the real world*.

```
❓ QUESTION: "What does Singu the lion eat?"
🪨 OBSTACLE AHEAD: Giant Boulder

🟢 Meat    → 💪 STRENGTH SURGE   — smashes boulder directly      ✅ Perfect
🐟 Fish    → ⚡ SPEED BURST       — too fast to aim, slides past
🌿 Grass   → 🐢 SLOW + WEAK      — can't break it, must detour
🍎 Fruits  → ❤️ HEALTH REGEN     — heals but boulder stays
```

The **correct answer** gives the **perfect power** for the upcoming obstacle. Wrong answers give **real but mismatched powers** — survivable but harder.

### Answer → Property → Power Mapping

| Answer Category | Real-World Property | In-Game Power |
|----------------|---------------------|---------------|
| Meat / Protein | Builds muscle strength | 💪 Strength — smash rocks and walls |
| Grass / Leaves | Slow plant digestion | 🐢 Slow-mo — time slows briefly |
| Fish / Seafood | Fast-burning energy | ⚡ Speed burst — sprint through gaps |
| Fruits / Sugar | Quick energy heal | ❤️ Health regen — recover a life |
| Wings / Air | Flight adaptation | 🕊️ Glide — float over pits and gaps |
| Roots / Underground | Hidden/camouflage | 🌑 Stealth — phase through 1 obstacle |
| Sun / Heat | High energy source | ☀️ Score multiplier — coins doubled |
| Water / Rain | Growth and hydration | 🌿 Path bloom — new route appears |
| Speed animal | Fast movement | 🏃 Dash — sprint segment unlocked |
| Night animal | Darkness adaptation | 🔦 Echolocate — dark cave lit up |

---

## 3. Narrative Frame

The Western Ghats forest is under threat — deforestation, pollution, and confused wild herds are causing chaos. Singhuu and the Council must run deeper into the forest every day to solve crises before sundown. The further they run, the more dangerous it gets. Only a Raja who **knows his forest** can survive.

> Every day = one endless run. The forest never ends. Neither does the learning.

---

## 4. Core Gameplay Loop

```
RUN STARTS
    ↓
Sprint through procedural jungle (3 lanes → obstacles, coins)
    ↓
~200m mark → QUESTION SLOW-MO (5-second bullet time window)
    ↓
Player picks answer → POWER ACTIVATES for next ~200m stretch
    ↓
Obstacles designed to match the power context
    ↓
Power expires → back to raw running → next question approaches
    ↓
3 lives lost → RUN ENDS → Best distance / score / learning summary
    ↓
"Play Again" → new run, shuffled questions
```

---

## 5. Difficulty Scaling (Endless)

| Distance | Speed | Obstacle Density | Question Difficulty | Question Type |
|----------|-------|-----------------|---------------------|---------------|
| 0–500m | Slow | Low | Easy (basic animals) | General kids |
| 500m–1km | Medium | Medium | Medium (Tamil wildlife) | Nature/ecology |
| 1km–2km | Fast | High | Hard (episode-specific) | Chutti TV lore |
| 2km+ | Very fast | Very high | Expert (conservation) | Deep ecology |
| 5km+ | Maximum | Extreme | Mixed shuffle | Random from all |

> **High score = knowledge depth.** A child who watches Singhuu episodes regularly reaches further distances because they know episode-specific answers.

---

## 6. Playable Characters & Ekam Synergy

Each character has a **domain** — questions from their domain give them *enhanced* power effects when they're the active runner.

| Character | Species | Domain | Ekam Bonus |
|-----------|---------|--------|------------|
| 🦁 **Singhuu** | Lion | Carnivores, strength, leadership | Strength-type answers give 2x effect |
| 🦊 **Thanthiraa** | Fox | Speed, stealth, forest ecology | Speed/stealth answers give 2x effect |
| 🐦 **Meenukutty** | Kingfisher | Flight, sky, migration, rivers | Air/water answers give 2x effect |

### Character Swapping
- Pre-run: player selects 3-character party
- TAB / tap portrait mid-run to swap (2-second cooldown)
- Swap strategically: if a speed question fires and Thanthiraa is active → 2x speed burst

---

## 7. Obstacle Types & Matched Questions

| Obstacle | Required Power | Example Question |
|----------|---------------|-----------------|
| 🪨 Boulder | 💪 Strength | "What gives a lion its strength?" |
| 🌊 River gap | 🕊️ Glide / ⚡ Speed | "What helps a kingfisher cross rivers?" |
| 🔥 Fire trap | ❤️ Health / 🌑 Stealth | "Which animal avoids fire by hiding?" |
| 🐃 Stampede | ⚡ Speed | "Which is the fastest land animal?" |
| 🌑 Dark cave | 🔦 Echolocate | "Which animal uses echolocation?" |
| 🌵 Thorn wall | 🌑 Stealth | "How does a snake move silently?" |
| ⬆️ Tall cliff | 🕊️ Glide | "Which bird soars the highest?" |
| 💨 Dust storm | 🐢 Slow-mo (correct) | "How do camels survive sandstorms?" |

---

## 8. Question Bank Structure

### Categories
1. **Tamil Forest Animals** — Western Ghats species (Nilgiri Tahr, Lion-tailed Macaque, Gaur)
2. **Animal Diet & Ecology** — What animals eat, habitat, food chain
3. **Nama Thala Singhuu Episodes** — Plot-specific questions (unlocked at 1km+)
4. **Tamil Culture & Nature** — Tamil Nadu geography, rivers, forests
5. **Conservation** — Endangered species, deforestation, environmental stewardship

### Question Format
- 1 question, 4 answer choices
- 5-second countdown timer (10 seconds for younger mode)
- Visual hint: obstacle silhouette visible behind question card
- Character reacts to answer: celebration / gentle encouragement (never shame)

---

## 9. Collectibles

| Item | Effect |
|------|--------|
| 🪙 Forest Coin | +5 score, 10 coins = +1 score multiplier (max 5x) |
| 🌿 Rare Herb | Slow-motion for 3 seconds + +50 bonus |
| 💎 Power Crystal | Resets all character swap cooldowns instantly |
| 📜 Episode Scroll | Unlocks a new episode-specific question set |
| ⭐ Star | +1 life (max 5 lives held at once) |

---

## 10. End-of-Run Screen

```
┌─────────────────────────────────────┐
│  🦁 SINGHUU IS PROUD OF YOU!        │
│                                     │
│  📏 Distance:     1,247m  🏆 BEST!  │
│  ⭐ Score:        3,820              │
│  🧠 Questions:    8 correct / 11    │
│  📚 You learned:                    │
│     • Lions are carnivores          │
│     • Kingfishers dive at 45km/h    │
│     • Nilgiri Tahr is endangered    │
│                                     │
│  [▶ Play Again]   [📤 Share Score]  │
└─────────────────────────────────────┘
```

The **"You learned"** section is critical — it transforms the run into a micro-lesson recap. Parents see this and trust the game.

---

## 11. Art, Audio, and UI

*For full details on the visual style, character designs, UI/UX flows, and technical art specifications, please refer to the core [Art Design Document](ArtDesignDocument.md).*

---

## 12. TV ↔ Game Synergy (Chutti TV)

| Strategy | Detail |
|----------|--------|
| **Episode Codes** | Secret codes revealed during Singhuu episodes unlock rare question packs |
| **Weekly Challenge** | Questions tied to that week's episode — rewatching helps you score higher |
| **On-Air Promotion** | "How far can YOU run? Download Singhuu: Ekam Run!" |
| **Character Unlock** | Watch 3 episodes = unlock Kongini as playable character |

---

## 12. Monetization

| Stream | Implementation | Est. Revenue % |
|--------|----------------|----------------|
| Rewarded Ads | Watch ad → extra life or question hint | 55% |
| Question Pack IAP | "Episode 4–8 Question Pack" (₹29) | 20% |
| Cosmetic IAP | Character skins, trail effects (₹29–₹99) | 15% |
| Brand Integration | In-game billboards, sponsored power-ups | 10% |

---

*Developed by **Lessario** × **Madras Deck Entertainment** for the **Nama Thala Singhuu** franchise on **Chutti TV** (Sun Network).*
