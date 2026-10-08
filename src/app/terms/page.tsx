"use client";

import { motion } from "framer-motion";
import { Scale, ShieldAlert, Lock, FileText, CheckCircle, Radar } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-48 text-slate-900">
            <div className="container mx-auto px-6 max-w-5xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-24 text-center"
                >
                    <div className="inline-flex items-center gap-3 bg-white text-primary px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] border border-slate-200 mb-10 shadow-sm">
                        <Radar size={14} className="animate-spin-slow" />
                        <span className="text-slate-500">Legal Framework & Compliance</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-10 uppercase leading-[0.9]">
                        USAGE <br/> <span className="text-primary italic">CHARTER.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
                        Last Modified: May 2026. Please sync with these services before utilizing the Vanguard Freight Data Network.
                    </p>
                </motion.div>

                <div className="space-y-20">
                    <section className="group">
                        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-6 tracking-tighter uppercase">
                            <div className="w-14 h-14 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                <FileText size={28} />
                            </div>
                            1. SYSTEM ACCEPTANCE
                        </h2>
                        <div className="text-slate-500 font-bold text-sm uppercase tracking-tight leading-relaxed pl-20 space-y-4">
                            <p>By accessing the Vanguard Freight platform, you agree to be bound by these Charter services. If you are operating on behalf of an institution, you represent that you have the authority to bind that office to these terms.</p>
                            <p>Vanguard Freight reserves the right to modify these services at any millisecond. Continued data sync constitutes acceptance of the new charter.</p>
                        </div>
                    </section>

                    <section className="group">
                        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-6 tracking-tighter uppercase">
                            <div className="w-14 h-14 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                <Lock size={28} />
                            </div>
                            2. DATA OWNERSHIP
                        </h2>
                        <div className="text-slate-500 font-bold text-sm uppercase tracking-tight leading-relaxed pl-20 space-y-4">
                            <p>We prioritize the security of your transit data. All tracking signatures are encrypted in transit. You retain ownership of all data submitted, but grant Vanguard Freight a non-exclusive license to use such data to optimize the global network.</p>
                        </div>
                    </section>

                    <section className="group">
                        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-6 tracking-tighter uppercase">
                            <div className="w-14 h-14 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                <ShieldAlert size={28} />
                            </div>
                            3. PROHIBITED VARIANCE
                        </h2>
                        <div className="text-slate-500 font-bold text-sm uppercase tracking-tight leading-relaxed pl-20 space-y-4">
                            <p>Operators are strictly prohibited from reverse engineering the Vanguard Freight autonomous algorithms, attempting to bypass office rate limits, or using the platform for unauthorized asset tracking.</p>
                        </div>
                    </section>

                    <section className="p-16 bg-slate-50 rounded-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-10 shadow-3xl">
                        <div className="text-center md:text-left">
                            <p className="font-black text-slate-900 text-lg uppercase tracking-tighter mb-4 italic">HAVE LEGAL CONCERNS?</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                                <CheckCircle size={16} />
                                FULLY COMPLIANT PLATFORM
                            </div>
                        </div>
                        <a href="mailto:support@vanguardfreight.com" className="bg-slate-900 px-12 py-5 rounded-sm font-black text-white text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl">
                            CONTACT COMPLIANCE
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}
