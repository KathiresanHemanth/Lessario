import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_PATH = path.resolve(__dirname, '../storage/datasets/default');
const OUTPUT_CSV = path.resolve(__dirname, '../leads_export.csv');
const OUTPUT_JSON = path.resolve(__dirname, '../leads_export.json');

console.log('📊 Starting Deduplication & Export...\n');

// 1. Load all JSON files
const files = fs.readdirSync(DATASET_PATH).filter(f => f.endsWith('.json'));
console.log(`📁 Found ${files.length} raw lead files`);

const allLeads = [];
for (const file of files) {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(DATASET_PATH, file), 'utf8'));
        allLeads.push(data);
    } catch (e) {
        // Skip malformed files
    }
}
console.log(`📥 Loaded ${allLeads.length} leads`);

// 2. Deduplicate by LinkedIn URL
const seen = new Map();
for (const lead of allLeads) {
    // Normalize the LinkedIn URL for dedup
    let url = (lead.link || '').trim().toLowerCase();
    // Remove trailing slashes and query params
    url = url.split('?')[0].replace(/\/+$/, '');

    if (!url || !url.includes('linkedin.com/in/')) continue;

    if (!seen.has(url)) {
        seen.set(url, lead);
    } else {
        // If we already have this URL, keep the one with more data
        const existing = seen.get(url);
        const existingScore = (existing.title?.length || 0) + (existing.snippet?.length || 0);
        const newScore = (lead.title?.length || 0) + (lead.snippet?.length || 0);
        if (newScore > existingScore) {
            seen.set(url, lead);
        }
    }
}

const uniqueLeads = Array.from(seen.values());
console.log(`🔍 After deduplication: ${uniqueLeads.length} unique leads (removed ${allLeads.length - uniqueLeads.length} duplicates)\n`);

// 3. Parse the name from the LinkedIn title
// LinkedIn titles look like: "FirstName LastName - Title at Company | LinkedIn"
function parseName(title) {
    if (!title) return { name: '', role: '', company: '' };

    // Remove " | LinkedIn" suffix
    let clean = title.replace(/\s*\|\s*LinkedIn\s*$/i, '').trim();

    // Split by " - " to get name and role/company
    const parts = clean.split(' - ');
    const name = parts[0]?.trim() || '';

    let role = '';
    let company = '';
    if (parts.length > 1) {
        const roleCompany = parts.slice(1).join(' - ');
        // Try to split by " at " or " @ "
        const atSplit = roleCompany.split(/\s+at\s+|\s+@\s+/i);
        if (atSplit.length > 1) {
            role = atSplit[0].trim();
            company = atSplit.slice(1).join(' at ').trim();
        } else {
            role = roleCompany.trim();
        }
    }

    return { name, role, company };
}

// 4. Build category summary
const categoryCount = {};
for (const lead of uniqueLeads) {
    const cat = lead.category || 'Unknown';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
}

console.log('📋 Leads per category:');
console.log('─'.repeat(50));
for (const [cat, count] of Object.entries(categoryCount).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${count}`);
}
console.log('─'.repeat(50));

// 5. Export to CSV
const csvHeader = 'Name,Role,Company,LinkedIn URL,Category,Mobile,Snippet';
const csvRows = uniqueLeads.map(lead => {
    const { name, role, company } = parseName(lead.title);
    const escapeCsv = (str) => {
        if (!str) return '';
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        str = String(str).replace(/"/g, '""');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str}"`;
        }
        return str;
    };

    return [
        escapeCsv(name),
        escapeCsv(role),
        escapeCsv(company),
        escapeCsv(lead.link),
        escapeCsv(lead.category),
        escapeCsv(lead.mobile || ''),
        escapeCsv((lead.snippet || '').substring(0, 200))
    ].join(',');
});

const csvContent = [csvHeader, ...csvRows].join('\n');
fs.writeFileSync(OUTPUT_CSV, csvContent, 'utf8');
console.log(`\n✅ CSV exported: ${OUTPUT_CSV}`);
console.log(`   → ${uniqueLeads.length} rows`);

// 6. Also export clean JSON
const cleanLeads = uniqueLeads.map(lead => {
    const { name, role, company } = parseName(lead.title);
    return {
        name,
        role,
        company,
        linkedinUrl: lead.link,
        category: lead.category,
        mobile: lead.mobile || null,
        snippet: (lead.snippet || '').substring(0, 200),
        scrapedAt: lead.scrapedAt
    };
});
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(cleanLeads, null, 2), 'utf8');
console.log(`✅ JSON exported: ${OUTPUT_JSON}`);

console.log(`\n🎯 FINAL RESULT: ${uniqueLeads.length} unique, deduplicated LinkedIn profiles ready for outreach!`);
