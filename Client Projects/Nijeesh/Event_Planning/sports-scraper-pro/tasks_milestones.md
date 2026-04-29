# Project Roadmap: 16,000+ Verified Contacts (The "Fully Local" Build)

This roadmap outlines the steps to build an enterprise-scale lead generation engine on your MacBook M2 Pro. The goal is to harvest **1,000 leads per category** across all 16 Indian Sports Industry categories without paying thousands of dollars for Apollo.io.

## Phase 1: Infrastructure Setup (Done ✅)
- [x] Initialize Node.js project.
- [x] Install Crawlee and Playwright.
- [x] Setup local **SearxNG Engine** (`http://127.0.0.1:8888`) to bypass IP blocks and scrape Google/Bing for free.

## Phase 2: The Scouting Engine at Scale (Pagination Upgrades) 🔍
- [x] Implement local search routing (`src/main.js`).
- [ ] **Pagination Upgrade:** Modify the scraper to navigate through SearxNG search result pages (Page 1 to 100) to harvest up to 1,000 URLs per category.
- [x] Extract raw search result data (Name, Snippet, LinkedIn URL).
- [x] Add strict location filtering (India only).

## Phase 3: The Free Enrichment Pipeline (Email & Mobile) 📧📱
- [x] Integrate Hunter.io API for high-volume, low-cost email discovery.
- [x] Build **Deep Phone Hunt** logic to search for mobile numbers using SearxNG (100% Free).
- [ ] Optimize the enrichment script to handle thousands of requests without crashing or getting rate-limited.

## Phase 4: Data Parsing & Deduplication 📊
- [x] Tag every lead with its respective **Category**.
- [ ] Build a script to merge the thousands of enriched JSON files into a single, clean database.
- [ ] De-duplicate records based on LinkedIn URLs to ensure 16,000 *unique* leads.

## Phase 5: Final Export & CRM Ready 🚀
- [ ] Export final dataset to `Companies_Contact_Directory_v2.csv`.
- [ ] **Goal Reached:** 16,000+ leads ready for email and phone outreach.

---

## 📈 Scale Milestones
1.  **Milestone 1 (Done):** Successfully build the Scouting & Enrichment pipeline.
2.  **Milestone 2 (Current):** Upgrade the Scouter with Pagination to hit 1,000 leads per category.
3.  **Milestone 3:** Run the massive extraction overnight.
4.  **Milestone 4:** Run the Hunter.io + Deep Phone Hunt enrichment on the 16k dataset.
