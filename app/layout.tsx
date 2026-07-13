import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Primary / display — PP Acma Black (Pangram Pangram, licensed webfont).
// Used for names, headings and key moments.
const acma = localFont({
  src: "./_brand/fonts/PPAcma-Black.otf",
  weight: "900",
  display: "swap",
  variable: "--font-acma",
});

// Secondary — Barlow. Core body copy.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-barlow",
});

// Secondary — Barlow Condensed. Supporting / space-constrained / small text.
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Finn Brinn Connections",
  description: "Group four groups of four!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${acma.variable} ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body className="font-body bg-wedding-aubergine text-wedding-cream">
        {children}
      </body>
    </html>
  );
}
