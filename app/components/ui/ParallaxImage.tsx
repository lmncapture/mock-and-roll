"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Map scroll progress [0, 1] to subtle y offset [-15, 15]
  const y = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  // If user prefers reduced motion, render without parallax
  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className={`overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
}
