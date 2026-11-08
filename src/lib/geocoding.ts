export const KNOWN_LOCATIONS: Record<string, [number, number]> = {
    "dallas, tx": [32.7767, -96.7970],
    "dallas": [32.7767, -96.7970],
    "dallas hub": [32.7767, -96.7970],
    "new york, ny": [40.7128, -74.0060],
    "new york": [40.7128, -74.0060],
    "new york hub": [40.7128, -74.0060],
    "los angeles, ca": [34.0522, -118.2437],
    "los angeles": [34.0522, -118.2437],
    "chicago, il": [41.8781, -87.6298],
    "chicago": [41.8781, -87.6298],
    "miami, fl": [25.7617, -80.1918],
    "miami": [25.7617, -80.1918],
    "atlanta, ga": [33.7490, -84.3880],
    "atlanta": [33.7490, -84.3880],
    "houston, tx": [29.7604, -95.3698],
    "houston": [29.7604, -95.3698],
    "phoenix, az": [33.4484, -112.0740],
    "phoenix": [33.4484, -112.0740],
    "seattle, wa": [47.6062, -122.3321],
    "seattle": [47.6062, -122.3321],
    "san francisco, ca": [37.7749, -122.4194],
    "san francisco": [37.7749, -122.4194],
    "denver, co": [39.7392, -104.9903],
    "denver": [39.7392, -104.9903],
    "boston, ma": [42.3601, -71.0589],
    "boston": [42.3601, -71.0589],
    "london, uk": [51.5074, -0.1278],
    "london": [51.5074, -0.1278],
    "paris, france": [48.8566, 2.3522],
    "paris": [48.8566, 2.3522],
    "tokyo, japan": [35.6762, 139.6503],
    "tokyo": [35.6762, 139.6503],
    "sydney, australia": [-33.8688, 151.2093],
    "sydney": [-33.8688, 151.2093],
    "toronto, canada": [43.6532, -79.3832],
    "toronto": [43.6532, -79.3832],
    "frankfurt, germany": [50.1109, 8.6821],
    "frankfurt": [50.1109, 8.6821],
    "dubai, uae": [25.2048, 55.2708],
    "dubai": [25.2048, 55.2708],
    "singapore": [1.3521, 103.8198]
};

export function getCoordsFromLocationName(name?: string): [number, number] | null {
    if (!name) return null;
    const clean = name.trim().toLowerCase();
    
    for (const key in KNOWN_LOCATIONS) {
        if (clean === key || clean.includes(key)) {
            return KNOWN_LOCATIONS[key];
        }
    }
    return null;
}

export async function geocodeLocationQuery(query: string): Promise<[number, number] | null> {
    const known = getCoordsFromLocationName(query);
    if (known) return known;

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
    } catch (e) {
        console.error("Geocoding fetch failed", e);
    }
    return null;
}
