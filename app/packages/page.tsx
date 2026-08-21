import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PackagesHero from "@/app/packages/components/PackagesHero";
import PackageOfferings from "@/app/packages/components/PackageOfferings";
import ServiceDetails from "@/app/packages/components/ServiceDetails";
import GratuityOptions from "@/app/packages/components/GratuityOptions";
import PackagesFAQ from "@/app/packages/components/PackagesFAQ";
import PackagesCTA from "@/app/packages/components/PackagesCTA";

export const metadata = {
  title: "Packages",
  description:
    "Premium mobile mocktail experiences for every celebration. From intimate gatherings to large-scale events — find the perfect Mock & Roll package.",
};

export default function PackagesPage() {
  return (
    <>
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
