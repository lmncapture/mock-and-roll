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

const siteUrl = "https://mocknrollbar.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mock & Roll — Premium Mobile Mocktail Bar",
    template: "%s | Mock & Roll",
  },
  description:
    "Premium mobile mocktail bar for weddings, birthdays, corporate events, and every celebration worth remembering. All of the buzz, none of the booze.",
  keywords: [
    "mocktail bar",
    "mobile bar",
    "alcohol-free bar",
    "non-alcoholic drinks",
    "wedding bar",
    "event bar",
    "mocktails",
    "Mock & Roll",
  ],
  authors: [{ name: "Mock & Roll" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mock & Roll",
    title: "Mock & Roll — Premium Mobile Mocktail Bar",
    description:
      "Premium mobile mocktail bar for weddings, birthdays, corporate events, and every celebration worth remembering. All of the buzz, none of the booze.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mock & Roll — Premium Mobile Mocktail Bar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mock & Roll — Premium Mobile Mocktail Bar",
    description:
      "Premium mobile mocktail bar for weddings, birthdays, corporate events, and every celebration worth remembering.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
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
