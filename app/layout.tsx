import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const justCosmic = localFont({
  src: "../public/fonts/JustCosmic.otf",
  variable: "--font-just-cosmic",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const outfit = localFont({
  src: "../public/fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mocknrollbar.com";

export const viewport: Viewport = {
  themeColor: "#324648",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mock & Roll — Premium Mobile Mocktail Bar | Seattle",
    template: "%s | Mock & Roll",
  },
  description:
    "Premium mobile mocktail bar serving Seattle and surrounding areas. Handcrafted mocktails for weddings, birthdays, baby showers, corporate events, and every celebration worth remembering.",
  keywords: [
    "mobile mocktail bar",
    "mocktail bar Seattle",
    "mobile mocktail bar Seattle",
    "mocktail catering",
    "non-alcoholic bar service",
    "wedding mocktail bar",
    "event mocktails",
    "Mock & Roll",
  ],
  authors: [{ name: "Mock & Roll" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mock & Roll",
    locale: "en_US",
    title: "Mock & Roll — Premium Mobile Mocktail Bar | Seattle",
    description:
      "Premium mobile mocktail bar serving Seattle and surrounding areas. Handcrafted mocktails for weddings, birthdays, corporate events, and every celebration worth remembering.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mock & Roll — Premium Mobile Mocktail Bar serving Seattle and surrounding areas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mock & Roll — Premium Mobile Mocktail Bar | Seattle",
    description:
      "Premium mobile mocktail bar serving Seattle and surrounding areas. Handcrafted mocktails for weddings, birthdays, corporate events, and celebrations.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
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
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:bg-slate focus:text-cool-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-body focus:font-semibold focus:text-sm"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
