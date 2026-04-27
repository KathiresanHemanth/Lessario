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
    headless: true, // Run in headless mode
    // useFingerprints: false,
    maxConcurrency: 3,

    async requestHandler({ page, request }) {
        const { category } = request.userData;
        log.info(`Scouting Category: ${category} - URL: ${request.url}`);

        try {
            // Wait for results to load. Using DuckDuckGo Lite/HTML structure for reliability
            await page.waitForSelector('.result', { timeout: 15000 });

            // Extract Name and LinkedIn URL
            const leads = await page.$$eval('.result', (elements) => {
                return elements.map(el => {
                    const linkEl = el.querySelector('.result__url');
                    const titleEl = el.querySelector('.result__title');
                    const snippetEl = el.querySelector('.result__snippet');

                    const title = titleEl ? titleEl.innerText : '';
                    const link = linkEl ? linkEl.href : '';
                    const snippet = snippetEl ? snippetEl.innerText : '';

                    return { title, link, snippet };
                }).filter(item => item.link.includes('linkedin.com/in/'));
            });

            // Save to Crawlee dataset
            for (const lead of leads) {
                await Dataset.pushData({
                    ...lead,
                    category,
                    scrapedAt: new Date().toISOString(),
                });
            }

            log.info(`Found ${leads.length} valid LinkedIn profiles for ${category}`);
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

    // Using DuckDuckGo HTML version to avoid dynamic JS captcha blocks on initial searches
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

    searchRequests.push({
        url: searchUrl,
        userData: { category: cat }
    });
}

log.info('🚀 Starting the Scouting Engine...');
await crawler.run(searchRequests);
log.info('✅ Scouting Complete! Data saved in storage/datasets/default');
