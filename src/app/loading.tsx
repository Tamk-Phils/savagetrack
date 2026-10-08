import { Navigation } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center space-y-4 text-center max-w-sm w-full animate-in zoom-in-95 duration-200">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-700 animate-spin" />
          <Navigation size={24} className="text-emerald-700 absolute transform rotate-45" />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-lg tracking-tight">Vanguard Freight & Cargo</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Connecting to Satellite Network...</p>
        </div>
      </div>
    </div>
  );
}
