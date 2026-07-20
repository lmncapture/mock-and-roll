"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/app/components/ui/FadeIn";

const mocktails = [
  {
    name: "Hibiscus Blossom",
    description: "hibiscus tea, raspberry puree, rose syrup and fresh lemon",
    image: "/images/mr-habiscus-tea-blossom.jpg",
    objectPosition: "center center",
  },
  {
    name: "Ginger Dragon",
    description: "dragonfruit syrup and ginger ale topped with fresh lime juice",
    image: "/images/mr-ginger-dragon.jpg",
    objectPosition: "center center",
  },
  {
    name: "Garden Sparkler",
    description: "Tart lemonade with sweet lavender and a sparkling finish",
    image: "/images/mr-garden-sparkler.jpg",
    objectPosition: "center center",
  },
  {
    name: "Pineapple Sunrise",
    description: "Pineapple juice and mango puree topped off with club soda",
    image: "/images/mr-pineapple-sunrise.jpg",
    objectPosition: "center center",
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
            <p className="font-body text-slate/75 text-base lg:text-lg mt-6 lg:mt-0 max-w-xs leading-relaxed">
              Four curated creations, crafted to surprise and delight at every event.
            </p>
          </div>
        </FadeIn>

        {/* Desktop: horizontal image above + uniform 2×2 grid */}
        <div className="hidden lg:flex lg:flex-col lg:gap-5">
          {/* Full-width horizontal image — above the drink grid */}
          <FadeIn>
            <div className="relative overflow-hidden rounded-[24px] w-full">
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

          {/* Row 1 */}
          <FadeIn delay={0.06}>
            <div className="grid grid-cols-2 gap-5">
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
                    style={{ objectPosition: drink.objectPosition }}
                    sizes="50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/10 to-transparent" />
                  {/* Text inside frame */}
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

          {/* Row 2 */}
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
                    style={{ objectPosition: drink.objectPosition }}
                    sizes="50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/10 to-transparent" />
                  {/* Text inside frame */}
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

        {/* Mobile: horizontal image first, then stacked drink cards */}
        <div className="lg:hidden flex flex-col gap-4">
          {/* Full-width horizontal image — above the drink cards */}
          <div className="relative overflow-hidden rounded-[20px] w-full">
            <Image
              src="/images/mr-signature-mocktails-horizontal.jpg"
              alt="Mock & Roll signature mocktails — handcrafted for every celebration"
              width={800}
              height={320}
              className="w-full h-auto rounded-[20px]"
              sizes="100vw"
            />
          </div>

          {mocktails.map((drink) => (
            <article
              key={drink.name}
              className="relative overflow-hidden rounded-[20px] aspect-[4/3] w-full"
            >
              <Image
                src={drink.image}
                alt={`${drink.name} — ${drink.description}`}
                fill
                className="object-cover"
                style={{ objectPosition: drink.objectPosition }}
                sizes="100vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate/60 via-slate/10 to-transparent" />
              {/* Text inside frame */}
              <div className="absolute bottom-5 left-5 z-10">
                <h3 className="font-body font-semibold text-cool-white text-lg tracking-tight leading-snug">
                  {drink.name}
                </h3>
                <p className="font-body text-cool-white/80 text-sm mt-0.5 tracking-wide">
                  {drink.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
