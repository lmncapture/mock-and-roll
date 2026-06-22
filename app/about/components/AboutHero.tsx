import FadeIn from "@/app/components/ui/FadeIn";

export default function AboutHero() {
  return (
    <section className="relative bg-cool-white pt-40 pb-20 lg:pb-28 px-6 lg:px-12 overflow-hidden">
      {/* Background shapes */}
      <div
        className="absolute top-16 right-[-6%] w-[350px] h-[350px] lg:w-[550px] lg:h-[550px] rounded-full bg-rose-petal/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-[-4%] w-[280px] h-[280px] lg:w-[420px] lg:h-[420px] rounded-full bg-lime-sorbet/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeIn>
          <p className="font-body text-slate/50 text-sm font-medium tracking-widest uppercase mb-6">
            Mock &amp; Roll — Our Story
          </p>
          <h1 className="font-display text-slate text-[clamp(44px,7vw,96px)] leading-[1.0] tracking-tight max-w-3xl">
            All of the buzz, none of the booze.
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="font-body text-slate/65 text-lg lg:text-xl leading-relaxed mt-8 max-w-xl">
            We&apos;re a premium mobile mocktail bar creating beautiful, alcohol-free experiences for celebrations of every kind.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
