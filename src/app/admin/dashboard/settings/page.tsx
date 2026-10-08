"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Globe, Bell, Mail, CreditCard, Save, RefreshCw, Radar, Zap } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-12 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Radar size={20} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Core Configuration</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">HUB <br/><span className="text-primary italic">PARAMETERS.</span></h1>
                </div>
                <button className="bg-slate-900 hover:bg-primary text-white px-10 py-5 rounded-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-4 shadow-xl transition-all group">
                    <Save size={20} /> SYNC CHANGES
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-1 space-y-3">
                    {[
                        { label: "GENERAL", icon: Settings, active: true },
                        { label: "SECURITY", icon: Shield, active: false },
                        { label: "NETWORK", icon: Globe, active: false },
                        { label: "DATA", icon: Bell, active: false },
                        { label: "API WEBHOOKS", icon: RefreshCw, active: false },
                        { label: "TRANSACTIONS", icon: CreditCard, active: false },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border ${item.active ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-900'}`}>
                            <item.icon size={18} className={item.active ? 'text-primary' : ''} /> {item.label}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3 space-y-10">
                    <div className="bg-white p-12 md:p-16 rounded-sm border border-slate-200 shadow-3xl space-y-16">
                        <section className="space-y-10">
                            <h3 className="text-[10px] font-black text-slate-900 flex items-center gap-4 uppercase tracking-[0.4em]">
                                <Globe className="text-primary" size={20} /> NETWORK IDENTITY
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">PLATFORM NOMENCLATURE</label>
                                    <input type="text" defaultValue="VANGUARD FREIGHT" className="w-full bg-slate-50 border border-slate-200 rounded-sm py-5 px-8 font-black text-[10px] uppercase tracking-widest text-slate-900 focus:outline-none focus:border-primary transition-all outline-none" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">COMMAND UPLINK EMAIL</label>
                                    <input type="email" defaultValue="SUPPORT@VANGUARD FREIGHTSHIPPING.COM" className="w-full bg-slate-50 border border-slate-200 rounded-sm py-5 px-8 font-black text-[10px] uppercase tracking-widest text-slate-900 focus:outline-none focus:border-primary transition-all outline-none" />
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] bg-slate-100" />

                        <section className="space-y-10">
                            <h3 className="text-[10px] font-black text-slate-900 flex items-center gap-4 uppercase tracking-[0.4em]">
                                <Bell className="text-primary" size={20} /> AUTOMATED DISPATCH
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "EMAIL DATA UPDATES", desc: "Notify offices instantly when transit service changes.", enabled: true },
                                    { label: "SMS EMERGENCY ALERTS", desc: "Critical alerts for delayed or held asset packets.", enabled: false },
                                    { label: "WEBHOOK SYNC", desc: "Push data to external institutional ERP systems.", enabled: true },
                                ].map((opt, i) => (
                                    <div key={i} className="flex items-center justify-between p-8 bg-slate-50 rounded-sm border border-slate-100 group hover:border-primary/20 transition-all">
                                        <div>
                                            <p className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-1">{opt.label}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{opt.desc}</p>
                                        </div>
                                        <div className={`w-14 h-7 rounded-sm p-1 relative cursor-pointer transition-all ${opt.enabled ? 'bg-primary' : 'bg-slate-200 hover:bg-slate-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-sm shadow-sm transition-transform ${opt.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="h-[1px] bg-slate-100" />

                        <section className="space-y-10">
                            <h3 className="text-[10px] font-black text-slate-900 flex items-center gap-4 uppercase tracking-[0.4em]">
                                <Shield className="text-primary" size={20} /> UPLINK SECURITY
                            </h3>
                            <div className="p-10 bg-slate-900 rounded-sm text-white shadow-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">PRODUCTION ACCESS KEY</span>
                                    <button className="text-primary font-black text-[9px] uppercase tracking-widest hover:text-white transition-colors">TERMINATE KEY</button>
                                </div>
                                <code className="block bg-black/40 p-6 rounded-sm font-mono text-xs break-all text-primary/80 border border-white/5 relative z-10">
                                    SWL_LIVE_2026_9481K_X92KJA_02JK_LMS0293
                                </code>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
