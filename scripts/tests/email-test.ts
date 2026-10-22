import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { sendShipmentCreatedEmail, sendShipmentUpdateEmail } from '../../src/lib/email';

async function runEmailTests() {
    console.log("--- TRANSWORLD LOGISTICS EMAIL TEST PROTOCOL ---");
    
    const testRecipient = process.argv[2] || process.env.TEST_EMAIL || "phils7872@gmail.com";
    const trackingNumber = "TWL-8829-NYC-X";

    console.log(`Target Node: ${testRecipient}`);

    // Test 1: Shipment Created
    console.log("\n[TEST 1] Dispatching 'Shipment Created' Telemetry...");
    const result1 = await sendShipmentCreatedEmail({
        to: testRecipient,
        subject: "Transworld Logistics: Transit Protocol Initiated",
        trackingNumber: trackingNumber,
        senderName: "COMMAND_CORE",
        recipientName: "TEST_OPERATOR",
        origin: "LONDON_HUB",
        destination: "SINGAPORE_PORT"
    });

    if (result1.success) {
        console.log("SUCCESS: Created email dispatched to uplink.");
    } else {
        console.error("FAILURE: Created email dispatch variance detected.", result1.error);
    }

    // Test 2: Shipment Update
    console.log("\n[TEST 2] Dispatching 'Shipment Update' Telemetry...");
    const result2 = await sendShipmentUpdateEmail({
        to: testRecipient,
        subject: "Transworld Logistics: Telemetry Variance Reported",
        trackingNumber: trackingNumber,
        recipientName: "TEST_OPERATOR",
        newStatus: "IN_TRANSIT",
        location: "NORTH_ATLANTIC_NODE_7",
        description: "ASSET IS AT OPTIMAL VELOCITY. NO ANOMALIES DETECTED."
    });

    if (result2.success) {
        console.log("SUCCESS: Update email dispatched to uplink.");
    } else {
        console.error("FAILURE: Update email dispatch variance detected.", result2.error);
    }

    console.log("\n--- TEST PROTOCOL COMPLETE ---");
}

runEmailTests().catch(err => {
    console.error("CRITICAL SYSTEM FAILURE:", err);
    process.exit(1);
});
