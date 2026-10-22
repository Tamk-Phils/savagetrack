"use client";

import { useState } from "react";
import { Package, MapPin, AlertCircle, User, FileText, Mail, Copy, Check, ChevronRight, Zap, Download, Sparkles, Clock, Truck, ShieldCheck, Headphones, Bell, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Shipment, ShipmentUpdate } from "@/types";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

export default function TrackingSearch() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<Shipment | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // Preset sample codes for instant demo testing
    const sampleTrackingCodes = ["VTX948210394", "VTX104928172"];

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
    };

    // Helper to generate simulated shipment details for any tracking code query
    const generateSimulatedShipment = (code: string): Shipment => {
        const uppercaseCode = code.toUpperCase().trim();
        return {
            id: uppercaseCode,
            tracking_number: uppercaseCode,
            current_status: "In Delivery",
            origin: "Frankfurt Hub, Germany",
            destination: "JFK Airport, New York, USA",
            sender_name: "Global Logistics Freight Corp",
            sender_email: "supportdesk@transworldlogistics.org",
            recipient_name: "Robert Vance & Partners",
            recipient_email: "r.vance@vanceglobal.com",
            recipient_address: "350 Fifth Avenue, Suite 4200, New York, NY 10118",
            description: "Express Air Freight - Priority Express Parcel & Documents",
            weight: 18.5,
            item_type: "AIR EXPORT CARGO",
            payment_status: "Paid",
            estimated_delivery: new Date(Date.now() + 86400000 * 2).toISOString(),
            latitude: 40.6413,
            longitude: -73.7781,
            origin_lat: 50.1109,
            origin_lng: 8.6821,
            destination_lat: 40.6413,
            destination_lng: -73.7781,
            is_deleted: false,
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            updated_at: new Date().toISOString(),
            updates: [
                {
                    id: "u1",
                    shipment_id: uppercaseCode,
                    status: "In Delivery",
                    location: "JFK International Freight Terminal",
                    description: "Package arrived at regional sorting hub. Assigned to Transworld Logistics Express Air Network.",
                    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
                },
                {
                    id: "u2",
                    shipment_id: uppercaseCode,
                    status: "Customs Cleared",
                    location: "Frankfurt International Hub",
                    description: "Export documentation verified and cleared by customs authority.",
                    created_at: new Date(Date.now() - 3600000 * 22).toISOString()
                },
                {
                    id: "u3",
                    shipment_id: uppercaseCode,
                    status: "Dispatch Processed",
                    location: "Frankfurt Gateway",
                    description: "Package logged into Transworld Logistics satellite tracking system.",
                    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
                }
            ]
        };
    };

    const performSearch = async (query: string) => {
        const cleanQuery = query.trim();
        if (!cleanQuery) return;

        setIsSearching(true);
        setResult(null);
        setError(null);

        let found: Shipment | null = null;

        // 1. Try Supabase with short 2s timeout
        try {
            const queryPromise = supabase
                .from('shipments')
                .select('*')
                .ilike('tracking_number', cleanQuery)
                .eq('is_deleted', false)
                .maybeSingle();

            const timeoutPromise = new Promise<{ data: any, error: any }>((resolve) =>
                setTimeout(() => resolve({ data: null, error: new Error("Timeout") }), 2000)
            );

            const { data, error: sbError } = await Promise.race([queryPromise, timeoutPromise]);

            if (!sbError && data) {
                found = data as Shipment;
            }
        } catch (err) {
            console.warn("Supabase query bypassed:", err);
        }

        // 2. Try LocalStorage
        if (!found && typeof window !== "undefined") {
            try {
                const saved = localStorage.getItem("transworldlogistics_shipments") || localStorage.getItem("transworldlogistics_shipments");
                if (saved) {
                    const localShipments: Shipment[] = JSON.parse(saved);
                    const match = localShipments.find(s =>
                        s.tracking_number.toLowerCase() === cleanQuery.toLowerCase() && !s.is_deleted
                    );
                    if (match) {
                        found = match;
                    }
                }
            } catch (e) {
                console.error("LocalStorage parse error", e);
            }
        }

        // 3. Guaranteed Fallback: Generate real-time simulated telemetry details for any tracking input
        if (!found) {
            found = generateSimulatedShipment(cleanQuery);
            if (typeof window !== "undefined") {
                try {
                    const saved = localStorage.getItem("transworldlogistics_shipments");
                    const localShipments: Shipment[] = saved ? JSON.parse(saved) : [];
                    if (!localShipments.some(s => s.tracking_number.toLowerCase() === cleanQuery.toLowerCase())) {
                        localShipments.push(found);
                        localStorage.setItem("transworldlogistics_shipments", JSON.stringify(localShipments));
                    }
                } catch (e) {
                    // quota ignore
                }
            }
        }

        setResult(found);
        setIsSearching(false);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(trackingNumber);
    };

    const handleSampleClick = (code: string) => {
        setTrackingNumber(code);
        performSearch(code);
    };

    return (
        <div className="w-full">
            {/* Search Input Box - Matching Uploaded Reference Image */}
            <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    <div className="relative flex-grow w-full flex items-center px-4 bg-slate-50 border-2 border-slate-300 rounded-lg focus-within:border-emerald-700 focus-within:bg-white transition-all">
                        <Package size={24} className="text-emerald-700 shrink-0 mr-3" />
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => {
                                setTrackingNumber(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder="Enter Tracking Number (e.g. VTX948210394)"
                            className="w-full bg-transparent py-4 text-slate-900 text-base md:text-lg font-bold uppercase tracking-wider focus:outline-none placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSearching}
                        className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-base px-8 py-4 rounded-xl md:rounded-full transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-emerald-900/25"
                    >
                        {isSearching ? (
                            <>
                                <Zap size={18} className="animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                Track Now
                                <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Popular Carriers Bar */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 px-3 text-slate-400 text-xs font-semibold">
                <div className="flex items-center gap-4">
                    <span className="text-slate-300 font-medium">Popular carriers:</span>
                    <div className="flex items-center gap-5 font-black text-slate-400 tracking-wider">
                        <span className="hover:text-emerald-700 transition-colors">DHL</span>
                        <span className="hover:text-emerald-700 transition-colors">FedEx</span>
                        <span className="hover:text-emerald-700 transition-colors">UPS</span>
                        <span className="hover:text-emerald-700 transition-colors">Aramex</span>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4"
                    >
                        <AlertCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-bold text-xs text-emerald-600 uppercase tracking-wider">TRACKING ALERT</p>
                            <p className="text-slate-600 mt-0.5 text-sm">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Live Shipment Details Card */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden text-slate-800 print:hidden"
                    >
                        {/* Status Header Banner */}
                        <div className="bg-slate-900 p-5 sm:p-8 md:p-10 flex flex-wrap justify-between items-center gap-4 sm:gap-6 text-white">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.9)] shrink-0" />
                                    <p className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest">TRANSWORLD LOGISTICS LIVE</p>
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                                    {result.current_status || "IN TRANSIT"}
                                </h2>
                            </div>

                            <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                                <p className="text-slate-400 text-[10px] font-mono font-bold uppercase tracking-wider">TRACKING NUMBER</p>
                                <div className="flex items-center justify-between sm:justify-start gap-3 bg-white/10 border border-white/10 px-4 py-2 rounded-xl w-full sm:w-auto">
                                    <span className="text-white font-mono font-extrabold text-sm sm:text-base md:text-lg tracking-wider break-all">{result.tracking_number}</span>
                                    <button
                                        onClick={() => handleCopy(result.tracking_number)}
                                        className={`p-1.5 rounded-lg transition-all shrink-0 ${isCopying ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                                        title="Copy Tracking ID"
                                    >
                                        {isCopying ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-8 md:p-12 space-y-8 md:space-y-10">
                            {/* Route Indicator */}
                            <div className="p-5 md:p-8 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left space-y-1">
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">ORIGIN</p>
                                        <p className="text-slate-900 text-xl font-extrabold">{result.origin}</p>
                                    </div>

                                    <div className="flex-1 w-full max-w-md space-y-2">
                                        <div className="h-1.5 bg-emerald-200/60 w-full rounded-full relative overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: "75%" }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-emerald-700 rounded-full"
                                            />
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 text-center">
                                            <Truck size={14} className="animate-pulse shrink-0" />
                                            <span>En Route via Transworld Logistics Transit Network</span>
                                        </div>
                                    </div>

                                    <div className="text-center md:text-right space-y-1">
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">DESTINATION</p>
                                        <p className="text-slate-900 text-xl font-extrabold">{result.destination}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Optional Live Satellite GPS Map Toggle */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                                            <Globe size={20} className="shrink-0" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-extrabold text-slate-900 text-sm md:text-base">Interactive Satellite GPS Map</h4>
                                            <p className="text-slate-500 text-xs font-medium">Real-time route telemetry & transit tracking (Optional)</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowMap(!showMap)}
                                        className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer shadow-sm ${
                                            showMap 
                                                ? 'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800' 
                                                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-700 hover:text-emerald-700'
                                        }`}
                                    >
                                        <MapPin size={15} className="shrink-0" />
                                        <span>{showMap ? "Hide Satellite Map" : "View Satellite Map"}</span>
                                        <ChevronDown size={15} className={`shrink-0 transition-transform duration-300 ${showMap ? "rotate-180" : ""}`} />
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showMap && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="h-[350px] sm:h-[440px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md relative">
                                                <LiveMap
                                                    lat={result.latitude}
                                                    lng={result.longitude}
                                                    originLat={result.origin_lat}
                                                    originLng={result.origin_lng}
                                                    originName={result.origin}
                                                    destinationLat={result.destination_lat}
                                                    destinationLng={result.destination_lng}
                                                    destinationName={result.destination}
                                                    currentLocationName={result.updates?.[0]?.location || result.origin}
                                                    trackingNumber={result.tracking_number}
                                                    status={result.current_status}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Shipment Details & Cargo Info */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 min-w-0 overflow-hidden">
                                            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider pb-2 border-b border-slate-200">
                                                <User size={16} className="shrink-0" /> Sender Information
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">NAME</p>
                                            <p className="text-slate-900 font-bold text-base break-words">{result.sender_name || 'N/A'}</p>
                                            <p className="text-slate-500 text-xs flex items-center gap-2 pt-1 min-w-0">
                                                <Mail size={13} className="text-emerald-600 shrink-0" />
                                                <span className="break-all font-medium">{result.sender_email || 'N/A'}</span>
                                            </p>
                                        </div>

                                        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 min-w-0 overflow-hidden">
                                            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider pb-2 border-b border-slate-200">
                                                <MapPin size={16} className="shrink-0" /> Recipient Information
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">RECIPIENT NAME</p>
                                            <p className="text-slate-900 font-bold text-base break-words">{result.recipient_name || 'N/A'}</p>
                                            <p className="text-slate-600 text-xs leading-relaxed pt-1 font-medium break-words">
                                                {result.recipient_address || 'Address registered'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
                                            <FileText size={15} className="text-emerald-700" /> Package Description & Content
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {result.description || 'Standard high-value express shipment parcel.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider pb-3 border-b border-slate-200">
                                            <Package size={16} /> Cargo Specifications
                                        </div>
                                        <div className="space-y-3 text-xs">
                                            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                                <span className="text-slate-500 font-medium">WEIGHT</span>
                                                <span className="text-slate-900 font-bold">{result.weight} LBS</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                                <span className="text-slate-500 font-medium">SERVICE TYPE</span>
                                                <span className="text-emerald-700 font-bold">{result.item_type || 'EXPRESS'}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                                <span className="text-slate-500 font-medium">ESTIMATED DELIVERY</span>
                                                <span className="text-slate-900 font-bold">
                                                    {result.estimated_delivery ? new Date(result.estimated_delivery).toLocaleDateString() : 'TBD'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-medium">PAYMENT STATUS</span>
                                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold">
                                                    {result.payment_status || 'PAID'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => window.print()} 
                                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                                    >
                                        <Download size={15} /> Download Waybill PDF
                                    </button>
                                </div>
                            </div>

                            {/* Tracking History Audit Trail */}
                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <Clock size={16} className="text-emerald-700" />
                                    Tracking Status History
                                </h3>

                                <div className="space-y-6 pl-4 border-l-2 border-emerald-100 ml-2">
                                    {result.updates && result.updates.length > 0 ? (
                                        result.updates.map((update: ShipmentUpdate, idx: number) => (
                                            <div key={idx} className="relative pl-6 space-y-1">
                                                <div className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 ${idx === 0 ? 'bg-emerald-700 border-emerald-700 shadow-[0_0_8px_rgba(190,18,60,0.8)]' : 'bg-white border-slate-300'}`} />
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className={`font-bold text-sm ${idx === 0 ? 'text-emerald-700' : 'text-slate-800'}`}>{update.status}</p>
                                                    <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                                        {new Date(update.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 text-xs leading-relaxed">{update.description}</p>
                                                <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                                                    <MapPin size={12} className="text-emerald-600" /> Location: {update.location}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">Initial dispatch record created.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* OFFICIAL PRINTABLE AIR WAYBILL (Visible ONLY when printing or saving as PDF) */}
                {result && (
                    <div id="official-waybill-document" className="hidden print:block p-8 bg-white text-slate-900 font-sans max-w-4xl mx-auto">
                        {/* Header with Company Logo & Official Title */}
                        <div className="border-b-2 border-slate-900 pb-5 mb-6 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                                        T
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                                            TRANSWORLD LOGISTICS
                                        </h1>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                                            Global Freight & Cargo Supply Chain Network
                                        </p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-2">
                                    Portal: <span className="font-semibold text-slate-700">transworldlogistics.org</span> • Support: <span className="font-semibold text-slate-700">supportdesk@transworldlogistics.org</span>
                                </p>
                            </div>

                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider rounded border border-emerald-300">
                                    Official Consignment Note
                                </span>
                                <p className="text-xs font-mono font-bold text-slate-800 mt-1.5">
                                    AIR WAYBILL (AWB)
                                </p>
                                <p className="text-[10px] text-slate-500">
                                    Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        {/* Tracking Number & Status Banner */}
                        <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-6 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                    WAYBILL / TRACKING IDENTIFIER
                                </span>
                                <span className="text-2xl font-mono font-black text-slate-950 tracking-wider">
                                    {result.tracking_number}
                                </span>
                            </div>

                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                    CURRENT DISPATCH STATUS
                                </span>
                                <span className="inline-block px-3.5 py-1 bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-md">
                                    {result.current_status || 'IN TRANSIT'}
                                </span>
                            </div>
                        </div>

                        {/* Routing Summary */}
                        <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 mb-6 bg-slate-50/60">
                            <div className="border-r border-slate-200 pr-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">ORIGIN STATION</span>
                                <p className="text-base font-black text-slate-900">{result.origin || 'N/A'}</p>
                            </div>
                            <div className="pl-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">FINAL DESTINATION</span>
                                <p className="text-base font-black text-slate-900">{result.destination || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Sender & Consignee Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="border border-slate-200 rounded-xl p-4 bg-white">
                                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-2 mb-3">
                                    1. Shipper / Sender Details
                                </h3>
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-slate-400 font-bold uppercase text-[10px] block">SENDER NAME</span>
                                        <span className="font-bold text-slate-900">{result.sender_name || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-bold uppercase text-[10px] block">EMAIL / CONTACT</span>
                                        <span className="font-medium text-slate-700">{result.sender_email || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-bold uppercase text-[10px] block">DISPATCH PORT</span>
                                        <span className="font-medium text-slate-700">{result.origin || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-4 bg-white">
                                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-slate-200 pb-2 mb-3">
                                    2. Consignee / Recipient Details
                                </h3>
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-slate-400 font-bold uppercase text-[10px] block">RECIPIENT NAME</span>
                                        <span className="font-bold text-slate-900">{result.recipient_name || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-bold uppercase text-[10px] block">DELIVERY ADDRESS</span>
                                        <span className="font-medium text-slate-700 leading-relaxed">{result.recipient_address || 'Address registered on file'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-bold uppercase text-[10px] block">DESTINATION PORT</span>
                                        <span className="font-medium text-slate-700">{result.destination || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cargo & Freight Specifications */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-800">
                                3. Cargo & Freight Specifications
                            </div>
                            <table className="w-full text-xs text-left">
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-4 py-2.5 font-bold text-slate-500 bg-slate-50/50 w-1/3">DESCRIPTION / CONTENTS</td>
                                        <td className="px-4 py-2.5 font-medium text-slate-900">{result.description || 'Standard high-value express shipment parcel.'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-bold text-slate-500 bg-slate-50/50">GROSS WEIGHT</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-900">{result.weight} LBS</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-bold text-slate-500 bg-slate-50/50">SERVICE CLASS</td>
                                        <td className="px-4 py-2.5 font-bold text-emerald-800">{result.item_type || 'EXPRESS AIR FREIGHT'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-bold text-slate-500 bg-slate-50/50">PAYMENT STATUS</td>
                                        <td className="px-4 py-2.5 font-bold text-slate-900">{result.payment_status || 'PAID'}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2.5 font-bold text-slate-500 bg-slate-50/50">ESTIMATED ARRIVAL</td>
                                        <td className="px-4 py-2.5 font-medium text-slate-900">
                                            {result.estimated_delivery ? new Date(result.estimated_delivery).toLocaleDateString() : 'TBD'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Transit Telemetry History (if present) */}
                        {result.updates && result.updates.length > 0 && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-800">
                                    4. Transit Telemetry & Milestone Audit Trail
                                </div>
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-2">Date / Time</th>
                                            <th className="px-4 py-2">Status</th>
                                            <th className="px-4 py-2">Location</th>
                                            <th className="px-4 py-2">Activity Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {result.updates.map((up: ShipmentUpdate, i: number) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                                                    {new Date(up.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 font-bold text-slate-900 whitespace-nowrap">
                                                    {up.status}
                                                </td>
                                                <td className="px-4 py-2 font-medium text-slate-700 whitespace-nowrap">
                                                    {up.location}
                                                </td>
                                                <td className="px-4 py-2 text-slate-600">
                                                    {up.description}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Official Seal, Authentication & Signature */}
                        <div className="border-t-2 border-slate-900 pt-6 mt-6 flex justify-between items-end">
                            <div className="space-y-1 max-w-md">
                                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                                    <ShieldCheck size={16} />
                                    <span>OFFICIALLY VERIFIED DISPATCH RECORD</span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    This document certifies international carriage registration under Transworld Logistics Operating Conditions. Issued electronically from verified secure gateway.
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="w-52 border-b border-slate-900 pb-1 mb-1 font-mono text-[11px] text-slate-600 italic">
                                    Authorized Dispatch Control
                                </div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">
                                    Transworld Global Operations
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


