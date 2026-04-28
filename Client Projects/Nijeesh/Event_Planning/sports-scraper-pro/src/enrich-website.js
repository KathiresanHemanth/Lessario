import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../leads_clean.json');
const OUTPUT_FILE = path.join(__dirname, '../leads_enriched_website.json');

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const phoneRegex = /(?:\+91|0)?[6-9]\d{4}\s?\d{5}/g;

async function fetchPage(url) {
    try {
        const response = await axios.get(url, { 
            timeout: 10000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        return response.data;
    } catch (e) {
        return '';
    }
}

async function scrapeWebsites() {
    console.log('🌐 Starting Phase 3: Company Website Scraping (Axios version)...');

    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`❌ Input file not found: ${INPUT_FILE}`);
        return;
    }

    let leads = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    let enrichedMap = new Map();

    if (fs.existsSync(OUTPUT_FILE)) {
        const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        existing.forEach(l => enrichedMap.set(l.linkedinUrl, l));
        console.log(`Loaded ${existing.length} previously website-enriched leads.`);
    }

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

    const pendingDomains = Array.from(domainsToCrawl).filter(domain => {
        const linkedInUrls = domainToLeads.get(domain);
        return linkedInUrls.some(url => !enrichedMap.get(url).websiteEnriched);
    });

    console.log(`Found ${pendingDomains.length} domains to crawl.`);

    if (pendingDomains.length === 0) {
        console.log('✅ All company websites crawled!');
        return;
    }

    // Process in batches so we don't overwhelm network
    const BATCH_SIZE = 10;
    
    for (let i = 0; i < pendingDomains.length; i += BATCH_SIZE) {
        const batch = pendingDomains.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(pendingDomains.length / BATCH_SIZE)}...`);
        
        await Promise.all(batch.map(async (domain) => {
            const base = `http://www.${domain}`;
            const urls = [base, `${base}/contact`, `${base}/contact-us`, `${base}/about`, `${base}/about-us`];
            
            const foundEmails = new Set();
            const foundPhones = new Set();
            
            for (const url of urls) {
                const text = await fetchPage(url);
                if (!text) continue;
                
                const emails = text.match(emailRegex) || [];
                const phones = text.match(phoneRegex) || [];
                
                emails.forEach(e => foundEmails.add(e.toLowerCase()));
                phones.forEach(p => {
                    const clean = p.replace(/\s/g, '');
                    if (clean.length >= 10) foundPhones.add(clean);
                });
            }
            
            const emailsArr = Array.from(foundEmails).filter(e => !e.includes('.png') && !e.includes('.jpg'));
            const phonesArr = Array.from(foundPhones);
            
            if (emailsArr.length > 0 || phonesArr.length > 0) {
                console.log(`[${domain}] Found ${emailsArr.length} emails, ${phonesArr.length} phones`);
            }
            
            // Update leads
            const linkedInUrls = domainToLeads.get(domain);
            for (const url of linkedInUrls) {
                const lead = enrichedMap.get(url);
                lead.websiteEnriched = true;
                lead.companyEmails = emailsArr;
                lead.companyPhones = phonesArr;
                enrichedMap.set(url, lead);
            }
        }));
        
        // Save after each batch
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(Array.from(enrichedMap.values()), null, 2));
    }

    console.log(`✅ Saved website-enriched leads to: ${OUTPUT_FILE}`);
}

scrapeWebsites();
