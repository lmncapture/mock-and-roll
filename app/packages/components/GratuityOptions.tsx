import FadeIn from "@/app/components/ui/FadeIn";
import { SERVICE_PRICING } from "@/lib/config/services";

export default function GratuityOptions() {
  return (
    <section className="bg-rose-petal/40 py-16 lg:py-28 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <h2 className="font-display text-slate text-4xl lg:text-5xl leading-[1.1] tracking-tight mb-4">
            Gratuity Options
          </h2>
          <p className="font-body text-slate/75 text-lg leading-relaxed max-w-2xl mb-6">
            We believe great service deserves to be recognized while giving our hosts the flexibility to choose what feels right for their event.
          </p>
          <p className="font-body text-slate/70 text-base leading-relaxed max-w-2xl mb-12 lg:mb-16">
            When booking, you may select one of two gratuity options:
          </p>
        </FadeIn>

        {/* Two option cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {/* Hosted Gratuity */}
          <FadeIn delay={0.05}>
            <div className="bg-cool-white rounded-3xl p-8 lg:p-10 flex flex-col gap-5 h-full">
              <h3 className="font-display text-slate text-2xl lg:text-3xl leading-tight tracking-tight">
                Hosted Gratuity
              </h3>

              {/* Quick summary */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lime-sorbet/60 flex items-center justify-center" aria-hidden="true">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="font-body text-sm font-medium text-slate">
                    {SERVICE_PRICING.hostedGratuityPercent}% added to service total
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lime-sorbet/60 flex items-center justify-center" aria-hidden="true">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="font-body text-sm font-medium text-slate">
                    No tip jar at event
                  </span>
                </div>
              </div>

              <div className="h-px bg-slate/10" />

              {/* Full explanation */}
              <p className="font-body text-slate/75 text-sm leading-relaxed">
                An {SERVICE_PRICING.hostedGratuityPercent}% gratuity is added to your service total. With this option, no tip jar will be displayed at your event, allowing you to take care of gratuity for your guests in advance.
              </p>
            </div>
          </FadeIn>

          {/* Guest Gratuity */}
          <FadeIn delay={0.1}>
            <div className="bg-cool-white rounded-3xl p-8 lg:p-10 flex flex-col gap-5 h-full">
              <h3 className="font-display text-slate text-2xl lg:text-3xl leading-tight tracking-tight">
                Guest Gratuity
              </h3>

              {/* Quick summary */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-peach-nectar/60 flex items-center justify-center" aria-hidden="true">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="font-body text-sm font-medium text-slate">
                    No {SERVICE_PRICING.hostedGratuityPercent}% hosted gratuity
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-peach-nectar/60 flex items-center justify-center" aria-hidden="true">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#324648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="font-body text-sm font-medium text-slate">
                    Guests may tip at the bar
                  </span>
                </div>
              </div>

              <div className="h-px bg-slate/10" />

              {/* Full explanation */}
              <p className="font-body text-slate/75 text-sm leading-relaxed">
                Prefer to let guests tip individually? You may opt out of the {SERVICE_PRICING.hostedGratuityPercent}% hosted gratuity, and a tasteful tip jar will be placed at the bar for guests who wish to show their appreciation.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Closing note */}
        <FadeIn delay={0.15}>
          <p className="font-body text-slate/70 text-base leading-relaxed max-w-2xl mx-auto text-center">
            Your gratuity preference will be selected prior to your event so everything feels seamless on the day of your celebration.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
