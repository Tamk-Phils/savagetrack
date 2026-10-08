"use client";

import { motion } from "framer-motion";
import { Info, AlertTriangle, CheckCircle2, CloudRain, Wind, Anchor, Plane, Truck, Radar, Zap } from "lucide-react";

export default function AlertsPage() {
    const alerts = [
        { 
            id: 1, 
            type: "warning", 
            title: "Winter Storm: East Coast", 
            description: "Heavy snow is causing 24-hour delays for all shipments moving through New York and Boston hubs.",
            icon: Wind,
            impact: "High",
            date: "Today, 08:30 AM"
        },
        { 
            id: 2, 
            type: "info", 
            title: "Port of Long Beach Maintenance", 
            description: "Scheduled equipment upgrades at the main terminal. Expect slight delays in processing through Friday.",
            icon: Anchor,
            impact: "Low",
            date: "Yesterday, 14:15 PM"
        },
        { 
            id: 3, 
            type: "success", 
            title: "New Hub: Chicago O'Hare", 
            description: "Our new automated sorting facility in Chicago is now fully operational, speeding up midwest deliveries.",
            icon: Plane,
            impact: "Positive",
            date: "Apr 07, 2026"
        }
    ];

    const systems = [
        { name: "Live Tracking System", status: "Working", color: "bg-emerald-500" },
        { name: "Ground Fleet Tracking", status: "Working", color: "bg-emerald-500" },
        { name: "Air Cargo Updates", status: "Perfect", color: "bg-emerald-500" },
        { name: "Warehouse Sorting", status: "Maintenance", color: "bg-amber-500" },
    ];

    return (
        <main className="min-h-screen bg-white pt-32 pb-48 text-slate-900">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto space-y-24">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 bg-white text-primary px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] border border-slate-200 mb-10 shadow-sm">
                            <Radar size={14} className="animate-spin-slow" />
                            <span className="text-slate-500">Live Service Status</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 uppercase leading-[0.9]">
                            SYSTEM <span className="text-primary italic">STATUS.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-bold max-w-3xl mx-auto leading-relaxed uppercase tracking-tight">
                            Check the health of our shipping network and stay updated on anything that might affect your package.
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-sm p-12 border border-slate-200 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-900 mb-10 flex items-center gap-4 uppercase tracking-[0.4em]">
                            <CheckCircle2 className="text-primary" size={20} />
                            CORE SYSTEMS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {systems.map((sys, i) => (
                                <div key={i} className="flex items-center justify-between p-8 bg-white rounded-sm border border-slate-100 shadow-sm group hover:border-primary/30 transition-all">
                                    <span className="font-black text-slate-700 text-xs uppercase tracking-widest">{sys.name}</span>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                        <div className={`w-2 h-2 rounded-full ${sys.color} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                                        <span className={sys.color.replace('bg-', 'text-')}>{sys.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12">
                        <h3 className="text-[10px] font-black text-slate-900 mb-10 flex items-center gap-4 uppercase tracking-[0.4em]">
                            <AlertTriangle className="text-amber-500" size={20} />
                            ACTIVE ALERTS
                        </h3>
                        {alerts.map((alert) => (
                            <motion.div 
                                key={alert.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-12 rounded-sm border border-slate-200 shadow-sm flex flex-col md:flex-row gap-12 items-start group hover:shadow-2xl transition-all"
                            >
                                <div className={`w-20 h-20 rounded-sm flex items-center justify-center shrink-0 border ${
                                    alert.type === 'warning' ? 'bg-teal-50 border-teal-100 text-teal-500' : 
                                    alert.type === 'info' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'
                                }`}>
                                    <alert.icon size={36} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{alert.title}</h4>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-sm border border-slate-100">{alert.date}</span>
                                    </div>
                                    <p className="text-slate-500 font-bold mb-10 leading-relaxed uppercase tracking-tight text-lg">{alert.description}</p>
                                    <div className="flex items-center gap-6">
                                        <div className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-sm border ${
                                            alert.impact === 'High' ? 'bg-teal-50 border-teal-100 text-teal-600' : 
                                            alert.impact === 'Low' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                        }`}>
                                            IMPACT: {alert.impact}
                                        </div>
                                        <button className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                            VIEW DETAILS <Zap size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-sm p-20 text-white text-center relative overflow-hidden shadow-3xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                        <p className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.5em]">SMS ALERTS</p>
                        <h4 className="text-5xl font-black mb-8 tracking-tighter uppercase">STAY UPDATED <br/><span className="italic">IN REAL TIME.</span></h4>
                        <p className="text-white/40 font-bold mb-16 max-w-2xl mx-auto uppercase tracking-tight text-lg leading-relaxed">
                            Sign up for text alerts to get notified the moment anything changes with our network. We keep you informed so you can stay ahead.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                            <input type="text" placeholder="YOUR PHONE NUMBER" className="flex-1 bg-white/5 border border-white/10 rounded-sm py-5 px-8 text-white font-black text-[10px] uppercase tracking-widest outline-none focus:border-primary transition-all" />
                            <button className="bg-primary hover:bg-white text-slate-900 px-12 py-5 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">START TEXT ALERTS</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
