"use client";

import { Plane, Truck, Ship, Train, Box, Package, Layers, ShieldCheck, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UsagePage() {
    const services = [
        {
            id: "air",
            title: "Air Freight",
            desc: "Rapid international air cargo corridors providing guaranteed transit times, chartering, and express custom handling.",
            img: "https://images.unsplash.com/photo-1520690214124-2405c5217036?q=80&w=1000",
            icon: Plane,
            features: ["Priority Air Cargo Booking", "Temperature-Controlled Holds", "Direct Airport Customs Scan"]
        },
        {
            id: "road",
            title: "Road Transport",
            desc: "Nationwide ground express freight connecting regional hubs with continuous satellite GPS waybill tracking.",
            img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000",
            icon: Truck,
            features: ["Full Truckload (FTL) & LTL", "Interstate Expedited Express", "Door-to-Door Last-Mile Delivery"]
        },
        {
            id: "ocean",
            title: "Ocean Freight",
            desc: "International maritime container shipping with full container load (FCL) and less than container load (LCL) options.",
            img: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1000",
            icon: Ship,
            features: ["FCL & LCL Maritime Lines", "Port Customs Clearing Desk", "Global Vessel Schedule Monitoring"]
        },
        {
            id: "rail",
            title: "Rail Freight",
            desc: "Eco-friendly, high-capacity long-distance rail logistics tailored for heavy industrial freight and bulk raw materials.",
            img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000",
            icon: Train,
            features: ["Bulk Rail Intermodal Transit", "Low-Emission Freight Corridors", "Regional Terminal Transfer"]
        },
        {
            id: "warehouse",
            title: "Warehousing & Storage",
            desc: "Strategically located climate-controlled storage hubs with real-time inventory management and pick-and-pack fulfillment.",
            img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000",
            icon: Box,
            features: ["24/7 Monitored Warehousing", "Automated Inventory Scans", "Cross-Docking & Fulfillment"]
        },
        {
            id: "packaging",
            title: "Packaging & Crating",
            desc: "Industrial protective packaging, custom wooden crating, and hazardous material containerization for safe transit.",
            img: "https://images.unsplash.com/photo-1565891741441-64926e441838?q=80&w=1000",
            icon: Package,
            features: ["Custom Wooden Crating", "Shock & Moisture Protection", "Eco-Friendly Recyclable Materials"]
        },
        {
            id: "logistics",
            title: "Logistics Solutions",
            desc: "End-to-end supply chain integration, route optimization, and vendor logistics management designed for enterprise operations.",
            img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000",
            icon: Layers,
            features: ["Supply Chain Route Audits", "Vendor Management Systems", "Customs Compliance Strategy"]
        },
        {
            id: "insurance",
            title: "Cargo Insurance",
            desc: "Comprehensive transit risk insurance protecting your shipments against damage, loss, or unforeseen delay.",
            img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000",
            icon: ShieldCheck,
            features: ["Full Declared Value Coverage", "Instant Claims Processing", "Global Risk Protection Policies"]
        }
    ];

    return (
        <main className="bg-slate-50 min-h-screen pt-28 md:pt-36 pb-24 text-slate-900">
            {/* Header Banner */}
            <div className="bg-slate-900 text-white py-16 mb-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400">MULTIFACETED SERVICE PORTFOLIO</span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">Our Services</h1>
                    <p className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto font-medium">
                        Comprehensive shipping & logistics solutions tailored to simplify your supply chain needs across air, land, ocean, rail, and warehousing.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            id={service.id}
                            className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all space-y-6 flex flex-col justify-between group"
                        >
                            <div className="space-y-6">
                                <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-100">
                                    <img
                                        src={service.img}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/95 rounded-2xl flex items-center justify-center text-emerald-700 shadow-md backdrop-blur-md">
                                        <service.icon size={24} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{service.title}</h3>
                                    <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed">{service.desc}</p>
                                </div>

                                <ul className="space-y-2 pt-2 border-t border-slate-100">
                                    {service.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                                            <Check size={14} className="text-emerald-700 shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <Link href="/quote" className="inline-flex items-center gap-2 text-white bg-emerald-700 hover:bg-emerald-800 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all">
                                    Get Quote for {service.title} <ArrowRight size={14} />
                                </Link>
                                <Link href="/tracking" className="text-xs font-extrabold text-emerald-700 hover:underline">
                                    Track Freight
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
