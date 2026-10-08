"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, Search, Filter, MoreVertical, Mail, Shield, ShieldCheck, Radar, Activity, Fingerprint } from "lucide-react";
import { useState } from "react";

export default function UserManagement() {
    const [users, setUsers] = useState([
        { id: 1, name: "COMMAND ADMIN", email: "ADMIN@VANGUARD FREIGHTSHIPPING.COM", role: "SUPER USER", status: "ACTIVE", lastLogin: "2 MINS AGO" },
        { id: 2, name: "SARAH JENKINS", email: "S.JENKINS@SWIFT.IO", role: "OPERATOR", status: "ACTIVE", lastLogin: "1 HOUR AGO" },
        { id: 3, name: "ROBERT CHEN", email: "R.CHEN@GLOBALPORT.IO", role: "MANAGER", status: "OFFLINE", lastLogin: "3 DAYS AGO" },
        { id: 4, name: "MICHAEL TORRES", email: "M.TORRES@APEX.IO", role: "OPERATOR", status: "ACTIVE", lastLogin: "5 HOURS AGO" },
    ]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Radar size={18} className="text-primary animate-pulse" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Personnel</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">ADMIN <span className="text-primary italic">USERS</span></h1>
                </div>
                <button className="bg-slate-900 hover:bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all">
                    <UserPlus size={18} /> Add New User
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "TOTAL USERS", val: "1,280", icon: Users, color: "text-primary", bg: "bg-primary/5" },
                    { label: "ACTIVE USERS", val: "42", icon: Activity, color: "text-primary", bg: "bg-primary/5" },
                    { label: "PENDING INVITES", val: "15", icon: Fingerprint, color: "text-primary", bg: "bg-primary/5" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex items-center gap-6 relative overflow-hidden">
                        <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users by name or email..." 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 pl-11 text-xs font-semibold text-slate-900 focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                        <button className="flex items-center gap-2 hover:text-primary transition-all uppercase tracking-wider">
                            <Filter size={16} /> Filter
                        </button>
                        <div className="h-4 w-[1px] bg-slate-200" />
                        <span className="uppercase tracking-wider">Showing 4 Users</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">User Info</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Login</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-all bg-white">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-primary font-bold">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs">{user.name}</p>
                                                <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 uppercase tracking-wider">{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                            <span className={`text-xs font-bold uppercase tracking-wider ${user.status === 'ACTIVE' ? 'text-emerald-700' : 'text-slate-400'}`}>{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                        {user.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
