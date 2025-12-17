
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
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
