import { PlaywrightCrawler, Dataset, log, Configuration } from 'crawlee';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disable memory snapshotting to avoid EPERM errors on certain OS environments
Configuration.getGlobalConfig().set('systemInfoIntervalMillis', 0);

// Set up logging
log.setLevel(log.LEVELS.INFO);

// Load configuration
const configPath = path.resolve(__dirname, '../categories.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Initialize the crawler
const crawler = new PlaywrightCrawler({
    // Enable stealth and anti-blocking
    headless: true, // Back to Auto/Invisible mode!
    maxConcurrency: 1, // Only one search at a time

    async requestHandler({ page, request }) {
        const { category } = request.userData;
        log.info(`Scouting Category: ${category} - URL: ${request.url}`);

        try {
            // Short delay: SearxNG handles the proxying, but we still don't want to spam our local server too hard
            const delay = Math.floor(Math.random() * (4000 - 2000 + 1) + 2000);
            log.info(`Waiting ${delay/1000} seconds...`);
            await page.waitForTimeout(delay);
            
            // Wait for SearxNG results to load
            await page.waitForTimeout(2000);

            // SearxNG uses the .result class for its search blocks
            const leads = await page.$$eval('.result', (elements) => {
                return elements.map(el => {
                    const linkEl = el.querySelector('h3 a') || el.querySelector('h4 a');
                    const snippetEl = el.querySelector('.content');

                    return {
                        title: linkEl ? linkEl.innerText : '',
                        link: linkEl ? linkEl.href : '',
                        snippet: snippetEl ? snippetEl.innerText : ''
                    };
                });
            });

            // Strict filter: MUST be a LinkedIn URL and MUST mention India or be on the 'in.' subdomain
            const validLeads = leads.filter(lead => {
                const isLinkedIn = lead.link && lead.link.includes('linkedin.com/in/');
                const isIndianDomain = lead.link && lead.link.includes('in.linkedin.com');
                const mentionsIndia = (lead.title + lead.snippet).toLowerCase().includes('india');
                
                // Keep it if it's an Indian domain OR if it explicitly mentions India in the text
                return isLinkedIn && (isIndianDomain || mentionsIndia);
            });

            if (validLeads.length === 0 && leads.length > 0) {
                log.warning(`Found ${leads.length} results for ${category}, but none matched the "India" location filter.`);
            }

            for (const lead of validLeads) {
                await Dataset.pushData({
                    ...lead,
                    category,
                    scrapedAt: new Date().toISOString(),
                });
            }

            log.info(`Found ${validLeads.length} valid LinkedIn profiles for ${category}`);
        } catch (error) {
            log.error(`Error processing ${request.url}: ${error.message}`);
        }
    },

    failedRequestHandler({ request }) {
        log.error(`Request ${request.url} failed completely after retries.`);
    },
});

// Build the queue of searches
const searchRequests = [];
for (const cat of config.categories) {
    const roles = config.roles.map(r => `"${r}"`).join(' OR ');
    const query = `site:linkedin.com/in/ (${roles}) "${cat}" "${config.location}"`;

    // Routing all searches through our local SearxNG Engine!
    const searchUrl = `http://127.0.0.1:8888/search?q=${encodeURIComponent(query)}`;

    searchRequests.push({
        url: searchUrl,
        userData: { category: cat }
    });
}

log.info('🚀 Starting the Scouting Engine...');
await crawler.run(searchRequests);
log.info('✅ Scouting Complete! Data saved in storage/datasets/default');
