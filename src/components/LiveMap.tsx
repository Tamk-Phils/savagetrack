"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCoordsFromLocationName } from '@/lib/geocoding';
import { Maximize2, Minimize2, Navigation, MapPin, Compass, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Origin Icon (Start Point)
const originIcon = L.divIcon({
    html: `
        <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 bg-emerald-500/20 rounded-full animate-ping absolute"></div>
            <div class="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white font-black text-[10px]">
                A
            </div>
            <div class="absolute -bottom-8 bg-slate-900 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded shadow-md whitespace-nowrap uppercase tracking-wider border border-emerald-500/30">
                START
            </div>
        </div>
    `,
    className: 'custom-origin-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

// Destination Icon (End Point)
const destinationIcon = L.divIcon({
    html: `
        <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 bg-indigo-500/20 rounded-full animate-ping absolute"></div>
            <div class="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white font-black text-[10px]">
                B
            </div>
            <div class="absolute -bottom-8 bg-slate-900 text-indigo-400 text-[9px] font-black px-2 py-0.5 rounded shadow-md whitespace-nowrap uppercase tracking-wider border border-indigo-500/30">
                FINISH
            </div>
        </div>
    `,
    className: 'custom-dest-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

// Moving Package Icon
const movingTruckIcon = L.divIcon({
    html: `
        <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-emerald-500/30 rounded-full animate-ping"></div>
            <div class="relative w-10 h-10 bg-emerald-600 text-white border-2 border-white rounded-full flex items-center justify-center shadow-2xl text-lg">
                🚚
            </div>
            <div class="absolute -top-9 bg-slate-900 text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded shadow-xl whitespace-nowrap uppercase tracking-widest border border-emerald-500/40 flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                LIVE PACKAGE
            </div>
        </div>
    `,
    className: 'custom-moving-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

interface LiveMapProps {
    lat?: number;
    lng?: number;
    originLat?: number;
    originLng?: number;
    originName?: string;
    destinationLat?: number;
    destinationLng?: number;
    destinationName?: string;
    currentLocationName?: string;
    trackingNumber?: string;
    status?: string;
    zoom?: number;
}

// Map Controller Component for view switching and size handling
function MapFocusController({ 
    currentCoords, 
    viewMode, 
    bounds, 
    isFullscreen 
}: { 
    currentCoords: [number, number]; 
    viewMode: 'package' | 'route'; 
    bounds: L.LatLngBoundsExpression;
    isFullscreen: boolean;
}) {
    const map = useMap();

    useEffect(() => {
        const updateMap = () => {
            map.invalidateSize();
            if (viewMode === 'package') {
                map.flyTo(currentCoords, isFullscreen ? 14 : 13, { duration: 0.8 });
            } else if (viewMode === 'route' && bounds) {
                map.fitBounds(bounds, { padding: isFullscreen ? [100, 100] : [50, 50], maxZoom: 14 });
            }
        };

        // Fire multiple recalculations to catch CSS animation and viewport transitions
        updateMap();
        const t1 = setTimeout(updateMap, 100);
        const t2 = setTimeout(updateMap, 300);
        const t3 = setTimeout(updateMap, 600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [viewMode, currentCoords, bounds, isFullscreen, map]);

    return null;
}

export default function LiveMap({
    lat,
    lng,
    originLat,
    originLng,
    originName,
    destinationLat,
    destinationLng,
    destinationName,
    currentLocationName,
    trackingNumber,
    status,
    zoom = 13
}: LiveMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [viewMode, setViewMode] = useState<'package' | 'route'>('package');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenRef = useRef<HTMLDivElement>(null);

    // Resolve Origin Coordinates
    let startCoords: [number, number] = [32.7767, -96.7970]; // Default Dallas
    if (originLat && originLng) {
        startCoords = [originLat, originLng];
    } else if (originName) {
        const resolved = getCoordsFromLocationName(originName);
        if (resolved) startCoords = resolved;
    }

    // Resolve Destination Coordinates
    let destCoords: [number, number] = [40.7128, -74.0060]; // Default NY
    if (destinationLat && destinationLng) {
        destCoords = [destinationLat, destinationLng];
    } else if (destinationName) {
        const resolved = getCoordsFromLocationName(destinationName);
        if (resolved) destCoords = resolved;
    }

    // Resolve Current Package Location Coordinates
    let currentCoords: [number, number];
    if (lat && lng) {
        currentCoords = [lat, lng];
    } else if (currentLocationName) {
        const resolved = getCoordsFromLocationName(currentLocationName);
        currentCoords = resolved || [(startCoords[0] + destCoords[0]) / 2, (startCoords[1] + destCoords[1]) / 2];
    } else {
        currentCoords = [(startCoords[0] + destCoords[0]) / 2, (startCoords[1] + destCoords[1]) / 2];
    }

    // Animated moving position along the route
    const [movingPos, setMovingPos] = useState<[number, number]>(startCoords);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Animate moving package icon along route
    useEffect(() => {
        if (!isMounted) return;

        let progress = 0;
        const speed = 0.005;

        const interval = setInterval(() => {
            progress += speed;
            if (progress > 1) progress = 0;

            let newLat: number, newLng: number;
            if (progress <= 0.65) {
                const t = progress / 0.65;
                newLat = startCoords[0] + (currentCoords[0] - startCoords[0]) * t;
                newLng = startCoords[1] + (currentCoords[1] - startCoords[1]) * t;
            } else {
                const t = (progress - 0.65) / 0.35;
                newLat = currentCoords[0] + (destCoords[0] - currentCoords[0]) * t;
                newLng = currentCoords[1] + (destCoords[1] - currentCoords[1]) * t;
            }

            setMovingPos([newLat, newLng]);
        }, 60);

        return () => clearInterval(interval);
    }, [isMounted, startCoords, currentCoords, destCoords]);

    // Handle Escape key and body scroll lock in Fullscreen
    useEffect(() => {
        if (!isFullscreen) return;

        // Lock background body scroll
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (document.fullscreenElement) {
                    document.exitFullscreen?.().catch(() => {});
                }
                setIsFullscreen(false);
            }
        };

        const handleFsChange = () => {
            if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
                // If exited via native gesture, sync state
                setIsFullscreen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('fullscreenchange', handleFsChange);
        document.addEventListener('webkitfullscreenchange', handleFsChange);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFsChange);
            document.removeEventListener('webkitfullscreenchange', handleFsChange);
        };
    }, [isFullscreen]);

    const toggleFullscreen = useCallback(async () => {
        if (!isFullscreen) {
            setIsFullscreen(true);
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if ((document.documentElement as any).webkitRequestFullscreen) {
                    await (document.documentElement as any).webkitRequestFullscreen();
                }
            } catch {
                // Fallback to high-z-index portal full-screen
            }
        } else {
            if (document.fullscreenElement) {
                try {
                    await document.exitFullscreen?.();
                } catch {}
            }
            setIsFullscreen(false);
        }
    }, [isFullscreen]);

    if (!isMounted) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-sm" />;

    const bounds: L.LatLngBoundsExpression = [
        startCoords,
        currentCoords,
        destCoords
    ];

    // Core Map Elements
    const renderMapElements = () => (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Traversed Path: Origin -> Current Location */}
            <Polyline
                positions={[startCoords, currentCoords]}
                pathOptions={{ color: '#059669', weight: 6, opacity: 0.9 }}
            />

            {/* Remaining Path: Current Location -> Destination */}
            <Polyline
                positions={[currentCoords, destCoords]}
                pathOptions={{ color: '#64748B', weight: 4, dashArray: '8, 10', opacity: 0.6 }}
            />

            {/* Start Marker */}
            <Marker position={startCoords} icon={originIcon}>
                <Popup>
                    <div className="font-bold text-xs uppercase text-slate-900">
                        Origin: {originName || "Start Location"}
                    </div>
                </Popup>
            </Marker>

            {/* Destination Marker */}
            <Marker position={destCoords} icon={destinationIcon}>
                <Popup>
                    <div className="font-bold text-xs uppercase text-slate-900">
                        Destination: {destinationName || "Final Destination"}
                    </div>
                </Popup>
            </Marker>

            {/* Moving Package Marker */}
            <Marker position={movingPos} icon={movingTruckIcon}>
                <Popup>
                    <div className="font-bold text-xs uppercase text-slate-900">
                        Current Location: {currentLocationName || "In Transit"}
                    </div>
                </Popup>
            </Marker>

            <MapFocusController 
                currentCoords={currentCoords} 
                viewMode={viewMode} 
                bounds={bounds} 
                isFullscreen={isFullscreen} 
            />
        </>
    );

    // Fullscreen View - Portaled to document.body to break out of all overflow-hidden and transform contexts
    const renderFullscreenView = () => (
        <div 
            ref={fullscreenRef}
            className="fixed inset-0 z-[999999] bg-slate-950 flex flex-col w-screen h-screen overflow-hidden select-none"
        >
            {/* Top Navigation & Status Bar */}
            <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between text-white shrink-0 shadow-2xl z-[1000] gap-4">
                {/* Brand & Telemetry Badge */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Navigation size={18} className="transform rotate-45 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                            <h2 className="text-xs sm:text-sm font-black tracking-tight uppercase truncate text-white">
                                Transworld Logistics Satellite Radar
                            </h2>
                            {trackingNumber && (
                                <span className="hidden md:inline px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
                                    {trackingNumber}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate flex items-center gap-2">
                            <span>{originName || "Origin"}</span>
                            <span className="text-emerald-400 font-bold">➔</span>
                            <span>{destinationName || "Destination"}</span>
                            {status && (
                                <span className="text-emerald-400 font-bold">• {status}</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* View Controls & Exit Button */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => setViewMode('package')}
                        className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md border cursor-pointer ${
                            viewMode === 'package' 
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/40' 
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                        }`}
                        title="Focus on package"
                    >
                        <Navigation size={13} className={viewMode === 'package' ? 'animate-bounce' : ''} />
                        <span className="hidden sm:inline">Focus Package</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setViewMode('route')}
                        className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md border cursor-pointer ${
                            viewMode === 'route' 
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/40' 
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                        }`}
                        title="Show entire route"
                    >
                        <Compass size={13} />
                        <span className="hidden sm:inline">Full Route</span>
                    </button>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:border-red-500/40 text-slate-200 hover:text-red-300 border border-slate-700 transition-all flex items-center gap-2 font-bold text-xs shadow-md cursor-pointer"
                        title="Exit Fullscreen (or press Esc)"
                    >
                        <Minimize2 size={15} />
                        <span className="hidden md:inline">Exit Fullscreen</span>
                        <kbd className="hidden lg:inline px-1.5 py-0.5 text-[9px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400">ESC</kbd>
                    </button>
                </div>
            </header>

            {/* Map Viewport */}
            <div className="flex-1 w-full h-full relative z-0">
                <MapContainer
                    center={currentCoords}
                    zoom={13}
                    className="w-full h-full z-0"
                    scrollWheelZoom={true}
                    doubleClickZoom={true}
                    touchZoom={true}
                    zoomControl={true}
                >
                    {renderMapElements()}
                </MapContainer>

                {/* Floating Bottom HUD */}
                <div className="absolute bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-[450] pointer-events-none flex justify-between items-end gap-4">
                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-2xl pointer-events-auto max-w-md">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">
                            ● ACTIVE CARGO RADAR
                        </span>
                        <p className="text-white text-xs sm:text-sm font-extrabold truncate">
                            {currentLocationName || "In Transit via Transit Network"}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
                            <span>LAT: {currentCoords[0].toFixed(4)}°</span>
                            <span>•</span>
                            <span>LNG: {currentCoords[1].toFixed(4)}°</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300 text-[11px] font-mono font-bold pointer-events-auto hidden sm:flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>GPS SATELLITE UPLINK LIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // If Fullscreen is active, render via Portal to document.body
    if (isFullscreen && isMounted && typeof document !== 'undefined') {
        return (
            <>
                {/* Clean placeholder in original container while fullscreen */}
                <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white gap-3 p-6 text-center border border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Navigation size={24} className="transform rotate-45 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-sm">Map Active in Fullscreen</h4>
                        <p className="text-xs text-slate-400 mt-1">Press ESC or click below to return</p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                    >
                        <Minimize2 size={14} />
                        <span>Return to Normal View</span>
                    </button>
                </div>

                {createPortal(renderFullscreenView(), document.body)}
            </>
        );
    }

    // Normal Inline View
    return (
        <div className="w-full h-full relative">
            {/* Overlay Map View Controls */}
            <div className="absolute top-4 right-4 z-[450] flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setViewMode('package')}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md border cursor-pointer ${
                        viewMode === 'package' 
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/30' 
                            : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-900 hover:text-white'
                    }`}
                    title="Zoom in on package location"
                >
                    <Navigation size={14} className={viewMode === 'package' ? 'animate-bounce' : ''} />
                    <span>Focus Package</span>
                </button>
                
                <button
                    type="button"
                    onClick={() => setViewMode('route')}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md border cursor-pointer ${
                        viewMode === 'route' 
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/30' 
                            : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-900 hover:text-white'
                    }`}
                    title="Show entire route"
                >
                    <Compass size={14} />
                    <span>Full Route</span>
                </button>

                <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all shadow-lg backdrop-blur-md cursor-pointer"
                    title="Fullscreen Map"
                >
                    <Maximize2 size={16} />
                </button>
            </div>

            <MapContainer
                center={currentCoords}
                zoom={13}
                className="w-full h-full rounded-sm z-0"
                scrollWheelZoom={true}
                doubleClickZoom={true}
                touchZoom={true}
                zoomControl={true}
            >
                {renderMapElements()}
            </MapContainer>
        </div>
    );
}
