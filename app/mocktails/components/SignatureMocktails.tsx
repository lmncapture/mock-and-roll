"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/app/components/ui/FadeIn";

const mocktails = [
  {
    name: "Garden Sparkler",
    description: "Fresh garden botanicals and sparkling citrus.",
    image: "/images/mr-garden-sparkler.jpg",
    accent: "bg-lime-sorbet/30",
    size: "featured",
  },
  {
    name: "Ginger Dragon",
    description: "Bold ginger, dragon fruit, and citrus.",
    image: "/images/mr-ginger-dragon.jpg",
    accent: "bg-lemon-zest/30",
    size: "standard",
  },
  {
    name: "Habiscus Tea Blossom",
    description: "Hibiscus, floral tea, and a sparkling finish.",
    image: "/images/mr-habiscus-tea-blossom.jpg",
    accent: "bg-berry-crush/25",
    size: "standard",
  },
  {
    name: "Pineapple Sunrise",
    description: "Pineapple, tropical fruit, and sunrise layers.",
    image: "/images/mr-pineapple-sunrise.jpg",
    accent: "bg-lime-sorbet/25",
    size: "standard",
  },
  {
    name: "Signature Mocktails",
    description: "Handcrafted for every celebration.",
    image: "/images/mr-signature-mocktails-horizontal.jpg",
    accent: "bg-peach-nectar/30",
    size: "wide",
  },
];

export default function SignatureMocktails() {
  return (
    <section className="bg-frosted-mint py-16 lg:py-32 px-6 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 lg:mb-20">
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.05] tracking-tight">
              Signature
              <br />
              Mocktails
            </h2>
            <p className="font-body text-slate/60 text-base lg:text-lg mt-6 lg:mt-0 max-w-xs leading-relaxed">
              Four curated creations, crafted to surprise and delight at every event.
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

          {/* Row 2: two equal cards */}
          {[2, 3].map((i, pos) => (
            <FadeIn key={mocktails[i].name} className="col-span-6" delay={0.08 + pos * 0.04}>
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
                    sizes="50vw"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-body font-semibold text-slate text-lg tracking-tight">{mocktails[i].name}</h3>
                  <p className="font-body text-slate/55 text-sm mt-0.5 tracking-wide">{mocktails[i].description}</p>
                </div>
              </motion.article>
            </FadeIn>
          ))}

          {/* Row 3: full-width signature horizontal */}
          <FadeIn className="col-span-12" delay={0.12}>
            <motion.article
              className="relative group cursor-pointer overflow-hidden rounded-[24px] aspect-[21/9]"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Image
                src={mocktails[4].image}
                alt="Mock & Roll signature mocktails — handcrafted for every celebration"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-7 z-10">
                <h3 className="font-body font-semibold text-cool-white text-xl tracking-tight">Mock &amp; Roll Signature Menu</h3>
                <p className="font-body text-cool-white/75 text-sm mt-0.5 tracking-wide">Handcrafted for every celebration.</p>
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
