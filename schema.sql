-- ==========================================================
-- TRANSWORLD LOGISTICS PLATFORM - UNIFIED PRODUCTION SQL SETUP SCRIPT
-- ==========================================================
-- Run this SINGLE script in your Supabase SQL Editor to configure all
-- tables, columns, indexes, Row-Level Security (RLS) policies, and seed data.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: shipments
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    item_type VARCHAR(255) DEFAULT 'General Cargo',
    description TEXT,
    sender_name VARCHAR(255),
    sender_email VARCHAR(255),
    sender_phone VARCHAR(50),
    sender_address TEXT,
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(50),
    recipient_address TEXT,
    origin VARCHAR(255) DEFAULT 'Dallas, TX',
    destination VARCHAR(255) DEFAULT 'New York, NY',
    origin_lat DECIMAL(10, 7),
    origin_lng DECIMAL(10, 7),
    destination_lat DECIMAL(10, 7),
    destination_lng DECIMAL(10, 7),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    weight DECIMAL(10, 2) DEFAULT 0.00,
    dimensions VARCHAR(100) DEFAULT '12x12x12',
    service_level VARCHAR(100) DEFAULT 'Priority Air Express',
    carrier VARCHAR(100) DEFAULT 'Transworld Logistics Air Cargo',
    declared_value DECIMAL(10, 2) DEFAULT 0.00,
    quantity INTEGER DEFAULT 1,
    special_notes TEXT,
    current_status VARCHAR(100) DEFAULT 'Pending',
    payment_method VARCHAR(100) DEFAULT 'Credit Card',
    payment_status VARCHAR(100) DEFAULT 'Paid',
    is_deleted BOOLEAN DEFAULT FALSE,
    estimated_delivery TIMESTAMPTZ,
    updates JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add any missing columns if shipments table already existed
DO $$ 
BEGIN
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_phone VARCHAR(50);
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_address TEXT;
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS recipient_phone VARCHAR(50);
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS service_level VARCHAR(100) DEFAULT 'Priority Air Express';
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS carrier VARCHAR(100) DEFAULT 'Transworld Logistics Air Cargo';
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS declared_value DECIMAL(10, 2) DEFAULT 0.00;
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS special_notes TEXT;
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7);
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7);
    ALTER TABLE shipments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 3. CREATE TABLE: shipment_updates (Relational updates history)
CREATE TABLE IF NOT EXISTS shipment_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id VARCHAR(100) REFERENCES shipments(tracking_number) ON DELETE CASCADE,
    status VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE TABLE: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) DEFAULT 'OPERATOR',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE TABLE: chat_messages (Live Customer & Admin Chat)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id VARCHAR(255) DEFAULT 'general',
    sender_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE TABLE: system_alerts
CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'INFO',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDEXES FOR HIGH-PERFORMANCE SEARCHING
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(current_status);
CREATE INDEX IF NOT EXISTS idx_shipments_deleted ON shipments(is_deleted);
CREATE INDEX IF NOT EXISTS idx_chat_room ON chat_messages(room_id);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public Read Shipments" ON shipments;
DROP POLICY IF EXISTS "Public Insert Shipments" ON shipments;
DROP POLICY IF EXISTS "Public Update Shipments" ON shipments;
DROP POLICY IF EXISTS "Public Read Updates" ON shipment_updates;
DROP POLICY IF EXISTS "Public Insert Updates" ON shipment_updates;
DROP POLICY IF EXISTS "Public Chat Messages" ON chat_messages;
DROP POLICY IF EXISTS "Public Admin Users" ON admin_users;
DROP POLICY IF EXISTS "Public System Alerts" ON system_alerts;

-- Create policies for public / anon API access
CREATE POLICY "Public Read Shipments" ON shipments FOR SELECT USING (true);
CREATE POLICY "Public Insert Shipments" ON shipments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Shipments" ON shipments FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Updates" ON shipment_updates FOR SELECT USING (true);
CREATE POLICY "Public Insert Updates" ON shipment_updates FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Chat Messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Public Admin Users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Public System Alerts" ON system_alerts FOR ALL USING (true);

-- 9. INITIAL SAMPLE SEED DATA
INSERT INTO shipments (
    tracking_number, item_type, description, sender_name, sender_email, sender_phone,
    recipient_name, recipient_email, recipient_phone, recipient_address, origin, destination,
    latitude, longitude, weight, dimensions, service_level, carrier, declared_value, quantity,
    current_status, payment_method, payment_status, updates
) VALUES 
(
    'VTX948210394',
    'Consumer Electronics',
    'Express delivery of high-value optical components and server boards',
    'SwiftLogistics US Hub',
    'supportdesk@transworldlogististics.org',
    '+1 (555) 019-2834',
    'Sarah Jenkins',
    'sarah.j@example.com',
    '+1 (555) 839-2011',
    '742 Evergreen Terrace, New York, NY 10001',
    'Dallas Hub, TX',
    'New York, NY',
    40.7128,
    -74.0060,
    14.50,
    '16x12x8',
    'Priority Air Express',
    'Transworld Logistics Air Cargo',
    450.00,
    2,
    'In Delivery',
    'Credit Card',
    'Paid',
    '[{"id":"u1", "status":"In Delivery", "location":"En route to NYC", "description":"Package departing regional sorting facility", "created_at":"2026-07-31T12:00:00Z"}]'::jsonb
),
(
    'VTX104928172',
    'Commercial Goods',
    'Bulk manufacturing parts for industrial production equipment',
    'Transworld Logistics Hub',
    'supportdesk@transworldlogististics.org',
    '+1 (555) 392-1029',
    'Robert Chen',
    'r.chen@globalport.io',
    '+1 (555) 492-8102',
    '100 Bay Street, San Francisco, CA 94105',
    'Chicago, IL',
    'San Francisco, CA',
    37.7749,
    -122.4194,
    42.00,
    '24x20x18',
    'Standard Ground',
    'Transworld Logistics Trucking',
    1200.00,
    5,
    'Out for Delivery',
    'Bank Transfer',
    'Paid',
    '[{"id":"u2", "status":"Out for Delivery", "location":"San Francisco, CA", "description":"On courier vehicle for final delivery", "created_at":"2026-07-31T14:30:00Z"}]'::jsonb
) ON CONFLICT (tracking_number) DO NOTHING;

INSERT INTO admin_users (full_name, email, role, status) VALUES
('COMMAND ADMIN', 'ADMIN@TRANSWORLD LOGISTICS-SHIPPING.COM', 'SUPER USER', 'ACTIVE'),
('SARAH JENKINS', 'S.JENKINS@SWIFT.IO', 'OPERATOR', 'ACTIVE'),
('ROBERT CHEN', 'R.CHEN@GLOBALPORT.IO', 'MANAGER', 'OFFLINE')
ON CONFLICT (email) DO NOTHING;
