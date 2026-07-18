import FadeIn from "@/app/components/ui/FadeIn";
import Button from "@/app/components/ui/Button";

export default function PackagesCTA() {
  return (
    <section className="bg-blueberry-dew py-20 lg:py-40 px-6 lg:px-12">
      <FadeIn className="mx-auto max-w-4xl flex flex-col items-center text-center gap-10">
        <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-slate leading-[1.15]">
          Ready to bring Mock &amp; Roll to your event?
        </h2>
        <p className="font-body text-slate/75 text-lg max-w-lg leading-relaxed -mt-4">
          Reach out and we&apos;ll get back to you within 24 hours to discuss your event details and find the perfect package.
        </p>
        <Button href="mailto:lauren@mocknrollbar.com" hoverColor="arctic-mist">
          Book Mock &amp; Roll
        </Button>
      </FadeIn>
    </section>
  );
}
