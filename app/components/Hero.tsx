"use client";

import Image from "next/image";
import Button from "@/app/components/ui/Button";
import FadeIn from "@/app/components/ui/FadeIn";

const supportingImages = [
  { src: "/images/events-celebration.jpg", alt: "Celebration with curated mocktails" },
  { src: "/images/events-bridal.jpg", alt: "Elegant bridal shower event" },
  { src: "/images/atmosphere-drinks.jpg", alt: "Artful mocktail with garnish detail" },
  { src: "/images/events-gathering.jpg", alt: "Guests enjoying a private event" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-cool-white pt-36 pb-20 lg:pb-28 px-6 lg:px-12">
      {/* Soft pastel abstract background shapes */}
      <div
        className="absolute top-16 left-[-5%] w-[320px] h-[320px] lg:w-[500px] lg:h-[500px] rounded-full bg-lime-sorbet/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[280px] h-[280px] lg:w-[450px] lg:h-[450px] rounded-full bg-peach-nectar/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-[40%] right-[20%] w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] rounded-full bg-rose-petal/30 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
        {/* Left: Typography content (~50%) */}
        <div className="flex flex-col justify-center lg:w-[50%] lg:pt-8">
          <FadeIn delay={0}>
            <h1 className="font-display text-slate text-[clamp(36px,8vw,80px)] lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight">
              Crafted mocktails.
              <br />
              Unforgettable moments.
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-body text-slate/80 text-xl lg:text-2xl leading-relaxed mt-8 max-w-md font-medium">
              All of the buzz, none of the booze.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="font-body text-slate/60 text-base lg:text-lg leading-relaxed mt-4 max-w-md">
              Premium mobile mocktail experiences for weddings, birthdays, corporate events, and every celebration worth remembering.
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-10">
              <Button href="#inquiries" hoverColor="lime-sorbet">
                Plan Your Event
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Right: Event-focused image composition (~50%) */}
        <FadeIn delay={0.2} className="lg:w-[50%] w-full">
          <div className="flex flex-col gap-3">
            {/* Large featured image */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src="/images/hero-mocktail.jpg"
                alt="Premium mocktail bar setup at a celebration event"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                preload
              />
            </div>

            {/* Four supporting images */}
            <div className="grid grid-cols-4 gap-3">
              {supportingImages.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
