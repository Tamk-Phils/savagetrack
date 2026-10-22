const { execSync } = require('child_process');

console.log("--- TRANSWORLD LOGISTICS BRAND CONSISTENCY CHECK ---");

try {
    console.log("Scanning for legacy 'NexusTrack' nomenclature...");
    const output = execSync("grep -rEi 'nexustrack' src | grep -v 'node_modules' || true").toString();
    
    if (output.trim()) {
        console.warn("WARNING: Legacy nomenclature detected in the following nodes:");
        console.log(output);
    } else {
        console.log("SUCCESS: Brand purge complete. No legacy signatures detected in source.");
    }

    console.log("\nScanning for legacy 'Nexus' signatures...");
    const nexusOutput = execSync("grep -rEi ' nexus' src | grep -v 'node_modules' | grep -v 'lucide-react' || true").toString();
    if (nexusOutput.trim()) {
        console.warn("WARNING: Potential legacy signatures detected:");
        console.log(nexusOutput);
    } else {
        console.log("SUCCESS: Protocol 'Nexus' purged.");
    }

} catch (err) {
    console.error("Internal Diagnostic Failure:", err.message);
}

console.log("\n--- DIAGNOSTIC COMPLETE ---");
