"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/app/components/ui/FadeIn";

const portfolioImages = [
  {
    src: "/images/events-bridal.jpg",
    alt: "Intimate bridal shower with custom mocktail menu",
    size: "large", // col-span-2
  },
  {
    src: "/images/events-celebration.jpg",
    alt: "Birthday celebration with curated drink experience",
    size: "small",
  },
  {
    src: "/images/atmosphere-detail.jpg",
    alt: "Signature garnish and glassware detail",
    size: "small",
  },
  {
    src: "/images/events-networking.jpg",
    alt: "Corporate networking event with premium mocktail bar",
    size: "small",
  },
  {
    src: "/images/atmosphere-lifestyle.jpg",
    alt: "Guests enjoying a private event setup",
    size: "large",
  },
  {
    src: "/images/events-gathering.jpg",
    alt: "Elegant private gathering with styled tablescape",
    size: "small",
  },
  {
    src: "/images/atmosphere-seating.jpg",
    alt: "Beautifully styled event seating and table detail",
    size: "small",
  },
  {
    src: "/images/events-community.jpg",
    alt: "Community celebration with signature drinks",
    size: "small",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-cool-white py-24 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 lg:mb-20">
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight max-w-lg">
              Moments Worth
              <br />
              Celebrating
            </h2>
            <p className="font-body text-slate/60 text-base lg:text-lg mt-6 lg:mt-0 max-w-sm leading-relaxed">
              A look at some of our favorite events, celebrations, and custom mocktail experiences.
            </p>
          </div>
        </FadeIn>

        {/* Editorial gallery — desktop asymmetric grid */}
        <div className="hidden lg:block">
          {/* Row 1: large left + 2 small right */}
          <FadeIn>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <motion.div
                className="col-span-7 relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Image
                  src={portfolioImages[0].src}
                  alt={portfolioImages[0].alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="58vw"
                />
              </motion.div>
              <div className="col-span-5 grid grid-rows-2 gap-4">
                {[1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Image
                      src={portfolioImages[i].src}
                      alt={portfolioImages[i].alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="42vw"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Row 2: 3 equal + wide right */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-12 gap-4">
              {[3, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className="col-span-3 relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Image
                    src={portfolioImages[i].src}
                    alt={portfolioImages[i].alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="25vw"
                  />
                </motion.div>
              ))}
              <motion.div
                className="col-span-3 relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Image
                  src={portfolioImages[4].src}
                  alt={portfolioImages[4].alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="25vw"
                />
              </motion.div>
            </div>
          </FadeIn>
        </div>

        {/* Mobile: vertical stacked + horizontal scroll combo */}
        <div className="lg:hidden space-y-4">
          {/* First large image */}
          <FadeIn>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full">
              <Image
                src={portfolioImages[0].src}
                alt={portfolioImages[0].alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </FadeIn>
          {/* Horizontal scroll row */}
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6 scrollbar-hide">
            {portfolioImages.slice(1, 6).map((img, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 snap-center w-[58vw] aspect-[4/3] rounded-xl overflow-hidden"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="60vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
