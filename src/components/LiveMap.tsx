"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getCoordsFromLocationName } from '@/lib/geocoding';
import { Maximize2, Minimize2, Navigation, Compass, Plus, Minus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker icons in Next.js/Webpack/Turbopack
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

// Origin Icon (Start Point)
const originIcon = typeof window !== 'undefined' ? L.divIcon({
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
}) : (null as any);

// Destination Icon (End Point)
const destinationIcon = typeof window !== 'undefined' ? L.divIcon({
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
}) : (null as any);

// Moving Package Icon
const movingTruckIcon = typeof window !== 'undefined' ? L.divIcon({
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
}) : (null as any);

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

// Stores map instance in a mutable ref - ZERO state triggers, 100% safe across all browsers
function MapBridge({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
    const map = useMap();
    useEffect(() => {
        mapRef.current = map;
        return () => {
            mapRef.current = null;
        };
    }, [map, mapRef]);
    return null;
}

// Map Controller Component for view switching & smooth size invalidation
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
    const isFirstRun = useRef(true);
    const prevViewMode = useRef(viewMode);
    const prevFullscreen = useRef(isFullscreen);

    // Invalidate size safely on mount and on fullscreen change
    useEffect(() => {
        const checkAndInvalidate = () => {
            try {
                const container = map.getContainer();
                if (container && container.clientHeight > 0 && container.clientWidth > 0) {
                    map.invalidateSize();
                }
            } catch {}
        };

        checkAndInvalidate();
        const t1 = setTimeout(checkAndInvalidate, 80);
        const t2 = setTimeout(checkAndInvalidate, 250);
        const t3 = setTimeout(checkAndInvalidate, 600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [isFullscreen, map]);

    // Initial positioning on mount
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            try {
                map.invalidateSize();
                if (viewMode === 'package') {
                    map.setView(currentCoords, isFullscreen ? 14 : 13);
                } else if (bounds) {
                    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
                }
            } catch {}
        }
    }, [map, currentCoords, bounds, isFullscreen, viewMode]);

    // Only re-center when the user explicitly clicks "Focus Package" or "Full Route"
    useEffect(() => {
        if (isFirstRun.current) return;
        const viewModeChanged = prevViewMode.current !== viewMode;
        const fsChanged = prevFullscreen.current !== isFullscreen;
        prevViewMode.current = viewMode;
        prevFullscreen.current = isFullscreen;

        if (viewModeChanged || fsChanged) {
            try {
                map.invalidateSize();
                if (viewMode === 'package') {
                    map.flyTo(currentCoords, isFullscreen ? 14 : 13, { duration: 0.8 });
                } else if (viewMode === 'route' && bounds) {
                    map.fitBounds(bounds, { padding: isFullscreen ? [80, 80] : [40, 40], maxZoom: 14 });
                }
            } catch {}
        }
    }, [viewMode, isFullscreen, currentCoords, bounds, map]);

    return null;
}

// Self-contained moving truck marker: animates smoothly WITHOUT re-rendering the parent map
function MovingTruckMarker({ 
    startCoords, 
    currentCoords, 
    destCoords,
    currentLocationName
}: { 
    startCoords: [number, number]; 
    currentCoords: [number, number]; 
    destCoords: [number, number];
    currentLocationName?: string;
}) {
    const [pos, setPos] = useState<[number, number]>(startCoords);

    useEffect(() => {
        let progress = 0;
        const speed = 0.003;

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

            setPos([newLat, newLng]);
        }, 80);

        return () => clearInterval(interval);
    }, [startCoords[0], startCoords[1], currentCoords[0], currentCoords[1], destCoords[0], destCoords[1]]);

    if (!movingTruckIcon) return null;

    return (
        <Marker position={pos} icon={movingTruckIcon}>
            <Popup>
                <div className="font-bold text-xs uppercase text-slate-900">
                    Current Location: {currentLocationName || "In Transit"}
                </div>
            </Popup>
        </Marker>
    );
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
}: LiveMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [viewMode, setViewMode] = useState<'package' | 'route'>('package');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const mapRef = useRef<L.Map | null>(null);

    // Resolve Origin Coordinates with NaN safety
    let startCoords: [number, number] = [32.7767, -96.7970]; // Default Dallas
    if (originLat && originLng && !isNaN(Number(originLat)) && !isNaN(Number(originLng))) {
        startCoords = [Number(originLat), Number(originLng)];
    } else if (originName) {
        const resolved = getCoordsFromLocationName(originName);
        if (resolved && !isNaN(resolved[0]) && !isNaN(resolved[1])) startCoords = resolved;
    }

    // Resolve Destination Coordinates with NaN safety
    let destCoords: [number, number] = [40.7128, -74.0060]; // Default NY
    if (destinationLat && destinationLng && !isNaN(Number(destinationLat)) && !isNaN(Number(destinationLng))) {
        destCoords = [Number(destinationLat), Number(destinationLng)];
    } else if (destinationName) {
        const resolved = getCoordsFromLocationName(destinationName);
        if (resolved && !isNaN(resolved[0]) && !isNaN(resolved[1])) destCoords = resolved;
    }

    // Resolve Current Package Location Coordinates with NaN safety
    let currentCoords: [number, number];
    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
        currentCoords = [Number(lat), Number(lng)];
    } else if (currentLocationName) {
        const resolved = getCoordsFromLocationName(currentLocationName);
        currentCoords = (resolved && !isNaN(resolved[0]) && !isNaN(resolved[1])) 
            ? resolved 
            : [(startCoords[0] + destCoords[0]) / 2, (startCoords[1] + destCoords[1]) / 2];
    } else {
        currentCoords = [(startCoords[0] + destCoords[0]) / 2, (startCoords[1] + destCoords[1]) / 2];
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Handle Escape key and body scroll lock when Fullscreen is active
    useEffect(() => {
        if (!isFullscreen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (typeof document !== 'undefined') {
                    const doc = document as any;
                    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
                        try {
                            if (typeof doc.exitFullscreen === 'function') doc.exitFullscreen();
                            else if (typeof doc.webkitExitFullscreen === 'function') doc.webkitExitFullscreen();
                        } catch {}
                    }
                }
                setIsFullscreen(false);
            }
        };

        const handleFsChange = () => {
            if (typeof document !== 'undefined') {
                const doc = document as any;
                if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
                    setIsFullscreen(false);
                }
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
        const nextFs = !isFullscreen;
        setIsFullscreen(nextFs);

        try {
            if (typeof document !== 'undefined') {
                const docEl = document.documentElement as any;
                const doc = document as any;
                if (nextFs) {
                    if (docEl && typeof docEl.requestFullscreen === 'function') {
                        await docEl.requestFullscreen();
                    } else if (docEl && typeof docEl.webkitRequestFullscreen === 'function') {
                        await docEl.webkitRequestFullscreen();
                    }
                } else {
                    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
                        if (typeof doc.exitFullscreen === 'function') {
                            await doc.exitFullscreen();
                        } else if (typeof doc.webkitExitFullscreen === 'function') {
                            await doc.webkitExitFullscreen();
                        }
                    }
                }
            }
        } catch {}

        // Schedule smooth map size invalidation
        setTimeout(() => {
            try {
                mapRef.current?.invalidateSize();
            } catch {}
        }, 100);
        setTimeout(() => {
            try {
                mapRef.current?.invalidateSize();
            } catch {}
        }, 300);
    }, [isFullscreen]);

    const bounds: L.LatLngBoundsExpression = useMemo(() => [
        startCoords,
        currentCoords,
        destCoords
    ], [startCoords[0], startCoords[1], currentCoords[0], currentCoords[1], destCoords[0], destCoords[1]]);

    if (!isMounted) {
        return (
            <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white gap-3 p-6 text-center border border-slate-800">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400 font-mono">INITIALIZING SATELLITE RADAR...</p>
            </div>
        );
    }

    return (
        <div 
            className={
                isFullscreen 
                    ? "fixed inset-0 z-[999999] bg-slate-950 flex flex-col w-screen h-screen overflow-hidden select-none" 
                    : "w-full h-full relative"
            }
        >
            {/* FULLSCREEN TOP BAR */}
            {isFullscreen ? (
                <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between text-white shrink-0 shadow-2xl z-[1000] gap-4">
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
            ) : (
                /* INLINE VIEW TOP BAR */
                <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 z-[450] flex items-center justify-between gap-2 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-xl text-white flex items-center gap-2 border border-white/10 shadow-lg pointer-events-auto shrink min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">
                            <span className="hidden sm:inline">TRANSWORLD </span>SATELLITE GPS
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
                        <button
                            type="button"
                            onClick={() => setViewMode('package')}
                            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md border cursor-pointer ${
                                viewMode === 'package' 
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/30' 
                                    : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-900 hover:text-white'
                            }`}
                            title="Focus on package"
                        >
                            <Navigation size={13} className={viewMode === 'package' ? 'animate-bounce shrink-0' : 'shrink-0'} />
                            <span className="hidden sm:inline">Focus Package</span>
                            <span className="sm:hidden">Focus</span>
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => setViewMode('route')}
                            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md backdrop-blur-md border cursor-pointer ${
                                viewMode === 'route' 
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/30' 
                                    : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-slate-900 hover:text-white'
                            }`}
                            title="Show full route"
                        >
                            <Compass size={13} className="shrink-0" />
                            <span className="hidden sm:inline">Full Route</span>
                            <span className="sm:hidden">Route</span>
                        </button>

                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/80 text-slate-300 border border-white/10 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all shadow-md backdrop-blur-md cursor-pointer shrink-0"
                            title="Toggle Fullscreen"
                        >
                            <Maximize2 size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* FLOATING ZOOM CONTROLS */}
            <div className={`absolute right-3 sm:right-4 ${isFullscreen ? 'bottom-28' : 'bottom-24'} z-[450] flex flex-col gap-1.5 pointer-events-auto`}>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        mapRef.current?.zoomIn();
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900/90 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-md transition-all shadow-xl cursor-pointer"
                    title="Zoom In"
                    aria-label="Zoom in"
                >
                    <Plus size={16} />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        mapRef.current?.zoomOut();
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900/90 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-md transition-all shadow-xl cursor-pointer"
                    title="Zoom Out"
                    aria-label="Zoom out"
                >
                    <Minus size={16} />
                </button>
            </div>

            {/* SINGLE MAP CONTAINER - NEVER DESTROYED OR REMOUNTED */}
            <div className="w-full h-full relative z-0 flex-1">
                <MapContainer
                    center={currentCoords}
                    zoom={13}
                    minZoom={2}
                    maxZoom={18}
                    className="w-full h-full rounded-sm z-0"
                    scrollWheelZoom={true}
                    doubleClickZoom={true}
                    touchZoom={true}
                    zoomControl={false}
                >
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
                    {originIcon && (
                        <Marker position={startCoords} icon={originIcon}>
                            <Popup>
                                <div className="font-bold text-xs uppercase text-slate-900">
                                    Origin: {originName || "Start Location"}
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Destination Marker */}
                    {destinationIcon && (
                        <Marker position={destCoords} icon={destinationIcon}>
                            <Popup>
                                <div className="font-bold text-xs uppercase text-slate-900">
                                    Destination: {destinationName || "Final Destination"}
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Moving Package Marker */}
                    <MovingTruckMarker 
                        startCoords={startCoords}
                        currentCoords={currentCoords}
                        destCoords={destCoords}
                        currentLocationName={currentLocationName}
                    />

                    <MapFocusController 
                        currentCoords={currentCoords} 
                        viewMode={viewMode} 
                        bounds={bounds} 
                        isFullscreen={isFullscreen} 
                    />

                    <MapBridge mapRef={mapRef} />
                </MapContainer>
            </div>

            {/* FULLSCREEN BOTTOM HUD */}
            {isFullscreen && (
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
            )}
        </div>
    );
}
