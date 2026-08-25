/**
 * Central structured data (JSON-LD) definitions for Mock & Roll.
 *
 * All structured data derives from the canonical business config in lib/config/.
 * This file provides schema.org entities used across the site.
 */

import { PACKAGES } from "@/lib/config/packages";
import { SERVICE_PRICING, TRAVEL_PRICING } from "@/lib/config/services";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mocknrollbar.com";

// Stable entity @id references
const ORG_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

/**
 * Organization entity — the core Mock & Roll entity.
 * Used on the homepage and referenced by other schemas.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: "Mock & Roll",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    image: `${siteUrl}/og-image.png`,
    description:
      "Premium mobile mocktail bar serving Seattle and surrounding areas. Handcrafted non-alcoholic drinks for weddings, baby showers, birthdays, corporate events, and celebrations.",
    email: "lauren@mocknrollbar.com",
    founder: {
      "@type": "Person",
      name: "Lauren",
      jobTitle: "Founder",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 47.6062,
        longitude: -122.3321,
      },
      geoRadius: "60 mi",
    },
    serviceArea: {
      "@type": "Place",
      name: "Seattle and surrounding areas",
    },
    priceRange: "$$",
    sameAs: ["https://www.instagram.com/mocknrollbar"],
    knowsAbout: [
      "Mocktail catering",
      "Non-alcoholic event drinks",
      "Mobile bar service",
      "Wedding mocktail bar",
      "Corporate event beverages",
    ],
  };
}

/**
 * WebSite entity — helps search engines understand the site structure.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Mock & Roll",
    url: siteUrl,
    publisher: {
      "@id": ORG_ID,
    },
  };
}

/**
 * Service + Offer structured data for the Packages page.
 * Derived from canonical config in lib/config/packages.ts and lib/config/services.ts.
 */
export function getServiceSchema() {
  const offers = PACKAGES.map((pkg) => ({
    "@type": "Offer" as const,
    name: pkg.name,
    price: pkg.price,
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification" as const,
      price: pkg.price,
      priceCurrency: "USD",
      unitText: pkg.pricingMode === "flat" ? "event" : "person",
      description: pkg.shortDescription,
    },
    description:
      pkg.pricingMode === "flat"
        ? `Up to ${pkg.guestMax} guests, ${pkg.allowedDrinkCount} handcrafted mocktails, ${SERVICE_PRICING.includedHours} hours of unlimited service`
        : `${pkg.guestMin ? `${pkg.guestMin}+ guests, ` : ""}${pkg.allowedDrinkCount} handcrafted mocktails, ${SERVICE_PRICING.includedHours} hours of unlimited service`,
    eligibleQuantity:
      pkg.guestMax
        ? {
            "@type": "QuantitativeValue" as const,
            maxValue: pkg.guestMax,
            unitText: "guests",
          }
        : pkg.guestMin
          ? {
              "@type": "QuantitativeValue" as const,
              minValue: pkg.guestMin,
              unitText: "guests",
            }
          : undefined,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mobile Mocktail Bar Service",
    provider: {
      "@id": ORG_ID,
    },
    serviceType: "Mobile Mocktail Bar",
    areaServed: {
      "@type": "Place",
      name: "Seattle and surrounding areas",
    },
    description: `Premium mobile mocktail bar for events. All packages include ${SERVICE_PRICING.includedHours} hours of unlimited mocktail service, professional bartending, premium garnishes, setup, and cleanup. Travel within ${SERVICE_PRICING.includedTravelMiles} miles included.`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Mock & Roll Packages",
      itemListElement: offers,
    },
  };
}

/**
 * FAQPage structured data for the Packages FAQ section.
 * Must exactly match visible FAQ content.
 */
export function getFAQSchema() {
  const faqs = [
    {
      question: "Do you travel to any venue?",
      answer:
        "Yes — we are a fully mobile mocktail bar. We bring everything needed to your venue: bar setup, garnishes, glassware, and our full service team.",
    },
    {
      question: "What's included in every package?",
      answer:
        "Every package includes unlimited mocktails for the duration of your event, professional bartending service, premium garnishes, and full setup and cleanup.",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 4–6 weeks in advance for most events. For weddings and larger events, earlier is always better to secure your date.",
    },
    {
      question: "Can I customize the mocktail menu?",
      answer:
        "Absolutely. We work with every client to design a signature menu that fits the theme, preferences, and dietary needs of your guests.",
    },
    {
      question: "What if my guest count changes?",
      answer:
        "No problem. For per-guest packages we finalize the count closer to the event date. We'll work with you to ensure accurate pricing for your final headcount.",
    },
    {
      question: "Do you serve alcohol?",
      answer:
        "Mock & Roll is an alcohol-free experience. Every drink on our menu is a thoughtfully crafted, non-alcoholic mocktail — which means everyone at your event can enjoy.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList schema for sub-pages.
 */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Travel pricing information formatted for humans (used in structured data descriptions).
 */
export function getTravelDescription(): string {
  const tiers = TRAVEL_PRICING.filter((t) => t.price !== null && t.price > 0)
    .map((t) => `${t.label}: ${t.priceDisplay}`)
    .join("; ");
  return `Travel within ${SERVICE_PRICING.includedTravelMiles} miles included. Beyond that: ${tiers}. 60+ miles: custom quote.`;
}
