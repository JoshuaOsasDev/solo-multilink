"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { Footer, Header } from "../../../components/site";
import {
  formatNaira,
  getProperty,
  propertyImage,
  propertySlugImages,
} from "../../../lib/api";
import Image from "next/image";

export default function Detail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next supplies route params as a promise; React unwraps it in client components.
  const { slug } = use(params);
  const {
    data: property,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => getProperty(slug),
  });
  if (isPending)
    return (
      <>
        <Header />
        <main className="page-section">
          <div className="shell">
            <p className="lead">Loading property…</p>
          </div>
        </main>
        <Footer />
      </>
    );
  if (isError || !property)
    return (
      <>
        <Header />
        <main className="page-section">
          <div className="shell">
            <h1>Property not found</h1>
            <Link className="text-link" href="/properties">
              Back to listings
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  const images = property.images.map((image) =>
    image.image.includes("uploads")
      ? image.image
      : `http://localhost:8000${image.image}`,
  );
  const mainImage = propertySlugImages(property);
  console.log("Property detail:", mainImage, property);
  return (
    <>
      <Header />
      <section className="page-section" style={{ paddingBottom: 35 }}>
        <div className="shell">
          <Link href="/properties" className="text-link">
            <ArrowLeft size={17} /> Back to listings
          </Link>
          <div className="detail-gallery">
            <img src={mainImage[0]} alt={property.title} />
            <aside>
              {(mainImage.slice(1, 3).length
                ? mainImage.slice(1, 3)
                : [mainImage[0], mainImage[0]]
              ).map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${property.title} view ${index + 2}`}
                />
              ))}
            </aside>
          </div>
          <div className="detail-body">
            <article>
              <div className="eyebrow">
                <span /> {property.property_type.toUpperCase()}
              </div>
              <h1 className="detail-title">{property.title}</h1>
              <p className="location">
                <MapPin size={16} />
                {property.location}
              </p>
              <p className="detail-price">{formatNaira(property.price)}</p>
              <div className="facts">
                <div>
                  <span>BEDROOMS</span>
                  <strong>
                    <BedDouble size={16} /> {property.bedrooms} Bedrooms
                  </strong>
                </div>
                <div>
                  <span>BATHROOMS</span>
                  <strong>
                    <Bath size={16} /> {property.bathrooms} Bathrooms
                  </strong>
                </div>
                <div>
                  <span>LAND SIZE</span>
                  <strong>
                    <Ruler size={16} /> {property.land_size || "Not specified"}
                  </strong>
                </div>
                <div>
                  <span>STATUS</span>
                  <strong>{property.status}</strong>
                </div>
              </div>
              <h2>
                Designed for <i>everyday ease.</i>
              </h2>
              <p className="lead">{property.description}</p>
            </article>
            <aside className="agent-card">
              <div className="eyebrow">
                <span /> ENQUIRE NOW
              </div>
              <h3>Interested in this property?</h3>
              <p>Arrange a viewing or speak with our property team today.</p>
              <Link
                className="button"
                style={{ background: "#033b2e", color: "white" }}
                href="/contact"
              >
                Contact an agent
              </Link>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
