import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

export default function MocktailsCTA() {
  return (
    <section className="bg-blueberry-dew py-28 lg:py-40 px-6 lg:px-12">
      <FadeIn className="mx-auto max-w-4xl flex flex-col items-center text-center gap-8">
        <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-slate leading-[1.15]">
          Want Something Custom?
        </h2>
        <p className="font-body text-slate/65 text-lg max-w-lg leading-relaxed -mt-2">
          We can create a mocktail menu tailored to your event colors, season, guest preferences, or celebration style.
        </p>
        <Button href="mailto:hello@mockandroll.com" hoverColor="arctic-mist">
          Book Mock &amp; Roll
        </Button>
      </FadeIn>
    </section>
  );
}
