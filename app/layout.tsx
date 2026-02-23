import type { Metadata } from "next";
import { Encode_Sans, Gloock } from "next/font/google";
import "./globals.css";

const encodeSans = Encode_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-encode-sans",
});

const gloock = Gloock({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gloock",
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
    <html lang="en" className={`${encodeSans.variable} ${gloock.variable}`}>
      <body className="font-body bg-wedding-deepRed text-wedding-blush">
        {children}
      </body>
    </html>
  );
}