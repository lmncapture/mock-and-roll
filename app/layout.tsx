import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const justCosmic = localFont({
  src: "../public/fonts/JustCosmic.otf",
  variable: "--font-just-cosmic",
  display: "swap",
});

const outfit = localFont({
  src: "../public/fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mock & Roll",
  description:
    "An elevated alcohol-free mocktail bar experience designed for connection, celebration, and feel-good nights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${justCosmic.variable} ${outfit.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
