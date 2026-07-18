import Image from "next/image";
import Button from "@/app/components/ui/Button";
import FadeIn from "@/app/components/ui/FadeIn";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cool-white pt-24 pb-12 lg:pt-28 lg:pb-20 px-6 lg:px-12">
      {/* Soft pastel abstract background shapes */}
      <div
        className="absolute top-16 left-[-5%] w-[260px] h-[260px] lg:w-[500px] lg:h-[500px] rounded-full bg-lime-sorbet/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[220px] h-[220px] lg:w-[450px] lg:h-[450px] rounded-full bg-peach-nectar/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-[40%] right-[20%] w-[160px] h-[160px] lg:w-[300px] lg:h-[300px] rounded-full bg-rose-petal/30 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left: Typography content — single cohesive stack */}
        <div className="flex flex-col lg:w-[50%]">
          <FadeIn delay={0}>
            <h1 className="font-display text-slate text-[clamp(40px,8vw,72px)] leading-[1.08] tracking-tight">
              Crafted mocktails.
              <br />
              Unforgettable moments.
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-body text-slate/80 text-base lg:text-xl leading-relaxed mt-6 max-w-md font-medium">
              All of the buzz, none of the booze.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="font-body text-slate/75 text-sm lg:text-base leading-relaxed mt-3 max-w-md">
              Premium mobile mocktail bar for weddings, birthdays, corporate events, and every celebration worth remembering.
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-8">
              <Button href="mailto:lauren@mocknrollbar.com" hoverColor="lime-sorbet">
                Book Mock &amp; Roll
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Right: Single immersive hero image */}
        <FadeIn delay={0.2} className="lg:w-[50%] w-full">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/images/mr-hero.jpg"
              alt="Mock & Roll premium mocktail bar at a celebration event"
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
