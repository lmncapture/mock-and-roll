import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

const events = [
  { name: "Baby Showers", accent: "bg-rose-petal/60" },
  { name: "Bridal Showers", accent: "bg-pink-lychee/50" },
  { name: "Weddings", accent: "bg-peach-nectar/50" },
  { name: "Birthday Parties", accent: "bg-lemon-zest/40" },
  { name: "Corporate Events", accent: "bg-frosted-mint/60" },
  { name: "Networking Events", accent: "bg-blueberry-dew/50" },
  { name: "Community Gatherings", accent: "bg-lime-sorbet/50" },
  { name: "Private Celebrations", accent: "bg-berry-crush/30" },
  { name: "Family-Friendly Events", accent: "bg-arctic-mist/50" },
  { name: "Wellness Events", accent: "bg-soft-plum/35" },
];

export default function PerfectFor() {
  return (
    <section className="bg-cool-white py-16 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="font-body text-slate/50 text-sm font-medium tracking-widest uppercase mb-5">
            04 — What We&apos;re Good For
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 lg:mb-20 gap-6">
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight max-w-lg">
              Perfect For Every Celebration
            </h2>
            <p className="font-body text-slate/60 text-base lg:text-lg max-w-sm leading-relaxed">
              Mock &amp; Roll is designed for events where guests want something beautiful, refreshing, and memorable.
            </p>
          </div>
        </FadeIn>

        {/* Editorial event grid */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {events.map((event, i) => (
              <div
                key={event.name}
                className={`
                  ${event.accent} rounded-2xl px-5 py-6
                  flex items-center justify-center text-center
                  transition-transform duration-500 hover:-translate-y-1
                  ${i === 0 ? "sm:col-span-1 lg:col-span-1" : ""}
                `}
              >
                <span className="font-body font-medium text-slate text-sm leading-snug">
                  {event.name}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.2}>
          <div className="mt-20 flex flex-col items-center text-center gap-8 max-w-2xl mx-auto">
            <h3 className="font-display text-slate text-3xl lg:text-4xl xl:text-5xl leading-[1.15] tracking-tight">
              Bring Mock &amp; Roll to Your Celebration
            </h3>
            <Button href="mailto:lauren@mocknrollbar.com" hoverColor="peach-nectar">
              Book Mock &amp; Roll
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
