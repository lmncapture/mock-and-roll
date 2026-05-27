"use client";

import Image from "next/image";
import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

interface EventType {
  name: string;
  description: string;
  image: string;
}

const events: EventType[] = [
  {
    name: "Bridal Showers",
    description:
      "Elegant celebrations for the bride-to-be, with custom mocktail menus and intimate styling.",
    image: "/images/events-bridal.jpg",
  },
  {
    name: "Birthdays",
    description:
      "Mark milestones in style with curated drinks, ambient lighting, and personalized touches.",
    image: "/images/events-celebration.jpg",
  },
  {
    name: "Private Events",
    description:
      "Reserve the space for your exclusive gathering, tailored to your vision.",
    image: "/images/events-gathering.jpg",
  },
  {
    name: "Networking",
    description:
      "Sophisticated settings for meaningful connections over refined beverages.",
    image: "/images/events-networking.jpg",
  },
  {
    name: "Community Gatherings",
    description:
      "Bring people together in a warm, welcoming atmosphere designed for connection.",
    image: "/images/events-community.jpg",
  },
];

export default function Events() {
  return (
    <FadeIn as="section" className="bg-rose-petal py-24 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.15] tracking-tight mb-14 lg:mb-20">
          Private Events &amp; Celebrations
        </h2>

        {/* Event Items — alternating image/text layout */}
        <div className="flex flex-col gap-16 lg:gap-20">
          {events.map((event, index) => {
            const isImageLeft = index % 2 === 0;

            return (
              <div
                key={event.name}
                className={`flex flex-col ${
                  isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-8 lg:gap-14`}
              >
                {/* Curved event image */}
                <div className="relative rounded-2xl overflow-hidden w-full lg:w-[48%] aspect-[4/3] flex-shrink-0">
                  <Image
                    src={event.image}
                    alt={`${event.name} at Mock & Roll`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 48vw"
                  />
                </div>

                {/* Descriptive text */}
                <div className="flex flex-col justify-center lg:w-[52%]">
                  <h3 className="font-body font-semibold text-slate text-xl lg:text-2xl">
                    {event.name}
                  </h3>
                  <p className="font-body text-slate/70 text-base lg:text-lg leading-relaxed mt-3 max-w-md">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-16 lg:mt-20 text-center">
          <Button href="#reservations" hoverColor="berry-crush">
            Inquire About Events
          </Button>
        </div>
      </div>
    </FadeIn>
  );
}
