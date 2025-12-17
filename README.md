# Stanbic Event Heatmap

An interactive event discovery map application for Stanbic Bank Ghana, built with Next.js and Mapbox GL.

## Features

- **Interactive Heatmap**: Visualize event density across Accra with distinct heatmaps for Stanbic and general events
- **3D Buildings**: Immersive 3D building visualization for major Accra landmarks
- **Event Details**: Click on heatmap areas to view detailed event information
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Sleek, professional design following Stanbic branding

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Mapbox GL JS** - Interactive map rendering
- **React** - Component-based UI
- **CSS3** - Modern styling with custom properties

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Mapbox API key

### Installation

1. Navigate to the Next.js app directory:
   ```bash
   cd stanbic-heatmap-next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Mapbox token:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
stanbic-heatmap-next/
├── src/
│   ├── app/              # Next.js App Router pages
│   └── components/       # React components
│       └── StanbicMap.js # Main map component
├── public/               # Static assets
└── package.json
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Run production server

## License

Proprietary - Stanbic Bank Ghana
