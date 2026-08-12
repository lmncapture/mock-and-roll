import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

const CATEGORIES = [
  {
    name: "Base",
    options: ["Lemonade", "Tea", "Soda", "Juice"],
    accent: "bg-frosted-mint/40",
    dot: "bg-lime-sorbet",
  },
  {
    name: "Purée",
    options: ["Mango", "Strawberry", "Raspberry", "Banana", "Peach", "Passionfruit"],
    accent: "bg-lemon-zest/30",
    dot: "bg-peach-nectar",
  },
  {
    name: "Syrup",
    options: ["Rose", "Lavender", "Mint", "Vanilla", "Dragonfruit"],
    accent: "bg-rose-petal/50",
    dot: "bg-berry-crush",
  },
  {
    name: "Garnishes",
    options: [
      "Dried Fruit",
      "Flowers",
      "Coconut Shreds",
      "Fresh Fruit",
      "Candied Ginger",
      "Herbs",
      "Glitter",
    ],
    accent: "bg-blueberry-dew/40",
    dot: "bg-soft-plum",
  },
];

export default function MocktailBuilder() {
  return (
    <section className="bg-cool-white px-6 py-16 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Centered introduction */}
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-slate leading-[1.1] tracking-tight">
              Create Your Own Mocktail
            </h2>
            <p className="mt-4 font-body text-slate/75 text-base lg:text-lg leading-relaxed">
              Build a custom mocktail for your celebration by choosing your base,
              purée, syrup, and garnishes.
            </p>
            <p className="mt-3 font-body text-slate/75 text-sm italic">
              All drinks come sparkling with club soda unless otherwise requested.
            </p>
          </div>
        </FadeIn>

        {/* Four-category menu grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
            {CATEGORIES.map((category) => (
              <div key={category.name} className="flex flex-col">
                {/* Category heading */}
                <h3 className="font-display text-xl lg:text-2xl text-slate mb-4 lg:mb-6">
                  {category.name}
                </h3>

                {/* Ingredient list */}
                <ul className="space-y-2.5">
                  {category.options.map((option) => (
                    <li key={option} className="flex items-center gap-2.5">
                      <span
                        className={`${category.dot} w-2 h-2 rounded-full shrink-0`}
                        aria-hidden="true"
                      />
                      <span className="font-body text-sm lg:text-base text-slate/80 leading-snug">
                        {option}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Closing CTA */}
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
