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

    // Initialize Lucide Icons for static elements (close button etc)
    lucide.createIcons();

    // Mock Data Generation for Stanbic Events in Accra
    const centerLat = 5.6037;
    const centerLng = -0.1870;

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
        "Jazz in the Park": [
            "Live performances from top local and international jazz artists",
            "Gourmet food trucks and refreshment stands",
            "Relaxed outdoor seating with premium sound system",
            "Meet and greet opportunities with performers"
        ],
        "Tech Expo 2025": [
            "Latest technology demonstrations and product launches",
            "Networking sessions with industry leaders",
            "Interactive workshops and panel discussions",
            "Startup pitch competitions with cash prizes"
        ],
        "Art & Wine Mixer": [
            "Curated art exhibition from emerging Ghanaian artists",
            "Premium wine tasting sessions",
            "Live painting demonstrations",
            "Opportunity to purchase exclusive artworks"
        ],
        "Start-up Pitch Night": [
            "Watch innovative startups pitch to investors",
            "Networking with entrepreneurs and VCs",
            "Q&A sessions with successful founders",
            "Complimentary refreshments and appetizers"
        ],
        "Food Festival": [
            "Over 50 food vendors featuring local and international cuisine",
            "Live cooking demonstrations by celebrity chefs",
            "Kids play area and family-friendly activities",
            "Live music and entertainment throughout the day"
        ],
        "Charity Gala": [
            "Black-tie dinner with premium catering",
            "Live auction featuring exclusive items",
            "Performances by renowned artists",
            "All proceeds support local community projects"
        ],
        "Fashion Week Runway": [
            "Runway shows from top Ghanaian and African designers",
            "VIP seating with complimentary champagne",
            "After-party with DJs and networking",
            "Exclusive shopping opportunities"
        ],
        "Music Concert": [
            "Headline performances from chart-topping artists",
            "State-of-the-art sound and lighting production",
            "VIP lounge access with premium amenities",
            "Merchandise and photo opportunities"
        ],
        "Book Launch": [
            "Author reading and book signing session",
            "Panel discussion on the book's themes",
            "Complimentary wine and canapés",
            "First 50 attendees receive a signed copy"
        ],
        "Comedy Night": [
            "Stand-up performances from Ghana's funniest comedians",
            "Open mic session for aspiring comedians",
            "Full bar and restaurant service",
            "Photo booth and social media contests"
        ]
    };

    // Generate random future dates
    function getRandomFutureDate() {
        const today = new Date();
        const daysAhead = Math.floor(Math.random() * 90) + 7; // 7-97 days ahead
        const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
        return futureDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    function getRandomTime() {
        const hours = Math.floor(Math.random() * 6) + 17; // 5 PM to 11 PM
        const minutes = Math.random() < 0.5 ? '00' : '30';
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours > 12 ? hours - 12 : hours;
        return `${displayHour}:${minutes} ${period}`;
    }

    // Placeholder images for events (using placeholder service)
    function getEventImages(eventType) {
        const seed = eventType.replace(/\s+/g, '-').toLowerCase();
        return [
            `https://picsum.photos/seed/${seed}-1/400/300`,
            `https://picsum.photos/seed/${seed}-2/400/300`,
            `https://picsum.photos/seed/${seed}-3/400/300`,
            `https://picsum.photos/seed/${seed}-4/400/300`
        ];
    }

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
            const location = locations[Math.floor(Math.random() * locations.length)];
            const date = getRandomFutureDate();
            const time = getRandomTime();
            const images = getEventImages(title);
            const expectations = eventExpectations[title] || [];

            points.push({
                lat: lat,
                lng: lng,
                intensity: intensity,
                title: title,
                desc: `Join us for an amazing ${title.toLowerCase()} experience. Sponsored by Stanbic Bank Ghana. This event promises to be unforgettable with world-class entertainment.`,
                price: price,
                location: location,
                date: date,
                time: time,
                images: images,
                expectations: expectations
            });
        }
        return points;
    }

    // Generate multiple clusters to mimic real events
    const osuEvents = generateMockPoints(40, 0.04);
    const airportEvents = generateMockPoints(30, 0.03);
    const eastLegonEvents = generateMockPoints(30, 0.05);

    // Shift centers slightly for the other clusters to ensure they aren't all on top of each other
    const shiftedAirport = airportEvents.map(p => ({ ...p, lat: p.lat + 0.04, lng: p.lng - 0.01 }));
    const shiftedLegon = eastLegonEvents.map(p => ({ ...p, lat: p.lat + 0.06, lng: p.lng + 0.03 }));

    const allPoints = [...osuEvents, ...shiftedAirport, ...shiftedLegon];

    // Heatmap Configuration
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

    // Elements to update
    const eventTitle = document.getElementById('event-title');
    const eventDesc = document.getElementById('event-desc');
    const eventPrice = document.getElementById('event-price');
    const eventDate = document.getElementById('event-date');
    const eventTime = document.getElementById('event-time');
    const eventLocation = document.getElementById('event-location');
    const eventGallery = document.getElementById('event-gallery');
    const eventExpectationsList = document.getElementById('event-expectations');

    // Helper functions
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    function closeDrawer() {
        drawer.classList.remove('open');
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

        // Threshold: ~1km for easy clicking on mock data
        if (closestPoint && minDistance < 1.0) {
            // Update Drawer Content
            eventTitle.textContent = closestPoint.title;
            eventDesc.textContent = closestPoint.desc;
            eventPrice.textContent = closestPoint.price;
            eventDate.textContent = closestPoint.date;
            eventTime.textContent = closestPoint.time;
            eventLocation.textContent = closestPoint.location;

            // Update Image Gallery
            eventGallery.innerHTML = '';
            closestPoint.images.forEach(imgSrc => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `${closestPoint.title} photo`;
                img.className = 'gallery-image';
                eventGallery.appendChild(img);
            });

            // Update Expectations
            eventExpectationsList.innerHTML = '';
            closestPoint.expectations.forEach(expectation => {
                const li = document.createElement('li');
                // Insert Check icon for each item
                li.innerHTML = `<i data-lucide="check" class="expectation-icon"></i> <span>${expectation}</span>`;
                eventExpectationsList.appendChild(li);
            });

            // Re-run Lucide to render new icons
            lucide.createIcons();

            // Open Drawer
            drawer.classList.add('open');
        } else {
            // Close drawer if clicking empty space
            closeDrawer();
        }
    });

    closeBtn.addEventListener('click', closeDrawer);

    // Also close when clicking overlay (if we had one separate, but here we can check target)
    // Optional: Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });

    // Expose for debugging
    window.map = map;
    window.allPoints = allPoints;
});
