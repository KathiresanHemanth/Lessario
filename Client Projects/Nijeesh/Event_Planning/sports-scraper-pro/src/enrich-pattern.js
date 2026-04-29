import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../leads_clean.json'); // You can change this to pipeline output
const OUTPUT_FILE = path.join(__dirname, '../leads_enriched_pattern.json');

function generateEmailPatterns(firstName, lastName, domain) {
    if (!firstName || !domain) return [];
    
    const f = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const l = lastName ? lastName.toLowerCase().replace(/[^a-z]/g, '') : '';
    const d = domain.toLowerCase();
    
    if (!l) {
        return [`${f}@${d}`];
    }

    return [
        `${f}@${d}`,
        `${f}.${l}@${d}`,
        `${f}${l}@${d}`,
        `${f.charAt(0)}${l}@${d}`,
        `${f}_${l}@${d}`,
        `${f.charAt(0)}.${l}@${d}`
    ];
}

function runPatternGeneration() {
    console.log('🎯 Starting Phase 5: Pattern-Based Email Generation...');

    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`❌ Input file not found: ${INPUT_FILE}`);
        return;
    }

    let leads = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    let generatedCount = 0;

    const enrichedLeads = leads.map(lead => {
        if (!lead.domain) return lead;

        // Parse first/last name
        const nameParts = lead.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

        const guessedEmails = generateEmailPatterns(firstName, lastName, lead.domain);
        
        if (guessedEmails.length > 0) {
            generatedCount++;
        }

        return {
            ...lead,
            guessedEmails
        };
    });

    console.log(`✅ Generated email patterns for ${generatedCount} leads.`);
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enrichedLeads, null, 2));
    console.log(`✅ Saved pattern-enriched leads to: ${OUTPUT_FILE}`);
    console.log('\n💡 Note: You can verify these guessed emails using a tool like NeverBounce, ZeroBounce, or QuickEmailVerification.');
}

runPatternGeneration();
