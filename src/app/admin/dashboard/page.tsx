"use client";

import { useEffect, useState } from "react";
import { Package, TrendingUp, AlertCircle, CheckCircle, ArrowUpRight, Radar, Activity, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Shipment {
    tracking_number: string;
    current_status: string;
    status?: string; // Backwards compatibility
    created_at: string;
}

export default function DashboardOverview() {
    const [stats, setStats] = useState([
        { label: "TOTAL DELIVERYS", value: "0", icon: Package, color: "text-primary", bg: "bg-primary/5" },
        { label: "ACTIVE SYNC", value: "0", icon: Activity, color: "text-primary", bg: "bg-primary/5" },
        { label: "VERIFIED OFFICES", value: "0", icon: CheckCircle, color: "text-primary", bg: "bg-primary/5" },
        { label: "EXCEPTIONS", value: "0", icon: AlertCircle, color: "text-teal-500", bg: "bg-teal-50" },
    ]);
    const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const timer = setTimeout(() => {
            const saved = localStorage.getItem("vanguardfreight_shipments") || localStorage.getItem("vanguardfreight_shipments");
            const shipments: Shipment[] = saved ? JSON.parse(saved) : [];

            const total = shipments.length;
            const inDelivery = shipments.filter(s => (s.current_status || s.status) === "In Delivery" || (s.current_status || s.status) === "Out for Delivery").length;
            const delivered = shipments.filter(s => (s.current_status || s.status) === "Delivered").length;
            const exceptions = shipments.filter(s => (s.current_status || s.status) === "Held" || (s.current_status || s.status) === "Postponed").length;

            setStats([
                { label: "TOTAL SHIPMENTS", value: total.toLocaleString(), icon: Package, color: "text-primary", bg: "bg-primary/5" },
                { label: "IN TRANSIT", value: inDelivery.toLocaleString(), icon: Activity, color: "text-primary", bg: "bg-primary/5" },
                { label: "DELIVERED", value: delivered.toLocaleString(), icon: CheckCircle, color: "text-primary", bg: "bg-primary/5" },
                { label: "HELD / ISSUES", value: exceptions.toLocaleString(), icon: AlertCircle, color: "text-teal-500", bg: "bg-teal-50" },
            ]);

            setRecentShipments(shipments.slice(-5).reverse());
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <Radar size={18} className="text-primary animate-pulse" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dashboard Summary</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">SHIPMENT <span className="text-primary italic">OVERVIEW</span></h1>
                </div>
                <Link href="/admin/dashboard/shipments" className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-primary transition-all shadow-md">
                    VIEW ALL SHIPMENTS <ArrowUpRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <stat.icon size={24} />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-wider">
                        <Activity className="text-primary" size={18} />
                        RECENT SHIPMENTS
                    </h3>
                    <div className="space-y-4 relative z-10">
                        {recentShipments.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-wider bg-slate-50 border border-dashed border-slate-200 rounded-xl">No recent shipments found</div>
                        ) : recentShipments.map((shipment) => (
                            <div key={shipment.tracking_number} className="flex gap-4 items-center p-4 rounded-xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all group bg-white">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                    <Package size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 text-sm tracking-tight truncate">Tracking #{shipment.tracking_number}</p>
                                    <p className="text-slate-400 font-medium text-xs mt-0.5">Status: {shipment.current_status} • Date: {new Date(shipment.created_at).toLocaleDateString()}</p>
                                </div>
                                <Link href="/admin/dashboard/shipments" className="text-xs font-bold text-primary hover:underline px-3 py-1 bg-primary/10 rounded-lg shrink-0">Details</Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <h3 className="text-xs font-bold text-primary mb-8 flex items-center gap-2 uppercase tracking-wider">
                            <Zap size={16} />
                            SYSTEM STATUS
                        </h3>
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-white/60 font-bold uppercase tracking-wider">DATABASE</span>
                                    <div className="flex items-center gap-2 font-bold text-primary">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        ONLINE
                                    </div>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-white/60 font-bold uppercase tracking-wider">EMAIL SERVICE</span>
                                    <div className="flex items-center gap-2 font-bold text-primary">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        ACTIVE
                                    </div>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-full" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 text-center relative z-10">
                            <p className="font-bold text-sm uppercase tracking-wider mb-4">Need Help?</p>
                            <Link href="/admin/dashboard/chat" className="w-full inline-block bg-white text-slate-900 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-md">System Support</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
