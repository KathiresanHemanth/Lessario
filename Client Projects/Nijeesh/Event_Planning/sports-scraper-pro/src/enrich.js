import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const DATASET_PATH = path.resolve(__dirname, '../storage/datasets/default');
const OUTPUT_PATH = path.resolve(__dirname, '../storage/datasets/enriched');

if (!APOLLO_API_KEY) {
    console.error('❌ ERROR: APOLLO_API_KEY is missing in your .env file!');
    process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

async function enrichLeads() {
    console.log('🚀 Starting Enrichment Phase (Apollo.io)...');
    
    const files = fs.readdirSync(DATASET_PATH).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} leads to enrich.`);

    for (const file of files) {
        const filePath = path.join(DATASET_PATH, file);
        const lead = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!lead.link || !lead.link.includes('linkedin.com/in/')) {
            console.log(`Skipping ${file}: No valid LinkedIn URL.`);
            continue;
        }

        console.log(`🔍 Enriching: ${lead.title}...`);

        try {
            const response = await axios.post('https://api.apollo.io/v1/people/match', {
                api_key: APOLLO_API_KEY,
                linkedin_url: lead.link
            });

            const person = response.data.person;
            
            if (person && person.email) {
                console.log(`✅ FOUND: ${person.email}`);
                const enrichedLead = {
                    ...lead,
                    email: person.email,
                    firstName: person.first_name,
                    lastName: person.last_name,
                    companyName: person.organization ? person.organization.name : '',
                    jobTitle: person.title,
                    enrichmentStatus: 'success',
                    enrichedAt: new Date().toISOString()
                };

                fs.writeFileSync(
                    path.join(OUTPUT_PATH, file),
                    JSON.stringify(enrichedLead, null, 2)
                );
            } else {
                console.log(`⚠️ No email found for ${lead.title}`);
            }
        } catch (error) {
            console.error(`❌ Error enriching ${lead.title}: ${error.response?.data?.error || error.message}`);
        }

        // Avoid hitting Apollo rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✅ Enrichment Complete! Check storage/datasets/enriched');
}

enrichLeads();
