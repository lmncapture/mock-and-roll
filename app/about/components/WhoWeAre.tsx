import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";

export default function WhoWeAre() {
  return (
    <section className="bg-cool-white py-24 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: copy */}
        <div className="lg:w-[50%]">
          <FadeIn>
            <p className="font-body text-slate/50 text-sm font-medium tracking-widest uppercase mb-5">
              01 — Who We Are
            </p>
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight mb-8">
              Who We Are
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-body text-slate/75 text-lg leading-relaxed mb-6">
              Mock &amp; Roll is a premium mobile mocktail bar created to bring beautiful, alcohol-free drinks to celebrations of every kind.
            </p>
            <p className="font-body text-slate/65 text-lg leading-relaxed">
              We serve handcrafted mocktails with thoughtful ingredients, polished presentation, and warm hospitality — giving guests all of the buzz, none of the booze.
            </p>
          </FadeIn>
        </div>

        {/* Right: image */}
        <FadeIn delay={0.15} className="lg:w-[50%] w-full">
          <div className="relative aspect-[4/3] rounded-[28px] overflow-hidden">
            <Image
              src="/images/atmosphere-drinks.jpg"
              alt="Mock & Roll premium mocktail service"
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
