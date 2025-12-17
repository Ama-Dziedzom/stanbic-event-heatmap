import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const radius = searchParams.get('radius') || '1000'; // Default 1km

        if (!lat || !lng) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required' },
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

        // Use Mapbox Places API to find restaurants
        // Search for restaurants, cafes, and food places near the location
        const categories = 'restaurant,cafe,food';
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=${mapboxToken}&limit=10&proximity=${lng},${lat}&radius=${radius}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.features) {
            return NextResponse.json({
                success: true,
                restaurants: [],
                total: 0
            });
        }

        // Filter and format restaurant data
        const restaurants = data.features
            .filter(feature => {
                // Filter to only include food-related places
                const category = feature.properties?.category?.toLowerCase() || '';
                const name = feature.text?.toLowerCase() || '';
                return category.includes('restaurant') ||
                    category.includes('food') ||
                    category.includes('cafe') ||
                    name.includes('restaurant') ||
                    name.includes('cafe');
            })
            .map(feature => ({
                id: feature.id,
                name: feature.text,
                address: feature.place_name,
                category: feature.properties?.category || 'Restaurant',
                coordinates: {
                    lng: feature.geometry.coordinates[0],
                    lat: feature.geometry.coordinates[1]
                },
                // Generate placeholder images (in production, you'd use real photos)
                images: [
                    `https://picsum.photos/seed/${feature.id}-1/400/300`,
                    `https://picsum.photos/seed/${feature.id}-2/400/300`,
                    `https://picsum.photos/seed/${feature.id}-3/400/300`
                ]
            }))
            .slice(0, 5); // Limit to top 5 restaurants

        return NextResponse.json({
            success: true,
            restaurants,
            total: restaurants.length,
            searchLocation: { lat: parseFloat(lat), lng: parseFloat(lng) }
        });

    } catch (error) {
        console.error('Restaurant API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch restaurants', message: error.message },
            { status: 500 }
        );
    }
}
