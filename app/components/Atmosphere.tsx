"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/app/components/ui/FadeIn";

interface GalleryImage {
  src: string;
  alt: string;
  aspect: string;
  colSpan?: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/mr-moments-1.jpg",
    alt: "Mock & Roll — moments worth celebrating",
    aspect: "aspect-[16/10]",
    colSpan: "lg:col-span-2",
  },
  {
    src: "/images/mr-signature-mocktails-horizontal.jpg",
    alt: "Mock & Roll signature mocktails crafted with care",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/mr-moments-2.jpg",
    alt: "Mock & Roll — guests enjoying handcrafted mocktails",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/mr-moments-3.jpg",
    alt: "Mock & Roll — a celebration worth remembering",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/mr-moments-4.jpg",
    alt: "Mock & Roll — premium mobile mocktail bar at an event",
    aspect: "aspect-[16/9]",
    colSpan: "lg:col-span-2",
  },
];

export default function Atmosphere() {
  return (
    <section className="relative bg-cool-white py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
      <FadeIn>
        <div className="mx-auto max-w-7xl">
          {/* Asymmetrical CSS Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Image 1: Interior wide shot — spans 2 columns */}
            <motion.div
              className={`${galleryImages[0].colSpan} rounded-2xl overflow-hidden`}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div className={`relative ${galleryImages[0].aspect} w-full`}>
                <Image
                  src={galleryImages[0].src}
                  alt={galleryImages[0].alt}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
            </motion.div>

            {/* Image 2: Drink close-up — tall */}
            <motion.div
              className="rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div className={`relative ${galleryImages[1].aspect} w-full`}>
                <Image
                  src={galleryImages[1].src}
                  alt={galleryImages[1].alt}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </motion.div>

            {/* Image 3: Seating area */}
            <motion.div
              className="rounded-xl overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div className={`relative ${galleryImages[2].aspect} w-full`}>
                <Image
                  src={galleryImages[2].src}
                  alt={galleryImages[2].alt}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </motion.div>

            {/* Editorial typography — integrated within the grid */}
            <div className="flex items-center justify-center lg:col-span-1 py-8 lg:py-0">
              <p className="font-display text-slate text-2xl lg:text-3xl xl:text-4xl leading-[1.2] text-center lg:text-left max-w-xs">
                A space to unwind, celebrate, and be present.
              </p>
            </div>

            {/* Image 4: Lifestyle shot — breaks grid boundary */}
            <motion.div
              className="rounded-2xl overflow-hidden lg:-translate-y-6 lg:-mr-8 relative z-10"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div className={`relative ${galleryImages[3].aspect} w-full`}>
                <Image
                  src={galleryImages[3].src}
                  alt={galleryImages[3].alt}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </motion.div>

            {/* Image 5: Bar detail — spans 2 columns */}
            <motion.div
              className={`${galleryImages[4].colSpan} rounded-2xl overflow-hidden lg:-translate-x-4`}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div className={`relative ${galleryImages[4].aspect} w-full`}>
                <Image
                  src={galleryImages[4].src}
                  alt={galleryImages[4].alt}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
