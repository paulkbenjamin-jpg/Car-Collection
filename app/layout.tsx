import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Inter, Cinzel } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-slab",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Dicksonian — Private Inventory",
  description: "A private inventory of the Dicksonian collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${jetbrainsMono.variable} ${inter.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
