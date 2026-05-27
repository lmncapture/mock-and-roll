"use client";

import Button from "@/app/components/ui/Button";
import FadeIn from "@/app/components/ui/FadeIn";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-cool-white pt-32 pb-20 lg:pb-28 px-6 lg:px-12">
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
      <div
        className="absolute bottom-[20%] left-[10%] w-[150px] h-[150px] lg:w-[220px] lg:h-[220px] rounded-full bg-arctic-mist/30 blur-2xl"
        aria-hidden="true"
      />

      {/* Editorial split layout: typography left, image right */}
      <div className="relative z-10 mx-auto max-w-7xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        {/* Left: Typography content (~55%) */}
        <div className="flex flex-col justify-center lg:w-[55%] lg:pt-12">
          <FadeIn delay={0}>
            <h1 className="font-display text-slate text-[clamp(36px,8vw,80px)] lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight">
              Crafted mocktails.
              <br />
              Unforgettable moments.
            </h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-body text-slate/80 text-lg lg:text-xl leading-relaxed mt-8 max-w-lg">
              An elevated alcohol-free experience designed for connection,
              celebration, and feel-good nights.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-10">
              <Button href="#cocktails" hoverColor="lime-sorbet">
                View Menu
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Right: Hero drink photography placeholder (~45%) */}
        <FadeIn delay={0.3} className="lg:w-[45%] w-full">
          <div className="relative w-full min-h-[400px] lg:min-h-[520px] rounded-3xl overflow-hidden bg-gradient-to-br from-frosted-mint via-frosted-mint/80 to-arctic-mist/60">
            {/* Decorative inner shapes to make the placeholder feel premium */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full bg-cool-white/30 blur-xl" />
            </div>
            <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-lime-sorbet/40" />
            <div className="absolute top-12 right-12 w-16 h-16 rounded-full bg-peach-nectar/50" />
            {/* Placeholder label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-body text-slate/30 text-sm tracking-widest uppercase">
                Hero Photography
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
