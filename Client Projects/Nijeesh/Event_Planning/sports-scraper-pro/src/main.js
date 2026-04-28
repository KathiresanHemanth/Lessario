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
            // MASSIVE Anti-Bot Delay: We were hammering the engines too fast, causing IP bans.
            // Waiting 15 to 25 seconds between pages to mimic a real human reading search results.
            const delay = Math.floor(Math.random() * (25000 - 15000 + 1) + 15000);
            log.info(`Waiting ${delay/1000} seconds to avoid IP Bans...`);
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

            // Strict filter: MUST be a LinkedIn URL
            const validLeads = leads.filter(lead => {
                const isLinkedIn = lead.link && lead.link.includes('linkedin.com/in/');
                const isIndianDomain = lead.link && lead.link.includes('in.linkedin.com');
                
                const text = (lead.title + ' ' + lead.snippet).toLowerCase();
                const isIndianLocation = text.includes('india') || 
                                         text.includes('mumbai') || 
                                         text.includes('delhi') || 
                                         text.includes('bangalore') || 
                                         text.includes('bengaluru') ||
                                         text.includes('pune') ||
                                         text.includes('hyderabad') ||
                                         text.includes('chennai');
                
                return isLinkedIn && (isIndianDomain || isIndianLocation);
            });

            if (leads.length > 0) {
                // If we found results, and we haven't hit the 20 page limit, enqueue the next page!
                const currentPage = request.userData.pageNum;
                if (currentPage < 20) {
                    const nextPage = currentPage + 1;
                    const nextUrl = request.url.replace(`&pageno=${currentPage}`, `&pageno=${nextPage}`);
                    await crawler.addRequests([{
                        url: nextUrl,
                        userData: { category, pageNum: nextPage }
                    }]);
                    log.info(`Enqueued Page ${nextPage} for ${category}...`);
                }
            } else {
                log.warning(`Hit the end of the search results for ${category} at Page ${request.userData.pageNum}. Stopping this category.`);
            }

            if (validLeads.length === 0 && leads.length > 0) {
                log.warning(`Found ${leads.length} results for ${category}, but none matched the strict India location filter.`);
            }

            for (const lead of validLeads) {
                // Look for Indian mobile numbers in the snippet or title
                // Pattern: Matches 10-digit numbers starting with 6-9, optionally with +91 or 0 prefix
                const phoneRegex = /(?:\+91|0)?[6-9]\d{9}/g;
                const foundPhones = (lead.title + ' ' + lead.snippet).match(phoneRegex);
                const mobile = foundPhones ? foundPhones[0] : null;

                await Dataset.pushData({
                    ...lead,
                    mobile,
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

// Build the queue of searches with massive pagination (100 pages per category)
const searchRequests = [];
for (const cat of config.categories) {
    const roles = config.roles.map(r => `"${r}"`).join(' OR ');
    
    // Clean the category to handle &, commas, and slashes perfectly for all 16 categories!
    let cleanedCat = cat.replace(/ & /g, '" OR "');
    cleanedCat = cleanedCat.replace(/,/g, '');
    cleanedCat = cleanedCat.replace(/\//g, '" OR "');
    
    // This creates perfect queries like: ("AR" OR "VR") or ("Sportswear" OR "Activewear")
    const query = `site:linkedin.com/in/ (${roles}) ("${cleanedCat}") "${config.location}"`;

    // Initialize ONLY Page 1. The script will automatically add Page 2 if Page 1 has results!
    const searchUrl = `http://127.0.0.1:8888/search?q=${encodeURIComponent(query)}&pageno=1`;

    searchRequests.push({
        url: searchUrl,
        userData: { category: cat, pageNum: 1 }
    });
}

log.info('🚀 Starting the Scouting Engine...');
await crawler.run(searchRequests);
log.info('✅ Scouting Complete! Data saved in storage/datasets/default');
