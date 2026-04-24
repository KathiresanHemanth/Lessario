# Nama Thala Singhuu: Forest Run 🦁
### *A Mobile Game for Chutti TV Kids*

> **Based on the AI-animated series *Nama Thala Singhuu* airing on Sun Network's Chutti TV, Tamil Nadu.**

[![GitHub](https://img.shields.io/badge/GitHub-NamaThala--Singhuu-blue?logo=github)](https://github.com/KathiresanHemanth/NamaThala-Singhuu)
[![Branch](https://img.shields.io/badge/active_branch-develop-brightgreen)]()
[![LFS](https://img.shields.io/badge/Git_LFS-enabled-orange)]()
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey)]()

---

## 🎯 Quick Facts

| Detail | Info |
|--------|------|
| **Series Name** | Nama Thala Singhuu |
| **Genre** | 2.5D Endless Runner + Character Swap + Mini-Games |
| **Platform** | Android (primary), iOS (secondary) |
| **Target Audience** | Children aged 4–12 (Chutti TV viewers, Tamil Nadu) |
| **Revenue Model** | Free-to-Play + Rewarded Ads + Cosmetic IAP |
| **USP** | Mid-run character swapping — each animal has unique abilities |
| **TV Synergy** | Cross-promoted on Chutti TV with episode-linked unlock events |
| **Production** | Lessario × Madras Deck Entertainment |

---

## 📄 Project Documents

| Document | Description |
|----------|-------------|
| [**GDD.md**](./GDD.md) | Full Game Design Document — vision, market rationale, monetization, phased roadmap |
| [**Mechanics.md**](./Mechanics.md) | The Council Swap System — character abilities, power-ups, scoring, combos, progression |
| [**LevelDesign.md**](./LevelDesign.md) | Run Zones (procedural tile design) + Episode Mini-Games |
| [**Pitch.md**](./Pitch.md) | Publisher/investor pitch deck — market opportunity, USP, revenue model, SWOT |
| [**SinghuuAIAnimatedSeries/**](./SinghuuAIAnimatedSeries/) | Source animated series — scripts (E1–E8), character sheets, storyboards, environments |

---

## 🎮 Core Game Loop

```
┌─────────────────────────────────────────────────┐
│                   MAIN MENU                      │
│  Select Party (3 characters) → Choose Run Zone   │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│                  ENDLESS RUN                     │
│  Run → Dodge → Swap Characters → Use Abilities   │
│  Collect Coins → Beat High Score → Die           │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│                 RESULTS SCREEN                   │
│  Score → Coins Earned → Watch Ad for 2x Coins?   │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│                   SHOP / UNLOCK                  │
│  Upgrade Characters → Buy Skins → Unlock Zones   │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│                 MINI-GAMES (Optional)            │
│  Episode-themed puzzles for bonus coins & badges  │
└─────────────────────────────────────────────────┘
```

---

## 🗺️ Development Roadmap

### Phase 1 — MVP Launch
- [ ] Core endless runner with swipe controls
- [ ] 3 playable characters (Singu, Thanthiraa, Meenukutti)
- [ ] Character swap mechanic with cooldowns
- [ ] 3 run zones (Dense Forest, Healing Mountain, Valley of Collision)
- [ ] Coin collection + character unlock system
- [ ] Tamil voice lines from the show
- [ ] Rewarded video ad integration
- [ ] Google Play Store launch

### Phase 2 — Content Expansion (Month 2–3)
- [ ] 4 additional characters (Kongini, Sssaarapaambu, Suttapazham, Muttagose)
- [ ] 2 additional run zones (Dark Cave, Signal Canopy)
- [ ] 4 episode mini-games (Herb Hunt, Herd Redirect, Cave Rescue, Signal Fix)
- [ ] Daily challenges + global leaderboards
- [ ] Cosmetic skins IAP store
- [ ] iOS launch

### Phase 3 — Growth & Retention (Month 4+)
- [ ] Social features (friend leaderboards, challenge a friend)
- [ ] Seasonal events (Pongal, Diwali, Summer Special)
- [ ] New zones tied to new TV episodes (Ep 6–8)
- [ ] Brand integration deals (in-game billboards, sponsored power-ups)
- [ ] Analytics-driven difficulty tuning

---

## 🌿 Branch Structure

This repository follows **Git Flow**.

```
main                                ← Stable / tagged releases only
│
├── develop                         ← Active development (default working branch)
│   │
│   ├── feature/game-design         ← GDD, Mechanics, Level Design, Pitch iterations
│   ├── feature/series-scripts-and-assets  ← Episode scripts, character sheets, art
│   └── feature/storyboarding       ← Storyboard grids and AI image prompts
│
├── release/v1.0.0                  ← Release candidate staging before merging to main
└── hotfix/*                        ← Emergency fixes on main (merge back to develop too)
```

### Workflow
| Task | Branch |
|------|--------|
| Day-to-day work | `develop` |
| New game mechanic or level | `feature/game-design` → PR → `develop` |
| New episode scripts or assets | `feature/series-scripts-and-assets` → PR → `develop` |
| New storyboard episode | `feature/storyboarding` → PR → `develop` |
| Milestone ready for release | `develop` → `release/v1.0.0` → `main` |
| Urgent fix on stable | `hotfix/*` off `main` → merge to both `main` & `develop` |

> **Active branch:** `develop`

---

## 🔗 Related Projects

- **[SinghuuAIAnimatedSeries](./SinghuuAIAnimatedSeries/)** — Source animated series. All character designs, episode scripts (E1–E8), storyboards, and environments.
- **[Lessario Engine](../../Lessario/)** — Custom C++ game engine (future native build consideration).

---

*Developed by **Lessario** × **Madras Deck Entertainment** for the **Nama Thala Singhuu** franchise on **Chutti TV** (Sun Network).*
