# 🎯 Lead Enrichment Plan — Emails & Mobile Numbers

## Current Status
- **1,790 unique LinkedIn profiles** scraped via Google Dorking  
- Each lead has: `name`, `role`, `company`, `linkedinUrl`, `category`, `snippet`  
- **Missing**: email addresses and mobile numbers for all leads  

---

## 🔑 Available API Keys

| Service | Key | Free Tier |
|---|---|---|
| **Hunter.io** | `3fe766e...` (active) | 50 credits/month (1 credit = 1 email lookup) |
| **Apollo.io** | `c5ii3Xu...` (active) | No free API access (manual only, ~10 credits/month) |

> **Reality check**: With 1,790 leads and only 50 free Hunter credits/month, we need **36 months** to enrich everything via Hunter alone. We need alternative strategies.

---

## 📋 Enrichment Strategy (Multi-Phase)

### Phase 1: Data Cleanup (FREE — Immediate)
**Goal**: Fix the raw data quality before enrichment

1. **Remove "Read more" duplicates** — Many leads have `name: "Read more"` which are Google's expanded snippets. These contain richer data (city, full role, company) but the name is wrong. Merge them with the parent lead.
2. **Extract company domains** — Parse company names to guess website domains (e.g., "Athlos Activewear" → `athlosactivewear.com`)
3. **Normalize LinkedIn URLs** — Remove `#:~:text=...` fragments and trailing slashes
4. **Deduplicate again** after merging "Read more" entries (should reduce from 1,790 → ~900-1,000 real unique people)

**Script**: `src/cleanup.js`

---

### Phase 2: Google Dorking for Emails & Phones (FREE — Slow but Powerful)
**Goal**: Use the same Google Dorking approach that worked for LinkedIn to find contact info

**Method**: For each lead, search Google for:
```
"Full Name" "Company" (email OR @gmail.com OR @company.com OR phone OR contact OR mobile)
```

This is the same visible-browser + manual CAPTCHA approach we already used. It's free, just slow.

**Expected hit rate**: ~20-30% (emails are sometimes on company websites, conference speaker bios, startup directories, etc.)

**Script**: `src/enrich-google.js`

---

### Phase 3: Company Website Scraping (FREE)
**Goal**: Scrape company websites for contact pages, team pages, about pages

1. From Phase 1, we'll have a list of company domains
2. Crawl `/contact`, `/about`, `/team`, `/leadership` pages
3. Extract emails with regex: `/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g`
4. Extract phones with regex: `/(?:\+91|0)?[6-9]\d{9}/g`

**Expected hit rate**: ~15-25% of companies will have publicly listed contact info

**Script**: `src/enrich-website.js`

---

### Phase 4: Hunter.io Email Guessing (50 FREE/month)
**Goal**: Use Hunter.io API strategically for highest-value leads

1. Prioritize leads where we have both `name` AND `company domain`
2. Use Hunter's `email-finder` endpoint (1 credit per lookup)
3. Process 50 leads per month (highest priority categories first)
4. Also use Hunter's `domain-search` to find email patterns for companies

**Priority order** (based on event planning relevance):
1. Event Management (68 leads)
2. Sports Marketing & PR (63 leads)  
3. Sponsorship & Branding (123 leads)
4. Broadcasters & OTT (150 leads)
5. Remaining categories...

**Script**: Update existing `src/enrich.js`

---

### Phase 5: Pattern-Based Email Generation (FREE — Instant)
**Goal**: Generate probable emails using common patterns

Most companies follow predictable email formats:
- `firstname@company.com`
- `firstname.lastname@company.com`
- `f.lastname@company.com`
- `firstname.l@company.com`

**Process**:
1. For each lead with a known company domain, generate 4-6 email variants
2. Verify deliverability using free email verification (SMTP check)
3. Mark verified emails as "confirmed", unverified as "guessed"

**Script**: `src/enrich-pattern.js`

---

## 🏗️ Implementation Order

```
Phase 1: cleanup.js          → ~900 clean leads (immediate, 5 min)
Phase 2: enrich-google.js    → +200-300 emails/phones (2-3 hours, manual CAPTCHAs)
Phase 3: enrich-website.js   → +100-200 emails/phones (30 min, automated)
Phase 4: enrich.js (Hunter)  → +50 emails/month (5 min, API)
Phase 5: enrich-pattern.js   → +300-400 guessed emails (10 min, automated)
```

**Estimated total enrichment**: 
- Emails: ~60-70% coverage (~600-700 out of ~1,000 unique leads)
- Phones: ~15-25% coverage (~150-250)

---

## 📁 File Structure

```
sports-scraper-pro/
├── src/
│   ├── main.js              ✅ Google Dorking scraper (DONE)
│   ├── export.js            ✅ Dedup & CSV export (DONE)
│   ├── cleanup.js           🔨 Phase 1: Data cleanup & merge
│   ├── enrich-google.js     🔨 Phase 2: Google Dorking for contacts
│   ├── enrich-website.js    🔨 Phase 3: Company website scraping
│   ├── enrich.js            🔧 Phase 4: Hunter.io API (update existing)
│   └── enrich-pattern.js    🔨 Phase 5: Email pattern generation
├── leads_export.json        ✅ Raw deduplicated leads (1,790)
├── leads_clean.json         🔨 After Phase 1 cleanup
├── leads_enriched.json      🔨 Final enriched output
└── leads_enriched.csv       🔨 Final CSV for outreach
```

---

## ⚡ Quick Start

```bash
# Phase 1: Clean the data
node src/cleanup.js

# Phase 2: Google Dork for emails (will open browser)
node src/enrich-google.js

# Phase 3: Scrape company websites
node src/enrich-website.js

# Phase 4: Hunter.io (50 leads/month)
npm run enrich

# Phase 5: Pattern-based email generation
node src/enrich-pattern.js

# Final export
node src/export.js
```

---

## 🚨 Important Notes

1. **Google CAPTCHA**: Phase 2 uses the same visible browser approach. You'll need to solve CAPTCHAs manually like before.
2. **Rate limiting**: All phases include delays to avoid IP bans.
3. **Data quality**: "Guessed" emails (Phase 5) should be marked separately from "verified" emails.
4. **GDPR/Privacy**: These are publicly available professional profiles. Use only for legitimate B2B outreach.
5. **Hunter credits**: Save your 50 monthly credits for the highest-priority leads that Phase 2-3 didn't catch.
