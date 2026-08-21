import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";

export default function PackagesGallery() {
  return (
    <section className="bg-cool-white py-16 lg:py-24 px-6 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p aria-hidden="true" className="font-body text-slate/75 text-sm font-medium tracking-widest uppercase mb-6">
            The Experience
          </p>
          <h2 className="font-display text-slate text-3xl lg:text-4xl leading-[1.1] tracking-tight mb-12 lg:mb-16 max-w-lg">
            Moments Worth Celebrating
          </h2>
        </FadeIn>

        {/* Desktop: asymmetric editorial layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-start">
          <FadeIn delay={0.05} className="col-span-7">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/images/mr-signature-mocktails-horizontal.jpg"
                alt="Signature mocktails displayed on a professional bar setup"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="col-span-5 flex flex-col gap-5">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
              <Image
                src="/images/mr-moments-1.jpg"
                alt="Guests enjoying a celebration with mocktails"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15} className="col-span-5">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="/images/events/wedding-event.jpg"
                alt="Mock & Roll bar setup at a wedding celebration"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.2} className="col-span-7">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden">
              <Image
                src="/images/mr-pineapple-sunrise.jpg"
                alt="Colorful Pineapple Sunrise mocktail with fresh garnishes"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>

        {/* Mobile: stacked single column */}
        <div className="lg:hidden flex flex-col gap-4">
          <FadeIn delay={0.05}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/mr-signature-mocktails-horizontal.jpg"
                alt="Signature mocktails displayed on a professional bar setup"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/mr-moments-1.jpg"
                alt="Guests enjoying a celebration with mocktails"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/events/wedding-event.jpg"
                alt="Mock & Roll bar setup at a wedding celebration"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
