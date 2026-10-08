"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Package, User, MapPin, Scale, AlertCircle, Clock, CreditCard, FileText, Calendar, Copy, Check, Mail, Radar, Zap, Box } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { notifyShipmentCreated } from "@/app/actions/email";
import { geocodeLocationQuery } from "@/lib/geocoding";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function AddShipment() {
    const router = useRouter();
    const [isCopying, setIsCopying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        tracking_number: "",
        item_type: "General Cargo",
        description: "",
        sender_name: "",
        sender_email: "",
        sender_phone: "",
        recipient_name: "",
        recipient_email: "",
        recipient_phone: "",
        recipient_address: "",
        origin: "Dallas, TX",
        destination: "New York, NY",
        latitude: 32.7767,
        longitude: -96.7970,
        weight: "15",
        dimensions: "12x12x12",
        service_level: "Priority Air Express",
        carrier: "Vanguard Freight Air Express Fleet",
        declared_value: "150.00",
        quantity: "1",
        current_status: "Pending",
        payment_method: "Credit Card",
        payment_status: "Paid",
        estimated_delivery: "",
        special_notes: ""
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Generate tracking number
        setFormData(prev => ({
            ...prev,
            tracking_number: `SWL${Math.floor(100000000 + Math.random() * 900000000)}`
        }));
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(formData.tracking_number);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);

        // Resolve coordinates
        const originCoords = await geocodeLocationQuery(formData.origin);
        const destCoords = await geocodeLocationQuery(formData.destination || formData.recipient_address);

        const newShipment = {
            ...formData,
            destination: formData.destination || formData.recipient_address,
            origin_lat: originCoords ? originCoords[0] : undefined,
            origin_lng: originCoords ? originCoords[1] : undefined,
            destination_lat: destCoords ? destCoords[0] : undefined,
            destination_lng: destCoords ? destCoords[1] : undefined,
            latitude: originCoords ? originCoords[0] : undefined,
            longitude: originCoords ? originCoords[1] : undefined,
            weight: parseFloat(formData.weight) || 0,
            estimated_delivery: formData.estimated_delivery ? new Date(formData.estimated_delivery).toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            updates: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    status: formData.current_status,
                    location: formData.origin,
                    description: `Shipment Registered: ${formData.description || 'New package created'}. Type: ${formData.item_type}`,
                    created_at: new Date().toISOString()
                }
            ]
        };

        try {
            const { error: sbError } = await supabase
                .from('shipments')
                .insert([newShipment]);

            if (sbError) {
                console.warn("Supabase insert warning, falling back to local database:", sbError);
            }

            // Always ensure local cache storage copy exists
            const existingRaw = localStorage.getItem("vanguardfreight_shipments") || localStorage.getItem("vanguardfreight_shipments");
            const existing: any[] = existingRaw ? JSON.parse(existingRaw) : [];
            existing.push({ ...newShipment, id: Math.random().toString(36).substr(2, 9) });
            localStorage.setItem("vanguardfreight_shipments", JSON.stringify(existing));

            if (formData.recipient_email) {
                try {
                    await notifyShipmentCreated({
                        to: formData.recipient_email,
                        subject: `Vanguard Freight: Package ${formData.tracking_number} Registered`,
                        trackingNumber: formData.tracking_number,
                        senderName: formData.sender_name || 'Vanguard Freight Admin',
                        recipientName: formData.recipient_name || 'Recipient',
                        origin: formData.origin || 'Source Hub',
                        destination: formData.destination || 'Destination Hub'
                    });
                } catch (emailErr) {
                    console.warn("Notification email dispatch notice:", emailErr);
                }
            }

            router.push("/admin/dashboard/shipments");
        } catch (err: any) {
            console.error("Shipment Registration Error:", err);
            // Fallback save to ensure administrative workflow is uninterrupted
            const existingRaw = localStorage.getItem("vanguardfreight_shipments") || localStorage.getItem("vanguardfreight_shipments");
            const existing: any[] = existingRaw ? JSON.parse(existingRaw) : [];
            existing.push({ ...newShipment, id: Math.random().toString(36).substr(2, 9) });
            localStorage.setItem("vanguardfreight_shipments", JSON.stringify(existing));
            router.push("/admin/dashboard/shipments");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-10 max-w-6xl pb-24">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard/shipments" className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-all shadow-sm group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">CREATE NEW <span className="text-primary italic">SHIPMENT</span></h1>
                        <p className="text-slate-400 font-semibold text-xs mt-1">Register a package delivery and send instant email notifications</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl flex items-center gap-4 text-teal-600 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle size={24} />
                    <p className="font-bold text-sm">Error: {error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-12 relative overflow-hidden">
                    
                    {/* Tracking ID Header */}
                    <div className="flex flex-wrap gap-8 justify-between items-center pb-10 border-b border-slate-100 relative z-10">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">GENERATED TRACKING NUMBER</p>
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                    {formData.tracking_number}
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className={`p-3 rounded-xl transition-all ${isCopying ? 'bg-primary text-white' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white'}`}
                                    title="Copy Tracking Number"
                                >
                                    {isCopying ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="bg-primary/10 text-primary border border-primary/20 px-6 py-4 rounded-2xl flex items-center gap-4">
                             <div>
                                <p className="text-xs font-bold opacity-70 uppercase mb-0.5">Shipment Status</p>
                                <p className="text-lg font-black uppercase tracking-tight">Ready to Register</p>
                             </div>
                             <Box size={32} />
                        </div>
                    </div>

                    {/* Section 1: Package Info */}
                    <div className="space-y-6 relative z-10">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Package size={18} />
                            </div>
                            PACKAGE INFORMATION
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Item / Package Type</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Consumer Electronics"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                    value={formData.item_type}
                                    onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Service Level / Speed</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none cursor-pointer"
                                    value={formData.service_level}
                                    onChange={(e) => setFormData({ ...formData, service_level: e.target.value })}
                                >
                                    <option value="Standard Ground">Standard Ground (3-5 Days)</option>
                                    <option value="Priority Air Express">Priority Air Express (1-2 Days)</option>
                                    <option value="Overnight Flight">Overnight Flight (Next Day)</option>
                                    <option value="Ocean Freight">Ocean Freight Cargo (7-14 Days)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Carrier Transport</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Vanguard Freight Fleet Air"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                    value={formData.carrier}
                                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Est. Delivery Date</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                    value={formData.estimated_delivery}
                                    onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Declared Value ($ USD)</label>
                                <input
                                    type="number"
                                    placeholder="150.00"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                    value={formData.declared_value}
                                    onChange={(e) => setFormData({ ...formData, declared_value: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Quantity / Box Count</label>
                                <input
                                    type="number"
                                    placeholder="1"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Special Handling Tags</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fragile, Temperature Controlled"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                    value={formData.special_notes}
                                    onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Package Description & Handling Notes</label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Add detailed package contents, dimensions notes, or delivery instructions..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:border-primary font-semibold text-slate-700 text-xs outline-none resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Section 2: Shipping Addresses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 pt-6 border-t border-slate-100">
                        {/* From */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <MapPin size={18} />
                                </div>
                                SENDER INFORMATION (FROM)
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Sender / Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name or Business Name"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                        value={formData.sender_name}
                                        onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Sender Email</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="admin@vanguardfreight.com"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                            value={formData.sender_email}
                                            onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Sender Phone</label>
                                        <input
                                            type="text"
                                            placeholder="+1 (555) 019-2834"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                            value={formData.sender_phone}
                                            onChange={(e) => setFormData({ ...formData, sender_phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Origin City / Hub</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Dallas, TX"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                        value={formData.origin}
                                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* To */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <User size={18} />
                                </div>
                                RECIPIENT INFORMATION (TO)
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Recipient Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Full Name or Business Name"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                        value={formData.recipient_name}
                                        onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Recipient Email</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="receiver@example.com"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                            value={formData.recipient_email}
                                            onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Recipient Phone</label>
                                        <input
                                            type="text"
                                            placeholder="+1 (555) 839-2011"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                            value={formData.recipient_phone}
                                            onChange={(e) => setFormData({ ...formData, recipient_phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Destination City / Hub</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. New York, NY"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1 block mb-1">Full Delivery Street Address</label>
                                    <textarea
                                        required
                                        rows={2}
                                        placeholder="Full Street Address (Street, Apt/Suite, Zip)"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none resize-none"
                                        value={formData.recipient_address}
                                        onChange={(e) => setFormData({ ...formData, recipient_address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2.5: Interactive Map Location Selection */}
                    <div className="space-y-6 pt-6 border-t border-slate-100 relative z-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <MapPin size={18} />
                                </div>
                                INTERACTIVE LIVE MAP (ORIGIN & LOCATION PIN)
                            </h3>
                            <span className="text-xs font-semibold text-slate-400">Click on map or search location to set precise GPS coordinates</span>
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-80 relative">
                            <MapPicker
                                initialLat={formData.latitude}
                                initialLng={formData.longitude}
                                initialAddress={formData.origin}
                                onChange={(lat, lng, addr) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        latitude: lat,
                                        longitude: lng,
                                        origin: addr || prev.origin
                                    }));
                                }}
                            />
                        </div>
                    </div>

                    {/* Section 3: Measurements */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-slate-100 relative z-10">
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Scale size={18} />
                                </div>
                                WEIGHT & SIZE
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Weight (in lbs)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0 lbs"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Dimensions (LxWxH inches)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 12x12x12"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none"
                                        value={formData.dimensions}
                                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 md:col-span-2">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <CreditCard size={18} />
                                </div>
                                PAYMENT & INITIAL STATUS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Payment Method</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:border-primary font-bold text-xs text-slate-900 outline-none appearance-none cursor-pointer"
                                            value={formData.payment_method}
                                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                        >
                                            <option value="Credit Card">Credit Card (Visa/MC/Amex)</option>
                                            <option value="Debit Card">Debit Card</option>
                                            <option value="Cash App">Cash App ($Cashtag)</option>
                                            <option value="Zelle">Zelle Transfer</option>
                                            <option value="Venmo">Venmo</option>
                                            <option value="Apple Pay">Apple Pay</option>
                                            <option value="Google Pay">Google Pay</option>
                                            <option value="PayPal">PayPal</option>
                                            <option value="Bank Wire / ACH">Bank Wire / ACH Direct</option>
                                            <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                                            <option value="Crypto (BTC/USDT)">Crypto (BTC / USDT / ETH)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Initial Status</label>
                                        <select
                                            className="w-full bg-slate-900 text-white border-none rounded-xl py-3.5 px-4 focus:bg-primary font-bold text-xs outline-none cursor-pointer"
                                            value={formData.current_status}
                                            onChange={(e) => setFormData({ ...formData, current_status: e.target.value })}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Delivery">In Delivery</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-center">
                                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                        Submitting will register the package and dispatch confirmation emails to both recipient and admin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100 flex items-center justify-end gap-6 relative z-10">
                        <Link href="/admin/dashboard/shipments" className="text-xs font-bold text-slate-500 hover:text-teal-500 transition-colors uppercase tracking-wider">Cancel</Link>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`bg-slate-900 hover:bg-primary text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-3 disabled:opacity-50`}
                        >
                            {isSaving ? <Clock className="animate-spin" size={18} /> : <Save size={18} />}
                            {isSaving ? "Saving..." : "Create Shipment"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
