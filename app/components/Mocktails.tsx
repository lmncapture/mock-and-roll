"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/app/components/ui/FadeIn";

interface Mocktail {
  name: string;
  description: string;
  image: string;
  accent: string;
}

const mocktails: Mocktail[] = [
  {
    name: "Hibiscus Tea Blossom",
    description: "Hibiscus · floral tea · sparkling finish",
    image: "/images/mr-habiscus-tea-blossom.jpg",
    accent: "bg-peach-nectar/20",
  },
  {
    name: "Ginger Dragon",
    description: "Bold ginger · dragon fruit · citrus",
    image: "/images/mr-ginger-dragon.jpg",
    accent: "bg-lemon-zest/20",
  },
  {
    name: "Garden Sparkler",
    description: "Fresh garden botanicals · sparkling citrus",
    image: "/images/mr-garden-sparkler.jpg",
    accent: "bg-lime-sorbet/20",
  },
  {
    name: "Pineapple Sunrise",
    description: "Pineapple · tropical fruit · sunrise layers",
    image: "/images/mr-pineapple-sunrise.jpg",
    accent: "bg-berry-crush/15",
  },
];

export default function Mocktails() {
  return (
    <section className="bg-frosted-mint py-12 lg:py-20 px-6 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-8 lg:mb-12">
            <h2 className="font-display text-slate text-4xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight">
              Signature Mocktails
            </h2>
          </div>
        </FadeIn>

        {/* Desktop: Structured editorial grid */}
        <div className="hidden lg:block">
          {/* Full-width horizontal image above the drink grid */}
          <FadeIn>
            <div className="mb-5">
              <Image
                src="/images/mr-signature-mocktails-horizontal.jpg"
                alt="Mock & Roll signature mocktails — handcrafted for every celebration"
                width={1400}
                height={560}
                className="w-full h-auto rounded-[24px]"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
          </FadeIn>

          {/* Top row: two equal cards */}
          <FadeIn delay={0.06}>
            <div className="grid grid-cols-2 gap-5 mb-5">
              {mocktails.slice(0, 2).map((drink) => (
                <motion.article
                  key={drink.name}
                  className="relative group cursor-pointer overflow-hidden rounded-[24px] aspect-[4/3]"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={drink.image}
                    alt={`${drink.name} — ${drink.description}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/10 to-transparent" />
                  <div className="absolute bottom-6 left-7 z-10">
                    <h3 className="font-body font-semibold text-cool-white text-xl tracking-tight leading-snug">
                      {drink.name}
                    </h3>
                    <p className="font-body text-cool-white/80 text-sm mt-1 tracking-wide">
                      {drink.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </FadeIn>

          {/* Bottom row: two equal cards */}
          <FadeIn delay={0.12}>
            <div className="grid grid-cols-2 gap-5">
              {mocktails.slice(2, 4).map((drink) => (
                <motion.article
                  key={drink.name}
                  className="relative group cursor-pointer overflow-hidden rounded-[24px] aspect-[4/3]"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={drink.image}
                    alt={`${drink.name} — ${drink.description}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/10 to-transparent" />
                  <div className="absolute bottom-6 left-7 z-10">
                    <h3 className="font-body font-semibold text-cool-white text-xl tracking-tight leading-snug">
                      {drink.name}
                    </h3>
                    <p className="font-body text-cool-white/80 text-sm mt-1 tracking-wide">
                      {drink.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Mobile: horizontal image first, then scroll cards */}
        <div className="lg:hidden">
          {/* Full-width horizontal image above the cards */}
          <FadeIn>
            <div className="mb-4">
              <Image
                src="/images/mr-signature-mocktails-horizontal.jpg"
                alt="Mock & Roll signature mocktails — handcrafted for every celebration"
                width={800}
                height={320}
                className="w-full h-auto rounded-[20px]"
                sizes="100vw"
              />
            </div>
          </FadeIn>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide">
            {mocktails.map((drink) => (
              <article
                key={drink.name}
                className="relative flex-shrink-0 snap-center w-[72vw]"
              >
                <div className="relative rounded-[20px] overflow-hidden aspect-[4/3]">
                  <Image
                    src={drink.image}
                    alt={`${drink.name} — ${drink.description}`}
                    fill
                    className="object-cover"
                    sizes="75vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 z-10">
                    <h3 className="font-body font-semibold text-cool-white text-lg tracking-tight leading-snug">
                      {drink.name}
                    </h3>
                    <p className="font-body text-cool-white/80 text-sm mt-0.5 tracking-wide">
                      {drink.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
