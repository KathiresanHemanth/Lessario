import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All our data sources
const CLEAN_FILE = path.join(__dirname, '../leads_clean.json');
const PATTERN_FILE = path.join(__dirname, '../leads_enriched_pattern.json');
const WEBSITE_FILE = path.join(__dirname, '../leads_enriched_website.json');
const GOOGLE_FILE = path.join(__dirname, '../leads_enriched_google.json');

const OUTPUT_JSON = path.join(__dirname, '../final_enriched_leads.json');
const OUTPUT_CSV = path.join(__dirname, '../final_enriched_leads.csv');

function loadJson(file) {
    if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    return [];
}

function compileData() {
    console.log('🔄 Compiling all enriched data sources...');

    const baseLeads = loadJson(CLEAN_FILE);
    const patternLeads = loadJson(PATTERN_FILE);
    const websiteLeads = loadJson(WEBSITE_FILE);
    const googleLeads = loadJson(GOOGLE_FILE);

    // Create lookup maps by linkedinUrl
    const patternMap = new Map(patternLeads.map(l => [l.linkedinUrl, l]));
    const websiteMap = new Map(websiteLeads.map(l => [l.linkedinUrl, l]));
    const googleMap = new Map(googleLeads.map(l => [l.linkedinUrl, l]));

    let emailCount = 0;
    let phoneCount = 0;

    const finalLeads = baseLeads.map(lead => {
        const url = lead.linkedinUrl;
        
        let allEmails = new Set();
        let allPhones = new Set();

        // 1. Add Website scraped contacts
        if (websiteMap.has(url)) {
            const wl = websiteMap.get(url);
            (wl.companyEmails || []).forEach(e => allEmails.add(e));
            (wl.companyPhones || []).forEach(p => allPhones.add(p));
        }

        // 2. Add Google Dorked contacts
        if (googleMap.has(url)) {
            const gl = googleMap.get(url);
            (gl.emails || []).forEach(e => allEmails.add(e));
            (gl.phones || []).forEach(p => allPhones.add(p));
        }

        // 3. Add Pattern generated emails
        if (patternMap.has(url)) {
            const pl = patternMap.get(url);
            (pl.guessedEmails || []).forEach(e => allEmails.add(`[GUESSED] ${e}`));
        }

        const finalEmails = Array.from(allEmails);
        const finalPhones = Array.from(allPhones);

        if (finalEmails.some(e => !e.startsWith('[GUESSED]'))) emailCount++;
        if (finalPhones.length > 0) phoneCount++;

        return {
            Name: lead.name,
            Role: lead.role || '',
            Company: lead.company || '',
            Category: lead.category || '',
            LinkedIn: lead.linkedinUrl,
            Domain: lead.domain || '',
            Emails: finalEmails.join(' | '),
            Phones: finalPhones.join(' | ')
        };
    });

    console.log(`\n📊 FINAL ENRICHMENT RESULTS:`);
    console.log(`   - Total Unique Leads: ${finalLeads.length}`);
    console.log(`   - Leads with scraped emails: ${emailCount}`);
    console.log(`   - Leads with scraped phones: ${phoneCount}`);

    // Export to JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(finalLeads, null, 2));

    // Export to CSV
    const csvHeaders = ['Name', 'Role', 'Company', 'Category', 'LinkedIn', 'Domain', 'Emails', 'Phones'];
    const escapeCsv = (str) => {
        if (!str) return '';
        const stringified = String(str);
        if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
            return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
    };

    const csvContent = [
        csvHeaders.join(','),
        ...finalLeads.map(lead => csvHeaders.map(h => escapeCsv(lead[h])).join(','))
    ].join('\n');

    fs.writeFileSync(OUTPUT_CSV, csvContent);

    console.log(`\n✅ Saved Final JSON: ${OUTPUT_JSON}`);
    console.log(`✅ Saved Final CSV: ${OUTPUT_CSV}`);
}

compileData();
