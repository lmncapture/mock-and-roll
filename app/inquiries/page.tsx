import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import InquiryForm from '@/app/inquiries/components/InquiryForm';

export const metadata = {
  title: 'Inquiries | Mock & Roll',
  description: 'Tell us about your event and let Mock & Roll craft the perfect mocktail experience for your celebration.',
};

export default function InquiriesPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-24 lg:pt-32">
        <section className="px-6 lg:px-12 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl text-slate leading-[1.1] tracking-tight">
              Tell Us About Your Event
            </h1>
            <p className="font-body text-slate/75 text-base lg:text-lg mt-6 max-w-xl leading-relaxed">
              We&apos;d love to create something special for your celebration. Fill out the details below and we&apos;ll be in touch within 1 business day.
            </p>
            <div className="mt-12">
              <InquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
