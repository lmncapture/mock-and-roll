"use client";

import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

const events = [
  {
    name: "Weddings",
    image: "/images/events-bridal.jpg",
  },
  {
    name: "Birthdays",
    image: "/images/events-celebration.jpg",
  },
  {
    name: "Baby Showers",
    image: "/images/events-gathering.jpg",
  },
  {
    name: "Corporate",
    image: "/images/events-networking.jpg",
  },
  {
    name: "Private Parties",
    image: "/images/events-community.jpg",
  },
];

export default function Events() {
  return (
    <section id="packages" className="bg-peach-nectar py-20 lg:py-24 px-6 lg:px-12">
      <FadeIn>
      <div className="mx-auto max-w-7xl">
        {/* Compact header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 lg:mb-12">
          <h2 className="font-display text-slate text-3xl lg:text-4xl xl:text-5xl leading-[1.15] tracking-tight">
            Private Events &amp; Celebrations
          </h2>
          <p className="font-body text-slate/65 text-base mt-4 lg:mt-0 max-w-xs leading-relaxed">
            We come to you. Any venue, any occasion.
          </p>
        </div>

        {/* Compact event type icons — horizontal scroll on mobile, flex on desktop */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:overflow-visible lg:grid lg:grid-cols-5 scrollbar-hide mb-10 lg:mb-12">
          {events.map((event) => (
            <div
              key={event.name}
              className="flex-shrink-0 snap-center w-[42vw] lg:w-auto flex flex-col gap-3"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 42vw, 20vw"
                />
              </div>
              <p className="font-body font-medium text-slate text-sm tracking-wide">
                {event.name}
              </p>
            </div>
          ))}
        </div>

        {/* Single CTA */}
        <div className="flex justify-start">
          <Button href="#book" hoverColor="berry-crush">
            Book Mock &amp; Roll
          </Button>
        </div>
      </div>
      </FadeIn>
    </section>
  );
}
