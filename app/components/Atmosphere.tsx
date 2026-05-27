"use client";

import { motion } from "framer-motion";
import FadeIn from "@/app/components/ui/FadeIn";

interface GalleryImage {
  label: string;
  category: string;
  bgColor: string;
  aspect: string;
  colSpan?: string;
  breakGrid?: boolean;
}

const galleryImages: GalleryImage[] = [
  {
    label: "Interior wide shot",
    category: "interior",
    bgColor: "bg-frosted-mint/40",
    aspect: "aspect-[16/10]",
    colSpan: "lg:col-span-2",
  },
  {
    label: "Drink close-up",
    category: "drinks",
    bgColor: "bg-soft-plum/40",
    aspect: "aspect-[3/4]",
  },
  {
    label: "Seating area",
    category: "seating",
    bgColor: "bg-blueberry-dew/40",
    aspect: "aspect-[4/3]",
  },
  {
    label: "Lifestyle shot",
    category: "lifestyle",
    bgColor: "bg-rose-petal/40",
    aspect: "aspect-[3/4]",
    breakGrid: true,
  },
  {
    label: "Bar detail",
    category: "drinks",
    bgColor: "bg-lime-sorbet/40",
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
              <div
                className={`${galleryImages[0].bgColor} ${galleryImages[0].aspect} w-full rounded-2xl`}
                role="img"
                aria-label={galleryImages[0].label}
              />
            </motion.div>

            {/* Image 2: Drink close-up — tall */}
            <motion.div
              className="rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div
                className={`${galleryImages[1].bgColor} ${galleryImages[1].aspect} w-full rounded-2xl`}
                role="img"
                aria-label={galleryImages[1].label}
              />
            </motion.div>

            {/* Image 3: Seating area */}
            <motion.div
              className="rounded-xl overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div
                className={`${galleryImages[2].bgColor} ${galleryImages[2].aspect} w-full rounded-xl`}
                role="img"
                aria-label={galleryImages[2].label}
              />
            </motion.div>

            {/* Editorial typography — integrated within the grid */}
            <div className="flex items-center justify-center lg:col-span-1 py-8 lg:py-0">
              <p className="font-display text-slate text-2xl lg:text-3xl xl:text-4xl leading-[1.2] text-center lg:text-left max-w-xs">
                A space to unwind, celebrate, and be present.
              </p>
            </div>

            {/* Image 4: Lifestyle shot — breaks grid boundary */}
            <motion.div
              className="rounded-2xl overflow-visible lg:-translate-y-6 lg:-mr-8 relative z-10"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div
                className={`${galleryImages[3].bgColor} ${galleryImages[3].aspect} w-full rounded-2xl`}
                role="img"
                aria-label={galleryImages[3].label}
              />
            </motion.div>

            {/* Image 5: Bar detail — spans 2 columns */}
            <motion.div
              className={`${galleryImages[4].colSpan} rounded-2xl overflow-hidden lg:-translate-x-4`}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
              <div
                className={`${galleryImages[4].bgColor} ${galleryImages[4].aspect} w-full rounded-2xl`}
                role="img"
                aria-label={galleryImages[4].label}
              />
            </motion.div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
