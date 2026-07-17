import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AboutHero from "@/app/about/components/AboutHero";
import WhoWeAre from "@/app/about/components/WhoWeAre";
import WhyWeStarted from "@/app/about/components/WhyWeStarted";
import OurMission from "@/app/about/components/OurMission";
import PerfectFor from "@/app/about/components/PerfectFor";

export const metadata = {
  title: "About",
  description:
    "Mock & Roll is a premium mobile mocktail bar bringing beautiful, alcohol-free drinks to celebrations of every kind.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <WhoWeAre />
        <WhyWeStarted />
        <OurMission />
        <PerfectFor />
      </main>
      <Footer />
    </>
  );
}
