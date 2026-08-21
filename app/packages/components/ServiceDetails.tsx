import FadeIn from "@/app/components/ui/FadeIn";
import { SERVICE_PRICING, TRAVEL_PRICING } from "@/lib/config/services";

export default function ServiceDetails() {
  return (
    <section className="bg-cool-white py-16 lg:py-28 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="font-display text-slate text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-4">
            Service &amp; Pricing Details
          </h2>
          <p className="font-body text-slate/70 text-lg leading-relaxed max-w-2xl mb-14 lg:mb-20">
            Everything you need to know about what&apos;s included and how pricing works.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Service Time */}
          <FadeIn delay={0.05}>
            <div className="bg-frosted-mint/40 rounded-3xl p-8 lg:p-10 flex flex-col gap-5 h-full">
              <div className="w-10 h-10 rounded-full bg-slate/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="font-display text-slate text-2xl leading-tight tracking-tight">
                Service Time
              </h3>
              <p className="font-body text-slate/80 text-base leading-relaxed">
                All packages include{" "}
                <span className="font-semibold text-slate">
                  {SERVICE_PRICING.includedHours} hours
                </span>{" "}
                of unlimited mocktail service.
              </p>
              <div className="h-px bg-slate/10" />
              <p className="font-body text-slate/75 text-sm leading-relaxed">
                Additional service time is available for{" "}
                <span className="font-semibold text-slate">
                  ${SERVICE_PRICING.additionalHourRate}/hour
                </span>
                .
              </p>
            </div>
          </FadeIn>

          {/* Travel */}
          <FadeIn delay={0.1}>
            <div className="bg-blueberry-dew/30 rounded-3xl p-8 lg:p-10 flex flex-col gap-5 h-full">
              <div className="w-10 h-10 rounded-full bg-slate/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="font-display text-slate text-2xl leading-tight tracking-tight">
                Travel
              </h3>
              <p className="font-body text-slate/80 text-base leading-relaxed">
                Travel within {SERVICE_PRICING.includedTravelMiles} miles of our home base is included with every package.
              </p>
              <div className="h-px bg-slate/10" />
              {/* Tiered pricing list */}
              <div className="flex flex-col gap-0">
                <p className="font-body text-slate/75 text-xs font-medium tracking-wider uppercase mb-3">
                  Distance from our home base
                </p>
                <ul className="flex flex-col">
                  {TRAVEL_PRICING.map((tier) => (
                    <li
                      key={tier.label}
                      className="flex items-center justify-between py-2.5 border-b border-slate/8 last:border-b-0"
                    >
                      <span className="font-body text-slate/80 text-sm">
                        {tier.label}
                      </span>
                      <span className={`font-body text-sm font-semibold whitespace-nowrap ${
                        tier.price === 0
                          ? 'text-slate/75'
                          : tier.price === null
                            ? 'text-slate/70'
                            : 'text-slate'
                      }`}>
                        {tier.priceDisplay}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>

          {/* Gratuity */}
          <FadeIn delay={0.15}>
            <div className="bg-peach-nectar/30 rounded-3xl p-8 lg:p-10 flex flex-col gap-5 h-full">
              <div className="w-10 h-10 rounded-full bg-slate/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 className="font-display text-slate text-2xl leading-tight tracking-tight">
                Gratuity
              </h3>
              <p className="font-body text-slate/80 text-base leading-relaxed">
                Choose between two gratuity options when booking — details below.
              </p>
              <div className="h-px bg-slate/10" />
              <p className="font-body text-slate/75 text-sm leading-relaxed">
                Your preference is selected prior to the event so everything feels seamless on the day of your celebration.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
