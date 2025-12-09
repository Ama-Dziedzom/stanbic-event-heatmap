
import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Stanbic Event Heatmap",
  description: "Heatmap of Stanbic Bank events in Accra",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body>
        <Script src="https://cdn.osmbuildings.org/4.1.1/OSMBuildings.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
