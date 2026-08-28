import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Button from '@/app/components/ui/Button';
import ThankYouConversion from './components/ThankYouConversion';

export const metadata = {
  title: 'Thank You',
  description: 'Thanks for your inquiry — someone from the Mock & Roll team will be in touch within 1 business day.',
  // Keep this confirmation page out of search results. It is also excluded
  // from the sitemap.
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouPage() {
  return (
    <>
      {/* Fires the Meta Lead conversion once, only after a real submission. */}
      <ThankYouConversion />
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-24 lg:pt-32">
        <section className="px-6 lg:px-12 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl bg-frosted-mint/30 p-8 lg:p-12 text-center"
            >
              <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl text-slate leading-[1.1] tracking-tight">
                Thank You!
              </h1>
              <p className="font-body text-base lg:text-lg text-slate/80 mt-4 max-w-md mx-auto leading-relaxed">
                Thanks for your inquiry — someone from our team will be in touch within 1 business day.
              </p>
              <div className="mt-8">
                <Button href="/" hoverColor="peach-nectar">
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
