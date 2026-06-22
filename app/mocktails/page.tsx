import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import MocktailsHero from "@/app/mocktails/components/MocktailsHero";
import SignatureMocktails from "@/app/mocktails/components/SignatureMocktails";
import FlavorProfiles from "@/app/mocktails/components/FlavorProfiles";
import MocktailsCTA from "@/app/mocktails/components/MocktailsCTA";

export const metadata = {
  title: "Mocktails — Mock & Roll",
  description:
    "Handcrafted mocktails made to celebrate. From bright citrus blends to berry-forward pours — every drink is crafted to feel festive, refreshing, and beautiful.",
};

export default function MocktailsPage() {
  return (
    <>
      <Header />
      <main>
        <MocktailsHero />
        <SignatureMocktails />
        <FlavorProfiles />
        <MocktailsCTA />
      </main>
      <Footer />
    </>
  );
}
