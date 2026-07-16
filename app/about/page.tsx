import { Award, Handshake, ShieldCheck } from "lucide-react";
import { Footer, Header, PageCta, PageHero } from "../../components/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Solo Multi-Link",
  description:
    "Learn about Solo Multi-Link, a trusted Nigerian real estate, construction, and surveying company committed to delivering quality, integrity, and lasting value. Discover our story, mission, and dedication to excellence.",
  keywords: [
    "Solo Multi-Link",
    "About Solo Multi-Link",
    "Real Estate Nigeria",
    "Construction Company Benin",
    "Property Development",
    "Surveying Services",
    "Civil Engineering",
    "Building Construction",
    "Property Investment Nigeria",
  ],
  openGraph: {
    title: "About Us | Solo Multi-Link",
    description:
      "Discover the story behind Solo Multi-Link and our commitment to delivering exceptional real estate, construction, and surveying services across Nigeria.",
    type: "website",
    url: "https://solo-multilink-kappa.vercel.app/about",
    siteName: "Solo Multi-Link",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Solo Multi-Link",
    description:
      "Discover the story behind Solo Multi-Link and our commitment to excellence in real estate, construction, and surveying.",
  },
};
export default function AboutPage() {
  return (
    <>
      <Header />
      <PageHero
        label="About us"
        title={
          <>
            Built with integrity.
            <br />
            <i>Made to last.</i>
          </>
        }
      />
      <section className="page-section">
        <div className="shell about-story">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85"
            alt="Solo Multi-Link project"
          />
          <div>
            <div className="eyebrow">
              <span /> OUR STORY
            </div>
            <h2>
              A reliable partner for every <i>important step.</i>
            </h2>
            <p className="lead">
              Solo Multi-Link was founded on a simple belief: property and
              construction should feel clear, personal and dependable. For more
              than a decade, we have helped individuals and businesses turn
              ambitious ideas into valuable, enduring places.
            </p>
            <p className="lead">
              Our multidisciplinary team combines local knowledge, technical
              skill and thoughtful service, bringing a steady hand to every
              decision.
            </p>
          </div>
        </div>
        <div className="shell values">
          {[
            [
              Handshake,
              "Trusted partnership",
              "We listen closely, communicate clearly and always act in your best interest.",
            ],
            [
              Award,
              "Excellence in delivery",
              "We bring the same care and precision to every project, large or small.",
            ],
            [
              ShieldCheck,
              "Built with confidence",
              "From title checks to final finishes, quality is never an afterthought.",
            ],
          ].map(([Icon, title, text]) => {
            const C = Icon as typeof Handshake;
            return (
              <div className="value" key={String(title)}>
                <C color="#0b5a41" size={28} />
                <strong>{String(title)}</strong>
                <p>{String(text)}</p>
              </div>
            );
          })}
        </div>
      </section>
      <PageCta />
      <Footer />
    </>
  );
}
