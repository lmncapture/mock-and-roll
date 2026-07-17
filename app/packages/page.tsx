import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PackagesHero from "@/app/packages/components/PackagesHero";
import PackageOfferings from "@/app/packages/components/PackageOfferings";
import CustomEvents from "@/app/packages/components/CustomEvents";
import PackagesCTA from "@/app/packages/components/PackagesCTA";
import PackagesFAQ from "@/app/packages/components/PackagesFAQ";

export const metadata = {
  title: "Packages",
  description:
    "Premium mobile mocktail experiences for every celebration. From intimate gatherings to large-scale events — find the perfect Mock & Roll package.",
};

export default function PackagesPage() {
  return (
    <>
      <Header />
      <main>
        <PackagesHero />
        <PackageOfferings />
        <CustomEvents />
        <PackagesFAQ />
        <PackagesCTA />
      </main>
      <Footer />
    </>
  );
}
