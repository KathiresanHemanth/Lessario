# CLAUDE.md — AI Context for Lessario Studios Monorepo

> **Last Updated:** 2026-04-28
> **Owner:** Hemanth Kumar PK — Founder, Lessario Studios | Co-founder, Capital Club
> **Contact:** hemanthkumarpk@lessario.com

---

## 🏢 What Is This Repo?

This is the **Lessario Studios monorepo** — the central workspace for a creative technology startup based in India. It contains:

- The **LessarioEngine** (custom C++/Rust game engine)
- The **Lessario Website** (React + Vite company site)
- **Client project** deliverables (AR apps, game dev, video production, lead-gen tools)
- **Corporate documents** (HR, finance, partnerships, operations)
- **Career learning roadmaps** (35 engineering disciplines)
- **Personal knowledge base** (Thiruppugazh study, notes)

This is **NOT** a single-application repo. It's a company-wide knowledge-and-code monorepo managed via feature branches.

---

## 📂 Repository Structure

```
Lessario/
├── LessarioEngine/          # Custom game engine (C++17 + Rust + OpenGL 3.3)
├── Lessario Website/
│   └── lessario-app/        # Company website (React 19 + Vite 8)
├── Lessario Documents/      # Corporate docs — executive, HR, ops, marketing, partnerships
│   ├── 01_Executive/
│   ├── 01_Projects/
│   ├── 02_Human_Resources/
│   ├── 03_Operations/
│   ├── 05_Marketing_Sales/
│   ├── 06_Partnerships/
│   └── 07_Academy_Knowledge_Base/
├── Client Projects/
│   ├── AR Robot Filter App/       # Unity AR selfie/filter app (C#)
│   ├── MadrasDeckEnterainment/    # Film/event production client
│   │   ├── Singhuu/               # Character IP — scripts, game, assets
│   │   ├── EventConducting/
│   │   └── VideoEdit/
│   ├── Nijeesh/                   # Sports industry event planning client
│   │   └── Event_Planning/
│   │       ├── sports-scraper-pro/  # LinkedIn lead scraper (Node.js + Playwright + Crawlee)
│   │       └── lead-scraper/        # Earlier scraper prototype
│   └── ZorbaGames/                # PC story game (Godot)
├── Career/                  # Self-study roadmaps (35 disciplines, 400+ projects)
│   ├── 01_Foundations_STEM/
│   ├── 02_Software_Engineering/
│   ├── 03_AI_Emerging_Tech/
│   ├── 04_Hardware_Engineering/
│   ├── 05_Business_Finance/
│   └── 06_Knowledge_Wisdom/
├── Tasks/                   # Daily checklists and project status trackers
├── Notes/                   # Miscellaneous notes and research
├── Thiruppugazh/            # Tamil devotional literature study
├── Founder_TODO.md          # Top-level CRM and revenue roadmap
├── .gitignore
└── package.json             # Root-level (Playwright dependency for scraper tooling)
```

---

## 🔧 Tech Stacks by Project

### LessarioEngine
| Layer | Technology |
|-------|-----------|
| Language | C++17 (primary) + Rust (ECS/logic modules) |
| Graphics | OpenGL 3.3 Core Profile via GLAD |
| Windowing | GLFW |
| Math | GLM |
| ECS | EnTT |
| Physics | Bullet Physics (formerly ReactPhysics3D) |
| UI/Editor | Dear ImGui |
| Build | CMake 3.20+ / Cargo (Rust) / MSVC (Visual Studio 2026) |
| Target HW | Intel i3-2100, NVIDIA GT 710, 720p |

**Key files:**
- `cpp_src/main.cpp` — C++ entry point
- `src/main.rs` — Rust entry point
- `src/engine.rs` — Core engine loop and renderer
- `CMakeLists.txt` — Build configuration
- `Cargo.toml` — Rust dependencies

### Lessario Website (`lessario-app`)
| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Routing | react-router-dom v7 |
| Language | JavaScript (JSX) |
| Linting | ESLint 9 |
| Standard | Next.js + TypeScript designated as gold standard (migration planned) |

**Key files:**
- `src/App.jsx` — Root component
- `src/pages/Home.jsx` — Main landing page (~37KB, needs modular refactoring)
- `src/components/Header.jsx`, `Footer.jsx` — Shared layout
- `src/pages/BlogList.jsx`, `BlogPost.jsx` — Blog system
- `src/pages/Login.jsx`, `Signup.jsx` — Auth pages

### Sports Scraper Pro (`Client Projects/Nijeesh/Event_Planning/sports-scraper-pro/`)
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Scraping | Playwright + Crawlee |
| Target | Google → LinkedIn profile discovery |
| Output | JSON datasets in `storage/datasets/default/` |
| Config | `categories.json` — industry categories to scrape |
| Deployment | Docker support (Dockerfile included) |

**Key behaviors:**
- Searches Google with `site:linkedin.com/in/` dorks for specific job titles
- Implements anti-ban: random delays (15-25s), CAPTCHA detection with manual solve window (5 min)
- Stores results as individual JSON files per profile
- Has its own `.git` (nested repo)

### AR Robot Filter App (`Client Projects/AR Robot Filter App/`)
- **Engine:** Unity (C#)
- **Platform:** Android (camera permissions required)
- **Type:** AR selfie/filter experience

### ZorbaGames (`Client Projects/ZorbaGames/`)
- **Engine:** Godot
- **Game:** "Aadhi Kudi" PC story game

---

## 🌿 Git Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production / stable (default on GitHub) |
| `develop` | Active development integration branch (**current HEAD**) |
| `Nijeesh` | Client work — Event Planning / Lead Scraper features |
| `Learning` | Career roadmaps and self-study materials |
| `ar-robot-filter-app-chitra` | Unity AR filter app development |
| `ar-singhu-selfie-app` | Singhuu character selfie app |
| `singhuu-game` | Singhuu game development |
| `feature` | General feature work |
| `milestone` | Engine milestone tracking |
| `tasks` | Task management updates |

**Workflow:** Feature branches merge into `develop`, then `develop` merges into `main`.

---

## 📏 Coding Conventions & Preferences

### General
- **Commit style:** Conventional Commits (`feat:`, `docs:`, `chore:`, `refactor:`, etc.)
- **Documentation:** Markdown everywhere — READMEs, TODOs, roadmaps, and planning docs
- **File organization:** Numbered folder prefixes for corporate docs (`01_`, `02_`, etc.)
- **Obsidian:** `.obsidian/` config present — repo doubles as an Obsidian vault for note-taking

### JavaScript/Node.js
- ES Modules (`"type": "module"`)
- ESLint for linting
- Vite for dev server and bundling

### C++/Rust (Engine)
- C++17 standard
- CMake for C++ builds
- Cargo for Rust modules
- Header-only libraries preferred (EnTT, GLM, stb_image)
- Vendored third-party deps in `third_party/`

### Unity (AR Apps)
- C# scripts
- Android target with runtime permission handling

---

## 🚨 Important Context for AI Assistants

1. **This is a startup founder's workspace.** Code quality varies — some projects are polished, others are rapid prototypes. Don't assume enterprise-grade patterns everywhere.

2. **`Home.jsx` is a known tech debt item** (~37KB monolith). There's a standing task to refactor it into sub-components.

3. **The scraper tools are sensitive.** They interact with Google and LinkedIn — always preserve anti-ban mechanisms (delays, CAPTCHA handling, rate limiting). Never remove or reduce these safeguards.

4. **LessarioEngine targets legacy hardware.** Optimizations must respect the i3-2100 / GT 710 profile. No Vulkan, no heavy compute shaders, no assumptions about modern GPU features.

5. **Multiple languages coexist.** English is the primary language for code and docs. Some content includes **Tamil** (scripts for MadrasDeckEntertainment, Thiruppugazh study). Handle Tamil text with care.

6. **Nested git repos exist.** `sports-scraper-pro` has its own `.git`. Be aware of this when running git commands from the root.

7. **The `Career/` folder is a personal learning roadmap** — not client-deliverable code. It contains study plans across 35 engineering disciplines.

8. **Company valuation context:** Lessario Studios is valued at ₹5 Crores. Active revenue streams come from game development, VFX, AR apps, and B2B lead generation services.

9. **Key partners to be aware of:** Zorba Games (PC game), Foxconn (VR industrial sim), MadrasDeckEntertainment (film/events), Capital Club (business networking), Aaga.one (AI lead-gen).

10. **The founder uses Obsidian, VS Code, and macOS** as the primary development environment.

---

## 🗂️ Active Work Streams (as of April 2026)

| Stream | Status | Location |
|--------|--------|----------|
| Sports Industry Lead Scraper | Active — scraping LinkedIn profiles | `Client Projects/Nijeesh/Event_Planning/sports-scraper-pro/` |
| LessarioEngine Milestone 2 | In progress — world/scene system | `LessarioEngine/` |
| Lessario Website | Needs refactoring | `Lessario Website/lessario-app/` |
| Singhuu Character IP | Scripts & game assets in progress | `Client Projects/MadrasDeckEnterainment/Singhuu/` |
| Career Learning Roadmaps | 35 disciplines documented | `Career/` |
| Company Registration | Pending (LLP/Pvt Ltd) | `Lessario Documents/01_Executive/` |

---

## 🔑 Environment & Secrets

- `.env` files exist in `sports-scraper-pro/` — contains scraper configuration
- Staff credentials are in `Lessario Documents/03_Operations/Security/` (internal/locked)
- **Never commit secrets.** The `.gitignore` covers `node_modules/`, build dirs, and IDE files

---

## 📚 Key Documents to Read First

If you're an AI assistant working on this repo for the first time, read these:

1. **This file** (`CLAUDE.md`)
2. `Founder_TODO.md` — Understand current priorities
3. `LessarioEngine/TODO.md` — Engine development roadmap
4. `LessarioEngine/TECH_STACK.md` — Engine architecture decisions
5. `Lessario Documents/README.md` — Corporate document structure
6. `Career/README.md` — Learning roadmap overview
7. `Client Projects/Nijeesh/Event_Planning/plan.md` — Active scraper project plan
