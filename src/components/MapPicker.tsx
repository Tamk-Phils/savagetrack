"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Loader2, Navigation, Maximize2, Minimize2, Search, Check, X } from 'lucide-react';
import debounce from 'lodash.debounce';
import 'leaflet/dist/leaflet.css';

// Delivery truck emoji icon
const customIcon = L.divIcon({
    html: '<div style="font-size: 32px; line-height: 1; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">🚚</div>',
    className: 'custom-emoji-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

interface MapPickerProps {
    onChange: (lat: number, lng: number, address: string) => void;
    initialLat?: number;
    initialLng?: number;
    initialAddress?: string;
}

// Controller component to handle map movement & resize recalculations
function MapController({ position, isFullscreen }: { position: L.LatLng, isFullscreen: boolean }) {
    const map = useMap();

    useEffect(() => {
        const update = () => {
            map.invalidateSize();
            if (position) {
                map.flyTo(position, Math.max(map.getZoom(), 12), { duration: 0.8 });
            }
        };

        update();
        const t1 = setTimeout(update, 100);
        const t2 = setTimeout(update, 300);
        const t3 = setTimeout(update, 600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [position, isFullscreen, map]);

    return null;
}

function LocationMarker({ position, onMapClick }: { position: L.LatLng, onMapClick: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon} />
    );
}

export default function MapPicker({ onChange, initialLat, initialLng, initialAddress = "" }: MapPickerProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialLat || 32.7767, initialLng || -96.7970));
    const [address, setAddress] = useState(initialAddress);
    const [isSearching, setIsSearching] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Keep position in sync with props
    useEffect(() => {
        if (initialLat && initialLng) {
            setPosition(new L.LatLng(initialLat, initialLng));
        }
    }, [initialLat, initialLng]);

    useEffect(() => {
        if (initialAddress) {
            setAddress(initialAddress);
        }
    }, [initialAddress]);

    // Reverse geocoding (Coordinates -> Address)
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`, {
                headers: {
                    'User-Agent': 'TransworldLogisticsApp/1.0'
                }
            });
            const data = await res.json();
            if (data && data.display_name) {
                const parts = data.display_name.split(', ');
                const cleanAddr = parts.slice(0, 3).join(', ');
                setAddress(cleanAddr);
                onChange(lat, lng, cleanAddr);
            } else {
                onChange(lat, lng, address);
            }
        } catch {
            onChange(lat, lng, address);
        }
    };

    // Forward geocoding (Address -> Coordinates)
    const searchAddress = async (searchQuery: string) => {
        if (!searchQuery || searchQuery.trim().length < 3) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`, {
                headers: {
                    'User-Agent': 'TransworldLogisticsApp/1.0'
                }
            });
            const data = await res.json();
            if (data && data.length > 0) {
                const newLat = parseFloat(data[0].lat);
                const newLng = parseFloat(data[0].lon);
                const newPos = new L.LatLng(newLat, newLng);
                setPosition(newPos);
                onChange(newLat, newLng, searchQuery);
            }
        } catch (err) {
            console.error("Geocoding lookup error:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((q: string) => searchAddress(q), 800),
        []
    );

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAddress(val);
        debouncedSearch(val);
    };

    const handleMapClick = (latlng: L.LatLng) => {
        setPosition(latlng);
        reverseGeocode(latlng.lat, latlng.lng);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        searchAddress(address);
    };

    // Handle Escape key and lock body scroll in fullscreen
    useEffect(() => {
        if (!isFullscreen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsFullscreen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen]);

    if (!isMounted) return <div className="w-full h-80 bg-slate-100 animate-pulse rounded-2xl border-2 border-dashed border-slate-200" />;

    // Map container element
    const renderMapContainer = () => (
        <MapContainer
            center={[position.lat, position.lng]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            className="w-full h-full z-0"
            scrollWheelZoom={true}
            doubleClickZoom={true}
            touchZoom={true}
            zoomControl={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} onMapClick={handleMapClick} />
            <MapController position={position} isFullscreen={isFullscreen} />
        </MapContainer>
    );

    // Fullscreen View - Portaled to document.body
    const renderFullscreenPicker = () => (
        <div className="fixed inset-0 z-[999999] bg-slate-950 flex flex-col w-screen h-screen overflow-hidden select-none">
            {/* Fullscreen Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white shrink-0 shadow-2xl z-[1000]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Navigation size={20} className="transform rotate-45 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                            FULLSCREEN LOCATION PICKER
                        </h3>
                        <p className="text-xs text-slate-400">Click anywhere on the map or type to locate and drop the GPS pin</p>
                    </div>
                </div>

                {/* Search Bar in Fullscreen */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-4 pl-10 pr-10 font-bold text-white text-xs focus:outline-none focus:border-emerald-500 transition-all outline-none"
                        placeholder="Search address, airport, or city..."
                        value={address}
                        onChange={handleAddressChange}
                    />
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    {isSearching ? (
                        <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 animate-spin" size={16} />
                    ) : (
                        <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer">
                            <Search size={15} />
                        </button>
                    )}
                </form>

                {/* Done & Close Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(false)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                        <Check size={16} /> Done & Apply Location
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(false)}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                        title="Close (Esc)"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 w-full h-full relative z-0">
                {renderMapContainer()}

                {/* Floating Bottom HUD */}
                <div className="absolute bottom-6 left-6 right-6 z-[450] pointer-events-none flex justify-between items-end gap-4">
                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl pointer-events-auto max-w-lg">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">
                            SELECTED GPS COORDINATES
                        </span>
                        <p className="text-white text-sm font-extrabold truncate">
                            {address || "Coordinates Selected on Map"}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-xs font-mono text-slate-400">
                            <span>LAT: {position.lat.toFixed(5)}°</span>
                            <span>•</span>
                            <span>LNG: {position.lng.toFixed(5)}°</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl text-slate-300 text-xs font-mono font-bold pointer-events-auto hidden sm:flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>CLICK MAP TO REPOSITION PIN</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Search or Click Map Location</label>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Navigation size={12} /> Click map to set pin
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsFullscreen(true)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                            title="Fullscreen Map"
                        >
                            <Maximize2 size={14} />
                            <span className="hidden sm:inline text-[10px] uppercase font-bold">Fullscreen</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 pl-11 pr-11 font-bold text-slate-900 text-xs focus:outline-none focus:border-emerald-600 transition-all outline-none"
                        placeholder="Search address or city (e.g. Dallas, TX or Heathrow)"
                        value={address}
                        onChange={handleAddressChange}
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    {isSearching ? (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 animate-spin" size={18} />
                    ) : (
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer">
                            <Search size={16} />
                        </button>
                    )}
                </form>
            </div>

            {/* Inline Map Container */}
            <div className="h-[380px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md relative z-0">
                {isFullscreen ? (
                    <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white gap-3 p-6 text-center">
                        <Navigation size={24} className="text-emerald-400 animate-pulse" />
                        <div>
                            <h4 className="font-extrabold text-sm">Picker Active in Fullscreen</h4>
                            <p className="text-xs text-slate-400 mt-1">Press ESC or click below to return</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsFullscreen(false)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                        >
                            <Minimize2 size={14} />
                            <span>Return to Form</span>
                        </button>
                    </div>
                ) : (
                    renderMapContainer()
                )}
            </div>

            <p className="text-[11px] font-semibold text-slate-500 flex justify-between items-center">
                <span>Selected GPS Coordinates: <span className="font-mono text-slate-900 font-bold">{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</span></span>
                {address && <span className="truncate max-w-[250px] text-slate-700 font-bold">{address}</span>}
            </p>

            {/* Fullscreen Portal */}
            {isFullscreen && typeof document !== 'undefined' && createPortal(renderFullscreenPicker(), document.body)}
        </div>
    );
}
