import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PackagesHero from "@/app/packages/components/PackagesHero";
import PackageOfferings from "@/app/packages/components/PackageOfferings";
import ServiceDetails from "@/app/packages/components/ServiceDetails";
import GratuityOptions from "@/app/packages/components/GratuityOptions";
import PackagesFAQ from "@/app/packages/components/PackagesFAQ";
import PackagesCTA from "@/app/packages/components/PackagesCTA";
import JsonLd from "@/app/components/JsonLd";
import {
  getServiceSchema,
  getFAQSchema,
  getBreadcrumbSchema,
} from "@/lib/seo/structured-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mocknrollbar.com";

export const metadata = {
  title: "Packages",
  description:
    "Mobile mocktail bar packages for every celebration. From intimate gatherings to large events — explore Mock & Roll pricing, service details, and what's included.",
  alternates: {
    canonical: `${siteUrl}/packages`,
  },
};

export default function PackagesPage() {
  return (
    <>
      <JsonLd
        data={[
          getServiceSchema(),
          getFAQSchema(),
          getBreadcrumbSchema([
            { name: "Home", url: siteUrl },
            { name: "Packages", url: `${siteUrl}/packages` },
          ]),
        ]}
      />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <PackagesHero />
        <PackageOfferings />
        <ServiceDetails />
        <GratuityOptions />
        <PackagesFAQ />
        <PackagesCTA />
      </main>
      <Footer />
    </>
  );
}
