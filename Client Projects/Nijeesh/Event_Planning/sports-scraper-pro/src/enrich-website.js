import { PlaywrightCrawler, log, Configuration } from 'crawlee';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Configuration.getGlobalConfig().set('systemInfoIntervalMillis', 0);

const INPUT_FILE = path.join(__dirname, '../leads_clean.json');
const OUTPUT_FILE = path.join(__dirname, '../leads_enriched_website.json');

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const phoneRegex = /(?:\+91|0)?[6-9]\d{4}\s?\d{5}/g;

async function scrapeWebsites() {
    log.setLevel(log.LEVELS.INFO);
    console.log('🌐 Starting Phase 3: Company Website Scraping...');

    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`❌ Input file not found: ${INPUT_FILE}`);
        return;
    }

    let leads = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    let enrichedMap = new Map();

    if (fs.existsSync(OUTPUT_FILE)) {
        const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        existing.forEach(l => enrichedMap.set(l.linkedinUrl, l));
        log.info(`Loaded ${existing.length} previously website-enriched leads.`);
    }

    // Find unique domains to crawl
    const domainsToCrawl = new Set();
    const domainToLeads = new Map();

    leads.forEach(lead => {
        if (!enrichedMap.has(lead.linkedinUrl)) {
            enrichedMap.set(lead.linkedinUrl, lead);
        }

        if (lead.domain) {
            domainsToCrawl.add(lead.domain);
            if (!domainToLeads.has(lead.domain)) {
                domainToLeads.set(lead.domain, []);
            }
            domainToLeads.get(lead.domain).push(lead.linkedinUrl);
        }
    });

    // Check which domains we haven't crawled yet
    // To be efficient, we track crawled domains in a simple file or just check if leads have a websiteEnriched flag.
    const pendingDomains = Array.from(domainsToCrawl).filter(domain => {
        const linkedInUrls = domainToLeads.get(domain);
        // If the first lead for this domain hasn't been website-enriched, we need to crawl
        return linkedInUrls.some(url => !enrichedMap.get(url).websiteEnriched);
    });

    log.info(`Found ${pendingDomains.length} domains to crawl.`);

    if (pendingDomains.length === 0) {
        log.info('✅ All company websites crawled!');
        return;
    }

    const requests = pendingDomains.flatMap(domain => {
        // We'll queue the homepage and a few likely contact pages
        const base = `http://www.${domain}`;
        return [
            { url: base, userData: { domain } },
            { url: `${base}/contact`, userData: { domain } },
            { url: `${base}/contact-us`, userData: { domain } },
            { url: `${base}/about`, userData: { domain } },
            { url: `${base}/about-us`, userData: { domain } }
        ];
    });

    const domainData = new Map(); // Store found emails/phones per domain

    const crawler = new PlaywrightCrawler({
        maxConcurrency: 5,
        maxRequestRetries: 1, // Don't retry much for invalid domains
        requestHandlerTimeoutSecs: 30,
        headless: true, // We don't need to see this, usually no captchas on random corporate sites

        async requestHandler({ page, request }) {
            const { domain } = request.userData;
            try {
                // Get all text on the page
                const pageText = await page.evaluate(() => document.body.innerText);

                const emails = [...new Set(pageText.match(emailRegex) || [])];
                const phones = [...new Set(pageText.match(phoneRegex) || [])];
                const cleanPhones = phones.map(p => p.replace(/\s/g, '')).filter(p => p.length >= 10);

                if (!domainData.has(domain)) {
                    domainData.set(domain, { emails: new Set(), phones: new Set() });
                }

                emails.forEach(e => domainData.get(domain).emails.add(e));
                cleanPhones.forEach(p => domainData.get(domain).phones.add(p));

                if (emails.length > 0 || cleanPhones.length > 0) {
                    log.info(`[${domain}] Found ${emails.length} emails, ${cleanPhones.length} phones on ${request.url}`);
                }
            } catch (e) {
                // Ignore errors like page not found
            }
        },
        async failedRequestHandler({ request }) {
            // log.debug(`Failed to load ${request.url}`);
        }
    });

    log.info('Running website crawler...');
    try {
        await crawler.run(requests);
    } catch (e) {
        log.warning(`Crawler finished with internal error (common in Crawlee), continuing to save... Error: ${e.message}`);
    }

    // Apply found data to leads
    log.info('Applying found contacts to leads...');
    for (const domain of pendingDomains) {
        const data = domainData.get(domain) || { emails: new Set(), phones: new Set() };
        const linkedInUrls = domainToLeads.get(domain);
        
        for (const url of linkedInUrls) {
            const lead = enrichedMap.get(url);
            lead.websiteEnriched = true;
            
            // Add found contacts to the lead
            lead.companyEmails = Array.from(data.emails);
            lead.companyPhones = Array.from(data.phones);
            
            enrichedMap.set(url, lead);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(Array.from(enrichedMap.values()), null, 2));
    log.info(`✅ Saved website-enriched leads to: ${OUTPUT_FILE}`);
}

scrapeWebsites();
