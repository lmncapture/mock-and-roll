import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Mocktails from "@/app/components/Mocktails";
import Portfolio from "@/app/components/Portfolio";
import Events from "@/app/components/Events";
import ReservationCTA from "@/app/components/ReservationCTA";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
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
