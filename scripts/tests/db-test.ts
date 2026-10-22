import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { supabase } from '../../src/lib/supabase';

async function runDatabaseTests() {
    console.log("--- TRANSWORLD LOGISTICS DATABASE TEST PROTOCOL ---");
    
    console.log(`Uplink URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

    // Test 1: Connectivity & Read
    console.log("\n[TEST 1] Querying Global Transit Ledger (shipments)...");
    const { data, error, count } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: false })
        .limit(5);

    if (error) {
        console.error("FAILURE: Ledger read variance detected.", error.message);
    } else {
        console.log(`SUCCESS: Connected to ledger. Found ${count} total transits.`);
        if (data && data.length > 0) {
            console.log("Recent Transits:");
            data.forEach((s: any) => {
                console.log(` - [${s.tracking_number}] ${s.current_status} | Destination: ${s.destination}`);
            });
        } else {
            console.log("NOTE: Ledger is currently empty or contains no accessible data.");
        }
    }

    // Test 2: Chat Rooms (if exists)
    console.log("\n[TEST 2] Querying Communication Channels (chat_rooms)...");
    const { data: chatData, error: chatError } = await supabase
        .from('chat_rooms')
        .select('id, customer_name, last_message')
        .limit(5);

    if (chatError) {
        console.warn("WARNING: Chat room query variance (table might not exist or RLS active).", chatError.message);
    } else {
        console.log(`SUCCESS: Retrieved ${chatData?.length} active channels.`);
    }

    console.log("\n--- TEST PROTOCOL COMPLETE ---");
}

runDatabaseTests().catch(err => {
    console.error("CRITICAL SYSTEM FAILURE:", err);
    process.exit(1);
});
