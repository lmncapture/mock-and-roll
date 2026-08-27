import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import FadeIn from "@/app/components/ui/FadeIn";
import JsonLd from "@/app/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/structured-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mocknrollbar.com";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Mock & Roll collects, uses, and protects information when you visit our website, submit an inquiry, or interact with our services.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: siteUrl },
          { name: "Privacy Policy", url: `${siteUrl}/privacy` },
        ])}
      />
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-24 lg:pt-32">
        {/* Hero */}
        <section className="px-6 lg:px-12 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl text-slate leading-[1.1] tracking-tight">
                Privacy Policy
              </h1>
              <p className="font-body text-sm text-slate/60 mt-4">
                Last Updated: August 26, 2026
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Policy Content */}
        <section className="px-6 lg:px-12 pb-24 lg:pb-32">
          <div className="max-w-3xl mx-auto space-y-16">

            {/* Introduction */}
            <div className="font-body text-base text-slate/80 leading-relaxed space-y-4">
              <p>
                Mock &amp; Roll (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website at{" "}
                <a
                  href="https://mocknrollbar.com"
                  className="text-slate underline underline-offset-2 hover:text-slate/70 transition-colors"
                >
                  mocknrollbar.com
                </a>
                . This Privacy Policy explains how we collect, use, and protect information when you visit our website, submit an inquiry, or interact with our services.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <PolicySection title="Information We Collect">
              <p>
                When you submit an inquiry through our website, we may collect information such as:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Event date, time, and type</li>
                <li>Estimated guest count</li>
                <li>Event location</li>
                <li>Package and service selections</li>
                <li>Drink preferences</li>
                <li>Additional information you voluntarily provide through the inquiry form</li>
              </ul>
              <p>
                Certain technical information may also be collected automatically when you visit our website through analytics and advertising technologies, as described in the sections below.
              </p>
            </PolicySection>

            {/* 2. How We Use Information */}
            <PolicySection title="How We Use Information">
              <p>We may use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to your inquiries</li>
                <li>Provide quotes and information about Mock &amp; Roll services</li>
                <li>Communicate with you regarding events and bookings</li>
                <li>Operate and improve our website</li>
                <li>Understand how visitors use our website</li>
                <li>Measure the effectiveness of our advertising</li>
                <li>Perform advertising attribution</li>
                <li>Improve our marketing efforts</li>
                <li>Maintain the security and reliability of our website</li>
              </ul>
              <p>We do not sell your personal information.</p>
            </PolicySection>

            {/* 3. Meta Pixel and Advertising Measurement */}
            <PolicySection title="Meta Pixel and Advertising Measurement">
              <p>
                Our website uses Meta Pixel, a technology provided by Meta Platforms, Inc. Meta Pixel helps us understand how visitors interact with our website and measure the effectiveness of our advertising on Meta platforms (such as Facebook and Instagram).
              </p>
              <p>
                When you visit our website, Meta Pixel may collect information about your browsing activity, such as pages visited. When you submit an inquiry, Meta Advanced Matching may send certain customer identifiers — such as your email address, phone number, first name, and last name — to Meta for matching, attribution, and advertising measurement purposes. Meta Pixel&rsquo;s Advanced Matching mechanism handles the hashing of these normalized identifiers. Meta processes this information according to its own privacy policies.
              </p>
              <p>
                You can learn more about how Meta uses information by reviewing the{" "}
                <a
                  href="https://www.facebook.com/privacy/policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate underline underline-offset-2 hover:text-slate/70 transition-colors"
                >
                  Meta Privacy Policy
                </a>
                . You may also manage your advertising preferences through your Facebook or Instagram account settings.
              </p>
            </PolicySection>

            {/* 4. Analytics */}
            <PolicySection title="Analytics">
              <p>
                We use Vercel Analytics to understand general website usage and performance. Vercel Analytics collects information such as page views, performance metrics, and general visitor information (such as country, browser type, and device). Vercel Analytics does not use cookies and does not track visitors across other websites.
              </p>
            </PolicySection>

            {/* 5. Service Providers */}
            <PolicySection title="Service Providers">
              <p>
                Mock &amp; Roll uses third-party service providers to help operate our website and process inquiries. Based on how our website currently operates, these providers include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium text-slate">Supabase</span> — database infrastructure for storing inquiry submissions
                </li>
                <li>
                  <span className="font-medium text-slate">Resend</span> — transactional email infrastructure for internal inquiry notifications
                </li>
                <li>
                  <span className="font-medium text-slate">Vercel</span> — website hosting and analytics
                </li>
                <li>
                  <span className="font-medium text-slate">Meta</span> — advertising measurement and attribution
                </li>
              </ul>
              <p>
                These providers may process information as necessary to provide their respective services. They are independent companies and are not owned or controlled by Mock &amp; Roll.
              </p>
            </PolicySection>

            {/* 6. Data Sharing */}
            <PolicySection title="Data Sharing">
              <p>
                We may share information with the service providers described above as necessary to operate our website and fulfill inquiries.
              </p>
              <p>
                We may also disclose information if required to do so by law, regulation, legal process, or governmental request.
              </p>
              <p>
                Mock &amp; Roll does not sell personal information in the ordinary meaning of directly exchanging personal information for monetary payment.
              </p>
            </PolicySection>

            {/* 7. Data Retention */}
            <PolicySection title="Data Retention">
              <p>
                We retain information for as long as reasonably necessary to respond to inquiries, provide services, maintain business records, comply with applicable obligations, and support legitimate business purposes.
              </p>
            </PolicySection>

            {/* 8. Data Security */}
            <PolicySection title="Data Security">
              <p>
                We use reasonable administrative and technical measures to help protect the information we collect. However, no method of internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </PolicySection>

            {/* 9. Privacy Choices and Requests */}
            <PolicySection title="Privacy Choices and Requests">
              <p>
                If you have questions about your personal information or would like to make a privacy-related request, please contact us at{" "}
                <a
                  href="mailto:lauren@mocknrollbar.com"
                  className="text-slate underline underline-offset-2 hover:text-slate/70 transition-colors"
                >
                  lauren@mocknrollbar.com
                </a>
                . We will handle requests as required by applicable law.
              </p>
            </PolicySection>

            {/* 10. Children's Privacy */}
            <PolicySection title="Children&#39;s Privacy">
              <p>
                Our website and services are not directed toward children under 13 years of age. We do not knowingly collect personal information directly from children under 13 through our website. If you believe a child under 13 has provided us with personal information, please contact us so we can take appropriate action.
              </p>
            </PolicySection>

            {/* 11. Changes to This Policy */}
            <PolicySection title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. When we make changes, we will revise the &ldquo;Last Updated&rdquo; date at the top of this page. We encourage you to review this page periodically for any updates.
              </p>
            </PolicySection>

            {/* 12. Contact Us */}
            <PolicySection title="Contact Us">
              <p>If you have any questions about this Privacy Policy, you may contact us at:</p>
              <address className="not-italic space-y-1 mt-4">
                <p className="font-medium text-slate">Mock &amp; Roll</p>
                <p>Seattle, Washington</p>
                <p>
                  <a
                    href="mailto:lauren@mocknrollbar.com"
                    className="text-slate underline underline-offset-2 hover:text-slate/70 transition-colors"
                  >
                    lauren@mocknrollbar.com
                  </a>
                </p>
              </address>
            </PolicySection>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/** Reusable section component for policy content */
function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl lg:text-3xl text-slate leading-tight tracking-tight">
        {title}
      </h2>
      <div className="font-body text-base text-slate/80 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}
