import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location');

        if (!location) {
            return NextResponse.json(
                { error: 'Location parameter is required' },
                { status: 400 }
            );
        }

        const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        if (!mapboxToken) {
            return NextResponse.json(
                { error: 'Mapbox token not configured' },
                { status: 500 }
            );
        }

        // Bias search towards Accra, Ghana
        const proximity = '-0.1870,5.6037'; // Accra coordinates (lng,lat)
        const country = 'gh'; // Ghana

        // Call Mapbox Geocoding API
        const encodedLocation = encodeURIComponent(location);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=${mapboxToken}&proximity=${proximity}&country=${country}&limit=1`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.features || data.features.length === 0) {
            return NextResponse.json(
                { error: 'Location not found', location },
                { status: 404 }
            );
        }

        const feature = data.features[0];
        const [lng, lat] = feature.center;

        return NextResponse.json({
            success: true,
            location: feature.place_name,
            latitude: lat,
            longitude: lng,
            coordinates: { lat, lng }
        });

    } catch (error) {
        console.error('Geocoding error:', error);
        return NextResponse.json(
            { error: 'Failed to geocode location', message: error.message },
            { status: 500 }
        );
    }
}
