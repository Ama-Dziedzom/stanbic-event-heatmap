# Restaurant Discovery Feature

## Overview
Snapchat-style restaurant discovery around event locations showing nearby dining options within 1km radius.

## Features

### 🍴 **Fork and Knife Icons**
- Red circular markers with fork and knife icons
- Appear near each Stanbic event location
- Animated hover effects (scale up on hover)

### 📍 **Automatic Discovery**
- Finds top 5 restaurants within 1km of each event
- Uses Mapbox Places API
- Filters for restaurants, cafes, and food venues

### 📸 **Snapchat-Style Popups**
When you click a restaurant icon, you see:
- Restaurant name
- Category (Restaurant, Cafe, etc.)
- Full address
- Main photo (large, top of popup)
- Thumbnail gallery (smaller photos you can scroll through)

## How It Works

### Backend (`/api/restaurants`)
```
GET /api/restaurants?lat=5.6037&lng=-0.1870&radius=1000
```

**Parameters:**
- `lat` - Event latitude
- `lng` - Event longitude  
- `radius` - Search radius in meters (default: 1000m = 1km)

**Response:**
```json
{
  "success": true,
  "restaurants": [
    {
      "id": "poi.123456",
      "name": "Ocean View Restaurant",
      "address": "123 Beach Road, Accra, Ghana",
      "category": "Restaurant",
      "coordinates": { "lat": 5.6040, "lng": -0.1875 },
      "images": ["url1", "url2", "url3"]
    }
  ],
  "total": 5
}
```

### Frontend (StanbicMap.js)
1. **Event markers load** → Blue event blobs appear
2. **Restaurant API called** → For each event, fetch nearby restaurants
3. **Restaurant markers add** → Fork & knife icons appear around events
4. **Click interaction** → Popup shows restaurant details + photos

## User Experience

### Desktop
- Hover over restaurant icon → Icon scales up
- Click icon → Popup appears with photos and info
- Close button on top-right of popup

### Mobile
- Tap restaurant icon → Popup appears
- Swipe photo gallery horizontally
- Tap outside or close button to dismiss

## Data Sources

### Current (Development)
- **Places**: Mapbox Places API
- **Photos**: Placeholder images (Picsum)

### Future (Production)
Replace placeholder images with:
- Google Places API photos
- Yelp API photos
- Foursquare venue photos
- Or curated photos from Airtable

## Customization

### Change Search Radius
In `StanbicMap.js`, line ~547:
```javascript
const response = await fetch(`/api/restaurants?lat=${event.lat}&lng=${event.lng}&radius=2000`); // 2km
```

### Change Number of Restaurants
In `/api/restaurants/route.js`, line ~70:
```javascript
.slice(0, 10); // Show top 10 instead of 5
```

### Change Icon Color
In `StanbicMap.js`, line ~555:
```javascript
<circle cx="12" cy="12" r="11" fill="#4CAF50" ... /> <!-- Green instead of red -->
```

### Add Real Photos
Update `/api/restaurants/route.js` to fetch from:
- Google Places Photos API
- Yelp Fusion API
- Foursquare Venues API

## Styling

All restaurant styles are in `globals.css`:
- `.restaurant-marker` - Icon container
- `.restaurant-custom-popup` - Popup container
- `.restaurant-popup` - Popup content

## Future Enhancements

- [ ] Filter by cuisine type (Italian, Chinese, etc.)
- [ ] Show ratings and reviews
- [ ] Show price range ($, $$, $$$)
- [ ] Add "Get Directions" button
- [ ] Show operating hours
- [ ] Add reservation integration
- [ ] Distance indicator from event
- [ ] Sort by rating or distance

## Performance

- **API Calls**: 1 call per event (async, parallel loading)
- **Markers**: Max 5 restaurants × number of events
- **Caching**: Can add browser cache for 1 hour
- **Loading**: Restaurants load after map initializes

---

**The feature is now live!** Refresh your browser and click on the red fork & knife icons to discover restaurants near events! 🍽️
