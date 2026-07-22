"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin } from "lucide-react";
import { Footer, Header, PageHero } from "../../components/site";
import { formatNaira, getProperties, propertyImage } from "../../lib/api";
import Whatsapp from "../../components/common/whatapp";

export default function PropertiesPage() {
  const {
    data: properties = [],
    isPending,
    isError,
  } = useQuery({ queryKey: ["properties"], queryFn: () => getProperties() });
  console.log("Properties page data:", properties);
  return (
    <>
      <Header />
      <PageHero
        label="Properties"
        title={
          <>
            Find your next
            <br />
            <i>great address.</i>
          </>
        }
      />
      <section className="page-section">
        <div className="shell">
          <div className="listing-head">
            <div>
              <div className="eyebrow">
                <span /> OUR LISTINGS
              </div>
              <h2>
                Properties with <i>possibility.</i>
              </h2>
            </div>
          </div>
          {isPending && <p className="lead">Loading properties…</p>}
          {isError && (
            <p className="lead">
              We couldn&apos;t load properties right now. Please try again
              shortly.
            </p>
          )}
          {!isPending &&
            !isError &&
            (properties.length ? (
              <div className="listing-grid">
                {properties.map((property) => (
                  <article className="listing-card" key={property.id}>
                    <img src={propertyImage(property)} alt={property.title} />
                    <div className="copy">
                      <h3>{property.title}</h3>
                      <p>
                        <MapPin size={14} /> {property.location}
                      </p>
                      <div className="bottom">
                        <span>{formatNaira(property.price)}</span>
                        <Link href={`/properties/${property.slug}`}>
                          View details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="lead">No properties are currently available.</p>
            ))}
        </div>
      </section>
      <Footer />
      <Whatsapp />
    </>
  );
}
