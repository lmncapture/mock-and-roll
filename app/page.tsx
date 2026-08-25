import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Mocktails from "@/app/components/Mocktails";
import Portfolio from "@/app/components/Portfolio";
import Events from "@/app/components/Events";
import ReservationCTA from "@/app/components/ReservationCTA";
import Footer from "@/app/components/Footer";
import JsonLd from "@/app/components/JsonLd";
import {
  getOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/seo/structured-data";

export default function Home() {
  return (
    <>
      <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Mocktails />
        <Portfolio />
        <Events />
        <ReservationCTA />
      </main>
      <Footer />
    </>
  );
}
