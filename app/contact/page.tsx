"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Footer, Header, PageHero } from "../../components/site";
import { sendContact } from "../../lib/api";
import Whatsapp from "../../components/common/whatapp";

export default function ContactPage() {
  const [error, setError] = useState("");
  const contact = useMutation({ mutationFn: sendContact });
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await contact.mutateAsync({
        name: String(form.get("name")),
        phone: String(form.get("phone")),
        email: String(form.get("email")),
        message: `${form.get("interest") ? `${form.get("interest")}\n\n` : ""}${form.get("message")}`,
      });
      event.currentTarget.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send your enquiry.",
      );
    }
  };
  return (
    <>
      <Header />
      <PageHero
        label="Contact"
        title={
          <>
            Let&apos;s start a<br />
            <i>good conversation.</i>
          </>
        }
      />
      <section className="page-section">
        <div className="shell contact-page-grid">
          <div>
            <div className="eyebrow">
              <span /> GET IN TOUCH
            </div>
            <h2>
              We&apos;re here to help you <i>move forward.</i>
            </h2>
            <p className="lead">
              Tell us what you&apos;re planning. Our team will be in touch to
              discuss the right next step.
            </p>
            <div className="contact-list">
              <div>
                <Phone color="#0b5a41" />
                <p>
                  <strong>Call us</strong>
                  <br />
                  <a href="tel:+2347061199435">+234 706 119 9435</a> <br />
                  <a href="tel:+2347052714130">+234 705 271 4130</a>
                </p>
              </div>
              <div>
                <Mail color="#0b5a41" />
                <p>
                  <strong>Email us</strong>
                  <br />
                  hello@solomonmultilink.com
                </p>
              </div>
              <div>
                <MapPin color="#0b5a41" />
                <p>
                  <strong>Visit our office</strong>
                  <br />
                  7, Julius Osasgie Crescent; Evbukwu Off Ogharefe Road, <br />
                  Sapele Road, <br />
                  Benin City, <br />
                  Nigeria
                </p>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <label>
                YOUR NAME
                <input name="name" required placeholder="Your full name" />
              </label>
              <label>
                PHONE NUMBER
                <input name="phone" required placeholder="0800 000 0000" />
              </label>
            </div>
            <label>
              EMAIL ADDRESS
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              WHAT ARE YOU INTERESTED IN?
              <input
                name="interest"
                placeholder="Property, construction, survey..."
              />
            </label>
            <label>
              YOUR MESSAGE
              <textarea
                name="message"
                required
                placeholder="Tell us a little about your enquiry"
              />
            </label>
            {error && <p className="lead">{error}</p>}
            <button className="button gold" disabled={contact.isPending}>
              {contact.isSuccess ? (
                "Enquiry sent — thank you!"
              ) : contact.isPending ? (
                "Sending…"
              ) : (
                <>
                  Send enquiry <Send size={17} />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="shell">
          <div className="map-container">
            <iframe
              title="Solomon Multi Link Nigeria Limited Office"
              src="https://www.google.com/maps?q=7%20Julius%20Osasgie%20Crescent%20Evbukwu%20Off%20Ogharefe%20Road%20Sapele%20Road%20Benin%20City%20Nigeria&output=embed"
              width="100%"
              height="450"
              style={{
                border: 0,
                borderRadius: "24px",
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      <Footer />
      <Whatsapp />
    </>
  );
}
