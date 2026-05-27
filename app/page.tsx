import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Experience from "@/app/components/Experience";
import Mocktails from "@/app/components/Mocktails";
import Atmosphere from "@/app/components/Atmosphere";
import Events from "@/app/components/Events";
import ReservationCTA from "@/app/components/ReservationCTA";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Experience />
        <Mocktails />
        <Atmosphere />
        <Events />
        <ReservationCTA />
      </main>
      <Footer />
    </>
  );
}
