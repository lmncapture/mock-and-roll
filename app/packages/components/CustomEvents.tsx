import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

export default function CustomEvents() {
  return (
    <section className="bg-rose-petal py-16 lg:py-28 px-6 lg:px-12">
      <FadeIn>
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-slate text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight">
              Need Something Custom?
            </h2>
            <p className="font-body text-slate/70 text-lg leading-relaxed mt-6 max-w-lg">
              We love creating unique mocktail experiences tailored to your event. If your
              celebration requires something special, we&apos;d love to build a custom
              package just for you.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button href="mailto:lauren@mocknrollbar.com" hoverColor="berry-crush">
              Book Mock &amp; Roll
            </Button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
