# Project Roadmap: 1,000+ Verified Contacts

This roadmap outlines the steps to build and execute the lead generation engine on your MacBook M2 Pro, targeting all 16 categories in the Indian Sports Industry.

## Phase 1: Environment Setup 🏗️
- [ ] Initialize Node.js project (`npm init`).
- [ ] Install Crawlee and Playwright.
- [ ] Verify Chromium runs natively on M2 (ARM64).
- [ ] Create basic "Hello World" crawler to test anti-detection.

## Phase 2: The Scouting Engine (Multi-Category Discovery) 🔍
- [ ] **Category Configuration:** Create a JSON file containing all 16 industry categories:
  - *Sportswear, Wearables, Sports Tech, AR/VR, Marketing/PR, Event Management, etc.*
- [ ] Implement Google/DuckDuckGo "Dorking" logic.
- [ ] **Automated Loop:** Run a search cycle for every category + role combination:
  - Query: `site:linkedin.com/in/ ("CEO" OR "Founder" OR "Marketing Head") "[Category]" "India"`
- [ ] Extract raw search result data (Name, Snippet, LinkedIn URL).
- [ ] Implement concurrency limits and "human-like" delays to avoid IP blocks.

## Phase 3: Data Parsing & Structuring 📊
- [ ] Parse company names and titles from search snippets.
- [ ] Tag every lead with its respective **Category** (for CRM filtering).
- [ ] Store leads in a local JSON Dataset (Crawlee default).
- [ ] De-duplicate records based on LinkedIn URL.

## Phase 4: Enrichment Pipeline (The Emails) 📧
- [ ] Integrate Apollo.io or Hunter.io API.
- [ ] Create script to match (Name + Company Domain) to verified emails.
- [ ] Implement "Permutation Logic" for domains not found in APIs.
- [ ] Add final validation check (Catch-all detection).

## Phase 5: Final Export & CRM Ready 🚀
- [ ] Export final dataset to `Companies_Contact_Directory_v2.csv`.
- [ ] Ensure formatting matches your original CSV structure.
- [ ] **Goal Reached:** 1,000+ Verified Leads across all 16 sports categories.

---

## 📈 Milestones
1.  **Milestone 1:** Successfully scrape 100 raw LinkedIn URLs (Discovery).
2.  **Milestone 2:** Successfully enrich 10 contacts with verified emails (Proof of Concept).
3.  **Milestone 3:** Run the full pipeline across all 16 categories to reach 1,000+ contacts.
