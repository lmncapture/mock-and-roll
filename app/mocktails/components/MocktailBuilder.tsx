import { BASES, PUREES, SYRUPS, GARNISHES } from '@/lib/config/drinks';
import FadeIn from '@/app/components/ui/FadeIn';
import Button from '@/app/components/ui/Button';

const STEPS = [
  { number: '01', label: 'Choose Your Base', items: BASES, accent: 'bg-frosted-mint/40' },
  { number: '02', label: 'Choose Your Purée', items: PUREES, accent: 'bg-lemon-zest/40' },
  { number: '03', label: 'Choose Your Syrup', items: SYRUPS, accent: 'bg-rose-petal/40' },
  { number: '04', label: 'Choose Your Garnishes', items: GARNISHES, accent: 'bg-blueberry-dew/40' },
];

export default function MocktailBuilder() {
  return (
    <section className="bg-cool-white px-6 py-16 lg:px-12 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-slate">
            Create Your Own Mocktail
          </h2>
          <p className="mt-4 font-body text-slate/75 text-base lg:text-lg">
            Build a custom mocktail for your celebration by choosing your base,
            purée, syrup, and garnishes.
          </p>
          <p className="mt-2 font-body text-slate/60 text-sm italic">
            All drinks come sparkling with club soda unless otherwise requested.
          </p>
        </FadeIn>

        <div className="mt-12 space-y-12">
          {STEPS.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.1}>
              <div>
                <p className="font-body text-sm font-semibold tracking-widest uppercase text-slate/40">
                  {step.number}
                </p>
                <h3 className="font-display text-2xl lg:text-3xl text-slate mt-2">
                  {step.label}
                </h3>
                <div className="flex flex-wrap gap-3 mt-4">
                  {step.items.map((item) => (
                    <span
                      key={item}
                      className={`${step.accent} rounded-full px-5 py-2.5 font-body font-medium text-sm text-slate`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-16 text-center">
          <h3 className="font-display text-2xl lg:text-3xl text-slate">
            Have Something Special in Mind?
          </h3>
          <p className="mt-3 font-body text-slate/65 text-base lg:text-lg">
            We&apos;d love to create a custom mocktail that complements your
            event, colors, or celebration.
          </p>
          <div className="mt-6">
            <Button href="/inquiries" hoverColor="rose-petal">
              Book Mock &amp; Roll
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
