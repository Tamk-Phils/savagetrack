"use client";

import { motion } from "framer-motion";
import { AlertTriangle, PlusCircle, Radio, Trash2, Send, CloudRain, Wind, Anchor, Plane, Radar, Zap, Activity } from "lucide-react";
import { useState } from "react";

export default function AlertsManager() {
    const [alerts, setAlerts] = useState([
        { id: 1, type: "Warning", title: "GEOMAGNETIC INTERFERENCE: NORTH ATLANTIC HUB", impact: "HIGH", status: "PUBLISHED" },
        { id: 2, type: "Info", title: "SINGAPORE PORT SYNC UNDERWAY", impact: "LOW", status: "PUBLISHED" },
        { id: 3, type: "Success", title: "NEW DATA OFFICE: NAIROBI", impact: "POSITIVE", status: "PUBLISHED" },
    ]);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Radar size={20} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Office Communication</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">SERVICE <br/><span className="text-primary italic">DISPATCH.</span></h1>
                </div>
                <button className="bg-slate-900 hover:bg-primary text-white px-10 py-5 rounded-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-4 shadow-xl transition-all">
                    <PlusCircle size={20} /> INITIALIZE ALERT
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-sm border border-slate-200 shadow-3xl overflow-hidden">
                        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">ACTIVE BROADCAST BOARD</h3>
                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-1.5 rounded-sm border border-primary/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> LIVE DATA
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="p-10 hover:bg-slate-50 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-8">
                                        <div className={`w-14 h-14 rounded-sm flex items-center justify-center border ${
                                            alert.type === 'Warning' ? 'bg-teal-50 border-teal-100 text-teal-500' : 'bg-primary/5 border-primary/10 text-primary'
                                        }`}>
                                            <AlertTriangle size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight mb-2">{alert.title}</h4>
                                            <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                <span className="flex items-center gap-2"><Activity size={12} /> {alert.type}</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className={alert.impact === 'HIGH' ? 'text-teal-500' : 'text-primary'}>IMPACT: {alert.impact}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <button className="p-3 text-slate-300 hover:text-teal-500 transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                        <button className="bg-slate-900 text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">
                                            CONFIGURE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-slate-900 rounded-sm p-12 text-white shadow-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                        <Radio className="text-primary mb-10" size={48} />
                        <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">EMERGENCY UPLINK</h3>
                        <p className="text-white/40 font-bold mb-10 leading-relaxed text-xs uppercase tracking-tight">
                            Simultaneously broadcast critical variance to all syncd offices and operator terminals.
                        </p>
                        
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] block">SYSTEM TEMPLATES</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['GEOMAGNETIC', 'PORT SYNC', 'AEROSPACE', 'HUB ALERT'].map(t => (
                                    <button key={t} className="bg-white/5 border border-white/10 p-5 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all">{t}</button>
                                ))}
                            </div>
                            <button className="w-full bg-primary text-white py-6 rounded-sm font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-white hover:text-slate-900 transition-all mt-8 flex items-center justify-center gap-4">
                                EXECUTE BROADCAST <Send size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-12 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full group-hover:scale-150 transition-transform duration-700" />
                        <h4 className="text-[10px] font-black text-slate-900 mb-2 relative z-10 uppercase tracking-[0.4em]">BOARD DATA</h4>
                        <p className="text-slate-400 font-bold text-[10px] mb-8 relative z-10 uppercase tracking-widest">Global Office Interaction Metrics</p>
                        
                        <div className="space-y-6">
                             <div className="flex justify-between items-end">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PLANETARY VIEWS</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">12,402</span>
                             </div>
                             <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-2/3 shadow-[0_0_8px_rgba(0,112,243,0.3)]" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
