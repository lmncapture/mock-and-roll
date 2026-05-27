"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}

const EASE_PREMIUM: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];
const DURATION_SLOW = 0.8;

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  as = "div",
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render content immediately without animation
  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionComponent = motion.create(as);

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: DURATION_SLOW,
        ease: EASE_PREMIUM,
        delay,
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
