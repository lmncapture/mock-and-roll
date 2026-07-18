import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Mocktails from "@/app/components/Mocktails";
import Portfolio from "@/app/components/Portfolio";
import Events from "@/app/components/Events";
import ReservationCTA from "@/app/components/ReservationCTA";
import Footer from "@/app/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mock & Roll",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mocknrollbar.com",
  sameAs: ["https://www.instagram.com/mocknrollbar"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main>
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
