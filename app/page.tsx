"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Check,
  ChevronDown,
  Facebook,
  Hammer,
  Instagram,
  Landmark,
  MapPin,
  Menu,
  MoveRight,
  Phone,
  Ruler,
  Search,
  Send,
  ShieldCheck,
  Star,
  Trees,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  formatNaira,
  getProperties,
  propertyImage,
  sendContact,
} from "../lib/api";
import Image from "next/image";

const properties = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    type: "For sale",
    title: "Contemporary Family Residence",
    place: "Gwarinpa, Abuja",
    price: "₦185,000,000",
    beds: 5,
    baths: 6,
    area: "680 sqm",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    type: "For lease",
    title: "The Grand View Apartments",
    place: "Lekki Phase 1, Lagos",
    price: "₦12,000,000 / yr",
    beds: 3,
    baths: 3,
    area: "240 sqm",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",
    type: "For sale",
    title: "Hillside Duplex",
    place: "Idu, Abuja",
    price: "₦95,000,000",
    beds: 4,
    baths: 4,
    area: "420 sqm",
  },
];

const services = [
  [
    Building2,
    "Building Plans",
    "Thoughtfully designed plans that bring your vision to life.",
  ],
  [
    Landmark,
    "Building Approval",
    "Clear, dependable guidance through the approval process.",
  ],
  [Ruler, "Land Survey", "Accurate surveys for confident property decisions."],
  [Hammer, "Construction", "Quality workmanship from foundation to finishing."],
  [
    Trees,
    "Estate Development",
    "Integrated developments made for modern living.",
  ],
  [
    ShieldCheck,
    "Property Services",
    "Professional sales, lease and title support.",
  ],
] as const;

function Logo() {
  return (
    <a href="#home" className="logo">
      <div>
        <Image
          src="/images/solomulti_logo_2.png"
          alt="Solomon Multi-Link"
          className="logo-image"
          fill
        />
      </div>
      <i></i>
      <strong>
        Solo
        <br />
        <em>Multi-Link</em>
      </strong>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: featuredProperties = [] } = useQuery({
    queryKey: ["properties", "featured"],
    queryFn: () => getProperties(true),
  });
  const contact = useMutation({
    mutationFn: sendContact,
    onSuccess: () => setSubmitted(true),
  });
  const scroll = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <main>
      <header className="header">
        <div className="shell nav">
          <Logo />
          <nav className={menuOpen ? "open" : ""}>
            {[
              ["Home", "#home"],
              ["Services", "#services"],
              ["Properties", "#properties"],
              ["About us", "#about"],
              ["Contact", "#contact"],
            ].map(([label, link]) => (
              <a key={label} href={link} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <button
              className="mobile-contact"
              onClick={() => scroll("#contact")}
            >
              Let&apos;s talk
            </button>
          </nav>
          <button
            className="hamburger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <button className="nav-cta" onClick={() => scroll("#contact")}>
            Let&apos;s talk <ArrowRight size={17} />
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="shell hero-content">
          <div className="eyebrow light">
            <span></span> PROPERTY • CONSTRUCTION • DEVELOPMENT
          </div>
          <h1>
            Spaces built for
            <br />
            <i>possibility.</i>
          </h1>
          <p>
            We create exceptional places to live, work and grow — with trusted
            expertise at every stage.
          </p>
          <div className="hero-actions">
            <Link className="button gold" href={"properties"}>
              Explore properties <MoveRight size={18} />
            </Link>
            <Link className="watch" href={"about"}>
              <span>→</span> Discover our story
            </Link>
          </div>
        </div>
        <div className="hero-foot shell">
          <span>SCROLL TO EXPLORE</span>
          <div></div>
          <p>RC 7149846 &nbsp;·&nbsp; Abuja, Nigeria</p>
        </div>
      </section>

      <section className="searchbar">
        <div className="shell search-wrap">
          <div className="search-title">
            <Search size={23} />
            <span>Find a property</span>
          </div>
          <label>
            LOCATION
            <select defaultValue="">
              <option value="" disabled>
                Any location
              </option>
              <option>Abuja</option>
              <option>Lagos</option>
            </select>
          </label>
          <label>
            PROPERTY TYPE
            <select defaultValue="">
              <option value="" disabled>
                Any type
              </option>
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
            </select>
          </label>
          <label>
            PRICE RANGE
            <select defaultValue="">
              <option value="" disabled>
                Any price
              </option>
              <option>Under ₦100m</option>
              <option>₦100m - ₦250m</option>
            </select>
          </label>
          <button
            className="search-button"
            onClick={() => scroll("#properties")}
          >
            Search <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="intro section" id="about">
        <div className="shell intro-grid">
          <div className="intro-image">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=85"
              alt="Modern residential building"
            />
            <div className="experience">
              <strong>
                10<span>+</span>
              </strong>
              <p>
                Years of
                <br />
                experience
              </p>
            </div>
          </div>
          <div className="intro-copy">
            <div className="eyebrow">
              <span></span> WHO WE ARE
            </div>
            <h2>
              More than a property company. <i>A lasting partner.</i>
            </h2>
            <p>
              Solo Multi-Link brings together property expertise, technical
              precision and an uncompromising commitment to quality. We make the
              complex feel simple, from your first idea to your finished space.
            </p>
            <Link className="text-link" href="services">
              Meet our team <ArrowRight size={18} />
            </Link>
            <div className="metrics">
              <div>
                <strong>
                  250<span>+</span>
                </strong>
                <p>Projects delivered</p>
              </div>
              <div>
                <strong>
                  98<span>%</span>
                </strong>
                <p>Client satisfaction</p>
              </div>
              <div>
                <strong>12</strong>
                <p>Core services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="properties section" id="properties">
        <div className="shell">
          <div className="section-top">
            <div>
              <div className="eyebrow">
                <span></span> FIND YOUR PLACE
              </div>
              <h2>
                Featured <i>properties.</i>
              </h2>
            </div>
            <Link href="properties" className="outline-button">
              View all listings <ArrowRight size={17} />
            </Link>
          </div>
          <div className="property-grid">
            {featuredProperties.map((p) => (
              <article className="property-card" key={p.id}>
                <div className="property-image">
                  <img src={propertyImage(p)} alt={p.title} />
                  <span>{p.property_type}</span>
                  <Link
                    href={`/properties/${p.slug}`}
                    aria-label="View property"
                    className="button"
                  >
                    ↗
                  </Link>
                </div>
                <div className="property-body">
                  <div>
                    <h3>{p.title}</h3>
                    <p className="location">
                      <MapPin size={15} />
                      {p.location}
                    </p>
                  </div>
                  <strong>{formatNaira(p.price)}</strong>
                  <div className="property-specs">
                    <span>
                      <BedDouble size={17} />
                      {p.bedrooms} Beds
                    </span>
                    <span>
                      <Bath size={17} />
                      {p.bathrooms} Baths
                    </span>
                    <span>
                      <Ruler size={17} />
                      {p.land_size}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="shell">
          <div className="services-heading">
            <div>
              <div className="eyebrow">
                <span></span> WHAT WE DO
              </div>
              <h2>
                Everything your
                <br />
                <i>project needs.</i>
              </h2>
            </div>
            <p>
              One experienced team. A complete range of property and
              construction services designed around you.
            </p>
          </div>
          <div className="services-grid">
            {services.map(([Icon, title, text], i) => (
              <article className="service" key={title}>
                <span className="service-no">0{i + 1}</span>
                <div className="service-icon">
                  <Icon size={26} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link href="contact" aria-label={`Learn more about ${title}`}>
                  <ArrowRight size={20} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="why">
        <div className="shell why-grid">
          <div>
            <div className="eyebrow light">
              <span></span> THE SOLO STANDARD
            </div>
            <h2>
              Built on trust.
              <br />
              <i>Defined by quality.</i>
            </h2>
            <p>
              Every project receives the care, clarity and craft it deserves —
              because your investment matters.
            </p>
            <Link className="button gold" href="contact">
              Work with us <ArrowRight size={18} />
            </Link>
          </div>
          <div className="reasons">
            {[
              [
                "01",
                "Trusted professionals",
                "A skilled team that puts your interests first.",
              ],
              [
                "02",
                "Quality delivery",
                "Work delivered with precision, on time and on budget.",
              ],
              [
                "03",
                "Foundation to finish",
                "One trusted partner through every stage of your project.",
              ],
            ].map(([no, title, text]) => (
              <div className="reason" key={no}>
                <span>{no}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <Check size={21} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial">
        <div className="shell quote">
          <div className="quote-mark">“</div>
          <blockquote>
            Solo Multi-Link made our journey to owning our dream home seamless.
            Their integrity, professionalism and eye for quality are
            exceptional.
          </blockquote>
          <div className="client">
            <div>AO</div>
            <p>
              <strong>Amara Okonkwo</strong>
              <br />
              Homeowner, Abuja
            </p>
            <span>
              <Star fill="#F4B400" />
              <Star fill="#F4B400" />
              <Star fill="#F4B400" />
              <Star fill="#F4B400" />
              <Star fill="#F4B400" />
            </span>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell contact-grid">
          <div className="contact-copy">
            <div className="eyebrow light">
              <span></span> LET&apos;S BEGIN
            </div>
            <h2>
              Let&apos;s build
              <br />
              <i>something great.</i>
            </h2>
            <p>
              Whether you&apos;re buying, building or simply exploring
              possibilities, our team is ready to help.
            </p>
            <div className="contact-detail">
              <Phone size={19} />
              <span>
                Call us today
                <br />
                <a href="tel:+2347061199435">+234 706 119 9435</a> <br />
                <a href="tel:+2347052714130">+234 705 271 4130</a>
              </span>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              contact.mutate({
                name: String(form.get("name")),
                phone: String(form.get("phone")),
                email: String(form.get("email")),
                message: String(form.get("message")),
              });
            }}
          >
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
              HOW CAN WE HELP?
              <textarea
                name="message"
                required
                placeholder="Tell us a little about your project or property needs"
              ></textarea>
            </label>
            <button
              className="button gold"
              type="submit"
              disabled={contact.isPending}
            >
              {submitted ? (
                "Message sent — thank you!"
              ) : (
                <>
                  Send enquiry <Send size={17} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <footer>
        <div className="shell footer-main">
          <Logo />
          <div>
            <h4>Explore</h4>
            <a href="#properties">Properties</a>
            <a href="#services">Services</a>
            <a href="#about">About us</a>
          </div>
          <div>
            <h4>Services</h4>
            <a href="#services">Property sales</a>
            <a href="#services">Construction</a>
            <a href="#services">Estate development</a>
          </div>
          <div>
            <h4>Connect</h4>
            <a href="mailto:hello@solomonmultilink.com">
              hello@solomonmultilink.com
            </a>
            <a href="tel:+2347061199435">+234 706 119 9435</a>
            <a href="tel:+2347052714130">+234 705 271 4130</a>
            <span className="socials">
              <Facebook size={17} />
              <Instagram size={17} />
            </span>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2026 Solo Multi-Link. All rights reserved.</span>
          <span>RC 7149846</span>
          <span>Made with purpose</span>
        </div>
      </footer>
    </main>
  );
}
