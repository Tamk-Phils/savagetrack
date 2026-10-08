"use client";

import { motion } from "framer-motion";
import { Book, FileText, Code, MessageCircle, HelpCircle, ArrowRight, Search, Download, Radar, Zap, Terminal, Database, ShieldCheck, Headphones } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ResourcesPage() {
    const categories = [
        {
            title: "SHIPPING GUIDES",
            icon: Book,
            items: ["HOW TO PACK YOUR SHIPMENT", "INTERNATIONAL SHIPPING BASICS", "INSURANCE & PROTECTION", "TRACKING YOUR PACKAGE"]
        },
        {
            title: "BUSINESS TOOLS",
            icon: Code,
            items: ["API DOCUMENTATION", "INTEGRATION GUIDE", "BULK SHIPPING TOOLS", "DASHBOARD TUTORIALS"]
        },
        {
            title: "LEGAL & POLICY",
            icon: FileText,
            items: ["TERMS OF SERVICE", "PRIVACY POLICY", "SHIPPING LIABILITY", "REFUND POLICY"]
        }
    ];

    return (
        <main className="bg-white min-h-screen">
             {/* Simple Header */}
            <div className="relative pt-48 pb-32 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <Image src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000" alt="World Map" fill className="object-cover" />
                </div>
                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-3 bg-white/10 text-primary px-4 py-2 rounded-full border border-white/10 mb-10 backdrop-blur-md">
                            <span className="text-xs font-bold uppercase tracking-wider">Help Center & Resources</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[1.1]">
                            How can we <br />
                            <span className="text-primary italic">Help you?</span>
                        </h1>
                        
                        <div className="max-w-3xl mx-auto relative group mt-16">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={24} />
                            <input 
                                type="text" 
                                placeholder="SEARCH FOR GUIDES, TOOLS, OR ANSWERS..." 
                                className="w-full bg-white/10 border border-white/10 rounded-full py-8 px-10 pl-20 text-white font-bold text-lg shadow-2xl backdrop-blur-xl focus:bg-white focus:text-slate-900 transition-all outline-none placeholder:text-white/30"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-32 max-w-7xl">
                {/* Resource Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {categories.map((cat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-50 p-12 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:bg-white transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform">
                                <cat.icon size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">{cat.title}</h3>
                            <ul className="space-y-6">
                                {cat.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between text-slate-500 font-bold text-sm hover:text-primary cursor-pointer transition-colors group/item">
                                        {item}
                                        <ArrowRight size={18} className="opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Helpful Downloads & Support */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    <div className="bg-slate-50 p-16 rounded-3xl border border-slate-100 relative overflow-hidden shadow-xl group">
                        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.05] grayscale pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000" alt="Customer Support Team" fill className="object-cover" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">Support Team</h3>
                            <p className="text-slate-500 text-lg mb-12 leading-relaxed max-w-sm">
                                Need help with a specific shipment? Our customer success team is available 24/7 to assist you.
                            </p>
                            <Link href="/contact" className="bg-slate-900 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-4 hover:bg-primary transition-all shadow-xl w-fit">
                                <Headphones size={20} /> Talk to Us Now
                            </Link>
                        </div>
                    </div>

                    <div className="bg-primary p-16 rounded-3xl relative overflow-hidden shadow-2xl group">
                        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.1] grayscale pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <Image src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000" alt="Logistics Software and Digital Assets" fill className="object-cover" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-6 text-white tracking-tight">Downloads Center</h3>
                            <p className="text-white/70 text-lg mb-12 leading-relaxed max-w-sm">
                                Download our mobile app, shipping labels, and brand assets for your business.
                            </p>
                            <button className="bg-white text-primary px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-4 hover:bg-slate-900 hover:text-white transition-all shadow-xl">
                                <Download size={20} /> Download Assets
                            </button>
                        </div>
                    </div>
                </div>

                {/* Final Help Gallery */}
                <div className="text-center mb-16">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Logistics at Your Fingertips</h2>
                   <p className="text-lg text-slate-500 max-w-2xl mx-auto">We're here to support your business every step of the way with the best tools in the industry.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-64">
                   <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000" alt="Team" fill className="object-cover" />
                   </div>
                   <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <Image src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000" alt="Truck" fill className="object-cover" />
                   </div>
                   <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <Image src="https://images.unsplash.com/photo-1520690214124-2405c5217036?q=80&w=1000" alt="Plane" fill className="object-cover" />
                   </div>
                   <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <Image src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1000" alt="Ship" fill className="object-cover" />
                   </div>
                </div>
            </div>
        </main>
    );
}
