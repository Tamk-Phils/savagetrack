"use client";

import { motion } from "framer-motion";
import { Users, Target, History, Globe2, ShieldCheck, Award, Radar, Zap, Activity } from "lucide-react";
import Image from "next/image";

export default function CompanyPage() {
    return (
        <div className="bg-white min-h-screen pt-32">
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 bg-primary/5 text-primary px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] border border-primary/10 mb-12 w-fit"
                        >
                            <Radar size={16} className="animate-pulse" />
                            <span>INSTITUTIONAL DOSSIER</span>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter mb-12 uppercase leading-[0.85]"
                        >
                            GLOBAL LOGISTICS, <br />
                            <span className="text-primary italic">REDEFINED.</span>
                        </motion.h1>
                        <p className="text-2xl text-slate-400 font-black leading-tight mb-16 uppercase tracking-tight max-w-2xl">
                            FOUNDED IN 2021, VANGUARD FREIGHT WAS BORN FROM A RADICAL OBSERVATION: THE PLANET'S MOST COMPLEX INDUSTRY WAS OPERATING ON FRAGMENTED, LEGACY DATA. WE BUILT THE CURE.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-[45%] h-full bg-slate-50/50 -skew-x-6 origin-top-right -z-10" />
                <div className="absolute top-1/2 right-[5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
            </section>

            {/* Stats */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
                        {[
                            { label: "FOUNDED", val: "2021" },
                            { label: "GLOBAL HUBS", val: "14" },
                            { label: "DATA SYNC / DAY", val: "2.5M+" },
                            { label: "OPERATOR POOL", val: "450+" }
                        ].map((stat, i) => (
                            <div key={i} className="text-left group">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 group-hover:text-primary transition-colors">{stat.label}</p>
                                <p className="text-5xl font-black text-slate-900 tracking-tighter italic">{stat.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-48">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <div className="space-y-20">
                            <div className="flex gap-10 group">
                                <div className="w-20 h-20 shrink-0 bg-slate-900 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
                                    <Target size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">OUR MISSION</h3>
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest leading-relaxed">
                                        TO SYNCHRONIZE PLANETARY TRADE BY PROVIDING ABSOLUTE TRANSPARENCY AND PREDICTIVE DATA TO EVERY OPERATOR IN THE GLOBAL SUPPLY CHAIN.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-10 group">
                                <div className="w-20 h-20 shrink-0 bg-slate-900 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
                                    <Globe2 size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">OUR VISION</h3>
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest leading-relaxed">
                                        A WORLD WHERE GEOSPATIAL DISTANCE IS NO LONGER A BARRIER TO VISIBILITY, AND DATA FLOWS AT VELOCITY EQUAL TO THE ASSETS IT DESCRIBES.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-sm overflow-hidden shadow-3xl grayscale hover:grayscale-0 transition-all duration-1000 group">
                            <Image src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000" alt="Vanguard Freight" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-1000" />
                            <div className="absolute bottom-10 left-10 p-6 bg-slate-900/90 backdrop-blur-md text-white rounded-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">OFFICE SWL-942 / NAIROBI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-48 bg-slate-900 text-white mx-6 rounded-sm mb-48 overflow-hidden relative shadow-3xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
                
                <div className="container mx-auto px-12 relative z-10">
                    <div className="max-w-4xl mb-32">
                        <div className="flex items-center gap-4 mb-8">
                            <Zap className="text-primary" size={24} />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">DNA SEQUENCE</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 uppercase italic">THE VANGUARD FREIGHT CODE.</h2>
                        <p className="text-2xl text-white/40 font-black uppercase tracking-tight max-w-2xl leading-tight">WE DON'T JUST BUILD SOFTWARE. WE ENGINEER THE PLANETARY INFRASTRUCTURE OF TOMORROW'S VELOCITY.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[
                            { icon: ShieldCheck, title: "RADICAL INTEGRITY", desc: "OUR DATA IS OUR BOND. WE PROVIDE RAW, UNFILTERED TRUTH AT GLOBAL SCALE." },
                            { icon: Award, title: "PRECISION SYSTEM", desc: "IN DELIVERY, CENTIMETERS ARE CRITICAL. WE OBSESS OVER EVERY SPATIAL COORDINATE." },
                            { icon: History, title: "VELOCITY EVOLUTION", desc: "WE MOVE AS FAST AS THE ASSETS WE SYNC, ITERATING SYSTEMS AT LIGHT SPEED." }
                        ].map((v, i) => (
                            <div key={i} className="p-12 bg-white/5 border border-white/5 rounded-sm hover:bg-white/10 transition-all group hover:border-primary/30 relative">
                                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                                <v.icon className="text-primary mb-10 group-hover:scale-110 transition-transform duration-500" size={48} />
                                <h4 className="text-2xl font-black mb-6 uppercase tracking-tighter italic">{v.title}</h4>
                                <p className="text-white/30 font-black text-[10px] uppercase tracking-widest leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
