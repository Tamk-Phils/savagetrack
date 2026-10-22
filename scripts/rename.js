const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '..');

const replacements = [
    { regex: /SwiftLink Shipping/g, replacement: 'Transworld Logistics' },
    { regex: /SWIFTLINK SHIPPING/g, replacement: 'TRANSWORLD LOGISTICS' },
    { regex: /SwiftLink/g, replacement: 'Transworld Logistics' },
    { regex: /SWIFTLINK/g, replacement: 'TRANSWORLD LOGISTICS' },
    { regex: /swiftlinkshipping\.com/g, replacement: 'transworldlogistics.org' },
    { regex: /swiftlink/g, replacement: 'transworldlogistics' },
    { regex: /Vortex Shipping/g, replacement: 'Transworld Logistics' },
    { regex: /VORTEX SHIPPING/g, replacement: 'TRANSWORLD LOGISTICS' },
    { regex: /Vortex Global/g, replacement: 'Transworld Logistics' },
    { regex: /VORTEX GLOBAL/g, replacement: 'TRANSWORLD LOGISTICS' },
    { regex: /Vortex Air Cargo/g, replacement: 'Transworld Logistics Air Cargo' },
    { regex: /Vortex Freight Trucking/g, replacement: 'Transworld Logistics Freight Trucking' },
    { regex: /Vortex/g, replacement: 'Transworld Logistics' },
    { regex: /VORTEX/g, replacement: 'TRANSWORLD LOGISTICS' },
    { regex: /vortex/g, replacement: 'transworldlogistics' }
];

// Files and directories to ignore
const ignoreList = [
    'node_modules',
    '.git',
    '.next',
    'package-lock.json', // Best not to mess with package-lock manually
    'rename.js',
    '.env.local' // Don't change database names if it happens to match, though here we might want to change it. Actually, .env.local doesn't contain these except in FROM_NAME. Let's include it.
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (ignoreList.includes(file)) continue;

        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else {
            // Only process text files (ts, tsx, js, json, md, html, css, etc)
            if (/\.(ts|tsx|js|jsx|json|md|html|css|sql|txt)$/.test(file) || file === '.env.local') {
                try {
                    let content = fs.readFileSync(fullPath, 'utf8');
                    let modified = false;

                    for (const { regex, replacement } of replacements) {
                        if (regex.test(content)) {
                            content = content.replace(regex, replacement);
                            modified = true;
                        }
                    }

                    if (modified) {
                        fs.writeFileSync(fullPath, content, 'utf8');
                        console.log(`Updated: ${fullPath}`);
                    }
                } catch (err) {
                    console.error(`Error processing ${fullPath}:`, err.message);
                }
            }
        }
    }
}

processDirectory(directoryPath);
console.log("Renaming complete.");
