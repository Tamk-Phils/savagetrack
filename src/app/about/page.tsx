"use client";

import { Globe, Target, ShieldCheck, Zap, Cpu, Radar, Database, Network, Users, Award, Landmark, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="bg-slate-50 min-h-screen pt-28 md:pt-36">
            {/* Hero Header matching blue theme */}
            <div className="relative pb-24 pt-12 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2000"
                        alt="Vanguard Freight Global Freight Operations"
                        fill
                        priority
                        className="object-cover object-center opacity-25"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-emerald-950/80" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md">
                            <Zap size={14} className="fill-white" />
                            ABOUT VANGUARD FREIGHT & CARGO
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                            Locate Your Parcel <br />
                            <span className="text-emerald-400">Anywhere Anytime.</span>
                        </h1>
                        <p className="text-slate-200 text-base md:text-xl font-medium leading-relaxed">
                            At Vanguard Freight & Cargo, we are more than just a shipping and logistics company – we are your trusted partner in navigating the complexities of global trade and commerce.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                        <Image 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000" 
                            alt="Vanguard Freight Parcel Express Team" 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">OUR HERITAGE</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Our Story & Mission</h2>
                            <p className="text-slate-600 text-base leading-relaxed font-medium">
                                With a rich history and a forward-thinking approach, we strive to redefine industry standards and deliver innovative logistics solutions that propel your business forward.
                            </p>
                            <p className="text-slate-600 text-base leading-relaxed font-medium">
                                Through a relentless pursuit of excellence, innovation, and customer satisfaction, we aim to empower businesses of all sizes to thrive in today's dynamic marketplace.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-md">
                                <p className="text-4xl font-black text-emerald-700 mb-1">180+</p>
                                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Global Ports</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-md">
                                <p className="text-4xl font-black text-emerald-700 mb-1">99.9%</p>
                                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">On-Time Scans</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-24 bg-slate-900 text-white">
               <div className="max-w-7xl mx-auto px-6 text-center">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">WHAT WE STAND FOR</span>
                  <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tight mt-2">Competitive Advantages</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     {[
                        { icon: ShieldCheck, title: "Trust & Transparency", desc: "Real-time satellite GPS waybill verification ensures tamper-proof telemetry across all international transit hubs." },
                        { icon: Zap, title: "Speed & Multi-Modal Transit", desc: "Dedicated express air corridors and intermodal ground networks optimized for rapid parcel movement." },
                        { icon: Users, title: "24/7 Dedicated Support", desc: "Logistics specialist support available around-the-clock to assist with route updates and customs paperwork." }
                     ].map((value, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-6 text-left hover:border-emerald-600 transition-all">
                           <div className="w-16 h-16 bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-lg">
                              <value.icon size={28} />
                           </div>
                           <h3 className="text-2xl font-extrabold text-white">{value.title}</h3>
                           <p className="text-slate-300 text-sm leading-relaxed font-medium">{value.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* CTA */}
            <section className="py-24 max-w-7xl mx-auto px-6 text-center">
                <div className="bg-emerald-700 text-white p-12 md:p-16 rounded-3xl shadow-2xl space-y-6 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">Ready to Dispatch or Track Your Freight?</h2>
                    <p className="text-emerald-100 text-base max-w-2xl mx-auto font-medium">
                        Experience fast, reliable and secure package tracking across global logistics hubs with Vanguard Freight & Cargo.
                    </p>
                    <div className="pt-4 flex flex-wrap justify-center gap-4">
                        <Link href="/tracking" className="bg-white text-emerald-700 font-extrabold text-sm px-8 py-4 rounded-xl shadow-lg hover:bg-slate-100 transition-all">
                            Track Consignment Now
                        </Link>
                        <Link href="/contact" className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm px-8 py-4 rounded-xl border border-emerald-600 transition-all">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
