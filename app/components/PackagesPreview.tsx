"use client";

import Link from "next/link";
import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

const previewPackages = [
  {
    name: "Signature Experience",
    description: "Perfect for intimate gatherings, baby showers, and small celebrations up to 30 guests.",
    accent: "bg-lime-sorbet/40",
    badge: "Most Popular",
  },
  {
    name: "Celebration Experience",
    description: "A flexible per-guest option for larger gatherings that want a curated two-drink menu.",
    accent: "bg-peach-nectar/40",
    badge: null,
  },
  {
    name: "Premier Experience",
    description: "Three handcrafted mocktails and expanded variety for guests who want more.",
    accent: "bg-soft-plum/30",
    badge: null,
  },
  {
    name: "Reserve Experience",
    description: "Our most elevated offering — four handcrafted mocktails for weddings and premium events.",
    accent: "bg-arctic-mist/40",
    badge: null,
  },
];

export default function PackagesPreview() {
  return (
    <section className="bg-lemon-zest/30 py-24 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 lg:mb-20">
            <div>
              <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight max-w-xl">
                Mocktail Experiences for Every Celebration
              </h2>
              <p className="font-body text-slate/65 text-base lg:text-lg mt-6 max-w-lg leading-relaxed">
                From intimate gatherings to large-scale celebrations, we offer handcrafted mocktail experiences designed to fit your event.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 flex-shrink-0">
              <Button href="/packages" hoverColor="peach-nectar">
                View Packages
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Preview cards — editorial grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {previewPackages.map((pkg) => (
              <Link
                key={pkg.name}
                href="/packages"
                className={`
                  ${pkg.accent} rounded-3xl p-8 lg:p-9 flex flex-col gap-4
                  transition-transform duration-500 ease-out hover:-translate-y-1
                  group cursor-pointer
                `}
              >
                {/* Badge */}
                <div className="min-h-[24px]">
                  {pkg.badge && (
                    <span className="font-body text-xs font-semibold text-slate/70 tracking-widest uppercase">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-display text-slate text-2xl lg:text-3xl leading-[1.2] tracking-tight">
                  {pkg.name}
                </h3>

                {/* Description */}
                <p className="font-body text-slate/65 text-sm leading-relaxed">
                  {pkg.description}
                </p>

                {/* Arrow CTA */}
                <div className="mt-auto pt-4">
                  <span className="font-body text-sm font-medium text-slate/60 group-hover:text-slate transition-colors duration-200">
                    See details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
