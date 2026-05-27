"use client";

import { motion } from "framer-motion";
import FadeIn from "@/app/components/ui/FadeIn";

interface Mocktail {
  name: string;
  description: string;
  imageBg: string;
}

const mocktails: Mocktail[] = [
  {
    name: "Citrus Bloom",
    description: "Yuzu · elderflower · sparkling citrus",
    imageBg: "bg-gradient-to-br from-lime-sorbet via-lime-sorbet/80 to-frosted-mint/60",
  },
  {
    name: "Golden Hour",
    description: "Turmeric · passionfruit · honeyed ginger",
    imageBg: "bg-gradient-to-br from-lemon-zest via-lemon-zest/70 to-peach-nectar/50",
  },
  {
    name: "Sunset Blush",
    description: "Blood orange · rose water · vanilla foam",
    imageBg: "bg-gradient-to-br from-peach-nectar via-pink-lychee/70 to-rose-petal/50",
  },
  {
    name: "Berry Fizz",
    description: "Muddled berries · lavender · prosecco bubbles",
    imageBg: "bg-gradient-to-br from-berry-crush/80 via-rose-petal/60 to-soft-plum/40",
  },
  {
    name: "Ocean Breeze",
    description: "Coconut · blue spirulina · lime zest",
    imageBg: "bg-gradient-to-br from-arctic-mist via-blueberry-dew/60 to-frosted-mint/40",
  },
];

export default function Mocktails() {
  return (
    <section className="bg-cool-white py-24 lg:py-36 px-6 lg:px-12 overflow-hidden">
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
          {/* Top row: featured (wide) + secondary (narrower), aligned baseline */}
          <FadeIn>
            <div className="grid grid-cols-12 gap-5 mb-5">
              {/* Featured — Citrus Bloom */}
              <motion.article
                className="col-span-7 relative group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className={`${mocktails[0].imageBg} rounded-[24px] aspect-[16/9] relative overflow-hidden`}>
                  <div className="absolute inset-3 rounded-[18px] border border-cool-white/15" />
                  {/* Glass silhouette suggestion */}
                  <div className="absolute bottom-8 right-12 w-16 h-24 rounded-full bg-cool-white/10 blur-sm" />
                  <div className="absolute top-10 left-12 w-10 h-10 rounded-full bg-cool-white/8" />
                </div>
                <div className="absolute bottom-6 left-7">
                  <h3 className="font-body font-semibold text-slate text-xl tracking-tight">
                    {mocktails[0].name}
                  </h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">
                    {mocktails[0].description}
                  </p>
                </div>
              </motion.article>

              {/* Secondary — Golden Hour */}
              <motion.article
                className="col-span-5 relative group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className={`${mocktails[1].imageBg} rounded-[24px] aspect-[16/9] relative overflow-hidden`}>
                  <div className="absolute inset-3 rounded-[18px] border border-cool-white/15" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-18 rounded-full bg-cool-white/10 blur-sm" />
                </div>
                <div className="absolute bottom-6 left-7">
                  <h3 className="font-body font-semibold text-slate text-xl tracking-tight">
                    {mocktails[1].name}
                  </h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">
                    {mocktails[1].description}
                  </p>
                </div>
              </motion.article>
            </div>
          </FadeIn>

          {/* Bottom row: three supporting drinks, equal rhythm */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-12 gap-5">
              {/* Sunset Blush */}
              <motion.article
                className="col-span-4 relative group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className={`${mocktails[2].imageBg} rounded-[24px] aspect-[4/3] relative overflow-hidden`}>
                  <div className="absolute inset-2.5 rounded-[18px] border border-cool-white/12" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-12 h-18 rounded-full bg-cool-white/10 blur-sm" />
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

              {/* Berry Fizz — slightly wider */}
              <motion.article
                className="col-span-5 relative group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className={`${mocktails[3].imageBg} rounded-[24px] aspect-[4/3] relative overflow-hidden`}>
                  <div className="absolute inset-2.5 rounded-[18px] border border-cool-white/12" />
                  <div className="absolute bottom-8 right-10 w-14 h-14 rounded-full bg-cool-white/10" />
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

              {/* Ocean Breeze — narrower */}
              <motion.article
                className="col-span-3 relative group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className={`${mocktails[4].imageBg} rounded-[24px] aspect-[4/3] relative overflow-hidden`}>
                  <div className="absolute inset-2.5 rounded-[18px] border border-cool-white/12" />
                  <div className="absolute top-8 right-6 w-8 h-12 rounded-full bg-cool-white/8 blur-sm" />
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
              <FadeIn key={drink.name} delay={index * 0.06}>
                <article
                  className={`
                    relative flex-shrink-0 snap-center
                    ${index === 0 ? "w-[72vw]" : "w-[62vw]"}
                  `}
                >
                  <div
                    className={`
                      ${drink.imageBg} rounded-[20px] relative overflow-hidden
                      ${index === 0 ? "aspect-[4/3]" : "aspect-[3/4]"}
                    `}
                  >
                    <div className="absolute inset-2 rounded-[16px] border border-cool-white/12" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-16 rounded-full bg-cool-white/10 blur-sm" />
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
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
