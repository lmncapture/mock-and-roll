import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

const CATEGORIES = [
  {
    name: "Base",
    options: ["Lemonade", "Tea", "Soda", "Juice"],
    accent: "bg-frosted-mint/20",
    border: "border-lime-sorbet",
    dot: "bg-lime-sorbet",
  },
  {
    name: "Purée",
    options: ["Mango", "Strawberry", "Raspberry", "Banana", "Peach", "Passionfruit"],
    accent: "bg-peach-nectar/15",
    border: "border-peach-nectar",
    dot: "bg-peach-nectar",
  },
  {
    name: "Syrup",
    options: ["Rose", "Lavender", "Mint", "Vanilla", "Dragonfruit"],
    accent: "bg-rose-petal/30",
    border: "border-berry-crush",
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
    accent: "bg-blueberry-dew/20",
    border: "border-soft-plum",
    dot: "bg-soft-plum",
  },
];

export default function MocktailBuilder() {
  return (
    <>
    <section className="bg-cool-white px-6 py-16 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Centered introduction */}
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
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

          {/* Editorial divider */}
          <div className="mx-auto mt-10 mb-12 lg:mt-14 lg:mb-16 max-w-xs">
            <hr className="border-t border-slate/15" />
          </div>
        </FadeIn>

        {/* Four-category menu grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-0">
            {CATEGORIES.map((category, index) => (
              <div
                key={category.name}
                className={[
                  "flex flex-col",
                  // Desktop vertical separators between columns
                  index > 0 ? "lg:border-l lg:border-slate/10 lg:pl-8" : "",
                  index < CATEGORIES.length - 1 ? "lg:pr-8" : "",
                ].join(" ")}
              >
                {/* Category header with pastel accent band */}
                <div className={`${category.accent} rounded-lg px-4 py-3 mb-5 lg:mb-6`}>
                  <div className={`border-b-2 ${category.border} pb-2 inline-block`}>
                    <h3 className="font-display text-xl lg:text-2xl text-slate">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Ingredient list */}
                <ul className="space-y-3 px-1">
                  {category.options.map((option) => (
                    <li key={option} className="flex items-center gap-3">
                      <span
                        className={`${category.dot} w-1.5 h-1.5 rounded-full shrink-0`}
                        aria-hidden="true"
                      />
                      <span className="font-body text-sm lg:text-base text-slate/85 leading-relaxed">
                        {option}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile row separator — visible between the two rows on small screens */}
          <hr className="border-t border-slate/10 my-0 lg:hidden hidden" aria-hidden="true" />
        </FadeIn>
      </div>
    </section>

    {/* Full-width closing CTA on Blueberry Dew background */}
    <section className="bg-blueberry-dew px-6 py-20 lg:py-32">
      <FadeIn>
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center gap-5">
          <h2 className="font-display text-2xl lg:text-3xl xl:text-4xl text-slate">
            Build Your Menu Now
          </h2>
          <Button href="mailto:lauren@mocknrollbar.com" hoverColor="arctic-mist">
            Book Mock &amp; Roll
          </Button>
        </div>
      </FadeIn>
    </section>
    </>
  );
}
