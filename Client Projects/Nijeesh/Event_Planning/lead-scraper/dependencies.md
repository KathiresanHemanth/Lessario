# Project Dependencies

This project uses the following specialized libraries to achieve high-volume, stealthy lead generation.

## 1. Core Framework
- **`crawlee`**: The main scraping framework. It handles the "dirty work" like retries, proxy rotation, and session management. It is significantly more robust than using raw Playwright.
- **`playwright`**: Used by Crawlee to automate a real Chromium browser. This allows us to scrape JavaScript-heavy sites that simple HTTP requests can't handle.

## 2. Stealth & Anti-Detection
- **`fingerprint-generator`** (Internal to Crawlee): Automatically generates realistic browser fingerprints (User-Agent, screen resolution, etc.) to bypass anti-bot systems.
- **`header-generator`** (Internal to Crawlee): Generates consistent HTTP headers to match the browser's identity.

## 3. Data Processing
- **`csv-writer`** (Optional): If we want to append directly to your existing `Companies_Contact_Directory.csv`.
- **`dotenv`**: For securely managing API keys (e.g., your Apollo or Hunter.io keys).

---

## Why these?
| Library | Benefit |
| :--- | :--- |
| **Crawlee** | Replaces 5+ custom Python scripts with one framework. |
| **Playwright** | Better than Selenium; faster and more reliable on M2 Mac. |
| **Chromium** | Runs natively on Apple Silicon (ARM64) for maximum speed. |
