import FadeIn from "@/app/components/ui/FadeIn";

export default function OurMission() {
  return (
    <section className="bg-blueberry-dew py-20 lg:py-36 px-6 lg:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <FadeIn>
          <p className="font-body text-slate/50 text-sm font-medium tracking-widest uppercase mb-6">
            03 — Our Mission
          </p>
          <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight mb-10">
            Our Mission
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="font-body text-slate/75 text-xl lg:text-2xl leading-relaxed mb-6 max-w-3xl mx-auto">
            Our mission is to make alcohol-free hospitality feel elevated, inclusive, and unforgettable.
          </p>
          <p className="font-body text-slate/60 text-lg leading-relaxed max-w-2xl mx-auto">
            We create mocktail experiences that help people gather, connect, celebrate, and feel cared for — one handcrafted drink at a time.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
