export type ShipmentStatus = 'Pending' | 'In Delivery' | 'Out for Delivery' | 'Delivered' | 'Held' | 'Postponed';

export interface ShipmentUpdate {
    id: string;
    shipment_id: string;
    status: string;
    location?: string;
    description?: string;
    created_at: string;
}

export interface Shipment {
    id: string;
    tracking_number: string;
    item_type: string;     // What is being shipped
    description: string;   // Full cargo description
    sender_name?: string;
    sender_email?: string;
    sender_phone?: string;
    sender_address?: string;
    recipient_name?: string;
    recipient_address?: string;
    recipient_email?: string;
    recipient_phone?: string;
    origin?: string;
    destination?: string;
    carrier?: string;
    service_level?: string;
    declared_value?: number | string;
    quantity?: number | string;
    special_notes?: string;
    current_status: ShipmentStatus;
    weight?: number;
    dimensions?: string;
    payment_method?: string;
    payment_status?: string;
    estimated_delivery?: string;
    created_at: string;
    updated_at: string;
    is_deleted?: boolean;
    latitude?: number;
    longitude?: number;
    origin_lat?: number;
    origin_lng?: number;
    destination_lat?: number;
    destination_lng?: number;
    updates: ShipmentUpdate[];
}

export interface ChatRoom {
    id: string;
    customer_name?: string;
    customer_email?: string;
    user_id?: string;
    last_message?: string;
    status: 'active' | 'closed';
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    id: string;
    room_id: string;
    sender_name?: string;
    sender_role: 'admin' | 'user' | 'system';
    content: string;
    created_at: string;
}
