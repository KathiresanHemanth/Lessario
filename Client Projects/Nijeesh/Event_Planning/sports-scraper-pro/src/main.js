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
log.setLevel(log.LEVELS.DEBUG);

// Load configuration
const configPath = path.resolve(__dirname, '../categories.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Debug directory for screenshots
const debugDir = path.resolve(__dirname, '../storage/debug');
if (!fs.existsSync(debugDir)) {
    fs.mkdirSync(debugDir, { recursive: true });
}

// Track total leads found
let totalLeadsFound = 0;

// Initialize the crawler
const crawler = new PlaywrightCrawler({
    headless: false, // Visible mode so you can manually solve CAPTCHAs
    maxConcurrency: 1, // Only one search at a time
    navigationTimeoutSecs: 120, // Give pages time to load
    requestHandlerTimeoutSecs: 600, // 10 minutes per request (for CAPTCHA solving)

    async requestHandler({ page, request }) {
        const { category } = request.userData;
        log.info(`Scouting Category: ${category} - URL: ${request.url}`);

        try {
            // Random delay between 20-35 seconds to mimic human behavior
            const delay = Math.floor(Math.random() * (35000 - 20000 + 1) + 20000);
            log.info(`⏳ Waiting ${(delay / 1000).toFixed(1)} seconds to avoid IP bans...`);
            await page.waitForTimeout(delay);

            // Check if we hit a CAPTCHA or consent page
            log.info(`🔍 Checking for CAPTCHA... If you see one, solve it manually. You have 5 minutes.`);

            // Wait for EITHER the search results OR common Google elements to appear
            // Google uses different selectors in different regions/versions
            try {
                await page.waitForSelector('#search, #rso, #main, .srg, #center_col', { timeout: 300000 });
            } catch (e) {
                // If nothing loads in 5 mins, save debug info and skip
                log.error(`⏰ Timeout waiting for results. Saving debug screenshot...`);
                const screenshotPath = path.join(debugDir, `timeout_${category.replace(/[^a-z0-9]/gi, '_')}.png`);
                await page.screenshot({ path: screenshotPath, fullPage: true });
                log.info(`📸 Debug screenshot saved: ${screenshotPath}`);
                return;
            }

            // Extra wait for dynamic content to finish rendering
            await page.waitForTimeout(3000);

            // Save a debug screenshot of the FIRST category to see what Google is serving
            const pageNum = request.userData.pageNum;
            const screenshotName = `${category.replace(/[^a-z0-9]/gi, '_')}_page${pageNum}.png`;
            const screenshotPath = path.join(debugDir, screenshotName);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            log.info(`📸 Screenshot saved: ${screenshotName}`);

            // ============================================================
            // BULLETPROOF EXTRACTION: Don't rely on .g class!
            // Instead, find ALL links on the page and filter for LinkedIn.
            // Then grab surrounding text for context.
            // ============================================================
            const leads = await page.evaluate(() => {
                const results = [];
                const seenLinks = new Set();

                // Strategy 1: Find all anchor tags with LinkedIn profile URLs
                const allLinks = document.querySelectorAll('a[href*="linkedin.com/in/"]');

                for (const link of allLinks) {
                    const href = link.href;

                    // Skip duplicates and Google redirect URLs
                    if (seenLinks.has(href)) continue;
                    seenLinks.add(href);

                    // Clean the URL (Google sometimes wraps URLs in redirects)
                    let cleanUrl = href;
                    if (href.includes('/url?')) {
                        try {
                            const urlParams = new URL(href);
                            cleanUrl = urlParams.searchParams.get('q') || urlParams.searchParams.get('url') || href;
                        } catch (e) { /* keep original */ }
                    }

                    if (!cleanUrl.includes('linkedin.com/in/')) continue;

                    // Find the title: look for h3 inside or near this link
                    let title = '';
                    const h3 = link.querySelector('h3') || link.closest('div')?.querySelector('h3');
                    if (h3) {
                        title = h3.innerText;
                    } else {
                        title = link.innerText || link.textContent || '';
                    }

                    // Find snippet: walk up to the parent container and grab surrounding text
                    let snippet = '';
                    let container = link.closest('div[data-sokoban]') ||
                        link.closest('div[class*="g"]') ||
                        link.closest('div[data-hveid]') ||
                        link.parentElement?.parentElement?.parentElement;
                    if (container) {
                        snippet = container.innerText || '';
                        // Remove the title from the snippet to avoid duplication
                        snippet = snippet.replace(title, '').trim();
                    }

                    if (title || cleanUrl) {
                        results.push({
                            title: title.trim(),
                            link: cleanUrl,
                            snippet: snippet.substring(0, 500) // Cap snippet length
                        });
                    }
                }

                // Strategy 2: Also check cite elements (Google shows URLs in cite tags)
                const cites = document.querySelectorAll('cite');
                for (const cite of cites) {
                    const citeText = cite.innerText || '';
                    if (citeText.includes('linkedin.com/in/') && !seenLinks.has(citeText)) {
                        // Find the parent result block
                        const parent = cite.closest('div[data-hveid]') || cite.closest('div[class]');
                        const linkEl = parent?.querySelector('a');
                        const h3El = parent?.querySelector('h3');

                        if (linkEl && linkEl.href) {
                            let cleanUrl = linkEl.href;
                            if (cleanUrl.includes('/url?')) {
                                try {
                                    cleanUrl = new URL(cleanUrl).searchParams.get('q') || cleanUrl;
                                } catch (e) { }
                            }

                            if (!seenLinks.has(cleanUrl) && cleanUrl.includes('linkedin.com/in/')) {
                                seenLinks.add(cleanUrl);
                                results.push({
                                    title: h3El ? h3El.innerText.trim() : '',
                                    link: cleanUrl,
                                    snippet: parent ? parent.innerText.substring(0, 500) : ''
                                });
                            }
                        }
                    }
                }

                return results;
            });

            log.info(`🔎 Raw extraction found ${leads.length} LinkedIn links on page`);

            // Also log what selectors exist on the page for debugging
            const debugInfo = await page.evaluate(() => {
                return {
                    hasSearch: !!document.querySelector('#search'),
                    hasRso: !!document.querySelector('#rso'),
                    hasDotG: document.querySelectorAll('.g').length,
                    hasH3: document.querySelectorAll('h3').length,
                    totalLinks: document.querySelectorAll('a').length,
                    linkedinLinks: document.querySelectorAll('a[href*="linkedin.com"]').length,
                    pageTitle: document.title,
                    bodyTextLength: document.body?.innerText?.length || 0
                };
            });
            log.info(`🐛 Debug: ${JSON.stringify(debugInfo)}`);

            // Filter for Indian profiles (relaxed filter - since we're already searching for India)
            const validLeads = leads.filter(lead => {
                const text = (lead.title + ' ' + lead.snippet + ' ' + lead.link).toLowerCase();

                // Since our Google dork already includes "India", most results should be relevant
                // But let's still do a soft check
                const isIndian = text.includes('india') ||
                    text.includes('mumbai') ||
                    text.includes('delhi') ||
                    text.includes('bangalore') ||
                    text.includes('bengaluru') ||
                    text.includes('pune') ||
                    text.includes('hyderabad') ||
                    text.includes('chennai') ||
                    text.includes('kolkata') ||
                    text.includes('in.linkedin.com') ||
                    text.includes('noida') ||
                    text.includes('gurgaon') ||
                    text.includes('gurugram') ||
                    text.includes('ahmedabad') ||
                    text.includes('jaipur');

                return isIndian;
            });

            // If the India filter removed everything but we have leads, keep them all
            // (the Google dork already filters for India)
            const finalLeads = validLeads.length > 0 ? validLeads : leads;

            if (leads.length > 0) {
                log.info(`✅ ${leads.length} total LinkedIn profiles found, ${validLeads.length} confirmed Indian`);

                // Enqueue next page if under limit
                const currentPage = request.userData.pageNum;
                if (currentPage < 10) { // Max 10 pages per category
                    const nextPage = currentPage + 1;
                    const startParam = currentPage * 10;

                    const urlObj = new URL(request.url);
                    urlObj.searchParams.set('start', startParam.toString());

                    await crawler.addRequests([{
                        url: urlObj.toString(),
                        userData: { category, pageNum: nextPage }
                    }]);
                    log.info(`📄 Enqueued Page ${nextPage} for ${category}...`);
                }
            } else {
                log.warning(`⚠️ No LinkedIn profiles found for "${category}" on Page ${pageNum}. Check the debug screenshot.`);
            }

            // Save valid leads
            for (const lead of finalLeads) {
                // Look for Indian mobile numbers
                const phoneRegex = /(?:\+91|0)?[6-9]\d{9}/g;
                const foundPhones = (lead.title + ' ' + lead.snippet).match(phoneRegex);
                const mobile = foundPhones ? foundPhones[0] : null;

                await Dataset.pushData({
                    ...lead,
                    mobile,
                    category,
                    scrapedAt: new Date().toISOString(),
                });
                totalLeadsFound++;
            }

            log.info(`📊 Saved ${finalLeads.length} leads for "${category}" | Running total: ${totalLeadsFound}`);
        } catch (error) {
            log.error(`❌ Error processing ${request.url}: ${error.message}`);
            // Save error screenshot
            try {
                const screenshotPath = path.join(debugDir, `error_${category.replace(/[^a-z0-9]/gi, '_')}.png`);
                await page.screenshot({ path: screenshotPath, fullPage: true });
                log.info(`📸 Error screenshot saved`);
            } catch (e) { }
        }
    },

    failedRequestHandler({ request }) {
        log.error(`💀 Request ${request.url} failed completely after retries.`);
    },
});

// Build the queue of searches
const searchRequests = [];
for (const cat of config.categories) {
    // Use fewer roles to keep the query shorter (Google has a query length limit)
    const topRoles = ['CEO', 'Founder', 'Co-Founder', 'Director', 'Managing Director', 'Owner'];
    const roles = topRoles.map(r => `"${r}"`).join(' OR ');

    // Clean the category to handle &, commas, and slashes
    let cleanedCat = cat.replace(/ & /g, '" OR "');
    cleanedCat = cleanedCat.replace(/,/g, '');
    cleanedCat = cleanedCat.replace(/\//g, '" OR "');

    // Google Dork query
    const query = `site:linkedin.com/in/ (${roles}) ("${cleanedCat}") "India"`;

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=20`;

    searchRequests.push({
        url: searchUrl,
        userData: { category: cat, pageNum: 1 }
    });
}

log.info('🚀 Starting Google Dorking Engine...');
log.info(`📋 ${searchRequests.length} categories to search`);
log.info(`📸 Debug screenshots will be saved to: ${debugDir}`);

// Clear old dataset
const datasetDir = path.resolve(__dirname, '../storage/datasets/default');
if (fs.existsSync(datasetDir)) {
    const oldFiles = fs.readdirSync(datasetDir).filter(f => f.endsWith('.json'));
    for (const f of oldFiles) {
        fs.unlinkSync(path.join(datasetDir, f));
    }
    log.info(`🧹 Cleared ${oldFiles.length} old results from previous run`);
}

await crawler.run(searchRequests);
log.info(`✅ Scouting Complete! Total leads found: ${totalLeadsFound}`);
log.info(`📁 Data saved in storage/datasets/default`);
log.info(`📸 Debug screenshots in storage/debug`);
