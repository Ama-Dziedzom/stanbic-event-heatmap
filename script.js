document.addEventListener('DOMContentLoaded', () => {
    // Initialize map centered on Accra
    const map = L.map('map', {
        zoomControl: false // Hide zoom control for cleaner UI
    }).setView([5.6037, -0.1870], 13);

    // Add CartoDB Positron tile layer (clean, light, good for overlays)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Mock Data Generation for Stanbic Events in Accra
    // Centered around Osu, Airport City, Cantonments
    const centerLat = 5.6037;
    const centerLng = -0.1870;

    const eventTitles = [
        "Jazz in the Park", "Tech Expo 2025", "Art & Wine Mixer",
        "Start-up Pitch Night", "Food Festival", "Charity Gala",
        "Fashion Week Runway", "Music Concert", "Book Launch", "Comedy Night"
    ];

    function generateMockPoints(count, spread) {
        const points = [];
        for (let i = 0; i < count; i++) {
            // Randomize position slightly around the center
            const lat = centerLat + (Math.random() - 0.5) * spread;
            const lng = centerLng + (Math.random() - 0.5) * spread;
            // Intensity between 0.5 and 1
            const intensity = 0.5 + Math.random() * 0.5;

            // Random Metadata
            const title = eventTitles[Math.floor(Math.random() * eventTitles.length)];
            const price = (Math.random() * 200 + 50).toFixed(2);

            points.push({
                lat: lat,
                lng: lng,
                intensity: intensity,
                title: title,
                desc: `Join us for an amazing ${title.toLowerCase()} experience at this location. Sponsored by Stanbic Bank.`,
                price: price
            });
        }
        return points;
    }

    // Generate multiple clusters to mimic real events
    const osuEvents = generateMockPoints(40, 0.04);
    const airportEvents = generateMockPoints(30, 0.03);
    const eastLegonEvents = generateMockPoints(30, 0.05);

    // Shift centers slightly for the other clusters to ensure they aren't all on top of each other
    // Osu is roughly center, Airport is slightly North, East Legon is North East
    const shiftedAirport = airportEvents.map(p => ({ ...p, lat: p.lat + 0.04, lng: p.lng - 0.01 }));
    const shiftedLegon = eastLegonEvents.map(p => ({ ...p, lat: p.lat + 0.06, lng: p.lng + 0.03 }));

    const allPoints = [...osuEvents, ...shiftedAirport, ...shiftedLegon];

    // Heatmap Configuration matching the reference (Blue blobs)
    // Reference shows distinct light blue outer, medium blue middle, dark blue core.
    const heatPoints = allPoints.map(p => [p.lat, p.lng, p.intensity]);

    const heat = L.heatLayer(heatPoints, {
        radius: 35,
        blur: 25,
        maxZoom: 15,
        max: 1.0,
        gradient: {
            0.4: '#d1e5f0', // Very light blue
            0.6: '#67a9cf', // Medium blue
            0.7: '#2166ac', // Darker blue
            0.9: '#053061'  // Deep blue
        }
    }).addTo(map);

    console.log(`Heatmap loaded with ${allPoints.length} points.`);

    // --- Interaction Logic ---

    const drawer = document.getElementById('event-drawer');
    const closeBtn = document.getElementById('close-drawer');
    const eventTitle = document.getElementById('event-title');
    const eventDesc = document.getElementById('event-desc');
    const eventPrice = document.getElementById('event-price');

    // Function to calculate distance between two coordinates in meters (Haversine approximation for short distances)
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    map.on('click', function (e) {
        let closestPoint = null;
        let minDistance = Infinity;

        // Find nearest point
        allPoints.forEach(point => {
            const dist = getDistanceFromLatLonInKm(e.latlng.lat, e.latlng.lng, point.lat, point.lng);
            if (dist < minDistance) {
                minDistance = dist;
                closestPoint = point;
            }
        });

        // Threshold: ~1km for easy clicking on mock data (can be tighter)
        if (closestPoint && minDistance < 1.0) {
            // Update Drawer Content
            eventTitle.textContent = closestPoint.title;
            eventDesc.textContent = closestPoint.desc;
            eventPrice.textContent = `GHS ${closestPoint.price}`;

            // Open Drawer
            drawer.classList.add('open');
        } else {
            // Close drawer if clicking empty space
            drawer.classList.remove('open');
        }
    });

    closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
    });

    // Expose for debugging/verification
    window.map = map;
    window.allPoints = allPoints;
});
