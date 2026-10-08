"use client";

import { Package, ShieldCheck, Clock, MapPin, Radar, Activity, Satellite, Lock, Search, HelpCircle, Truck, Info, Zap } from "lucide-react";
import Image from "next/image";
import TrackingSearch from "@/components/TrackingSearch";
import Link from "next/link";

export default function TrackingPage() {
    return (
        <main className="bg-slate-50 text-slate-900 pt-28 md:pt-36 pb-12">
            {/* Header Banner */}
            <section className="bg-slate-900 text-white py-16 mb-16 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2000"
                        alt="Vanguard Freight Satellite Tracking"
                        fill
                        priority
                        className="object-cover object-center opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-emerald-950/80" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-700/90 text-white font-bold text-xs uppercase tracking-wider shadow-md">
                        <Radar size={14} className="text-white animate-pulse" />
                        VANGUARD FREIGHT LIVE SATELLITE RADAR
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">Real Time Parcel Tracking</h1>
                    <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium">
                        Locate Your Parcel Anywhere Anytime. Enter your Consignment No. below to get real-time satellite GPS updates.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 space-y-16">
                {/* Search Container Card */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200">
                    <TrackingSearch />
                </div>

                {/* 3 Value Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-white border border-slate-200/80 rounded-3xl shadow-md space-y-4 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
                            <Truck size={26} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Real-Time Telemetry</h3>
                        <p className="text-slate-500 font-medium text-xs leading-relaxed">
                            Continuous location checkpoint scans as your parcel moves through air, sea, and ground corridors.
                        </p>
                    </div>

                    <div className="p-8 bg-white border border-slate-200/80 rounded-3xl shadow-md space-y-4 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={26} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Chain of Custody Protection</h3>
                        <p className="text-slate-500 font-medium text-xs leading-relaxed">
                            Every package is protected by our global courier security and customs clearance verification network.
                        </p>
                    </div>

                    <div className="p-8 bg-white border border-slate-200/80 rounded-3xl shadow-md space-y-4 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
                            <Clock size={26} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Accurate Delivery ETA</h3>
                        <p className="text-slate-500 font-medium text-xs leading-relaxed">
                            Automated transit algorithms predict your exact arrival window with high precision.
                        </p>
                    </div>
                </div>

                {/* Tracking FAQ Banner */}
                <div className="bg-slate-900 rounded-3xl p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                                <HelpCircle size={22} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black">Tracking Help & Guidance</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-emerald-400">Where do I find my Consignment No.?</h4>
                                <p className="text-slate-300 leading-relaxed font-medium text-xs">
                                    Your tracking number is printed on your physical dispatch waybill or sent in your dispatch email confirmation (e.g. VTX948210394).
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-emerald-400">What if my package status shows "In Transit"?</h4>
                                <p className="text-slate-300 leading-relaxed font-medium text-xs">
                                    "In Transit" indicates your cargo is actively moving between regional dispatch hubs or onboard long-distance freight vessels.
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-slate-400 text-xs font-semibold">Need specialized assistance with your parcel?</p>
                            <Link href="/contact" className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-extrabold text-xs shadow-md transition-colors">
                                Contact Support Desk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
