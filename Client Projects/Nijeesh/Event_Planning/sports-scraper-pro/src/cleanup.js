import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../leads_export.json');
const OUTPUT_FILE = path.join(__dirname, '../leads_clean.json');

// Helper to clean LinkedIn URL
function cleanLinkedInUrl(url) {
    if (!url) return '';
    let clean = url.split('#')[0]; // Remove fragment
    clean = clean.split('?')[0]; // Remove query params
    if (clean.endsWith('/')) {
        clean = clean.slice(0, -1);
    }
    return clean.toLowerCase();
}

// Helper to guess company domain
function guessDomain(companyName) {
    if (!companyName) return '';
    
    // Remove common suffixes
    let cleanName = companyName.toLowerCase()
        .replace(/pvt\.?\s*ltd\.?/g, '')
        .replace(/private limited/g, '')
        .replace(/ltd\.?/g, '')
        .replace(/inc\.?/g, '')
        .replace(/llc/g, '')
        .replace(/corporation/g, '')
        .replace(/corp/g, '')
        .replace(/[^a-z0-9]/g, ''); // Remove spaces and special chars
        
    if (cleanName.length < 2) return '';
    
    return `${cleanName}.com`; // Simple guess, can be improved or we can use clearbit logo API later
}

function cleanup() {
    console.log('🧹 Starting Phase 1: Data Cleanup...');
    
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`❌ Input file not found: ${INPUT_FILE}`);
        return;
    }

    const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
    const leads = JSON.parse(rawData);
    
    console.log(`📥 Loaded ${leads.length} raw leads`);

    const uniqueLeads = new Map();
    let mergedCount = 0;
    let readMoreCount = 0;

    for (const lead of leads) {
        const cleanUrl = cleanLinkedInUrl(lead.linkedinUrl);
        
        // Skip leads with no valid URL
        if (!cleanUrl || !cleanUrl.includes('linkedin.com/in/')) continue;

        const isReadMore = lead.name.toLowerCase().includes('read more');
        if (isReadMore) readMoreCount++;

        if (uniqueLeads.has(cleanUrl)) {
            // Merge logic
            const existing = uniqueLeads.get(cleanUrl);
            
            // If the current is a "Read more", maybe we can extract better company/role from snippet
            // But usually the parent has the actual name.
            if (isReadMore) {
                existing.snippet = existing.snippet + '\n---\n' + lead.snippet;
            } else if (existing.name.toLowerCase().includes('read more') && !isReadMore) {
                // The existing one was a "Read more", but now we found the actual profile
                lead.snippet = existing.snippet + '\n---\n' + lead.snippet;
                uniqueLeads.set(cleanUrl, lead);
            } else {
                // Both are normal profiles? Just keep the one with a better name
                if (existing.name.length < lead.name.length) {
                    uniqueLeads.set(cleanUrl, lead);
                }
            }
            mergedCount++;
        } else {
            uniqueLeads.set(cleanUrl, { ...lead, linkedinUrl: cleanUrl });
        }
    }

    // Second pass: clean up fields and add guessed domains
    const cleanedLeads = Array.from(uniqueLeads.values()).map(lead => {
        // Clean up role (sometimes contains trailing "...")
        let role = lead.role || '';
        if (role.endsWith('...')) role = role.slice(0, -3).trim();
        
        // Clean up company
        let company = lead.company || '';
        if (company.endsWith('...')) company = company.slice(0, -3).trim();
        
        // Try to extract company from role if company is empty
        if (!company && role.includes(' at ')) {
            const parts = role.split(' at ');
            company = parts[parts.length - 1].trim();
            role = parts[0].trim();
        } else if (!company && role.includes('@')) {
            const parts = role.split('@');
            company = parts[parts.length - 1].trim();
            role = parts[0].trim();
        }
        
        return {
            ...lead,
            role,
            company,
            domain: guessDomain(company),
            emails: [], // Prepare for Phase 2+
            phones: []  // Prepare for Phase 2+
        };
    }).filter(lead => lead.name && !lead.name.toLowerCase().includes('read more') && lead.name.length > 2);

    console.log(`\n🔍 Cleanup Results:`);
    console.log(`   - "Read more" entries found: ${readMoreCount}`);
    console.log(`   - Duplicates merged/removed: ${mergedCount}`);
    console.log(`   - Invalid names filtered: ${uniqueLeads.size - cleanedLeads.length}`);
    console.log(`   - Final clean leads: ${cleanedLeads.length}`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanedLeads, null, 2));
    console.log(`\n✅ Saved cleaned leads to: ${OUTPUT_FILE}`);
}

cleanup();
