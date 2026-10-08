"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircle, Send, User, Headset, Loader2, Search, Clock, ChevronRight, ArrowLeft, Trash2, Radar, Activity, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ChatRoom, ChatMessage } from "@/types";

export default function AdminChat() {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoadingRooms, setIsLoadingRooms] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial load of rooms
    useEffect(() => {
        loadRooms();

        // Subscribe to new rooms/updates
        const channel = supabase
            .channel('admin-rooms')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'chat_rooms' },
                () => loadRooms()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const [activeChannel, setActiveChannel] = useState<any>(null);

    // Load messages when room selection changes
    useEffect(() => {
        if (selectedRoomId) {
            loadMessages(selectedRoomId);

            // Subscribe to room messages
            const channel = supabase
                .channel(`room-${selectedRoomId}`, { config: { broadcast: { ack: false } } })
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'chat_messages',
                        filter: `room_id=eq.${selectedRoomId}`
                    },
                    (payload) => {
                        const d = payload.new as any;
                        const newMsg: ChatMessage = {
                            id: d.id,
                            room_id: d.room_id,
                            sender_name: d.sender_name,
                            content: d.message,
                            sender_role: d.is_admin ? 'admin' : 'user',
                            created_at: d.created_at
                        };
                        setMessages(prev => {
                            if (prev.find(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                    }
                )
                .on(
                    'broadcast',
                    { event: 'new_message' },
                    (payload) => {
                        const newMsg = payload.payload as ChatMessage;
                        setMessages(prev => {
                            if (prev.find(m => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                    }
                )
                .subscribe();

            setActiveChannel(channel);

            return () => {
                supabase.removeChannel(channel);
                setActiveChannel(null);
            };
        }
    }, [selectedRoomId]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadRooms = async () => {
        const { data, error } = await supabase
            .from('chat_rooms')
            .select('*')
            .order('updated_at', { ascending: false });

        if (!error && data) {
            setRooms(data);
        }
        setIsLoadingRooms(false);
    };

    const loadMessages = async (id: string) => {
        setIsLoadingMessages(true);
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('room_id', id)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setMessages(data.map((d: any) => ({
                id: d.id,
                room_id: d.room_id,
                sender_name: d.sender_name,
                content: d.message,
                sender_role: d.is_admin ? 'admin' : 'user',
                created_at: d.created_at
            })));
        }
        setIsLoadingMessages(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedRoomId) return;

        const content = inputValue.trim();
        setInputValue("");
        
        if (activeChannel) {
            activeChannel.send({
                type: 'broadcast',
                event: 'typing',
                payload: { isTyping: false }
            });
        }

        const newId = crypto.randomUUID();
        const adminMsg: ChatMessage = {
            id: newId,
            room_id: selectedRoomId,
            sender_name: "Admin",
            content,
            sender_role: "admin",
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, adminMsg]);

        if (activeChannel) {
            activeChannel.send({
                type: 'broadcast',
                event: 'new_message',
                payload: adminMsg
            });
        }

        const { error } = await supabase
            .from('chat_messages')
            .insert([{ id: newId, room_id: selectedRoomId, sender_name: 'Admin', message: content, is_admin: true }]);

        if (!error) {
            await supabase
                .from('chat_rooms')
                .update({ last_message: content, updated_at: new Date().toISOString() })
                .eq('id', selectedRoomId);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (activeChannel) {
            activeChannel.send({
                type: 'broadcast',
                event: 'typing',
                payload: { isTyping: e.target.value.length > 0 }
            });
        }
    };

    const handleDeleteRoom = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this conversation? This cannot be undone.")) return;

        const { error } = await supabase
            .from('chat_rooms')
            .delete()
            .eq('id', id);

        if (!error) {
            if (selectedRoomId === id) setSelectedRoomId(null);
            loadRooms();
        } else {
            alert("Error deleting chat: " + error.message);
        }
    };

    const selectedRoom = rooms.find(r => r.id === selectedRoomId);

    return (
        <div className="h-[calc(100vh-12rem)] min-h-[600px] flex bg-white rounded-sm overflow-hidden border border-slate-200 shadow-3xl">
            {/* Rooms List */}
            <div className={`w-full lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/30 ${selectedRoomId ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-10 border-b border-slate-200 bg-white">
                    <h2 className="text-[10px] font-black text-slate-900 flex items-center gap-4 uppercase tracking-[0.4em]">
                        <MessageCircle className="text-primary" size={18} />
                        COMMUNICATIONS
                    </h2>
                    <div className="mt-8 relative">
                        <input
                            type="text"
                            placeholder="SEARCH TERMINALS..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-sm py-4 px-6 pl-14 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-primary transition-all outline-none placeholder:text-slate-300"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoadingRooms ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="animate-spin text-primary" size={28} />
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center p-12 space-y-4">
                            <p className="font-black text-slate-300 text-[10px] uppercase tracking-widest italic">NO ACTIVE DATA CHATS</p>
                            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tight">NEW OFFICE MESSAGES WILL APPEAR HERE.</p>
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => setSelectedRoomId(room.id)}
                                className={`w-full p-8 rounded-sm text-left transition-all border ${selectedRoomId === room.id
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                    : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4 group/room">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className={`font-black text-xs uppercase tracking-tight truncate ${selectedRoomId === room.id ? 'text-white' : 'text-slate-900'}`}>
                                            {room.customer_name}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex items-center gap-2 opacity-50">
                                            <Clock size={12} />
                                            <p className="text-[9px] font-black uppercase">
                                                {new Date(room.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteRoom(e, room.id)}
                                            className={`p-2 rounded-sm transition-all ${selectedRoomId === room.id
                                                ? 'text-white/30 hover:text-white hover:bg-white/10'
                                                : 'text-slate-200 hover:text-teal-500 hover:bg-teal-50'
                                                }`}
                                            title="Terminate Connection"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <p className={`text-[10px] font-bold uppercase tracking-tight truncate ${selectedRoomId === room.id ? 'text-white/40' : 'text-slate-400'}`}>
                                    {room.last_message || 'ESTABLISHING CONNECTION...'}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-white ${!selectedRoomId ? 'hidden lg:flex' : 'flex'}`}>
                {selectedRoomId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white relative z-10">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setSelectedRoomId(null)}
                                    className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center text-primary shadow-sm">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{selectedRoom?.customer_name}</h3>
                                    <p className="text-[9px] text-slate-400 font-black tracking-widest uppercase italic mt-1">{selectedRoom?.customer_email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-primary/5 px-4 py-1.5 rounded-sm border border-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full shadow-[0_0_8px_rgba(0,112,243,0.5)]" /> LIVE UPLINK
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-12 space-y-8 bg-slate-50/20"
                        >
                            {isLoadingMessages ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] md:max-w-[70%] p-6 rounded-sm text-xs font-bold uppercase tracking-tight shadow-sm relative ${msg.sender_role === 'admin'
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white text-slate-900 border border-slate-200'
                                            }`}>
                                            <div className={`absolute top-0 w-1 h-full ${msg.sender_role === 'admin' ? 'right-0 bg-primary' : 'left-0 bg-primary'}`} />
                                            {msg.content}
                                            <div className={`flex items-center gap-2 text-[8px] mt-4 font-black tracking-widest opacity-40 ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <Clock size={10} />
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Reply Area */}
                        <form
                            onSubmit={handleSendMessage}
                            className="p-8 border-t border-slate-100 flex gap-6 bg-white relative z-10"
                        >
                            <input
                                type="text"
                                placeholder="TYPE UPLINK RESPONSE..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-sm py-5 px-8 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-primary transition-all outline-none"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <button
                                type="submit"
                                className="px-12 bg-slate-900 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-xl flex items-center gap-4"
                            >
                                <span className="hidden md:inline">TRANSMIT</span>
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                        <div className="w-32 h-32 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center text-slate-100 shadow-inner group">
                            <MessageCircle size={64} className="group-hover:scale-110 group-hover:text-primary transition-all duration-700" />
                        </div>
                        <div className="max-w-md space-y-4 relative z-10">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">INITIALIZE COMMUNICATION</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] leading-relaxed">
                                SELECT AN ACTIVE PLANETARY OFFICE FROM THE DIRECTORY TO INITIATE LIVE DATA SUPPORT.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
