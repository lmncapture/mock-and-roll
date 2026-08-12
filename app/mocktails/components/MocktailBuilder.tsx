"use client";

import { useState } from "react";
import BuilderStep from "./BuilderStep";
import LivePreview from "./LivePreview";
import Button from "@/app/components/ui/Button";
import FadeIn from "@/app/components/ui/FadeIn";
import type { StepColorScheme } from "./IngredientChip";

interface StepConfig {
  id: string;
  stepNumber: string;
  label: string;
  options: string[];
  colorScheme: StepColorScheme;
  multiSelect: boolean;
}

const STEPS: StepConfig[] = [
  {
    id: "base",
    stepNumber: "01",
    label: "Choose Your Base",
    options: ["Lemonade", "Tea", "Soda", "Juice"],
    colorScheme: {
      idle: "bg-frosted-mint/40",
      hover: "bg-frosted-mint/70",
      selected: "bg-lime-sorbet",
      ring: "ring-lime-sorbet",
    },
    multiSelect: false,
  },
  {
    id: "puree",
    stepNumber: "02",
    label: "Choose Your Purée",
    options: ["Mango", "Strawberry", "Raspberry", "Banana", "Peach", "Passionfruit"],
    colorScheme: {
      idle: "bg-lemon-zest/40",
      hover: "bg-lemon-zest/70",
      selected: "bg-peach-nectar",
      ring: "ring-peach-nectar",
    },
    multiSelect: false,
  },
  {
    id: "syrup",
    stepNumber: "03",
    label: "Choose Your Syrup",
    options: ["Rose", "Lavender", "Mint", "Vanilla", "Dragonfruit"],
    colorScheme: {
      idle: "bg-rose-petal/40",
      hover: "bg-rose-petal/70",
      selected: "bg-berry-crush",
      ring: "ring-berry-crush",
    },
    multiSelect: false,
  },
  {
    id: "garnishes",
    stepNumber: "04",
    label: "Choose Your Garnishes",
    options: [
      "Dried Fruit",
      "Flowers",
      "Coconut Shreds",
      "Fresh Fruit",
      "Candied Ginger",
      "Herbs",
      "Glitter",
    ],
    colorScheme: {
      idle: "bg-blueberry-dew/40",
      hover: "bg-blueberry-dew/70",
      selected: "bg-soft-plum",
      ring: "ring-soft-plum",
    },
    multiSelect: true,
  },
];

export default function MocktailBuilder() {
  const [base, setBase] = useState<string | null>(null);
  const [puree, setPuree] = useState<string | null>(null);
  const [syrup, setSyrup] = useState<string | null>(null);
  const [garnishes, setGarnishes] = useState<string[]>([]);

  function handleSelect(stepId: string, name: string) {
    switch (stepId) {
      case "base":
        setBase((prev) => (prev === name ? null : name));
        break;
      case "puree":
        setPuree((prev) => (prev === name ? null : name));
        break;
      case "syrup":
        setSyrup((prev) => (prev === name ? null : name));
        break;
      case "garnishes":
        setGarnishes((prev) =>
          prev.includes(name)
            ? prev.filter((g) => g !== name)
            : [...prev, name]
        );
        break;
    }
  }

  function handleReset() {
    setBase(null);
    setPuree(null);
    setSyrup(null);
    setGarnishes([]);
  }

  function getSelected(stepId: string): string | string[] | null {
    switch (stepId) {
      case "base":
        return base;
      case "puree":
        return puree;
      case "syrup":
        return syrup;
      case "garnishes":
        return garnishes;
      default:
        return null;
    }
  }

  return (
    <section className="bg-cool-white px-6 py-16 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section introduction */}
        <FadeIn>
          <div className="mb-14 lg:mb-20 max-w-2xl">
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-slate leading-[1.1] tracking-tight">
              Create Your Own Mocktail
            </h2>
            <p className="mt-4 font-body text-slate/75 text-base lg:text-lg leading-relaxed">
              Build a custom mocktail for your celebration by choosing your base,
              purée, syrup, and garnishes.
            </p>
            <p className="mt-2 font-body text-slate/75 text-sm italic">
              All drinks come sparkling with club soda unless otherwise requested.
            </p>
          </div>
        </FadeIn>

        {/* Four steps */}
        <div className="space-y-12 lg:space-y-16">
          {STEPS.map((step, index) => (
            <FadeIn key={step.id} delay={index * 0.08}>
              <BuilderStep
                stepNumber={step.stepNumber}
                label={step.label}
                options={step.options}
                selected={getSelected(step.id)}
                onSelect={(name) => handleSelect(step.id, name)}
                colorScheme={step.colorScheme}
                multiSelect={step.multiSelect}
              />
            </FadeIn>
          ))}
        </div>

        {/* Live Preview */}
        <LivePreview
          base={base}
          puree={puree}
          syrup={syrup}
          garnishes={garnishes}
          onReset={handleReset}
        />

        {/* Inline booking CTA */}
        <FadeIn delay={0.2}>
          <div className="mt-16 lg:mt-24 text-center flex flex-col items-center gap-4">
            <h3 className="font-display text-2xl lg:text-3xl text-slate">
              Have Something Special in Mind?
            </h3>
            <p className="font-body text-slate/75 text-base lg:text-lg max-w-md leading-relaxed">
              We&apos;d love to create a custom mocktail that complements your
              event, colors, or celebration.
            </p>
            <Button href="mailto:lauren@mocknrollbar.com" hoverColor="rose-petal">
              Book Mock &amp; Roll
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
