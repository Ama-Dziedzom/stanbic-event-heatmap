'use client';

import { useEffect, useRef, useState } from 'react';

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

// --- Bottom Sheet Component ---
const BottomSheet = ({ event, onClose }) => {
    if (!event) return null;

    const mapPinIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
    const calendarIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>;
    const closeIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;

    return (
        <>
            <div className="bottom-sheet-overlay" onClick={onClose}></div>
            <div className="bottom-sheet">
                <div className="bottom-sheet-handle-bar">
                    <div className="bottom-sheet-handle"></div>
                </div>
                <button className="bottom-sheet-close" onClick={onClose}>
                    {closeIcon}
                </button>

                <div className="popup-card">
                    <img src={event.images[0]} alt={event.title} className="popup-header-image" />
                    <div className="popup-content">
                        <div className="popup-top-section">
                            <h3 className="popup-title">{event.title}</h3>
                        </div>

                        <div className="popup-desc-section">
                            <span className="popup-desc-label">Description</span>
                            <p className="popup-desc-text">
                                {event.desc}
                                <a href="#" className="read-more" style={{ marginLeft: '4px' }}>...Read more</a>
                            </p>
                        </div>

                        <div className="popup-info-rows">
                            <div className="info-row">
                                <div className="info-icon-circle">
                                    {mapPinIcon}
                                </div>
                                <div className="info-text">
                                    <span className="info-subtext">{event.location.split(',').pop().trim()}</span>
                                    <span className="info-maintext">{event.location.split(',')[0]}</span>
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="info-icon-circle">
                                    {calendarIcon}
                                </div>
                                <div className="info-text">
                                    <span className="info-subtext">{event.date}, 2025</span>
                                    <span className="info-maintext">{event.time}</span>
                                </div>
                            </div>
                        </div>

                        <button className="popup-action-btn">
                            Buy Ticket GHS {event.price}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- Popup Component for HTML string ---
const createPopupContent = (point) => {
    const mapPinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="info-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="info-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;

    return `
        <div class="popup-card">
            <img src="${point.images[0]}" alt="${point.title}" class="popup-header-image">
            <div class="popup-content">
                <div class="popup-top-section">
                    <h3 class="popup-title">${point.title}</h3>
                </div>

                <div class="popup-desc-section">
                    <span class="popup-desc-label">Description</span>
                    <p class="popup-desc-text">
                        ${point.desc}
                        <a href="#" class="read-more">...Read more</a>
                    </p>
                </div>

                <div class="popup-info-rows">
                    <div class="info-row">
                        <div class="info-icon-circle">
                            ${mapPinIcon}
                        </div>
                        <div class="info-text">
                            <span class="info-subtext">${point.location.split(',').pop().trim()}</span>
                            <span class="info-maintext">${point.location.split(',')[0]}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-icon-circle">
                            ${calendarIcon}
                        </div>
                        <div class="info-text">
                            <span class="info-subtext">${point.date}, 2025</span>
                            <span class="info-maintext">${point.time}</span>
                        </div>
                    </div>
                </div>

                <button class="popup-action-btn">
                    Buy Ticket GHS ${point.price}
                </button>
            </div>
        </div>
    `;
};

export default function StanbicMap() {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);
    const isMouseOverMarkerRef = useRef(false); // Hover lock
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstance.current) return;

        const initMap = async () => {
            // Wait for container to have dimensions
            if (!mapContainerRef.current || mapContainerRef.current.offsetHeight === 0 || mapContainerRef.current.offsetWidth === 0) {
                setTimeout(initMap, 200);
                return;
            }

            // Dynamic import for Mapbox
            const mapboxgl = (await import('mapbox-gl')).default;

            // Check again after async import
            if (mapInstance.current) return;

            // Set your Mapbox access token here
            // For production, use environment variables
            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYW1hLWR6aWVkemUiLCJhIjoiY21hNHpmZ3RiMDNsejJxczVkcjJwbnh1cyJ9.TKDiKg77cL_NNTc04NJpfg';

            // Initialize Map
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/dzie4bar/cmj8qbohf002s01s94w0j9mbl', // Light style similar to Carto
                center: [-0.1870, 5.6037], // [lng, lat] - Accra
                zoom: 12,
                pitch: 45, // Tilt for 3D effect
                bearing: 0
            });

            mapInstance.current = map;

            // Wait for map to load before adding layers
            map.on('load', () => {
                setupLayers(mapboxgl, map);
            });
        };

        const setupLayers = (mapboxgl, map) => {
            // --- Mock Data ---
            const centerLat = 5.6037;
            const centerLng = -0.1870;

            // 1. Stanbic Events (5 Key Anchors - Main Attractions)
            // We place them in a known "nice" arc for demo purposes
            const stanbicEvents = [
                { lat: 5.6037, lng: -0.1870, title: 'Jazz in the Park', desc: 'A smooth evening of jazz.', location: 'Movenpick, Accra' },
                { lat: 5.6100, lng: -0.1990, title: 'Art & Wine', desc: 'Wine tasting and gallery walk.', location: 'Alliance Francaise, Accra' },
                { lat: 5.5900, lng: -0.1800, title: 'Tech Summit', desc: 'Future of fintech in Africa.', location: 'Kempinski Hotel, Accra' },
                { lat: 5.6250, lng: -0.1700, title: 'Blue Gala', desc: 'Annual exclusive banking gala.', location: 'Labadi Beach Hotel, Accra' },
                { lat: 5.5800, lng: -0.2100, title: 'Golf Championship', desc: 'Pro-am golf tournament.', location: 'Achimota Golf Club, Accra' }
            ].map(p => ({
                ...p,
                id: Math.random().toString(),
                price: Math.floor(Math.random() * 500) + 100,
                desc: `Exclusive event sponsored by Stanbic Bank. ${p.desc}`,
                intensity: 1.0,
                // Use a placeholder image generator that looks professional
                images: [`https://picsum.photos/seed/${p.title.replace(/\s/g, '')}/400/300`]
            }));


            // 2. General Events (Curated "Designed" Clusters)
            // Instead of random noise, we create 3 distinct "Hotspots" of general activity.
            // This mirrors real life: usually Osu, Airport, and East Legon are hot.

            const generalCluster1 = generateMockPoints(8, 0.015, 5.5600, -0.2000); // Osu/Cantonments (Nightlife)
            const generalCluster2 = generateMockPoints(6, 0.012, 5.6400, -0.1600); // East Legon (Restaurants)
            const generalCluster3 = generateMockPoints(5, 0.010, 5.6000, -0.1650); // Airport City (Business)

            const generalEvents = [...generalCluster1, ...generalCluster2, ...generalCluster3];

            // Prepare GeoJSONs
            const stanbicGeoJSON = {
                type: 'FeatureCollection',
                features: stanbicEvents.map(point => ({
                    type: 'Feature',
                    properties: { intensity: point.intensity },
                    geometry: { type: 'Point', coordinates: [point.lng, point.lat] }
                }))
            };

            const generalGeoJSON = {
                type: 'FeatureCollection',
                features: generalEvents.map(point => ({
                    type: 'Feature',
                    properties: { intensity: point.intensity }, // varying intensity
                    geometry: { type: 'Point', coordinates: [point.lng, point.lat] }
                }))
            };

            // --- SOURCES ---
            map.addSource('stanbic-heat', { type: 'geojson', data: stanbicGeoJSON });
            map.addSource('general-heat', { type: 'geojson', data: generalGeoJSON });

            // --- LAYERS ---

            // 1. General Events Heatmap (Premium Warm Gold/Honey)
            map.addLayer({
                id: 'general-heat-layer',
                type: 'heatmap',
                source: 'general-heat',
                maxzoom: 15,
                paint: {
                    'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 1, 1],
                    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 15, 1.2], // Lower intensity for subtle look
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(0,0,0,0)',
                        0.2, 'rgba(255, 235, 205, 0.2)', // BlanchedAlmond (Very soft halo)
                        0.5, 'rgba(255, 215, 0, 0.5)',   // Gold
                        0.8, 'rgba(255, 165, 0, 0.7)',   // Orange
                        1, 'rgba(205, 133, 63, 0.85)'    // Peru/Bronze (Deep core)
                    ],
                    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 5, 10, 20, 15, 50], // Tighter radius = cleaner blobs
                    'heatmap-opacity': 0.8
                }
            });

            // 2. Stanbic Blue Heatmap (Subtle Glow behind markers)
            map.addLayer({
                id: 'stanbic-heat-layer',
                type: 'heatmap',
                source: 'stanbic-heat',
                maxzoom: 15,
                paint: {
                    'heatmap-weight': 1.5,
                    // Revert to interpolation to make it stronger at higher zooms
                    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(0, 0, 255, 0)',
                        0.1, 'rgba(135, 206, 250, 0.4)', // Start visible color earlier (Light Sky Blue)
                        0.5, 'rgba(6, 55, 162, 0.7)',
                        1, 'rgba(0, 10, 60, 0.9)'
                    ],
                    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 15, 9, 45, 15, 100], // Increased radius slightly
                    'heatmap-opacity': 0.9
                }
            });

            // Add 3D buildings layer
            // Check if the 'composite' source exists (common issue with custom styles)
            if (!map.getSource('composite')) {
                map.addSource('composite', {
                    url: 'mapbox://mapbox.mapbox-streets-v8',
                    type: 'vector'
                });
            }

            const layers = map.getStyle().layers;
            const labelLayerId = layers.find(
                (layer) => layer.type === 'symbol' && layer.layout['text-field']
            )?.id;

            map.addLayer(
                {
                    id: '3d-buildings',
                    source: 'composite',
                    'source-layer': 'building',
                    filter: ['==', 'extrude', 'true'],
                    type: 'fill-extrusion',
                    minzoom: 12,
                    paint: {
                        'fill-extrusion-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'height'],
                            0, '#e8e8e8',
                            50, '#d4d4d4',
                            100, '#c0c0c0',
                            200, '#a8a8a8'
                        ],
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            12, 0,
                            12.5, ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            12, 0,
                            12.5, ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.7
                    }
                },
                labelLayerId
            );

            // Add markers for Stanbic events
            stanbicEvents.forEach((point) => {
                const borderColor = Math.random() > 0.5 ? '#0637A2' : '#fb923c';

                // Create custom marker element
                const markerEl = document.createElement('div');
                markerEl.className = 'mapbox-custom-marker';
                markerEl.style.cssText = `
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: 3px solid ${borderColor};
                    background-image: url(${point.images[0]});
                    background-size: cover;
                    background-position: center;
                    background-color: #fff;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                `;

                markerEl.addEventListener('mouseenter', () => {
                    markerEl.style.transform = 'scale(1.15)';
                    markerEl.style.borderColor = '#fb923c';
                    isMouseOverMarkerRef.current = true;
                });

                markerEl.addEventListener('mouseleave', () => {
                    markerEl.style.transform = 'scale(1)';
                    markerEl.style.borderColor = borderColor;
                    isMouseOverMarkerRef.current = false;
                });

                // Create popup
                const popup = new mapboxgl.Popup({
                    offset: 30,
                    className: 'mapbox-custom-popup',
                    maxWidth: '320px',
                    closeButton: true,
                    closeOnClick: true
                }).setHTML(createPopupContent(point));

                // Create marker
                const marker = new mapboxgl.Marker({
                    element: markerEl,
                    anchor: 'center'
                })
                    .setLngLat([point.lng, point.lat])
                    .addTo(map);

                // Handle click for mobile (bottom sheet) vs desktop (popup)
                markerEl.addEventListener('click', (e) => {
                    e.stopPropagation();

                    const isMobile = window.innerWidth < 768;
                    const targetZoom = Math.max(map.getZoom(), 16); // Zoom in if not already close

                    // Snapchat-style FlyTo animation
                    map.flyTo({
                        center: [point.lng, point.lat],
                        zoom: targetZoom,
                        speed: 1.2, // Smooth speed
                        curve: 1.42, // Cinematic arc
                        easing: (t) => t,
                        padding: isMobile ? { bottom: 300 } : { left: 0 } // Offset for Bottom Sheet
                    });

                    if (isMobile) {
                        setSelectedEvent(point);
                    } else {
                        // For desktop, we wait a tiny bit for the flyTo to start before opening popup
                        // or just open it. Mapbox popups track the marker, so it moves with the map!
                        // Disable autoPan to avoid fighting with FlyTo
                        popup.options.autoPan = false;
                        popup.setLngLat([point.lng, point.lat]).addTo(map);
                    }
                });

                markersRef.current.push(marker);
            });

            // Map click for heatmap interaction
            map.on('click', (e) => {
                // LOCK CHECK: If mouse is over a marker, ignore map click.
                if (isMouseOverMarkerRef.current) return;

                // Also check DOM target as double safety
                const target = e.originalEvent.target;
                if (target.closest('.mapbox-custom-marker')) return;

                // Check if we clicked on EITHER heatmap layer
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['general-heat-layer', 'stanbic-heat-layer']
                });

                // If we clicked a heatmap blob OR we are close to a generalized point

                // We also search our raw data for the closest point to the click
                const clickLng = e.lngLat.lng;
                const clickLat = e.lngLat.lat;

                let closestPoint = null;
                let minDistance = Infinity;

                // Search all events (Stanbic + General)
                const interactivePoints = [...stanbicEvents, ...generalEvents];

                interactivePoints.forEach(point => {
                    const dist = Math.sqrt(
                        Math.pow(point.lat - clickLat, 2) +
                        Math.pow(point.lng - clickLng, 2)
                    );
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestPoint = point;
                    }
                });

                // Threshold: If we are reasonably close to a point (or inside a heat blob)
                // The distance 0.01 is roughly 1km. Good for "blob" detection.
                if (closestPoint && minDistance < 0.02) {
                    const isMobile = window.innerWidth < 768;
                    const targetZoom = Math.max(map.getZoom(), 15);

                    // Cinematic FlyTo
                    map.flyTo({
                        center: [closestPoint.lng, closestPoint.lat],
                        zoom: targetZoom,
                        speed: 0.9,       // Slightly slower for discovery feel
                        curve: 1.5,
                        easing: (t) => t,
                        padding: isMobile ? { bottom: 300 } : { left: 0 }
                    });

                    if (isMobile) {
                        setSelectedEvent(closestPoint);
                    } else {
                        new mapboxgl.Popup({
                            offset: 30,
                            className: 'mapbox-custom-popup',
                            maxWidth: '320px',
                            closeButton: true
                        })
                            .setLngLat([closestPoint.lng, closestPoint.lat])
                            .setHTML(createPopupContent(closestPoint))
                            .addTo(map);
                    }
                }
            });

            // Change cursor on hover over heatmap (Both layers)
            map.on('mouseenter', 'general-heat-layer', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'general-heat-layer', () => {
                map.getCanvas().style.cursor = '';
            });

            map.on('mouseenter', 'stanbic-heat-layer', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'stanbic-heat-layer', () => {
                map.getCanvas().style.cursor = '';
            });
        };

        initMap();

        return () => {
            // Cleanup markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Cleanup map
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    return (
        <>
            <div id="map" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}></div>
            {selectedEvent && <BottomSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </>
    );
}
