import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

export default function MocktailsHero() {
  return (
    <section className="relative bg-cool-white pt-32 pb-16 lg:pt-40 lg:pb-24 px-6 lg:px-12 overflow-hidden">
      {/* Background shapes */}
      <div
        className="absolute top-12 right-[-6%] w-[380px] h-[380px] lg:w-[580px] lg:h-[580px] rounded-full bg-lime-sorbet/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[320px] h-[320px] lg:w-[480px] lg:h-[480px] rounded-full bg-peach-nectar/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12 lg:gap-12">
        {/* Left: Typography */}
        <div className="lg:w-[50%] lg:py-0">
          <FadeIn>
            <p className="font-body text-slate/50 text-sm font-medium tracking-widest uppercase mb-6">
              Mock &amp; Roll — The Menu
            </p>
            <h1 className="font-display text-slate text-[clamp(40px,6.5vw,84px)] leading-[1.05] tracking-tight">
              Handcrafted Mocktails, Made to Celebrate
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-body text-slate/65 text-lg lg:text-xl leading-relaxed mt-8 max-w-lg">
              From bright citrus blends to berry-forward pours, every Mock &amp; Roll drink is crafted to feel festive, refreshing, and beautiful in hand.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-10">
              <Button href="mailto:lauren@mocknrollbar.com" hoverColor="lime-sorbet">
                Book Mock &amp; Roll
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Right: Hero image — vertically centered with text column */}
        <FadeIn delay={0.15} className="lg:w-[50%] w-full">
          <div className="relative w-full aspect-[4/3] rounded-[28px] overflow-hidden">
            <Image
              src="/images/mr-signature-mocktails-horizontal.jpg"
              alt="Mock & Roll handcrafted mocktails — beautifully presented with fresh garnishes"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
