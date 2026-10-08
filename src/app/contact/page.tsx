"use client";

import { Mail, MessageSquare, Phone, MapPin, Globe, Send, Zap, Clock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 md:pt-36 pb-24">
            {/* Page Header */}
            <div className="bg-slate-900 text-white py-16 mb-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-4">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400">24/7 GLOBAL SUPPORT</span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">Contact Vanguard Freight & Cargo</h1>
                    <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium">
                        Our team is here to help you with anything you need. Whether you have a question about consignment tracking or custom cargo quotes.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* 3 Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <Mail size={26} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">EMAIL SUPPORT</span>
                        <h3 className="text-xl font-black text-slate-900">Official Email</h3>
                        <a href="mailto:support@vanguardfreight.com" className="text-emerald-700 font-extrabold text-sm block hover:underline break-all">
                            support@vanguardfreight.com
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <Phone size={26} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">HOTLINE</span>
                        <h3 className="text-xl font-black text-slate-900">Phone Support</h3>
                        <p className="text-emerald-700 font-extrabold text-sm">
                            +1 254-966-4186
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4 hover:shadow-xl transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <Clock size={26} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">HOURS</span>
                        <h3 className="text-xl font-black text-slate-900">Operating Hours</h3>
                        <p className="text-slate-600 text-sm font-semibold">
                            24/7 Satellite Global Dispatch & Waybill Tracking
                        </p>
                    </div>
                </div>

                {/* Form & Info Section */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-5 bg-slate-900 text-white p-10 md:p-14 flex flex-col justify-between relative">
                        <div className="space-y-6 relative z-10">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">SEND A DIRECT INQUIRY</span>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                Reach Out to Our Logistics Specialists
                            </h2>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                Fill out the form and our global support desk will respond promptly with consignment tracking or freight details.
                            </p>

                            <div className="space-y-4 pt-6 border-t border-slate-800 text-xs font-semibold text-slate-300">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-emerald-400 shrink-0" />
                                    <span>Multimodal International Logistics Network</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Zap size={18} className="text-emerald-400 shrink-0" />
                                    <span>Real-Time Satellite GPS Waybill Telemetry</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 p-10 md:p-14 bg-white">
                        {submitted ? (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-3">
                                <h3 className="text-2xl font-black">Message Received!</h3>
                                <p className="text-sm font-medium">Thank you for reaching out to Vanguard Freight & Cargo. Our support team will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
                                            placeholder="e.g. John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
                                            placeholder="e.g. Smith"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
                                        placeholder="name@company.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Consignment No. (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
                                        placeholder="Ex: VTX948210394"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Your Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors resize-none"
                                        placeholder="How can we assist your shipment today?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Send size={16} />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
