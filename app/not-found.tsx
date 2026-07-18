import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Button from "@/app/components/ui/Button";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-cool-white min-h-screen flex flex-col items-center justify-center px-6 py-32 lg:py-48 text-center">
        <p className="font-display text-slate text-8xl lg:text-[200px] leading-none tracking-tight mb-6 opacity-10 select-none">
          404
        </p>
        <h1 className="font-display text-slate text-4xl lg:text-6xl leading-tight mb-6">
          Page not found.
        </h1>
        <p className="font-body text-slate/75 text-lg max-w-sm mb-10 leading-relaxed">
          This page doesn&apos;t exist. Let&apos;s get you back to something
          worth celebrating.
        </p>
        <Button href="/" hoverColor="peach-nectar">
          Back to Home
        </Button>
      </main>
      <Footer />
    </>
  );
}
