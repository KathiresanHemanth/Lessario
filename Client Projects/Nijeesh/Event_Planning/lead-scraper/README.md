# Sports Lead Scraper (M2 Pro Edition)

A high-performance B2B lead generation engine built with **Node.js** and **Crawlee**. Optimized for Apple Silicon (M2 Pro) to handle massive concurrency and stealthy data gathering.

## 🚀 The Tech Stack
- **Engine:** [Crawlee](https://crawlee.dev/) (The Gold Standard for Scraping)
- **Browser:** Playwright (Headless Chromium)
- **Stealth:** Integrated Fingerprint Suite & Header Generator
- **Storage:** Local JSON/CSV (Crawlee Dataset)
- **Language:** JavaScript / Node.js

## 🛠️ Setup Instructions
1. **Initialize Project:**
   ```bash
   mkdir lead-scraper
   cd lead-scraper
   npm init -y
   ```

2. **Install Dependencies:**
   ```bash
   npm install crawlee playwright
   npx playwright install chromium
   ```

3. **Run the Scraper:**
   ```bash
   node src/main.js
   ```

## 🎯 Target Goals
- [ ] Scrape LinkedIn profiles via Search Engine Dorks.
- [ ] Extract Name, Role, Company, and LinkedIn URL.
- [ ] Enrich data with verified emails via Apollo/Hunter API.
- [ ] Export final list to `Companies_Contact_Directory.csv`.

## 🛡️ Stealth Features
This scraper uses **PlaywrightCrawler** with automatic fingerprint generation to mimic a real user on a MacBook Pro, reducing the risk of IP bans.
