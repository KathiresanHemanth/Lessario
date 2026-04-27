import { PlaywrightCrawler, Dataset, log } from 'crawlee';
import fs from 'fs';
import path from 'path';

// Set up logging
log.setLevel(log.LEVELS.INFO);

// Ensure the config file exists
const configPath = path.resolve('./categories.json');
if (!fs.existsSync(configPath)) {
    log.error('categories.json not found! Please ensure it is in the root of the project.');
    process.exit(1);
}

// Load our configuration
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Initialize the crawler
const crawler = new PlaywrightCrawler({
    // Use the stealth features automatically
    useFingerprints: true,
    
    // Limits to avoid getting blocked too quickly
    maxConcurrency: 2,
    maxRequestsPerCrawl: 100,

    async requestHandler({ page, request }) {
        const { category } = request.userData;
        log.info(`Scouting Category: ${category} - URL: ${request.url}`);

        try {
            // Wait for search results to load (DuckDuckGo generic result selector)
            // Note: Selectors might need adjustment based on DDG's current layout
            await page.waitForSelector('article', { timeout: 10000 }).catch(() => log.warning('Timeout waiting for article selector. Page might have different layout or captcha.'));

            // Extract Name and LinkedIn URL from the search results
            const leads = await page.$$eval('article', (elements) => {
                return elements.map(el => {
                    const titleEl = el.querySelector('h2');
                    const linkEl = el.querySelector('a');
                    // DuckDuckGo sometimes uses specific classes for snippets, fallback to generic div if needed
                    const snippetEl = el.querySelector('.result__snippet') || el.querySelector('div:nth-child(2)');
                    
                    const title = titleEl ? titleEl.innerText : '';
                    const link = linkEl ? linkEl.href : '';
                    const snippet = snippetEl ? snippetEl.innerText : '';
                    
                    return { title, link, snippet };
                }).filter(item => item.link.includes('linkedin.com/in/'));
            });

            // Add the category tag and save to our dataset
            for (const lead of leads) {
                await Dataset.pushData({
                    ...lead,
                    category,
                    scrapedAt: new Date().toISOString(),
                });
            }
            
            log.info(`Found ${leads.length} leads for ${category}`);
        } catch (error) {
            log.error(`Error processing ${request.url}: ${error.message}`);
        }
    },

    // Handle failed requests
    failedRequestHandler({ request }) {
        log.error(`Request ${request.url} failed completely.`);
    },
});

// Generate initial search requests for each category
const searchRequests = [];
for (const cat of config.categories) {
    // We construct a DuckDuckGo search query.
    // Example: site:linkedin.com/in/ ("CEO" OR "Founder" OR "Marketing Head") "Sportswear" "India"
    const roles = config.roles.map(r => `"${r}"`).join(' OR ');
    const query = `site:linkedin.com/in/ (${roles}) "${cat}" "${config.location}"`;
    
    // Using DuckDuckGo HTML version is often easier to scrape, but let's try standard first
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    searchRequests.push({
        url: searchUrl,
        userData: { category: cat }
    });
}

log.info('🚀 Starting the Scouting Engine...');
await crawler.run(searchRequests);
log.info('✅ Scouting Complete. Check the "storage/datasets/default" folder for your leads!');
