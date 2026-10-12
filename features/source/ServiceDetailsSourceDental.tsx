import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { TitleDivider } from "@/components/source/SourceHelpers";
import type { DentalService } from "@/types/content";
import { ScopedRevealGuard } from "./ScopedRevealGuard";

function serviceHref(slug: string) {
  return `/services/${slug}`;
}

export function ServiceDetailsSourceDental({ service, relatedServices }: { service: DentalService; relatedServices: DentalService[] }) {
  const firstSection = service.detailSections[0];
  const secondSection = service.detailSections[1];
  const revealWatchKey = ["service-detail", service.slug, relatedServices.map((item) => item.slug).join("|")].join(":");

  return <section className="source-service-detail-section" data-service-detail-scope data-reveal="up">
    <ScopedRevealGuard scopeSelector="[data-service-detail-scope]" watchKey={revealWatchKey} />
    <div className="source-page-container">
      <div className="source-service-detail-layout">
        <div className="source-service-detail-main" data-reveal="up">
          <div className="source-detail-panel active">
            <article className="source-service-detail-card">
              <div className="source-service-detail-image"><Image src={service.detailImage} alt={service.title} width={870} height={520} priority /></div>
              <div className="source-service-detail-copy">
                <h2>{service.title}</h2>
                <TitleDivider />
                <p>{service.description}</p>

                {firstSection ? <>
                  <h3>{firstSection.heading}</h3>
                  <p>{firstSection.body}</p>
                </> : null}

                <ul className="service-detail-list">{service.features.map((item) => <li key={item}>{item}</li>)}</ul>

                <div className="service-detail-image-box">
                  {service.detailImages.map((image, index) => <Image key={image} src={image} alt={`${service.title} procedure ${index + 1}`} width={380} height={280} />)}
                </div>

                {secondSection ? <>
                  <h3>{secondSection.heading}</h3>
                  <p>{secondSection.body}</p>
                </> : null}

                {service.procedureSteps?.length ? <>
                  <h3>Procedure Information</h3>
                  <ul className="service-detail-list">{service.procedureSteps.map((item) => <li key={item}>{item}</li>)}</ul>
                </> : null}

                <h3>Benefits Patients Discuss</h3>
                <ul className="service-detail-list mb-0">{service.benefits.map((item) => <li key={item}>{item}</li>)}</ul>

                {service.faqs?.length ? <div className="service-detail-faqs mt-[35px]">
                  <h3>Common Patient Questions</h3>
                  {service.faqs.map((item) => <div className="service-detail-faq mt-[18px] border-t border-[rgba(14,29,76,.12)] pt-[18px]" key={item.question}>
                    <h4>{item.question}</h4>
                    <p>{item.answer}</p>
                  </div>)}
                </div> : null}
              </div>
            </article>
          </div>
        </div>
        <aside className="source-service-detail-sidebar">
          <div className="source-detail-widget source-detail-service-widget">
            <h3>Our Services</h3>
            <nav className="source-detail-services-nav" aria-label="Services details navigation">
              {relatedServices.map((item) => <Link key={item.slug} className={item.slug === service.slug ? "active" : ""} aria-current={item.slug === service.slug ? "page" : undefined} href={serviceHref(item.slug)}><span aria-hidden="true">»</span>{item.title}</Link>)}
            </nav>
          </div>
          <div className="source-detail-widget source-detail-newsletter">
            <h3>News Letter</h3>
            <p>Subscribe email and get recent dental education updates.</p>
            <NewsletterForm inputId="service-detail-email" className="source-detail-newsletter-form" statusClassName="source-detail-newsletter-status" placeholder="Email address..." />
          </div>
        </aside>
      </div>
    </div>
  </section>;
}
