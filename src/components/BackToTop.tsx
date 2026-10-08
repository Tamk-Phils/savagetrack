"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let ticking = false;

        const toggleVisibility = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsVisible(window.scrollY > 300);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 p-3.5 bg-emerald-700 text-white rounded-full shadow-2xl hover:bg-emerald-800 active:scale-95 transition-all z-40 animate-in fade-in duration-200 border border-emerald-500/30"
        >
            <ChevronUp size={22} />
        </button>
    );
}
