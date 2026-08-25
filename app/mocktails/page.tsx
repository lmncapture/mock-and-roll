import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import MocktailsHero from "@/app/mocktails/components/MocktailsHero";
import SignatureMocktails from "@/app/mocktails/components/SignatureMocktails";
import MocktailBuilder from "@/app/mocktails/components/MocktailBuilder";
import MocktailsCTA from "@/app/mocktails/components/MocktailsCTA";
import JsonLd from "@/app/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/structured-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mocknrollbar.com";

export const metadata = {
  title: "Mocktails",
  description:
    "Handcrafted mocktails made to celebrate. From bright citrus blends to berry-forward pours — every Mock & Roll drink is crafted to feel festive, refreshing, and beautiful.",
  alternates: {
    canonical: `${siteUrl}/mocktails`,
  },
};

export default function MocktailsPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Mocktails", url: `${siteUrl}/mocktails` },
        ])}
      />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <MocktailsHero />
        <SignatureMocktails />
        <MocktailBuilder />
        <MocktailsCTA />
      </main>
      <Footer />
    </>
  );
}
