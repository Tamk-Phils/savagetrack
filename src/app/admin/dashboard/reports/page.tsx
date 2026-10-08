"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Ship, Plane, Truck, Download, Calendar, Radar, Zap, Activity } from "lucide-react";

export default function ReportsPage() {
    const stats = [
        { label: "PLANETARY REVENUE", val: "$428,500", change: "+12.5%", trend: "up", color: "text-primary" },
        { label: "ACTIVE DELIVERYS", val: "1,842", change: "+4.2%", trend: "up", color: "text-primary" },
        { label: "OFFICE SYNC TIME", val: "4.2 DAYS", change: "-0.5 DAYS", trend: "down", color: "text-primary" },
        { label: "FUEL SURCHARGE", val: "18.5%", change: "+2.1%", trend: "up", color: "text-teal-500" },
    ];

    return (
        <div className="space-y-12 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Radar size={20} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Institutional Analytics</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">GLOBAL <br/><span className="text-primary italic">INTELLIGENCE.</span></h1>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border border-slate-200 px-8 py-5 rounded-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-slate-50 transition-all shadow-sm">
                        <Calendar size={18} /> LAST 30 DAYS
                    </button>
                    <button className="bg-slate-900 text-white px-8 py-5 rounded-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-primary transition-all shadow-xl">
                        <Download size={18} /> EXPORT LEDGER
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-sm border border-slate-200 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                        <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">{stat.val}</h3>
                        <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${stat.color}`}>
                            {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            {stat.change} FROM PREVIOUS SYNC
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 bg-white p-12 rounded-sm border border-slate-200 shadow-3xl">
                    <div className="flex justify-between items-center mb-16">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-4">
                            <Activity className="text-primary" size={18} />
                            VOLUME BY MODALITY
                        </h3>
                        <div className="flex gap-4">
                            {['WEEK', 'MONTH', 'YEAR'].map(t => (
                                <button key={t} className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-sm border ${t === 'MONTH' ? 'bg-primary border-primary text-white shadow-lg' : 'text-slate-400 border-transparent hover:bg-slate-50'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-12">
                        {[
                            { name: "OCEAN FREIGHT", val: 65, icon: Ship, color: "bg-primary" },
                            { name: "AIR CARGO", val: 45, icon: Plane, color: "bg-primary" },
                            { name: "LAND LOGISTICS", val: 85, icon: Truck, color: "bg-primary" },
                        ].map((m, i) => (
                            <div key={i} className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                                            <m.icon size={20} />
                                        </div>
                                        <span className="font-black text-slate-900 text-[10px] uppercase tracking-widest">{m.name}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.val}% CAPACITY UTILIZED</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${m.val}%` }}
                                        transition={{ duration: 1.5, delay: i * 0.2, ease: "circOut" }}
                                        className={`h-full ${m.color} shadow-[0_0_8px_rgba(0,112,243,0.3)]`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-sm p-12 text-white shadow-3xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                    <div className="relative z-10">
                        <Zap className="text-primary mb-10" size={48} />
                        <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">QUOTA UTILIZATION</h3>
                        <p className="text-white/40 font-bold mb-12 leading-relaxed text-[10px] uppercase tracking-tight">
                            ENTERPRISE API LIMITS AND RESOURCE CONSUMPTION FOR THE CURRENT BILLING CYCLE.
                        </p>
                        
                        <div className="relative w-56 h-56 mx-auto mb-12 group">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="112" cy="112" r="100" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle cx="112" cy="112" r="100" fill="transparent" stroke="#0070f3" strokeWidth="8" strokeDasharray="628.3" strokeDashoffset="157.1" strokeLinecap="round" className="shadow-[0_0_15px_rgba(0,112,243,0.5)]" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black tracking-tighter">75%</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mt-2">SYNCED</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-12 border-t border-white/5 relative z-10">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                            <span>CREDITS CONSUMED</span>
                            <span className="text-white">75,000 / 100,000</span>
                        </div>
                        <button className="w-full bg-white text-slate-900 py-6 rounded-sm font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-xl">
                            UPGRADE TIER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
