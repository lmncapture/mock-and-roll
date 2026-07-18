import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";

export default function WhyWeStarted() {
  return (
    <section className="bg-frosted-mint py-16 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
        {/* Right (visually left due to reverse): copy */}
        <div className="lg:w-[50%]">
          <FadeIn>
            <p className="font-body text-slate/50 text-sm font-medium tracking-widest uppercase mb-5">
              02 — Why We Started
            </p>
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight mb-8">
              Why We Started
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-body text-slate/75 text-lg leading-relaxed mb-6">
              We started Mock &amp; Roll because celebrations deserve drinks that feel just as special — without requiring alcohol.
            </p>
            <p className="font-body text-slate/75 text-lg leading-relaxed">
              Whether guests are sober, expecting, driving, working, celebrating with family, or simply choosing not to drink, they still deserve something crafted, beautiful, and memorable in their glass.
            </p>
          </FadeIn>
        </div>

        {/* Left (visually): image */}
        <FadeIn delay={0.15} className="lg:w-[50%] w-full">
          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden">
            <Image
              src="/images/mr-moments-1.jpg"
              alt="Guests celebrating with Mock & Roll mocktails"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
