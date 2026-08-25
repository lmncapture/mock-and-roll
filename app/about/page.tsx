import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";
import Image from "next/image";

export const metadata = {
  title: "About",
  description:
    "Meet Lauren, the founder of Mock & Roll — a luxury mobile mocktail bar born from an unexpected new chapter, serving Seattle and the surrounding areas.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {/* Editorial Hero */}
        <section className="relative bg-cool-white pt-32 pb-12 lg:pt-40 lg:pb-20 px-6 lg:px-12 overflow-hidden">
          {/* Subtle background shape */}
          <div
            className="absolute top-16 right-[-6%] w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full bg-rose-petal/30 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-7xl text-center">
            <FadeIn>
              <p className="font-body text-slate/75 text-sm font-medium tracking-widest uppercase mb-6">
                Our Story
              </p>
              <h1 className="font-display text-slate text-[clamp(40px,6vw,80px)] leading-[1.05] tracking-tight">
                Meet Lauren
              </h1>
            </FadeIn>
          </div>
        </section>

        {/* Lauren Photo + Story */}
        <section className="bg-cool-white pb-20 lg:pb-32 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {/* Full 3:2 photograph — no cropping */}
            <FadeIn>
              <Image
                src="/images/mr-lauren-founder.jpg"
                alt="Lauren, founder of Mock & Roll, smiling warmly"
                width={1920}
                height={1280}
                className="w-full h-auto rounded-[28px]"
                sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1024px) calc(100vw - 96px), 1280px"
                priority
              />
            </FadeIn>

            {/* Bio underneath */}
            <FadeIn delay={0.1}>
              <div className="mx-auto max-w-3xl mt-12 lg:mt-16">
                <p className="font-body text-slate/80 text-lg lg:text-xl leading-relaxed mb-6">
                  I&apos;m Lauren, the face behind Mock &amp; Roll. At the beginning of 2026, life threw me a curveball: I was laid off from my corporate job. It was unexpected, a little scary, and definitely not part of the plan. But you know what they say: When life gives you lemons… cut them and garnish beautiful mocktails?
                </p>
                <p className="font-body text-slate/80 text-lg lg:text-xl leading-relaxed mb-6">
                  Somewhere in that uncertainty, Mock &amp; Roll was born. I&apos;ve always loved the little details that make an event feel special- beautiful presentation, thoughtful touches, and creating an experience people remember. I wanted to take that love and turn it into something of my own.
                </p>
                <p className="font-body text-slate/80 text-lg lg:text-xl leading-relaxed mb-6">
                  Mock &amp; Roll is a luxury mobile mocktail bar serving Seattle and the surrounding areas. We bring the bar experience to you with handcrafted mocktails, beautiful garnishes, custom menus &amp; cups, personalized details, and a setup designed to feel just as special as the event itself.
                </p>
                <p className="font-body text-slate/80 text-lg lg:text-xl leading-relaxed">
                  Weddings, showers, birthdays, corporate events, celebrations… if there&apos;s something worth raising a glass to, we&apos;re there. Getting laid off may have been the end of one chapter, but it gave me the opportunity to start one I might not have written otherwise. I&apos;m so excited to show you what I&apos;ve been creating and hopefully roll up to one of your celebrations soon.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Booking CTA */}
        <section className="bg-rose-petal/40 py-20 lg:py-32 px-6 lg:px-12">
          <FadeIn className="mx-auto max-w-3xl flex flex-col items-center text-center gap-6 lg:gap-8">
            <h2 className="font-display text-slate text-3xl lg:text-5xl xl:text-6xl leading-[1.15] tracking-tight">
              Let&apos;s celebrate something together.
            </h2>
            <Button href="/inquiries" hoverColor="peach-nectar">
              Book Mock &amp; Roll
            </Button>
          </FadeIn>
        </section>
      </main>
      <Footer />
    </>
  );
}
