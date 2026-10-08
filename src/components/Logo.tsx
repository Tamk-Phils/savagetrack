"use client";

import { motion } from "framer-motion";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <motion.div 
            className={`relative ${className}`}
            whileHover={{ scale: 1.05 }}
        >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                    <linearGradient id="logoGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0d9488" />
                        <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                </defs>
                
                {/* Background circle */}
                <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" opacity="0.15" />

                {/* Outer Ring */}
                <circle 
                    cx="50" cy="50" r="45" 
                    stroke="url(#logoGradient)" 
                    strokeWidth="1.5" 
                />

                {/* Rotating dashed ring */}
                <motion.circle 
                    cx="50" cy="50" r="35" 
                    stroke="#059669" 
                    strokeWidth="0.5"
                    strokeDasharray="4 8"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Freight ship hull shape */}
                <path 
                    d="M20 58 Q50 68 80 58 L74 50 H26 Z" 
                    fill="url(#logoGradient)" 
                    opacity="0.9"
                />

                {/* Ship mast / forward arrow */}
                <path 
                    d="M50 28 L50 52" 
                    stroke="url(#logoGradient)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                />

                {/* Sail / cargo box */}
                <rect x="38" y="32" width="24" height="18" rx="2"
                    fill="url(#logoGradient2)" opacity="0.8" />

                {/* VF letter mark */}
                <text x="50" y="46" textAnchor="middle" fontSize="10" fontWeight="bold"
                    fill="white" fontFamily="Arial, sans-serif">VF</text>
                
                {/* Pulsing center dot */}
                <motion.circle 
                    cx="50" cy="58" r="3" 
                    fill="#14b8a6"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Speed lines */}
                <line x1="22" y1="54" x2="14" y2="54" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <line x1="22" y1="58" x2="12" y2="58" stroke="#0d9488" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            </svg>
        </motion.div>
    );
}
