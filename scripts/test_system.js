/**
 * System Verification & Diagnostic Script for Transworld Logistics Platform
 * Run with: node scripts/test_system.js
 */

const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("🧪 TRANSWORLD LOGISTICS PLATFORM - SYSTEM INTEGRITY TEST");
console.log("==================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`  ❌ FAIL: ${message}`);
        failed++;
    }
}

// 1. Verify Essential Project Files
console.log("1. Checking Required Core Project Files:");
const coreFiles = [
    'schema.sql',
    'supabase_setup.sql',
    'src/app/page.tsx',
    'src/app/admin/dashboard/add/page.tsx',
    'src/app/admin/dashboard/layout.tsx',
    'src/components/Header.tsx',
    'src/components/MapPicker.tsx',
    'src/components/LiveMap.tsx',
    'src/lib/email.ts',
    'src/lib/supabase.ts'
];

coreFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    assert(fs.existsSync(filePath), `File exists: ${file}`);
});

// 2. Verify Unified SQL Schema Content
console.log("\n2. Validating Unified SQL Schema ('schema.sql'):");
const schemaContent = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf-8');
assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS shipments'), 'schema.sql defines shipments table');
assert(schemaContent.includes('sender_phone'), 'schema.sql defines sender_phone column');
assert(schemaContent.includes('recipient_phone'), 'schema.sql defines recipient_phone column');
assert(schemaContent.includes('service_level'), 'schema.sql defines service_level column');
assert(schemaContent.includes('carrier'), 'schema.sql defines carrier column');
assert(schemaContent.includes('ROW LEVEL SECURITY'), 'schema.sql defines RLS policies');

// 3. Verify Header Navigation (Home link & Admin layout)
console.log("\n3. Validating Navigation & Header Overlap Fixes:");
const headerContent = fs.readFileSync(path.join(__dirname, '../src/components/Header.tsx'), 'utf-8');
assert(headerContent.includes('name: "Home", href: "/"'), 'Header.tsx includes explicit Home navigation button');

const adminLayoutContent = fs.readFileSync(path.join(__dirname, '../src/app/admin/dashboard/layout.tsx'), 'utf-8');
assert(adminLayoutContent.includes('pt-28 lg:pt-0'), 'AdminLayout prevents header overlap with top padding');
assert(adminLayoutContent.includes('top-[76px]'), 'Mobile Admin Sub-Header positioned below main header');
assert(adminLayoutContent.includes('Home'), 'Mobile Admin Sub-Header includes Home link');

// 4. Verify Leaflet CSS Imports
console.log("\n4. Validating Leaflet Map CSS Imports:");
const globalsCss = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf-8');
assert(globalsCss.includes('@import "leaflet/dist/leaflet.css";'), 'globals.css imports Leaflet CSS');

const mapPickerContent = fs.readFileSync(path.join(__dirname, '../src/components/MapPicker.tsx'), 'utf-8');
assert(mapPickerContent.includes("import 'leaflet/dist/leaflet.css';"), 'MapPicker.tsx imports Leaflet CSS directly');

// Summary Report
console.log("\n==================================================");
console.log(`📊 TEST SUMMARY: ${passed} Passed, ${failed} Failed.`);
console.log("==================================================");

if (failed === 0) {
    console.log("🎉 ALL SYSTEM VERIFICATION CHECKS PASSED SUCCESSFULLY!\n");
    process.exit(0);
} else {
    console.error("⚠️ SOME CHECKS FAILED. Please review output above.\n");
    process.exit(1);
}
