import { PlaywrightCrawler, log, Configuration } from 'crawlee';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Configuration.getGlobalConfig().set('systemInfoIntervalMillis', 0);
log.setLevel(log.LEVELS.INFO);

const INPUT_FILE = path.join(__dirname, '../leads_clean.json');
const OUTPUT_FILE = path.join(__dirname, '../leads_enriched_google.json');

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const phoneRegex = /(?:\+91|0)?[6-9]\d{4}\s?\d{5}/g;

async function runEnrichment() {
    if (!fs.existsSync(INPUT_FILE)) {
        log.error(`Input file not found: ${INPUT_FILE}`);
        return;
    }

    let leads = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    let enrichedMap = new Map();

    // Load existing progress if available
    if (fs.existsSync(OUTPUT_FILE)) {
        const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        existing.forEach(l => enrichedMap.set(l.linkedinUrl, l));
        log.info(`Loaded ${existing.length} previously enriched leads.`);
    }

    // Filter leads that need enrichment
    const pendingLeads = leads.filter(l => {
        const existing = enrichedMap.get(l.linkedinUrl);
        if (existing) {
            // Check if we already tried searching for this lead (you might want a 'googleEnriched' flag)
            if (existing.googleEnriched) return false;
        }
        return true;
    });

    log.info(`Found ${pendingLeads.length} leads pending Google enrichment.`);

    if (pendingLeads.length === 0) {
        log.info('All leads enriched!');
        return;
    }

    const requests = pendingLeads.map(lead => {
        // Query formulation: "Name" "Company" email OR mobile OR contact
        let companyQuery = lead.company ? `"${lead.company}"` : '';
        const query = `"${lead.name}" ${companyQuery} (email OR @gmail.com OR @company.com OR phone OR contact OR mobile)`;
        const encodedQuery = encodeURIComponent(query);
        return {
            url: `https://www.google.com/search?q=${encodedQuery}`,
            userData: { lead }
        };
    });

    const crawler = new PlaywrightCrawler({
        headless: false, // Need visible for CAPTCHA
        maxConcurrency: 1,
        navigationTimeoutSecs: 120,
        requestHandlerTimeoutSecs: 600,

        async requestHandler({ page, request }) {
            const { lead } = request.userData;
            log.info(`🔍 Searching contacts for: ${lead.name} (${lead.company})`);

            // Random delay to avoid IP ban (15-25 seconds)
            const delay = Math.floor(Math.random() * (25000 - 15000 + 1) + 15000);
            log.info(`⏳ Waiting ${(delay / 1000).toFixed(1)} seconds...`);
            await page.waitForTimeout(delay);

            try {
                await page.waitForSelector('#search, #rso, #main', { timeout: 300000 });
            } catch (e) {
                log.error(`Timeout waiting for results for ${lead.name}. Might be blocked/CAPTCHA.`);
                return;
            }

            // Extract all text from the search results
            const pageText = await page.evaluate(() => {
                const searchEl = document.querySelector('#search') || document.body;
                return searchEl.innerText;
            });

            // Find matches
            const emails = [...new Set(pageText.match(emailRegex) || [])];
            const phones = [...new Set(pageText.match(phoneRegex) || [])];

            const cleanPhones = phones.map(p => p.replace(/\s/g, '')).filter(p => p.length >= 10);

            if (emails.length > 0) log.info(`   📧 Found Emails: ${emails.join(', ')}`);
            if (cleanPhones.length > 0) log.info(`   📱 Found Phones: ${cleanPhones.join(', ')}`);

            // Update lead
            const updatedLead = { 
                ...lead, 
                googleEnriched: true,
                emails: [...new Set([...(lead.emails || []), ...emails])],
                phones: [...new Set([...(lead.phones || []), ...cleanPhones])]
            };

            enrichedMap.set(updatedLead.linkedinUrl, updatedLead);

            // Save progress continuously
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(Array.from(enrichedMap.values()), null, 2));
        },
        async failedRequestHandler({ request }) {
            log.error(`Request failed completely: ${request.url}`);
        }
    });

    // Run crawler on pending leads (maybe limit to 50 for testing)
    // To test, we can slice it to the first 5
    // await crawler.run(requests.slice(0, 5));
    log.info('Running Google enrichment (this will take a while)...');
    await crawler.run(requests);
}

runEnrichment();
