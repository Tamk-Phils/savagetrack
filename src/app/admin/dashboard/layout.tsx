"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Package, PlusCircle, LogOut, ArrowLeft, Menu, X, LucideIcon, MessageSquare, Users as UserProfileIcon, BarChart3 as BarChartIcon, Settings as SettingsIcon, AlertTriangle as AlertTriangleIcon, Radar, Activity } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";

interface MenuItem {
    label: string;
    icon: LucideIcon;
    href: string;
}

const SidebarContent = ({
    pathname,
    router,
    setIsSidebarOpen,
    menuItems
}: {
    pathname: string;
    router: AppRouterInstance;
    setIsSidebarOpen: (open: boolean) => void;
    menuItems: MenuItem[];
}) => (
    <div className="h-full flex flex-col p-8">
        <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-slate-900 flex items-center justify-center text-primary font-black shadow-2xl">
                    <Radar size={20} className="animate-pulse" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">Vanguard Freight Admin</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Management Portal</span>
                </div>
            </div>
            <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
            >
                <X size={24} />
            </button>
        </div>

        <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider border ${isActive
                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                            : "text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-900"
                            }`}
                    >
                        <item.icon size={18} className={isActive ? "text-primary" : ""} />
                        {item.label}
                    </Link>
                );
            })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-2">
            <button
                onClick={() => {
                    setIsSidebarOpen(false);
                    router.push("/");
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all text-xs font-bold uppercase tracking-wider border border-transparent"
            >
                <ArrowLeft size={18} />
                Back to Website
            </button>
            <button
                onClick={() => {
                    setIsSidebarOpen(false);
                    router.push("/admin");
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-teal-500 hover:bg-teal-50 transition-all text-xs font-bold uppercase tracking-wider border border-transparent"
            >
                <LogOut size={18} />
                Log Out
            </button>
        </div>
    </div>
);

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems: MenuItem[] = [
        { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
        { label: "All Shipments", icon: Package, href: "/admin/dashboard/shipments" },
        { label: "Create Shipment", icon: PlusCircle, href: "/admin/dashboard/add" },
        { label: "Customer Chat", icon: MessageSquare, href: "/admin/dashboard/chat" },
        { label: "Admin Users", icon: UserProfileIcon, href: "/admin/dashboard/users" },
        { label: "Reports", icon: BarChartIcon, href: "/admin/dashboard/reports" },
        { label: "Alerts", icon: AlertTriangleIcon, href: "/admin/dashboard/alerts" },
        { label: "Settings", icon: SettingsIcon, href: "/admin/dashboard/settings" },
    ];

    return (
        <div className="flex min-h-screen bg-white">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-80 bg-white border-r border-slate-200 flex-col shadow-sm sticky top-0 h-screen shrink-0">
                <SidebarContent
                    pathname={pathname}
                    router={router}
                    setIsSidebarOpen={setIsSidebarOpen}
                    menuItems={menuItems}
                />
            </aside>

            {/* Mobile Sidebar / Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl lg:hidden"
                        >
                            <SidebarContent
                                pathname={pathname}
                                router={router}
                                setIsSidebarOpen={setIsSidebarOpen}
                                menuItems={menuItems}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0 pt-28 lg:pt-0">
                {/* Mobile Top Header (Sits cleanly below global site Header on mobile) */}
                <header className="lg:hidden h-16 bg-slate-900 text-white px-6 flex items-center justify-between sticky top-[76px] z-30 border-b border-slate-800 shadow-md">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/" 
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-primary bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 transition-colors"
                        >
                            <ArrowLeft size={14} className="text-primary" /> Home
                        </Link>
                        <div className="h-4 w-px bg-slate-700" />
                        <div className="flex items-center gap-2">
                            <Radar size={16} className="text-primary animate-pulse" />
                            <span className="text-[11px] font-black text-white uppercase tracking-wider">Admin Portal</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-white hover:text-primary focus:outline-none transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
