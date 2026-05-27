"use client";

import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

export default function ReservationCTA() {
  return (
    <section className="bg-frosted-mint py-28 lg:py-40 px-6 lg:px-12">
      <FadeIn className="mx-auto max-w-4xl flex flex-col items-center text-center gap-10">
        <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-slate leading-[1.15]">
          Join us for mocktails worth remembering.
        </h2>

        <Button href="#reservations" hoverColor="arctic-mist">
          Reserve Your Spot
        </Button>
      </FadeIn>
    </section>
  );
}
