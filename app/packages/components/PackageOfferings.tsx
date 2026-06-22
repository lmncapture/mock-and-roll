import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

const packages = [
  {
    name: "Signature Experience",
    price: "$550",
    priceUnit: "Base Package",
    badge: "Most Popular",
    description:
      "Perfect for intimate gatherings, baby showers, birthdays, and small celebrations.",
    accent: "bg-lime-sorbet/40",
    hoverAccent: "hover:bg-lime-sorbet/60",
    includes: [
      "Up to 30 guests",
      "2 handcrafted mocktails",
      "Unlimited drinks",
      "Professional mocktail bar service",
      "Setup and cleanup included",
    ],
  },
  {
    name: "Celebration Experience",
    price: "$16",
    priceUnit: "Per Guest",
    badge: null,
    description:
      "A flexible option for larger gatherings that still want a simple two-drink menu.",
    accent: "bg-peach-nectar/40",
    hoverAccent: "hover:bg-peach-nectar/60",
    includes: [
      "31+ guests",
      "2 handcrafted mocktails",
      "Unlimited drinks",
      "Professional mocktail bar service",
      "Setup and cleanup included",
    ],
  },
  {
    name: "Premier Experience",
    price: "$18",
    priceUnit: "Per Guest",
    badge: null,
    description:
      "Our expanded experience with three handcrafted mocktails and more variety for guests.",
    accent: "bg-soft-plum/30",
    hoverAccent: "hover:bg-soft-plum/50",
    includes: [
      "3 handcrafted mocktails",
      "Unlimited drinks",
      "Professional mocktail bar service",
      "Setup and cleanup included",
    ],
  },
  {
    name: "Reserve Experience",
    price: "$20",
    priceUnit: "Per Guest",
    badge: "Most Elevated",
    description:
      "Our most elevated package with four handcrafted mocktails for weddings, premium events, and larger celebrations.",
    accent: "bg-arctic-mist/40",
    hoverAccent: "hover:bg-arctic-mist/60",
    includes: [
      "4 handcrafted mocktails",
      "Unlimited drinks",
      "Professional mocktail bar service",
      "Setup and cleanup included",
    ],
  },
];

export default function PackageOfferings() {
  return (
    <section className="bg-cool-white py-20 lg:py-28 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Desktop: 2-column editorial grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {packages.map((pkg, i) => (
            <FadeIn key={pkg.name} delay={i * 0.08}>
              <article
                className={`
                  ${pkg.accent} rounded-3xl p-10 xl:p-12
                  flex flex-col gap-6
                  transition-colors duration-300 ${pkg.hoverAccent}
                `}
              >
                {/* Top row: badge + price */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-h-[20px]">
                    {pkg.badge && (
                      <span className="font-body text-xs font-semibold text-slate/60 tracking-widest uppercase">
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-display text-slate text-4xl xl:text-5xl leading-none tracking-tight">
                      {pkg.price}
                    </span>
                    <p className="font-body text-slate/55 text-xs mt-1 tracking-wide">
                      {pkg.priceUnit}
                    </p>
                  </div>
                </div>

                {/* Name */}
                <h2 className="font-display text-slate text-3xl xl:text-4xl leading-[1.15] tracking-tight">
                  {pkg.name}
                </h2>

                {/* Description */}
                <p className="font-body text-slate/70 text-base leading-relaxed">
                  {pkg.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-slate/10" />

                {/* Includes */}
                <ul className="flex flex-col gap-3">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-body text-slate/75 text-sm leading-relaxed">
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-slate/15 flex items-center justify-center">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-2">
                  <Button href="mailto:hello@mockandroll.com" hoverColor="frosted-mint">
                    Book Mock &amp; Roll
                  </Button>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        {/* Mobile: single column */}
        <div className="lg:hidden flex flex-col gap-5">
          {packages.map((pkg, i) => (
            <FadeIn key={pkg.name} delay={i * 0.06}>
              <article
                className={`${pkg.accent} rounded-3xl p-8 flex flex-col gap-5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {pkg.badge && (
                      <span className="font-body text-xs font-semibold text-slate/60 tracking-widest uppercase">
                        {pkg.badge}
                      </span>
                    )}
                    <h2 className="font-display text-slate text-2xl leading-[1.2] tracking-tight mt-2">
                      {pkg.name}
                    </h2>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-display text-slate text-3xl leading-none tracking-tight">
                      {pkg.price}
                    </span>
                    <p className="font-body text-slate/55 text-xs mt-1 tracking-wide">
                      {pkg.priceUnit}
                    </p>
                  </div>
                </div>

                <p className="font-body text-slate/70 text-sm leading-relaxed">
                  {pkg.description}
                </p>

                <div className="h-px bg-slate/10" />

                <ul className="flex flex-col gap-2.5">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 font-body text-slate/75 text-sm">
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-slate/15 flex items-center justify-center">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button href="mailto:hello@mockandroll.com" hoverColor="frosted-mint">
                  Book Mock &amp; Roll
                </Button>
              </article>
            </FadeIn>
          ))}
        </div>

        {/* Pricing disclaimer */}
        <FadeIn delay={0.2}>
          <p className="font-body text-slate/45 text-sm text-center mt-10 max-w-xl mx-auto leading-relaxed">
            Final pricing may vary based on event location, service time, custom menu needs, and specialty requests.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
