"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Headset, Loader2, ArrowRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";

interface ChatMessage {
    id: string;
    room_id: string;
    sender_name: string;
    content: string;
    sender_role: "user" | "admin" | "system";
    created_at: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);
    const [activeChannel, setActiveChannel] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize session and load messages
    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
            setSession(currentSession);
            setIsLoadingSession(false);

            if (currentSession) {
                // Determine room ID based on user ID so they always have the same room
                const userRoomId = currentSession.user.id;
                setRoomId(userRoomId);
                
                // Load existing messages
                const { data } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('room_id', userRoomId)
                    .order('created_at', { ascending: true });
                    
                if (data && data.length > 0) {
                    setMessages(data.map((d: any) => ({
                        id: d.id,
                        room_id: d.room_id,
                        sender_name: d.sender_name,
                        content: d.message,
                        sender_role: d.is_admin ? 'admin' : 'user',
                        created_at: d.created_at
                    })));
                } else {
                    // Welcome message for authenticated users
                    setMessages([{
                        id: 'welcome',
                        room_id: userRoomId,
                        sender_name: 'System',
                        content: `Hello ${currentSession.user.user_metadata.full_name || 'there'}! Welcome to Vanguard Freight & Cargo Support. How can we help with your cargo or parcel today?`,
                        sender_role: 'system',
                        created_at: new Date().toISOString()
                    }]);
                }
            } else {
                // Welcome message for unauthenticated users
                setMessages([{
                    id: 'welcome-unauth',
                    room_id: 'temp',
                    sender_name: 'System',
                    content: 'Hello! To ensure security and dedicated support, please sign in to establish a live uplink with our dispatch agents.',
                    sender_role: 'system',
                    created_at: new Date().toISOString()
                }]);
                setRoomId(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Subscribe to real-time messages
    useEffect(() => {
        if (!roomId || !session) return;

        const channel = supabase
            .channel(`room-${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `room_id=eq.${roomId}`
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
                        // Prevent duplicates
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                    
                    if (!isOpen && newMsg.sender_role === 'admin') {
                        setUnreadCount(prev => prev + 1);
                    }
                    setIsTyping(false);
                }
            )
            .on(
                'broadcast',
                { event: 'typing' },
                (payload) => {
                    setIsTyping(payload.payload.isTyping);
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
                    
                    if (!isOpen && newMsg.sender_role === 'admin') {
                        setUnreadCount(prev => prev + 1);
                    }
                    setIsTyping(false);
                }
            )
            .subscribe();

        setActiveChannel(channel);

        return () => {
            supabase.removeChannel(channel);
            setActiveChannel(null);
        };
    }, [roomId, session, isOpen]);

    // Auto-scroll to latest message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
        setUnreadCount(0);
    };

    const handleQuickAction = (promptText: string) => {
        if (session) {
            submitUserMessage(promptText);
        }
    };

    const submitUserMessage = async (text: string) => {
        if (!text.trim() || !session || !roomId) return;

        const fullName = session.user.user_metadata.full_name || 'Verified User';
        const email = session.user.email || 'unknown@email.com';

        // Check if room exists by attempting to create/update it
        const { data: existingRoom } = await supabase
            .from('chat_rooms')
            .select('id')
            .eq('id', roomId)
            .single();

        if (!existingRoom) {
            // Insert new room using user's real identity
            await supabase.from('chat_rooms').insert([{
                id: roomId,
                customer_name: fullName,
                customer_email: email,
                last_message: text
            }]);
        } else {
            // Update last message in room
            await supabase.from('chat_rooms').update({
                last_message: text,
                updated_at: new Date().toISOString()
            }).eq('id', roomId);
        }

        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            room_id: roomId,
            sender_name: fullName,
            content: text,
            sender_role: "user",
            created_at: new Date().toISOString()
        };

        // Optimistically add message
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        if (activeChannel) {
            activeChannel.send({
                type: 'broadcast',
                event: 'new_message',
                payload: userMsg
            });
        }

        // Send to Supabase
        await supabase.from('chat_messages').insert([{
            id: userMsg.id,
            room_id: userMsg.room_id,
            sender_name: userMsg.sender_name,
            message: userMsg.content,
            is_admin: false
        }]);
        
        // If it's the very first message, simulate an automated acknowledgment while waiting for admin
        if (messages.length <= 2) { // Allow for welcome message
            setTimeout(async () => {
                const autoReply: ChatMessage = {
                    id: crypto.randomUUID(),
                    room_id: roomId,
                    sender_name: "System",
                    content: "Thank you for reaching out! A Vanguard Freight dispatch agent has been notified and will join the chat momentarily.",
                    sender_role: "system",
                    created_at: new Date().toISOString()
                };
                await supabase.from('chat_messages').insert([{
                    id: autoReply.id,
                    room_id: autoReply.room_id,
                    sender_name: autoReply.sender_name,
                    message: autoReply.content,
                    is_admin: true
                }]);
                setIsTyping(false);
            }, 1500);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitUserMessage(inputValue);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.92 }}
                        className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 p-5 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40">
                                    <Headset size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-extrabold text-sm tracking-tight">Vanguard Freight Support</h4>
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    </div>
                                    <p className="text-[11px] text-slate-300 font-medium">Online 24/7 Global Dispatch Desk</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Quick Prompts Bar (Only show if authenticated) */}
                        {session && (
                            <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-[11px] font-bold text-slate-700 no-scrollbar">
                                <span className="text-slate-400 shrink-0 font-extrabold uppercase tracking-wider text-[9px]">Quick:</span>
                                <button
                                    onClick={() => handleQuickAction("Track my consignment")}
                                    className="bg-white hover:bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-slate-200/80 hover:border-emerald-200 whitespace-nowrap transition-colors shadow-sm"
                                >
                                    📦 Track Consignment
                                </button>
                                <button
                                    onClick={() => handleQuickAction("Get a freight quote")}
                                    className="bg-white hover:bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-slate-200/80 hover:border-emerald-200 whitespace-nowrap transition-colors shadow-sm"
                                >
                                    💰 Request Quote
                                </button>
                            </div>
                        )}

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50"
                        >
                            {isLoadingSession ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 className="animate-spin text-emerald-700" size={24} />
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.sender_role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${msg.sender_role === 'user'
                                                ? 'bg-emerald-700 text-white rounded-br-none'
                                                : msg.sender_role === 'admin'
                                                    ? 'bg-slate-900 text-white rounded-bl-none'
                                                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 px-1">
                                            <span className="text-[9px] font-bold text-slate-400">
                                                {msg.sender_role === 'admin' ? 'Agent' : msg.sender_name}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-medium">
                                                • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}

                            {isTyping && (
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold p-2 bg-white rounded-2xl border border-slate-200/60 w-fit">
                                    <Loader2 className="animate-spin text-emerald-700" size={14} />
                                    <span>Waiting for response...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Footer (Conditional on Authentication) */}
                        {!isLoadingSession && (
                            session ? (
                                <form
                                    onSubmit={handleSubmit}
                                    className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
                                >
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="w-10 h-10 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            ) : (
                                <div className="p-4 border-t border-slate-200 bg-white flex justify-center">
                                    <Link 
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="w-full bg-slate-900 hover:bg-emerald-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-extrabold tracking-widest uppercase transition-colors shadow-lg"
                                    >
                                        <Lock size={14} />
                                        Secure Sign In
                                    </Link>
                                </div>
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <div className="relative">
                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-700 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10 animate-bounce">
                        {unreadCount}
                    </span>
                )}
                <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={isOpen ? () => setIsOpen(false) : handleOpen}
                    className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all cursor-pointer ${isOpen ? 'bg-slate-900 text-white' : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-emerald-900/40'
                        }`}
                >
                    {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
                </motion.button>
            </div>
        </div>
    );
}
