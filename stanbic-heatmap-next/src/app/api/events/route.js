import Airtable from 'airtable';
import { NextResponse } from 'next/server';

// Helper function to geocode a location using Mapbox
async function geocodeLocation(locationName) {
    try {
        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!mapboxToken) return null;

        const proximity = '-0.1870,5.6037'; // Accra coordinates
        const encodedLocation = encodeURIComponent(locationName);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=${mapboxToken}&proximity=${proximity}&country=gh&limit=1`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

export async function GET() {
    try {
        // Validate environment variables
        const apiKey = process.env.AIRTABLE_API_KEY;
        const baseId = process.env.AIRTABLE_BASE_ID;
        const tableName = process.env.AIRTABLE_TABLE_NAME || 'Events';

        if (!apiKey || !baseId) {
            return NextResponse.json(
                {
                    error: 'Airtable configuration missing. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env.local',
                    useMockData: true
                },
                { status: 500 }
            );
        }

        // Initialize Airtable
        const base = new Airtable({ apiKey }).base(baseId);

        // Fetch records from Airtable
        const records = await base(tableName)
            .select({
                // Only fetch published events
                filterByFormula: '{Status} = "Published"',
                // Sort by event date
                sort: [{ field: 'Event Date', direction: 'asc' }]
            })
            .all();

        // Transform Airtable records to our app's format
        const eventsPromises = records.map(async (record) => {
            let lat = parseFloat(record.get('Latitude'));
            let lng = parseFloat(record.get('Longitude')) || parseFloat(record.get('Longtitude')); // Handle typo
            const locationName = record.get('Location Name');

            // Auto-geocode if coordinates are missing but location exists
            if ((!lat || !lng || isNaN(lat) || isNaN(lng)) && locationName) {
                console.log(`Auto-geocoding: ${locationName}`);
                const coords = await geocodeLocation(locationName);
                if (coords) {
                    lat = coords.lat;
                    lng = coords.lng;
                    console.log(`Geocoded ${locationName} to: ${lat}, ${lng}`);
                }
            }

            // Fallback to Accra center if still missing
            if (!lat || isNaN(lat)) lat = 5.6037;
            if (!lng || isNaN(lng)) lng = -0.1870;

            return {
                id: record.id,
                title: record.get('Event name') || 'Untitled Event', // Lowercase 'n' to match Airtable
                desc: record.get('Description') || '',
                lat,
                lng,
                location: locationName || 'Accra, Ghana',
                category: record.get('Category') || 'General Event',
                intensity: parseFloat(record.get('Intensity')) || 0.5,
                price: record.get('Ticket Price') || 0,
                date: formatDate(record.get('Event Date')),
                time: formatTime(record.get('Event Date')), // Extract time from same field
                images: getImages(record.get('Attachments')),
                expectations: record.get('Expectations')
                    ? record.get('Expectations').split(',').map(e => e.trim())
                    : []
            };
        });

        const events = await Promise.all(eventsPromises);

        // Separate Stanbic and General events
        const stanbicEvents = events.filter(e => e.category === 'Stanbic Event');
        const generalEvents = events.filter(e => e.category === 'General Event');

        return NextResponse.json({
            success: true,
            stanbicEvents,
            generalEvents,
            total: events.length,
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error('Airtable API Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch events from Airtable',
                message: error.message,
                useMockData: true
            },
            { status: 500 }
        );
    }
}

// Helper function to format date from Airtable
function formatDate(dateString) {
    if (!dateString) return 'TBA';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    } catch (error) {
        return dateString;
    }
}

// Helper function to format time from Airtable date field
function formatTime(dateString) {
    if (!dateString) return 'TBA';

    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        return 'TBA';
    }
}

// Helper function to extract image URLs from Airtable attachments
function getImages(attachments) {
    if (!attachments || !Array.isArray(attachments)) {
        // Return a default placeholder image
        return ['https://picsum.photos/seed/default/400/300'];
    }

    return attachments.map(attachment => attachment.url);
}
