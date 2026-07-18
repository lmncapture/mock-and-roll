"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ElementType } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}

const EASE_PREMIUM: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];
const DURATION_SLOW = 0.8;

// Pre-built motion components at module level — never re-created during render.
// This satisfies the react-hooks/static-components lint rule.
const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionArticle = motion.article;
const MotionSpan = motion.span;
const MotionP = motion.p;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionH3 = motion.h3;

const motionComponents: Record<string, typeof MotionDiv> = {
  div: MotionDiv,
  section: MotionSection,
  article: MotionArticle,
  span: MotionSpan,
  p: MotionP,
  h1: MotionH1,
  h2: MotionH2,
  h3: MotionH3,
};

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  as = "div",
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render content immediately without animation
  if (prefersReducedMotion) {
    const StaticTag = as as React.ElementType;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const asStr = typeof as === "string" ? as : "div";
  const MotionComponent = motionComponents[asStr] ?? MotionDiv;

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
