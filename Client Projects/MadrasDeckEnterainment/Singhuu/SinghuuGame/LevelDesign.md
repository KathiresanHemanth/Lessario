# Level Design: Run Zones & Mini-Games

> *Environment and mission design for "Nama Thala Singhuu: Forest Run"*

---

## Run Zone Design Philosophy

Each "Run Zone" is an infinitely-scrolling side-scrolling environment tied to an episode of the *Singu - The Raja* series. Zones are not linear levels — they are **procedurally assembled from hand-crafted tile segments** to keep each run feeling fresh while maintaining art quality.

### Zone Structure
```
[Start Gate] → [Easy Segment ×3] → [Ramp Segment ×∞] → [Boss Obstacle (every 500m)]
                                      ↑ speed increases
                                      ↑ obstacle density increases
                                      ↑ new obstacle types introduced
```

---

## Zone 1: The Dense Forest 🌳
**Episode Tie-In:** Pilot + General  
**Unlock:** Available at start

| Element | Detail |
|---------|--------|
| **Setting** | Thick Tamil Nadu Western Ghats forest — tall canopy, dappled sunlight, mossy rocks |
| **Colour Palette** | Deep greens, golden sunlight beams, brown earth |
| **Ground Obstacles** | Fallen logs, muddy puddles, tangled roots, river crossings (jump) |
| **Air Obstacles** | Low-hanging branches, beehive drops, swooping starling flocks |
| **Unique Mechanic** | River crossings — must jump 3 consecutive platforms over flowing water |
| **Boss Obstacle (500m)** | Stampeding Elephant — screen shakes, must use Roar or Dash to survive |
| **Coin Placement** | Along the standard path + elevated vine arches (use Meenukutti/Muttagose) |

---

## Zone 2: The Healing Mountain ⛰️
**Episode Tie-In:** Ep 2 — Herb for the Herd  
**Unlock:** Reach 2,000m total distance

| Element | Detail |
|---------|--------|
| **Setting** | Rocky mountain slopes, misty peaks, rare medicinal herb patches |
| **Colour Palette** | Dusty greys, pale greens, warm amber sunrise |
| **Ground Obstacles** | Loose boulders (roll toward player), narrow ledges, ice patches |
| **Air Obstacles** | Wind gusts (push player sideways), falling rocks from above |
| **Unique Mechanic** | Herb Collection — special green herbs appear that fill a "Healing Meter" for bonus score |
| **Boss Obstacle (500m)** | Rockslide — an avalanche section where the screen scrolls faster for 10 seconds |
| **Coin Placement** | Hidden in rock alcoves (Kongini's climb paths) + in wind current streams (Meenukutti) |

---

## Zone 3: The Valley of Collision 🦏
**Episode Tie-In:** Ep 4 — The Great Collision  
**Unlock:** Reach 5,000m total distance

| Element | Detail |
|---------|--------|
| **Setting** | Open savanna/valley with two converging herd paths, dust clouds |
| **Colour Palette** | Golden savanna, red-brown earth, dust haze |
| **Ground Obstacles** | Charging Wild Buffaloes (from behind), Rhinos (from the front), dust walls |
| **Air Obstacles** | Thrown debris from herd stampede, frightened birds |
| **Unique Mechanic** | Herd Dodge — every 200m, a herd charge event forces a rapid-swap decision |
| **Boss Obstacle (500m)** | Double Stampede — Buffaloes AND Rhinos converge, must swap and use two abilities in sequence |
| **Coin Placement** | In the slipstream behind charging animals (risk/reward) |

---

## Zone 4: The Dark Cave 🦇 *(Phase 2)*
**Episode Tie-In:** Ep 3 — The Lost Pawrent  
**Unlock:** Unlock Sssaarapaambu

| Element | Detail |
|---------|--------|
| **Setting** | Underground cave system, torch-lit, stalactites, underground rivers |
| **Colour Palette** | Deep blues-blacks, warm torch orange, bioluminescent greens |
| **Unique Mechanic** | Visibility — the screen is dark; only a small radius around the player is lit. Meenukutti's Keen Eye passive expands visibility |

---

## Zone 5: The Signal Canopy 🌿 *(Phase 2)*
**Episode Tie-In:** Ep 5 — The Broken Signal  
**Unlock:** Unlock Muttagose

| Element | Detail |
|---------|--------|
| **Setting** | High treetop canopy, vine bridges, acoustic resonance chambers |
| **Colour Palette** | Bright greens, sky blues, golden leaves |
| **Unique Mechanic** | Sound Waves — rhythmic obstacles pulse to a beat; timing-based dodging |

---

## Episode Mini-Games (Detailed Design)

### Mini-Game 1: Herb Hunt (Ep 2)
**Type:** Tap Collector  
**Duration:** 45 seconds  
**Mechanic:** Herbs fall from the top of the screen. Tap green healing herbs (+10 pts), avoid red poison mushrooms (-20 pts). Suttapazham appears carrying baskets — fill the baskets before time runs out.  
**Unlock Condition:** Complete 3 runs in the Healing Mountain zone.  
**Reward:** 100 Coins + "Healer" badge.

### Mini-Game 2: Herd Redirect (Ep 4)
**Type:** Traffic Puzzle  
**Duration:** 60 seconds  
**Mechanic:** Top-down view of the valley. Swipe to place barriers and open paths, directing buffalo herds left and rhino herds right. If any two herds collide, game over.  
**Unlock Condition:** Complete 3 runs in the Valley of Collision zone.  
**Reward:** 150 Coins + "Peacekeeper" badge.

### Mini-Game 3: Cave Rescue (Ep 3) *(Phase 2)*
**Type:** Tilt Maze  
**Duration:** 45 seconds  
**Mechanic:** Control Sssaarapaambu through a maze by tilting the phone. Reach Magizhnan at the end. Walls are narrow — touching them costs time.  
**Unlock Condition:** Unlock the Dark Cave zone.  
**Reward:** 150 Coins + "Rescuer" badge.

### Mini-Game 4: Signal Fix (Ep 5) *(Phase 2)*
**Type:** Connect-the-Dots Puzzle  
**Duration:** 60 seconds  
**Mechanic:** Nodes on the screen represent signaling stations. Draw lines to connect them in the right order (shown briefly at the start). Incorrect connections cause a chain reaction that scrambles all nodes.  
**Unlock Condition:** Unlock the Signal Canopy zone.  
**Reward:** 200 Coins + "Signal Master" badge.

---

## Procedural Segment Assembly

Each zone uses **hand-crafted tile segments** assembled procedurally:

```
Segment Types:
├── Easy   (20 variants per zone) — simple obstacles, generous gaps
├── Medium (15 variants per zone) — tighter timing, combo opportunities  
├── Hard   (10 variants per zone) — requires ability use or perfect swaps
├── Boss   (3 variants per zone)  — scripted boss obstacle sequences
└── Bonus  (5 variants per zone)  — coin-rich, low-obstacle reward segments
```

**Assembly Rules:**
1. First 100m: Easy segments only (tutorial feel)
2. 100m–300m: Mix of Easy + Medium
3. 300m+: Medium + Hard, with increasing Hard ratio
4. Every 500m: One Boss segment guaranteed
5. After Boss: One Bonus segment (reward for surviving)

---

*Part of the Singhuu: Forest Run — The Raja's Dash design documentation.*
