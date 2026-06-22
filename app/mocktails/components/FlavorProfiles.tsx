import FadeIn from "@/app/components/ui/FadeIn";

const flavors = [
  {
    name: "Bright & Citrusy",
    description: "Yuzu, lemon, lime, grapefruit — fresh and effervescent.",
    accent: "bg-lemon-zest/40",
  },
  {
    name: "Berry & Floral",
    description: "Berries, rose, lavender, elderflower — soft and fragrant.",
    accent: "bg-berry-crush/30",
  },
  {
    name: "Crisp & Refreshing",
    description: "Cucumber, mint, sparkling water — light and clean.",
    accent: "bg-arctic-mist/40",
  },
  {
    name: "Peachy & Tropical",
    description: "Peach, mango, passionfruit, jasmine — warm and lush.",
    accent: "bg-peach-nectar/40",
  },
  {
    name: "Botanical & Herbal",
    description: "Basil, thyme, turmeric, ginger — complex and layered.",
    accent: "bg-lime-sorbet/40",
  },
  {
    name: "Custom Seasonal",
    description: "Tailored to your event theme, season, and color palette.",
    accent: "bg-soft-plum/30",
  },
];

export default function FlavorProfiles() {
  return (
    <section className="bg-rose-petal py-16 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 lg:mb-20 gap-6">
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight max-w-xl">
              Build a Menu That Fits Your Event
            </h2>
            <p className="font-body text-slate/60 text-base lg:text-lg max-w-sm leading-relaxed">
              Choose from bright, botanical, fruit-forward, sparkling, or custom seasonal mocktails.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {flavors.map((flavor) => (
              <div
                key={flavor.name}
                className={`${flavor.accent} rounded-2xl p-8 flex flex-col gap-3 transition-transform duration-500 hover:-translate-y-1`}
              >
                <h3 className="font-body font-semibold text-slate text-lg tracking-tight">
                  {flavor.name}
                </h3>
                <p className="font-body text-slate/65 text-sm leading-relaxed">
                  {flavor.description}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
