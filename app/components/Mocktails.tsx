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
    name: "Citrus Bloom",
    description: "Yuzu · elderflower · sparkling citrus",
    image: "/images/signature-drink-01.jpg",
    accent: "bg-lime-sorbet/20",
  },
  {
    name: "Golden Hour",
    description: "Turmeric · passionfruit · honeyed ginger",
    image: "/images/signature-drink-02.jpg",
    accent: "bg-lemon-zest/20",
  },
  {
    name: "Sunset Blush",
    description: "Blood orange · rose water · vanilla foam",
    image: "/images/signature-drink-03.jpg",
    accent: "bg-peach-nectar/20",
  },
  {
    name: "Berry Fizz",
    description: "Muddled berries · lavender · prosecco bubbles",
    image: "/images/signature-drink-04.jpg",
    accent: "bg-berry-crush/15",
  },
  {
    name: "Ocean Breeze",
    description: "Coconut · blue spirulina · lime zest",
    image: "/images/signature-drink-05.jpg",
    accent: "bg-arctic-mist/20",
  },
];

export default function Mocktails() {
  return (
    <section className="bg-frosted-mint py-16 lg:py-36 px-6 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 lg:mb-20">
            <h2 className="font-display text-slate text-4xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight">
              Signature
              <br />
              Mocktails
            </h2>
            <p className="font-body text-slate/60 text-base lg:text-lg mt-6 lg:mt-0 max-w-xs leading-relaxed">
              Five curated creations, each crafted to surprise and delight.
            </p>
          </div>
        </FadeIn>

        {/* Desktop: Structured editorial grid */}
        <div className="hidden lg:block">
          {/* Top row: featured (wide) + secondary (narrower) */}
          <FadeIn>
            <div className="grid grid-cols-12 gap-5 mb-5">
              {/* Featured — Citrus Bloom */}
              <motion.article
                className="col-span-7 relative group cursor-pointer overflow-hidden rounded-[24px]"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[24px]">
                  <Image
                    src={mocktails[0].image}
                    alt={`${mocktails[0].name} — ${mocktails[0].description}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                  {/* Gradient overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/50 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-6 left-7 z-10">
                  <h3 className="font-body font-semibold text-cool-white text-xl tracking-tight">
                    {mocktails[0].name}
                  </h3>
                  <p className="font-body text-cool-white/80 text-sm mt-0.5 tracking-wide">
                    {mocktails[0].description}
                  </p>
                </div>
              </motion.article>

              {/* Secondary — Golden Hour */}
              <motion.article
                className="col-span-5 relative group cursor-pointer overflow-hidden rounded-[24px]"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[24px]">
                  <Image
                    src={mocktails[1].image}
                    alt={`${mocktails[1].name} — ${mocktails[1].description}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/50 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-6 left-7 z-10">
                  <h3 className="font-body font-semibold text-cool-white text-xl tracking-tight">
                    {mocktails[1].name}
                  </h3>
                  <p className="font-body text-cool-white/80 text-sm mt-0.5 tracking-wide">
                    {mocktails[1].description}
                  </p>
                </div>
              </motion.article>
            </div>
          </FadeIn>

          {/* Bottom row: three supporting drinks */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-12 gap-5">
              {/* Sunset Blush */}
              <motion.article
                className="col-span-4 relative group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Image
                    src={mocktails[2].image}
                    alt={`${mocktails[2].name} — ${mocktails[2].description}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-body font-semibold text-slate text-lg tracking-tight">
                    {mocktails[2].name}
                  </h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">
                    {mocktails[2].description}
                  </p>
                </div>
              </motion.article>

              {/* Berry Fizz */}
              <motion.article
                className="col-span-5 relative group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Image
                    src={mocktails[3].image}
                    alt={`${mocktails[3].name} — ${mocktails[3].description}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-body font-semibold text-slate text-lg tracking-tight">
                    {mocktails[3].name}
                  </h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">
                    {mocktails[3].description}
                  </p>
                </div>
              </motion.article>

              {/* Ocean Breeze */}
              <motion.article
                className="col-span-3 relative group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Image
                    src={mocktails[4].image}
                    alt={`${mocktails[4].name} — ${mocktails[4].description}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-body font-semibold text-slate text-lg tracking-tight">
                    {mocktails[4].name}
                  </h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">
                    {mocktails[4].description}
                  </p>
                </div>
              </motion.article>
            </div>
          </FadeIn>
        </div>

        {/* Mobile: Immersive horizontal scroll */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide">
            {mocktails.map((drink, index) => (
              <article
                key={drink.name}
                className={`
                  relative flex-shrink-0 snap-center
                  ${index === 0 ? "w-[72vw]" : "w-[62vw]"}
                `}
              >
                <div
                  className={`
                    relative rounded-[20px] overflow-hidden
                    ${index === 0 ? "aspect-[4/3]" : "aspect-[3/4]"}
                  `}
                >
                  <Image
                    src={drink.image}
                    alt={`${drink.name} — ${drink.description}`}
                    fill
                    className="object-cover"
                    sizes="75vw"
                  />
                </div>
                <div className="mt-3.5 px-0.5">
                  <h3 className="font-body font-semibold text-slate text-lg tracking-tight">
                    {drink.name}
                  </h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">
                    {drink.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
