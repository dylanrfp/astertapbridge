import "@fontsource-variable/inter";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/archivo/wdth-italic.css";
import "./globals.css";
import { BRIDGE_CONFIG } from "../config/bridge.config";

const { siteUrl, brandName, tagline, description } = BRIDGE_CONFIG;
const title = `${brandName} · ${tagline}`;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: brandName,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: brandName,
    locale: "es_MX",
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${brandName} — ${tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
