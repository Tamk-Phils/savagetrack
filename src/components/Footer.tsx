"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, Navigation, ShieldCheck, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        setIsSubscribed(true);
        setTimeout(() => {
            setNewsletterEmail("");
            setIsSubscribed(false);
        }, 4000);
    };

    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-20 pb-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Newsletter Subscription Banner - Matching theglobalcargo */}
                <div className="bg-emerald-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center lg:text-left max-w-xl">
                        <span className="text-emerald-200 text-xs font-black uppercase tracking-widest">STAY CONNECTED</span>
                        <h3 className="text-2xl md:text-4xl font-black tracking-tight">Subscribe Our Newsletter</h3>
                        <p className="text-emerald-100 text-sm font-medium leading-relaxed">
                            Don’t miss out on exciting updates, exclusive freight rates, and global logistics insights from Vanguard Freight & Cargo!
                        </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full bg-white text-slate-900 py-3.5 pl-11 pr-4 rounded-xl text-sm font-semibold focus:outline-none placeholder:text-slate-400 shadow-inner"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all shrink-0 uppercase tracking-wider flex items-center justify-center gap-2"
                            >
                                {isSubscribed ? "Subscribed!" : "Subscribe"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Main 4-Column Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Mission */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                                <Navigation size={22} className="transform rotate-45" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tight text-white font-display">
                                    Vanguard Freight <span className="text-emerald-400">Logistics</span>
                                </span>
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest -mt-1">
                                    Locate Your Parcel Anywhere Anytime
                                </span>
                            </div>
                        </Link>
                        
                        <p className="text-slate-400 text-sm leading-relaxed font-normal">
                            Comprehensive international shipping solutions. Connecting you to endless possibilities through real-time satellite GPS package surveillance.
                        </p>

                        <div className="space-y-2.5 text-xs text-slate-300 font-medium pt-1">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Mail size={14} className="text-emerald-400 shrink-0" />
                                <span>support@vanguardfreight.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone size={14} className="text-emerald-400 shrink-0" />
                                <span>+1 254-966-4186</span>
                            </div>
                        </div>

                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-6 border-l-2 border-emerald-600 pl-3">
                            Company
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Contact Us", href: "/contact" },
                                { name: "Return Policies", href: "/terms" },
                                { name: "Terms And Conditions", href: "/terms" },
                                { name: "Privacy Policy", href: "/privacy" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-emerald-400 transition-all" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-6 border-l-2 border-emerald-600 pl-3">
                            Services
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { name: "Ocean Freight", href: "/usage#ocean" },
                                { name: "Road Transport", href: "/usage#road" },
                                { name: "Air Freight", href: "/usage#air" },
                                { name: "Warehousing", href: "/usage#warehouse" },
                                { name: "Cargo Insurance", href: "/usage#insurance" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-emerald-400 transition-all" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-6 border-l-2 border-emerald-600 pl-3">
                            Quick Links
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { name: "Request A Quote", href: "/quote" },
                                { name: "Track & Trace", href: "/tracking" },
                                { name: "Find A Location", href: "/contact" },
                                { name: "Help & FAQ", href: "/resources" },
                                { name: "Client Portal Login", href: "/login" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-emerald-400 transition-all" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright & Sub-links */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs font-medium text-slate-400">
                    <p>
                        © 2026 Vanguard Freight & Cargo. All rights reserved. Locate Your Parcel Anywhere Anytime.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
                        <Link href="/resources" className="hover:text-emerald-400 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
