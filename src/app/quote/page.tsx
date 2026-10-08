"use client";

import { Calculator, Package, Globe, Ruler, Send, ArrowRight, CheckCircle2, Zap, Box, MapPin } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function QuotePage() {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <main className="min-h-screen bg-slate-50 pt-36 pb-24 text-slate-900">
                <div className="max-w-xl mx-auto px-6 text-center">
                    <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
                        <div className="w-20 h-20 bg-emerald-700 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quote Request Submitted!</h2>
                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                            We are analyzing route options and freight rates. A custom logistics quote will be emailed to you shortly.
                        </p>
                        <div className="pt-4">
                            <Link 
                                href="/"
                                className="bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-800 transition-all inline-block shadow-md"
                            >
                                Return to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pt-28 md:pt-36 pb-24 text-slate-900">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Banner */}
                <div className="bg-slate-900 text-white py-14 px-8 rounded-3xl mb-12 shadow-2xl">
                    <div className="max-w-3xl space-y-3">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-400">INSTANT FREIGHT ESTIMATION</span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Request a Freight Quote</h1>
                        <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
                            Get competitive shipping rates for land, ocean, air freight, or contract warehousing across our global transit corridors.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Info Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
                            <h3 className="text-xl font-black text-slate-900">Why Ship with Vanguard Freight?</h3>

                            <div className="space-y-6">
                                {[
                                    { icon: Globe, title: "Global Transit Network", desc: "Express air cargo, ocean vessel slots, and intermodal trucking covering 180+ countries." },
                                    { icon: Box, title: "Custom Cargo Handling", desc: "Specialized crating, temperature control, and heavy machinery logistics." },
                                    { icon: Zap, title: "Guaranteed Telemetry Scans", desc: "Satellite GPS tracking included on every consignment quote." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
                                            <item.icon size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-900 text-sm">{item.title}</h4>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-emerald-700 text-white space-y-3 shadow-xl">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-200">ENTERPRISE LOGISTICS</span>
                            <h4 className="text-xl font-black">High Volume Shipping?</h4>
                            <p className="text-emerald-100 text-xs font-medium leading-relaxed">
                                Connect with our corporate accounts desk for custom volume tier discounts and dedicated account manager assignment.
                            </p>
                        </div>
                    </div>

                    {/* Right Form Card */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <div className="border-b border-slate-100 pb-4">
                                            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">STEP 1 OF 2</span>
                                            <h3 className="text-2xl font-black text-slate-900">Route & Transit Details</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Origin City / Hub</label>
                                                <input type="text" placeholder="e.g. Frankfurt, Germany" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-700 transition-colors" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Destination Hub</label>
                                                <input type="text" placeholder="e.g. New York, USA" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-700 transition-colors" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Preferred Transport Service</label>
                                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-700 transition-colors">
                                                <option>Air Freight Express (1-2 Days)</option>
                                                <option>Ocean Container Cargo (10-14 Days)</option>
                                                <option>Road Intermodal Express (3-5 Days)</option>
                                                <option>Rail Freight Bulk (5-7 Days)</option>
                                                <option>Warehouse Storage & Fulfillment</option>
                                            </select>
                                        </div>

                                        <button type="button" onClick={nextStep} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg transition-all">
                                            Next Step: Cargo Info <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="border-b border-slate-100 pb-4">
                                            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">STEP 2 OF 2</span>
                                            <h3 className="text-2xl font-black text-slate-900">Cargo Weight & Specifications</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Estimated Weight (kg / lbs)</label>
                                                <input type="number" placeholder="e.g. 50" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-700 transition-colors" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Declared Value ($ USD)</label>
                                                <input type="number" placeholder="e.g. 2500" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-700 transition-colors" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Contact Email for Quote</label>
                                            <input type="email" placeholder="name@company.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-700 transition-colors" required />
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            <button type="button" onClick={prevStep} className="w-1/3 bg-slate-100 text-slate-700 py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors">
                                                Back
                                            </button>
                                            <button type="submit" className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all">
                                                <Send size={16} /> Request Quote Now
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
