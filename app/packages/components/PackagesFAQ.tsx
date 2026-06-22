"use client";

import { useState } from "react";
import FadeIn from "@/app/components/ui/FadeIn";

const faqs = [
  {
    q: "Do you travel to any venue?",
    a: "Yes — we are a fully mobile mocktail bar. We bring everything needed to your venue: bar setup, garnishes, glassware, and our full service team.",
  },
  {
    q: "What's included in every package?",
    a: "Every package includes unlimited mocktails for the duration of your event, professional bartending service, premium garnishes, and full setup and cleanup.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 4–6 weeks in advance for most events. For weddings and larger events, earlier is always better to secure your date.",
  },
  {
    q: "Can I customize the mocktail menu?",
    a: "Absolutely. We work with every client to design a signature menu that fits the theme, preferences, and dietary needs of your guests.",
  },
  {
    q: "What if my guest count changes?",
    a: "No problem. For per-guest packages we finalize the count closer to the event date. We'll work with you to ensure accurate pricing for your final headcount.",
  },
  {
    q: "Do you serve alcohol?",
    a: "Mock & Roll is an alcohol-free experience. Every drink on our menu is a thoughtfully crafted, non-alcoholic mocktail — which means everyone at your event can enjoy.",
  },
];

export default function PackagesFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-frosted-mint py-20 lg:py-28 px-6 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h2 className="font-display text-slate text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-12 lg:mb-16">
            Frequently Asked Questions
          </h2>
        </FadeIn>

        <div className="flex flex-col divide-y divide-slate/10">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="py-6">
                <button
                  type="button"
                  className="w-full flex items-start justify-between gap-6 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <h3 className="font-body font-semibold text-slate text-lg leading-snug">
                    {faq.q}
                  </h3>
                  <span
                    className={`flex-shrink-0 mt-0.5 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4V16M4 10H16" stroke="#324648" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    open === i ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="font-body text-slate/70 text-base leading-relaxed max-w-2xl">
                    {faq.a}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
