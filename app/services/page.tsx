"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, Hammer, ShieldCheck } from "lucide-react";
import { Footer, Header, PageCta, PageHero } from "../../components/site";
import { getServices } from "../../lib/api";

export default function ServicesPage() {
  const {
    data: services = [],
    isPending,
    isError,
  } = useQuery({ queryKey: ["services"], queryFn: getServices });
  const iconMap = { Building2, Hammer, ShieldCheck };
  return (
    <>
      <Header />
      <PageHero
        label="Services"
        title={
          <>
            One team. Every
            <br />
            <i>essential service.</i>
          </>
        }
      />
      <section className="page-section">
        <div className="shell">
          <div className="eyebrow">
            <span /> OUR EXPERTISE
          </div>
          <h2>
            A complete path from
            <br />
            <i>vision to value.</i>
          </h2>
          <p className="lead">
            Whether you are planning, purchasing, developing or renovating, our
            services work together to keep your project moving forward.
          </p>
          {isPending && <p className="lead">Loading services…</p>}
          {isError && (
            <p className="lead">We couldn&apos;t load services right now.</p>
          )}
          <div className="service-page-grid" style={{ marginTop: 40 }}>
            {services.map((service) => {
              const Icon =
                iconMap[service.icon as keyof typeof iconMap] ?? Building2;
              return (
                <article className="service-page-card" key={service.id}>
                  <div className="service-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <PageCta />
      <Footer />
    </>
  );
}
