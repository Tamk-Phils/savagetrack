"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, Home, Radar } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (username === "admin" && password === "admin123") {
                router.push("/admin/dashboard");
            } else {
                alert("Invalid username or password. Please try again.");
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-200 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-slate-50 text-primary px-4 py-2 rounded-full text-xs font-bold border border-slate-200 mb-6 shadow-sm">
                        <Radar size={14} className="animate-spin-slow" />
                        <span className="text-slate-600">Admin Portal</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">VANGUARD FREIGHT <span className="text-primary italic">ADMIN</span></h2>
                    <p className="text-slate-500 font-medium text-sm">Please log in to manage shipments</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 pl-12 focus:outline-none focus:border-primary transition-all font-semibold text-sm text-slate-900 outline-none"
                                placeholder="Username"
                                required
                            />
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 pl-12 focus:outline-none focus:border-primary transition-all font-semibold text-sm text-slate-900 outline-none"
                                placeholder="Password"
                                required
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-primary text-white py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 group text-sm uppercase tracking-wider"
                        >
                            {isLoading ? "Signing In..." : (
                                <>
                                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-xs">
                        <Home size={14} /> Back to Website
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
