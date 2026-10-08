"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Loader2, UserPlus, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 sm:p-10 bg-slate-50 relative overflow-hidden">
            {/* Background elements - Performance Optimized */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-200/30 via-transparent to-transparent opacity-60" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-200/30 via-transparent to-transparent opacity-60" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white rounded-sm border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10"
            >
                <div className="md:w-1/3 bg-slate-900 p-10 flex flex-col justify-between text-white relative">
                    <div className="relative z-10">
                        <LogIn size={48} className="text-primary mb-8" />
                        <h2 className="text-2xl font-black uppercase tracking-tighter leading-[0.9]">ESTABLISH <br/><span className="text-primary">UPLINK</span></h2>
                    </div>
                    <div className="relative z-10 pt-10 border-t border-white/10">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">VANGUARD FREIGHT</p>
                    </div>
                </div>

                <div className="md:w-2/3 p-10 sm:p-16">
                    <div className="mb-12">
                        <h1 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter">SECURE AUTH</h1>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">Enter your service credentials to access the global data network.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-6 bg-teal-50 border border-teal-100 text-teal-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                            <ShieldAlert size={16} />
                            ACCESS DENIED: {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Network Identity</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-sm py-5 px-6 pl-14 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-slate-900 text-sm outline-none"
                                    placeholder="user@vanguardfreight.com"
                                />
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Passkey</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-sm py-5 px-6 pl-14 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-slate-900 text-sm tracking-widest outline-none"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-slate-900 text-white py-6 rounded-sm font-black text-xs uppercase tracking-[0.4em] transition-all shadow-lg flex items-center justify-center gap-4 group disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    SYNC UPLINK <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">Secure monitoring active.</p>
                        <Link href="/signup" className="inline-flex items-center gap-2 text-primary hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors">
                            <UserPlus size={14} /> NEW IDENTITY
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
