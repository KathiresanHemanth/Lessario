import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
const DATASET_PATH = path.resolve(__dirname, '../storage/datasets/default');
const OUTPUT_PATH = path.resolve(__dirname, '../storage/datasets/enriched');
const SEARXNG_URL = 'http://127.0.0.1:8888/search';

if (!HUNTER_API_KEY) {
    console.error('❌ ERROR: HUNTER_API_KEY is missing in your .env file!');
    process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

function parseTitle(title) {
    const parts = title.split(' - ');
    if (parts.length >= 2) {
        const fullName = parts[0].trim();
        const companyPart = parts[1].split('|')[0].trim();
        return { fullName, company: companyPart };
    }
    const simpleParts = title.split('|');
    return { fullName: simpleParts[0].trim(), company: '' };
}

/**
 * DEEP PHONE HUNT: Uses SearxNG to find potential mobile numbers
 */
async function deepSearchPhone(fullName, company) {
    console.log(`📱 Deep searching for mobile number: ${fullName}...`);
    try {
        const query = `"${fullName}" ${company} mobile number OR contact`;
        const response = await axios.get(SEARXNG_URL, {
            params: { q: query, format: 'json' }
        });

        // Search through the results for Indian mobile patterns
        const phoneRegex = /(?:\+91|0)?[6-9]\d{9}/g;
        const results = response.data.results || [];
        
        for (const res of results) {
            const text = (res.title + ' ' + res.content).replace(/\s/g, '');
            const match = text.match(phoneRegex);
            if (match) return match[0];
        }
    } catch (e) {
        console.error(`   ⚠️ Phone search failed: ${e.message}`);
    }
    return null;
}

async function enrichLeads() {
    console.log('🚀 Starting Enrichment Phase (Email & Deep Phone Hunt)...');
    
    const files = fs.readdirSync(DATASET_PATH).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} leads to process.`);

    for (const file of files) {
        const filePath = path.join(DATASET_PATH, file);
        const lead = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const { fullName, company } = parseTitle(lead.title);
        
        if (!fullName) continue;

        let enrichedLead = { ...lead, fullName, companyName: company };

        // 1. EMAIL ENRICHMENT (Hunter.io)
        if (!lead.email) {
            try {
                console.log(`📧 Finding email for: ${fullName}...`);
                const response = await axios.get('https://api.hunter.io/v2/email-finder', {
                    params: { full_name: fullName, company: company, api_key: HUNTER_API_KEY }
                });
                if (response.data.data?.email) {
                    console.log(`   ✅ Email Found: ${response.data.data.email}`);
                    enrichedLead.email = response.data.data.email;
                }
            } catch (e) {
                console.error(`   ❌ Email error: ${e.message}`);
            }
        }

        // 2. DEEP PHONE HUNT (SearxNG)
        if (!lead.mobile) {
            const mobile = await deepSearchPhone(fullName, company);
            if (mobile) {
                console.log(`   ✅ Mobile Found: ${mobile}`);
                enrichedLead.mobile = mobile;
            } else {
                console.log(`   ⚠️ No mobile found in deep search.`);
            }
        }

        // Save progress
        fs.writeFileSync(
            path.join(OUTPUT_PATH, file),
            JSON.stringify(enrichedLead, null, 2)
        );

        // Sleep to be polite
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('✅ Enrichment Complete! Check storage/datasets/enriched');
}

enrichLeads();
