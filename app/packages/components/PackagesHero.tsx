import FadeIn from "@/app/components/ui/FadeIn";

export default function PackagesHero() {
  return (
    <section className="relative bg-cool-white pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 overflow-hidden">
      {/* Soft background shapes */}
      <div
        className="absolute top-20 right-[-8%] w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] rounded-full bg-blueberry-dew/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-[-5%] w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full bg-lime-sorbet/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeIn>
          {/* Eyebrow */}
          <p className="font-body text-slate/50 text-sm font-medium tracking-widest uppercase mb-6">
            Mock &amp; Roll — Packages
          </p>

          {/* Headline */}
          <h1 className="font-display text-slate text-[clamp(40px,7vw,88px)] leading-[1.05] tracking-tight max-w-4xl">
            Mocktail Experiences for Every Celebration
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="font-body text-slate/70 text-lg lg:text-xl leading-relaxed mt-8 max-w-2xl">
            Every Mock &amp; Roll package includes unlimited mocktails during your event,
            professional service, premium garnishes, setup, and cleanup.
            We come to you — any venue, any occasion.
          </p>
        </FadeIn>

        {/* Included callouts */}
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap gap-3 mt-10">
            {[
              "Unlimited mocktails",
              "Professional service",
              "Premium garnishes",
              "Setup & cleanup",
              "We come to you",
            ].map((item) => (
              <span
                key={item}
                className="font-body text-sm font-medium text-slate bg-frosted-mint/60 rounded-pill px-4 py-2"
              >
                {item}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
