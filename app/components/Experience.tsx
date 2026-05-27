"use client";

import Button from "@/app/components/ui/Button";
import FadeIn from "@/app/components/ui/FadeIn";
import CurvedImage from "@/app/components/ui/CurvedImage";

export default function Experience() {
  return (
    <section className="relative overflow-hidden bg-cool-white py-24 lg:py-32 px-6 lg:px-12">
      {/* Subtle frosted-mint accent background */}
      <div
        className="absolute top-0 right-0 w-[40%] h-full bg-frosted-mint/20 rounded-l-[60px]"
        aria-hidden="true"
      />

      {/* Botanical illustration accents */}
      <svg
        className="absolute top-12 left-8 w-16 h-24 text-frosted-mint/40"
        viewBox="0 0 64 96"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M32 96V48M32 48C32 48 16 40 12 24C8 8 24 4 32 16M32 48C32 48 48 40 52 24C56 8 40 4 32 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="20" r="3" fill="currentColor" opacity="0.3" />
        <circle cx="52" cy="20" r="3" fill="currentColor" opacity="0.3" />
      </svg>

      <svg
        className="absolute bottom-16 right-16 w-12 h-20 text-frosted-mint/30"
        viewBox="0 0 48 80"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 80V40M24 40C24 40 10 34 8 20C6 6 18 2 24 12M24 40C24 40 38 34 40 20C42 6 30 2 24 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <svg
        className="absolute top-[60%] left-[5%] w-10 h-14 text-lime-sorbet/30"
        viewBox="0 0 40 56"
        fill="none"
        aria-hidden="true"
      >
        <ellipse cx="20" cy="20" rx="12" ry="18" stroke="currentColor" strokeWidth="1" />
        <path d="M20 38V56" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>

      {/* Editorial split layout */}
      <div className="relative z-10 mx-auto max-w-7xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        {/* Left: Typography content (~50%) */}
        <div className="flex flex-col justify-center lg:w-[50%] lg:pt-8">
          <FadeIn delay={0}>
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.15] tracking-tight">
              The Experience
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-body text-slate/80 text-lg leading-relaxed mt-8 max-w-md">
              Every detail at Mock &amp; Roll is intentional — from the soft glow of ambient
              lighting to the curated playlist that sets the mood. We created a space where
              slowing down feels natural and every sip is a moment worth savoring.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="font-body text-slate/70 text-lg leading-relaxed mt-5 max-w-md">
              No alcohol, no compromise. Just refined flavors, thoughtful design, and an
              atmosphere that invites you to stay a little longer.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-10">
              <Button href="#atmosphere" hoverColor="frosted-mint">
                Explore Our Space
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* Right: Large arch image (~50%) */}
        <FadeIn delay={0.25} className="lg:w-[50%] w-full">
          <CurvedImage
            src="/images/interior-arch.jpg"
            alt="Mock and Roll boutique interior with warm ambient lighting"
            width={640}
            height={800}
            variant="arch"
            className="w-full min-h-[400px] lg:min-h-[520px] bg-peach-nectar/30"
          />
        </FadeIn>
      </div>
    </section>
  );
}
