"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/app/components/ui/FadeIn";

const mocktails = [
  {
    name: "Citrus Bloom",
    description: "Yuzu, elderflower, and sparkling citrus.",
    image: "/images/signature-drink-01.jpg",
    accent: "bg-lime-sorbet/30",
    size: "featured", // col-span-2
  },
  {
    name: "Golden Hour",
    description: "Turmeric, passionfruit, and honeyed ginger.",
    image: "/images/signature-drink-02.jpg",
    accent: "bg-lemon-zest/30",
    size: "standard",
  },
  {
    name: "Berry Crush",
    description: "Muddled berries, lavender, and prosecco-style bubbles.",
    image: "/images/signature-drink-03.jpg",
    accent: "bg-berry-crush/25",
    size: "standard",
  },
  {
    name: "Lime Sorbet",
    description: "Lime, cucumber, mint, and soda.",
    image: "/images/signature-drink-04.jpg",
    accent: "bg-lime-sorbet/25",
    size: "standard",
  },
  {
    name: "Peach Glow",
    description: "Peach, jasmine, and white tea.",
    image: "/images/signature-drink-05.jpg",
    accent: "bg-peach-nectar/30",
    size: "standard",
  },
  {
    name: "Rose Spritz",
    description: "Rose, lychee, lemon, and bubbles.",
    image: "/images/atmosphere-drinks.jpg",
    accent: "bg-rose-petal/40",
    size: "wide", // col-span-2
  },
  {
    name: "Arctic Mist",
    description: "Mint, lime, cucumber, and sparkling water.",
    image: "/images/atmosphere-detail.jpg",
    accent: "bg-arctic-mist/30",
    size: "standard",
  },
  {
    name: "Soft Plum",
    description: "Plum, lavender, vanilla, and citrus.",
    image: "/images/atmosphere-lifestyle.jpg",
    accent: "bg-soft-plum/30",
    size: "standard",
  },
];

export default function SignatureMocktails() {
  return (
    <section className="bg-frosted-mint py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 lg:mb-20">
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.05] tracking-tight">
              Signature
              <br />
              Mocktails
            </h2>
            <p className="font-body text-slate/60 text-base lg:text-lg mt-6 lg:mt-0 max-w-xs leading-relaxed">
              Eight curated creations, crafted to surprise and delight at every event.
            </p>
          </div>
        </FadeIn>

        {/* Desktop editorial grid */}
        <div className="hidden lg:grid grid-cols-12 gap-5">
          {/* Row 1: featured (col-7) + standard (col-5) */}
          <FadeIn className="col-span-7">
            <motion.article
              className="relative group cursor-pointer overflow-hidden rounded-[24px] aspect-[16/9]"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src={mocktails[0].image}
                alt={`${mocktails[0].name} — ${mocktails[0].description}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-7 z-10">
                <h3 className="font-body font-semibold text-cool-white text-xl tracking-tight">{mocktails[0].name}</h3>
                <p className="font-body text-cool-white/75 text-sm mt-0.5 tracking-wide">{mocktails[0].description}</p>
              </div>
            </motion.article>
          </FadeIn>

          <FadeIn className="col-span-5" delay={0.05}>
            <motion.article
              className="relative group cursor-pointer overflow-hidden rounded-[24px] aspect-[16/9]"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src={mocktails[1].image}
                alt={`${mocktails[1].name} — ${mocktails[1].description}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-7 z-10">
                <h3 className="font-body font-semibold text-cool-white text-xl tracking-tight">{mocktails[1].name}</h3>
                <p className="font-body text-cool-white/75 text-sm mt-0.5 tracking-wide">{mocktails[1].description}</p>
              </div>
            </motion.article>
          </FadeIn>

          {/* Row 2: three equal cards */}
          {[2, 3, 4].map((i, pos) => (
            <FadeIn key={mocktails[i].name} className="col-span-4" delay={0.08 + pos * 0.04}>
              <motion.article
                className="group cursor-pointer"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="relative overflow-hidden rounded-[24px] aspect-[4/3]">
                  <Image
                    src={mocktails[i].image}
                    alt={`${mocktails[i].name} — ${mocktails[i].description}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="33vw"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-body font-semibold text-slate text-lg tracking-tight">{mocktails[i].name}</h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">{mocktails[i].description}</p>
                </div>
              </motion.article>
            </FadeIn>
          ))}

          {/* Row 3: wide (col-8) + standard (col-4) */}
          <FadeIn className="col-span-8" delay={0.12}>
            <motion.article
              className="relative group cursor-pointer overflow-hidden rounded-[24px] aspect-[16/9]"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src={mocktails[5].image}
                alt={`${mocktails[5].name} — ${mocktails[5].description}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-7 z-10">
                <h3 className="font-body font-semibold text-cool-white text-xl tracking-tight">{mocktails[5].name}</h3>
                <p className="font-body text-cool-white/75 text-sm mt-0.5 tracking-wide">{mocktails[5].description}</p>
              </div>
            </motion.article>
          </FadeIn>

          <FadeIn className="col-span-4" delay={0.15}>
            <motion.article
              className="group cursor-pointer"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="relative overflow-hidden rounded-[24px] aspect-[4/3]">
                <Image
                  src={mocktails[6].image}
                  alt={`${mocktails[6].name} — ${mocktails[6].description}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="33vw"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-body font-semibold text-slate text-lg tracking-tight">{mocktails[6].name}</h3>
                <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">{mocktails[6].description}</p>
              </div>
            </motion.article>
          </FadeIn>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide">
            {mocktails.map((drink, index) => (
              <article
                key={drink.name}
                className={`relative flex-shrink-0 snap-center ${index === 0 ? "w-[74vw]" : "w-[62vw]"}`}
              >
                <div className={`relative rounded-[20px] overflow-hidden ${index === 0 ? "aspect-[4/3]" : "aspect-[3/4]"}`}>
                  <Image
                    src={drink.image}
                    alt={`${drink.name} — ${drink.description}`}
                    fill
                    className="object-cover"
                    sizes="75vw"
                  />
                </div>
                <div className="mt-3.5 px-0.5">
                  <h3 className="font-body font-semibold text-slate text-lg tracking-tight">{drink.name}</h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">{drink.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
