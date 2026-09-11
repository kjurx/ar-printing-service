import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR. Printing Service & Gift Gallery | Custom Printing in Jashpur",
  description:
    "Custom printing on T-Shirts, Hoodies, Jerseys, Mugs, Bottles, Mobile Covers & more. AR. Printing Service & Gift Gallery — Bagicha, Jashpur. Order on WhatsApp.",
  openGraph: {
    title: "AR. Printing Service & Gift Gallery",
    description: "Custom print & gift studio in Jashpur. Har Print, Aapke Style Mein!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}