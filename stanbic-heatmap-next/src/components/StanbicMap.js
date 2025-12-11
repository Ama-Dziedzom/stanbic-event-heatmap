'use client';

import { useEffect, useRef } from 'react';

// Mock Data Utilities
const eventTitles = [
    "Jazz in the Park", "Tech Expo 2025", "Art & Wine Mixer",
    "Start-up Pitch Night", "Food Festival", "Charity Gala",
    "Fashion Week Runway", "Music Concert", "Book Launch", "Comedy Night"
];

const locations = [
    "Labadi Beach Hotel, Accra",
    "Movenpick Ambassador Hotel",
    "Alliance Française d'Accra",
    "Accra International Conference Centre",
    "Kempinski Hotel Gold Coast City",
    "The Alora Beach Resort",
    "Polo Grounds, Accra",
    "National Theatre of Ghana",
    "Villagio Vista, Airport City",
    "Osu Oxford Street"
];

const eventExpectations = {
    "Jazz in the Park": ["Live performances", "Gourmet food", "Outdoor seating"],
    "Tech Expo 2025": ["Tech demos", "Networking", "Workshops"],
    "Art & Wine Mixer": ["Art exhibition", "Wine tasting", "Live painting"],
    "Start-up Pitch Night": ["Startup pitches", "Networking", "Q&A"],
    "Food Festival": ["Food vendors", "Cooking demos", "Kids area"],
    "Charity Gala": ["Dinner", "Auction", "Performances"],
    "Fashion Week Runway": ["Runway shows", "VIP seating", "After-party"],
    "Music Concert": ["Performances", "Sound/Light", "VIP lounge"],
    "Book Launch": ["Readings", "Panel", "Wine"],
    "Comedy Night": ["Stand-up", "Open mic", "Bar"]
};

function getRandomFutureDate() {
    const today = new Date();
    const daysAhead = Math.floor(Math.random() * 90) + 7;
    const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return futureDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getRandomTime() {
    const hours = Math.floor(Math.random() * 6) + 17;
    const minutes = Math.random() < 0.5 ? '00' : '30';
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes} ${period}`;
}

function getEventImages(eventType) {
    const seed = eventType.replace(/\s+/g, '-').toLowerCase();
    return [
        `https://picsum.photos/seed/${seed}-1/400/300`,
    ];
}

function generateMockPoints(count, spread, centerLat, centerLng) {
    const points = [];
    for (let i = 0; i < count; i++) {
        const lat = centerLat + (Math.random() - 0.5) * spread;
        const lng = centerLng + (Math.random() - 0.5) * spread;
        const intensity = 0.5 + Math.random() * 0.5;
        const title = eventTitles[Math.floor(Math.random() * eventTitles.length)];
        const price = (Math.random() * 200 + 50).toFixed(2);
        const location = locations[Math.floor(Math.random() * locations.length)];
        const date = getRandomFutureDate();
        const time = getRandomTime();
        const images = getEventImages(title);
        const expectations = eventExpectations[title] || [];

        points.push({
            lat, lng, intensity, title,
            desc: `Join us for an amazing ${title.toLowerCase()} experience. Sponsored by Stanbic Bank Ghana.`,
            price, location, date, time, images, expectations
        });
    }
    return points;
}

// Helper: Distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function StanbicMap() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;
        if (mapInstance.current) return;

        let map;

        const initMap = async () => {
            // Wait for container to have dimensions
            if (!mapRef.current || mapRef.current.offsetHeight === 0 || mapRef.current.offsetWidth === 0) {
                setTimeout(initMap, 200);
                return;
            }

            // Dynamic imports to avoid SSR issues and window error
            const L = (await import('leaflet')).default;
            // Ensure L is global BEFORE importing plugins that depend on it
            if (typeof window !== 'undefined') window.L = L;
            await import('leaflet.heat');

            // Check again after async import
            if (mapInstance.current) return;

            // Initialize Map
            map = L.map(mapRef.current, {
                zoomControl: false,
                preferCanvas: false, // SVG is more stable for initial load
                zoomAnimation: true,
                markerZoomAnimation: true,
                fadeAnimation: true
            }).setView([5.6037, -0.1870], 13);

            mapInstance.current = map;

            // Tile Layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                maxZoom: 20
            }).addTo(map);

            setupLayers(L, map);
        };

        const setupLayers = (L, map) => {
            // --- Mock Data ---
            const centerLat = 5.6037;
            const centerLng = -0.1870;
            const osuEvents = generateMockPoints(40, 0.04, centerLat, centerLng);
            const airportEvents = generateMockPoints(30, 0.03, centerLat, centerLng);
            const eastLegonEvents = generateMockPoints(30, 0.05, centerLat, centerLng);

            const shiftedAirport = airportEvents.map(p => ({ ...p, lat: p.lat + 0.04, lng: p.lng - 0.01 }));
            const shiftedLegon = eastLegonEvents.map(p => ({ ...p, lat: p.lat + 0.06, lng: p.lng + 0.03 }));

            const allPoints = [...osuEvents, ...shiftedAirport, ...shiftedLegon];
            const heatPoints = allPoints.map(p => [p.lat, p.lng, p.intensity]);

            // Function to initialize layers ensuring map has size
            const initLayers = () => {
                if (!mapInstance.current || mapInstance.current !== map) return;

                const size = map.getSize();
                const container = map.getContainer();

                // Double check dimensions
                if (size.x <= 0 || size.y <= 0 || !container || container.offsetWidth <= 0 || container.offsetHeight <= 0) {
                    map.invalidateSize();
                    setTimeout(initLayers, 200);
                    return;
                }

                // Heatmap - Wrapped in try/catch to prevent app crash
                try {
                    L.heatLayer(heatPoints, {
                        radius: 35,
                        blur: 25,
                        maxZoom: 15,
                        max: 1.0,
                        gradient: {
                            0.4: '#d1e5f0',
                            0.6: '#67a9cf',
                            0.7: '#2166ac',
                            0.9: '#053061'
                        }
                    }).addTo(map);
                } catch (err) {
                    console.warn("[StanbicMap] Heatmap init error:", err);
                }

                // Trigger OSMBuildings init
                if (window.OSMBuildings) {
                    initOSMBuildings();
                } else {
                    const checkOsm = setInterval(() => {
                        if (!mapInstance.current || mapInstance.current !== map) {
                            clearInterval(checkOsm);
                            return;
                        }
                        if (window.OSMBuildings) {
                            initOSMBuildings();
                            clearInterval(checkOsm);
                        }
                    }, 500);
                    setTimeout(() => clearInterval(checkOsm), 10000);
                }
            };

            // --- 3D Buildings (OSMBuildings) ---
            const initOSMBuildings = () => {
                if (!window.L) window.L = L;
                if (!mapInstance.current || mapInstance.current !== map) return;
                if (!window.OSMBuildings) return;

                const container = map.getContainer();
                if (!container || container.offsetHeight <= 0 || container.offsetWidth <= 0) {
                    setTimeout(initOSMBuildings, 200);
                    return;
                }

                try {
                    const osmb = new window.OSMBuildings(map).date(new Date('2025-12-09 14:00:00'));
                    osmb.load('https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json');

                    // Manual Lego Landmarks
                    const legoLandmarks = {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: { color: '#ff0000', height: 40, roofColor: '#cc0000' },
                                geometry: { type: 'Polygon', coordinates: [[[-0.1990, 5.5500], [-0.1985, 5.5500], [-0.1985, 5.5505], [-0.1990, 5.5505], [-0.1990, 5.5500]]] }
                            },
                            {
                                type: 'Feature',
                                properties: { color: '#ffff00', height: 60, roofColor: '#cccc00' },
                                geometry: { type: 'Polygon', coordinates: [[[-0.1920, 5.5480], [-0.1915, 5.5480], [-0.1915, 5.5485], [-0.1920, 5.5485], [-0.1920, 5.5480]]] }
                            },
                            {
                                type: 'Feature',
                                properties: { color: '#00ff00', height: 30, roofColor: '#00cc00' },
                                geometry: { type: 'Polygon', coordinates: [[[-0.1925, 5.5480], [-0.1920, 5.5480], [-0.1920, 5.5485], [-0.1925, 5.5485], [-0.1925, 5.5480]]] }
                            },
                            {
                                type: 'Feature',
                                properties: { color: '#0000ff', height: 80, roofColor: '#0000cc' },
                                geometry: { type: 'Polygon', coordinates: [[[-0.1800, 5.6000], [-0.1795, 5.6000], [-0.1795, 5.6005], [-0.1800, 5.6005], [-0.1800, 5.6000]]] }
                            }
                        ]
                    };
                    osmb.addGeoJSON(legoLandmarks);
                } catch (e) {
                    console.warn("OSMBuildings initialization warning:", e);
                }
            };

            initLayers();

            // --- Interaction Logic ---
            map.on('click', (e) => {
                let closestPoint = null;
                let minDistance = Infinity;

                allPoints.forEach(point => {
                    const dist = getDistanceFromLatLonInKm(e.latlng.lat, e.latlng.lng, point.lat, point.lng);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestPoint = point;
                    }
                });

                if (closestPoint && minDistance < 1.0) {
                    const mapPinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="info-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
                    const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="info-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;

                    const popupContent = `
                        <div class="popup-card">
                            <img src="${closestPoint.images[0]}" alt="${closestPoint.title}" class="popup-header-image">
                            <div class="popup-content">
                                <div class="popup-top-section">
                                    <h3 class="popup-title">${closestPoint.title}</h3>
                                </div>
    
                                <div class="popup-desc-section">
                                    <span class="popup-desc-label">Description</span>
                                    <p class="popup-desc-text">
                                        ${closestPoint.desc}
                                        <a href="#" class="read-more">...Read more</a>
                                    </p>
                                </div>
    
                                <div class="popup-info-rows">
                                    <div class="info-row">
                                        <div class="info-icon-circle">
                                            ${mapPinIcon}
                                        </div>
                                        <div class="info-text">
                                            <span class="info-subtext">${closestPoint.location.split(',').pop().trim()}</span>
                                            <span class="info-maintext">${closestPoint.location.split(',')[0]}</span>
                                        </div>
                                    </div>
                                    <div class="info-row">
                                        <div class="info-icon-circle">
                                            ${calendarIcon}
                                        </div>
                                        <div class="info-text">
                                            <span class="info-subtext">${closestPoint.date}, 2025</span>
                                            <span class="info-maintext">${closestPoint.time}</span>
                                        </div>
                                    </div>
                                </div>
    
                                <button class="popup-action-btn">
                                    Buy Ticket GHS ${closestPoint.price}
                                </button>
                            </div>
                        </div>
                    `;

                    const isMobile = window.innerWidth < 768;
                    const popupOffset = isMobile ? [0, 10] : [170, 250];
                    const popupMaxWidth = isMobile ? 300 : 320;

                    L.popup({
                        offset: popupOffset,
                        className: 'custom-popup',
                        maxWidth: popupMaxWidth,
                        minWidth: isMobile ? 280 : 320,
                        closeButton: true,
                        autoPan: true,
                        autoPanPadding: [50, 50]
                    })
                        .setLatLng([closestPoint.lat, closestPoint.lng])
                        .setContent(popupContent)
                        .openOn(map);
                }
            });
        };

        initMap();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    return <div id="map" ref={mapRef} style={{ width: '100%', height: '100vh' }}></div>;
}
