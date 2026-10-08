"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Filter, Edit2, Trash2, ArrowUpRight, Package, RefreshCw, X, Save, MapPin, Clock, Copy, Check, Radar, Activity, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });
import { notifyShipmentUpdate } from "@/app/actions/email";
import { Shipment, ShipmentUpdate } from "@/types";

export default function ShipmentsList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleted, setShowDeleted] = useState(false);
    const [copyId, setCopyId] = useState<string | null>(null);

    // Status Update Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
    const [newUpdate, setNewUpdate] = useState({
        status: "Pending",
        location: "",
        description: "",
        lat: 52.5200,
        lng: 13.4050
    });

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopyId(id);
        setTimeout(() => setCopyId(null), 2000);
    };

    const loadShipments = async () => {
        // Optimistic Load
        const cached = localStorage.getItem("vanguardfreight_shipments") || localStorage.getItem("vanguardfreight_shipments");
        if (cached) {
            setShipments(JSON.parse(cached) as Shipment[]);
        }

        setIsLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
            const { data, error } = await supabase
                .from('shipments')
                .select('*')
                .order('created_at', { ascending: false })
                .abortSignal(controller.signal);

            clearTimeout(timeoutId);
            if (error) throw error;

            if (data) {
                setShipments(data as Shipment[]);
                localStorage.setItem("vanguardfreight_shipments", JSON.stringify(data));
            }
        } catch (err: any) {
            clearTimeout(timeoutId);
            console.error("Supabase Load Error:", err.message || "Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadShipments();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(`Are you sure you want to archive transit ${id}? It will be hidden from public view.`)) return;

        try {
            const { error } = await supabase
                .from('shipments')
                .update({ is_deleted: true, updated_at: new Date().toISOString() })
                .eq('tracking_number', id);

            if (error) throw error;

            const updated = shipments.map(s => {
                if (s.tracking_number === id) return { ...s, is_deleted: true, updated_at: new Date().toISOString() };
                return s;
            });
            setShipments(updated);
            localStorage.setItem("vanguardfreight_shipments", JSON.stringify(updated));
        } catch (err) {
            console.error(err);
            alert("Failed to archive transit.");
        }
    };

    const handleRestore = async (id: string) => {
        try {
            const { error } = await supabase
                .from('shipments')
                .update({ is_deleted: false, updated_at: new Date().toISOString() })
                .eq('tracking_number', id);

            if (error) throw error;

            const updated = shipments.map(s => {
                if (s.tracking_number === id) return { ...s, is_deleted: false, updated_at: new Date().toISOString() };
                return s;
            });
            setShipments(updated);
            localStorage.setItem("vanguardfreight_shipments", JSON.stringify(updated));
            alert(`Delivery ${id} restored successfully.`);
        } catch (err) {
            console.error(err);
            alert("Failed to restore transit.");
        }
    };

    const handleEditClick = (shipment: Shipment) => {
        setEditingShipment(shipment);
        setNewUpdate({
            status: shipment.current_status || "Pending",
            location: "",
            description: "",
            lat: shipment.latitude || 32.7767,
            lng: shipment.longitude || -96.7970
        });
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingShipment || isUpdating) return;
        setIsUpdating(true);

        const updateRecord = {
            id: Math.random().toString(36).substr(2, 9),
            shipment_id: editingShipment.tracking_number,
            status: newUpdate.status,
            location: newUpdate.location,
            description: newUpdate.description,
            created_at: new Date().toISOString()
        };

        const updatedUpdates = [updateRecord, ...(editingShipment.updates || [])];

        try {
            const { error } = await supabase
                .from('shipments')
                .update({
                    current_status: newUpdate.status,
                    updates: updatedUpdates,
                    latitude: newUpdate.lat,
                    longitude: newUpdate.lng,
                    updated_at: new Date().toISOString()
                })
                .eq('tracking_number', editingShipment.tracking_number);

            if (error) throw error;

            const updatedShipments = shipments.map(s => {
                if (s.tracking_number === editingShipment.tracking_number) {
                    return {
                        ...s,
                        current_status: newUpdate.status as any,
                        latitude: newUpdate.lat,
                        longitude: newUpdate.lng,
                        updates: updatedUpdates,
                        updated_at: new Date().toISOString()
                    };
                }
                return s;
            });

            setShipments(updatedShipments);
            localStorage.setItem("vanguardfreight_shipments", JSON.stringify(updatedShipments));

            if (editingShipment.recipient_email) {
                await notifyShipmentUpdate({
                    to: editingShipment.recipient_email,
                    subject: `Vanguard Freight: Delivery Update ${editingShipment.tracking_number}`,
                    trackingNumber: editingShipment.tracking_number,
                    recipientName: editingShipment.recipient_name || 'Operator',
                    newStatus: newUpdate.status,
                    location: newUpdate.location,
                    description: newUpdate.description
                });
            }

            setIsModalOpen(false);
            setEditingShipment(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update transit data.");
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredShipments = shipments.filter(s => {
        const matchesSearch =
            s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.recipient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.item_type || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesVisibility = showDeleted ? s.is_deleted : !s.is_deleted;

        return matchesSearch && matchesVisibility;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Radar size={18} className="text-primary animate-pulse" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipment Management</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">ALL <span className="text-primary italic">SHIPMENTS</span></h1>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={loadShipments}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary transition-all shadow-sm"
                        title="Refresh List"
                    >
                        <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <Link
                        href="/admin/dashboard/add"
                        className="flex-1 sm:flex-initial bg-slate-900 hover:bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> Create New Shipment
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search by tracking number or recipient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 pl-11 text-xs font-semibold text-slate-900 focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setShowDeleted(!showDeleted)}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider shadow-sm ${showDeleted
                                ? "bg-amber-50 border-amber-200 text-amber-700"
                                : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                        >
                            <Trash2 size={16} /> {showDeleted ? "Viewing Archived" : "View Archive"}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading && shipments.length === 0 ? (
                        <div className="p-20 text-center text-slate-400 font-bold text-xs uppercase tracking-wider animate-pulse">Loading shipments...</div>
                    ) : (
                        <>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4">Tracking Number</th>
                                        <th className="px-6 py-4 hidden md:table-cell">Sender & Receiver</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredShipments.length > 0 ? (
                                        filteredShipments.map((shipment, i) => (
                                            <tr key={i} className="hover:bg-slate-50/80 transition-colors bg-white">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 shrink-0">
                                                            <Package size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-slate-900 font-black text-sm tracking-tight">{shipment.tracking_number}</p>
                                                                <button
                                                                    onClick={() => handleCopy(shipment.tracking_number)}
                                                                    className={`p-1 transition-all ${copyId === shipment.tracking_number ? 'text-primary' : 'text-slate-300 hover:text-slate-700'}`}
                                                                    title="Copy Tracking Number"
                                                                >
                                                                    {copyId === shipment.tracking_number ? <Check size={14} /> : <Copy size={14} />}
                                                                </button>
                                                            </div>
                                                            <p className="text-slate-400 text-xs font-medium mt-0.5">{shipment.item_type || 'General Cargo'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 hidden md:table-cell">
                                                    <p className="font-bold text-slate-900 text-xs">{shipment.recipient_name}</p>
                                                    <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs font-medium">
                                                        <span>{shipment.origin || 'Origin'}</span>
                                                        <ArrowUpRight size={12} className="text-primary" />
                                                        <span>{shipment.destination || 'Destination'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border inline-block ${shipment.current_status === 'Delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                                        shipment.current_status === 'Held' ? 'bg-teal-50 border-teal-200 text-teal-700' :
                                                            shipment.current_status === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                                                'bg-blue-50 border-blue-200 text-blue-700'
                                                        }`}>
                                                        {shipment.current_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(shipment)}
                                                            className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-900 hover:text-white transition-all"
                                                            title="Update Status"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        {shipment.is_deleted ? (
                                                            <button
                                                                onClick={() => handleRestore(shipment.tracking_number)}
                                                                className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                                                title="Restore"
                                                            >
                                                                <RefreshCw size={16} />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleDelete(shipment.tracking_number)}
                                                                className="p-2.5 bg-teal-50 border border-teal-200 text-teal-500 rounded-xl hover:bg-teal-600 hover:text-white transition-all"
                                                                title="Archive"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center bg-slate-50/50">
                                                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">No shipments found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="p-6 bg-slate-50/50 border-t border-slate-200">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Showing {filteredShipments.length} total shipments</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Status Update Modal */}
            {isModalOpen && editingShipment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Update Shipment Status</h3>
                                <p className="text-xs font-bold text-primary mt-1 uppercase tracking-wider">Tracking #{editingShipment.tracking_number}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateStatus} className="p-6 sm:p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">New Status</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 focus:outline-none focus:border-primary font-bold text-xs text-slate-900 appearance-none cursor-pointer outline-none"
                                        value={newUpdate.status}
                                        onChange={(e) => setNewUpdate({ ...newUpdate, status: e.target.value })}
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Delivery">In Delivery</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Held">Held at Customs</option>
                                        <option value="Postponed">Postponed</option>
                                    </select>
                                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Update Current Location on Map</label>
                                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                                    <MapPicker 
                                        initialLat={newUpdate.lat} 
                                        initialLng={newUpdate.lng} 
                                        onChange={(lat, lng) => setNewUpdate({ ...newUpdate, lat, lng })} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Update Notes / Details</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 focus:outline-none focus:border-primary font-semibold text-slate-700 text-xs min-h-[100px] outline-none resize-none"
                                    placeholder="e.g. Package arrived at distribution hub, cleared customs..."
                                    value={newUpdate.description}
                                    onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 bg-slate-900 hover:bg-primary text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin text-white" />
                                            <span>Saving Update...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span>Save Update</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
