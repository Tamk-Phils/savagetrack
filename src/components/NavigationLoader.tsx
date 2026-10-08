"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Navigation } from "lucide-react";

function LoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setIsLoading(false), 3500);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        href !== pathname &&
        !anchor.target
      ) {
        setIsLoading(true);
      }
    };

    const handleFormSubmit = () => {
      setIsLoading(true);
    };

    document.addEventListener("click", handleAnchorClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
      {/* Top Loading Progress Line */}
      <div className="w-full h-1.5 bg-emerald-100 overflow-hidden relative shadow-sm">
        <div className="h-full bg-gradient-to-r from-emerald-700 via-teal-500 to-emerald-700 animate-pulse w-full" />
      </div>

      {/* Non-intrusive Top-Right Floating Loading Spinner Toast (NO SCREEN OVERLAY) */}
      <div className="fixed top-24 right-6 z-[99999] pointer-events-none animate-in slide-in-from-top-2 fade-in duration-200">
        <div className="bg-white/95 px-5 py-3.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3.5 text-slate-800">
          <div className="relative flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-emerald-100 border-t-emerald-700 animate-spin" />
            <Navigation size={12} className="text-emerald-700 absolute transform rotate-45" />
          </div>
          <div>
            <p className="font-extrabold text-xs text-slate-900 tracking-tight">Vanguard Freight & Cargo</p>
            <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider animate-pulse">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderContent />
    </Suspense>
  );
}
