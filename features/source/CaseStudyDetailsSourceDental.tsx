import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { TitleDivider } from "@/components/source/SourceHelpers";
import type { CaseStudy, DentalService } from "@/types/content";

function caseHref(slug: string) {
  return `/case-studies/${slug}`;
}

function serviceHref(slug: string) {
  return `/services/${slug}`;
}

export function CaseStudyDetailsSourceDental({ item, relatedServices, relatedCases }: { item: CaseStudy; relatedServices: DentalService[]; relatedCases: CaseStudy[] }) {
  const primaryService = relatedServices[0]?.title || "Dental Planning";

  return <section className="source-service-detail-section source-case-detail-section" data-reveal="up">
    <div className="source-page-container">
      <div className="source-service-detail-layout source-case-detail-layout">
        <div className="source-service-detail-main" data-reveal="up">
          <div className="source-detail-panel source-case-detail-panel active">
            <article className="source-service-detail-card source-case-detail-card">
              <div className="source-service-detail-image source-case-detail-image"><Image src={item.detailImage} alt={item.title} width={870} height={520} priority /></div>
              <div className="source-service-detail-copy source-case-detail-copy">
                <h2>{item.title}</h2>
                <TitleDivider />
                <p>{item.summary}</p>

                <h3>Project Information</h3>
                <ul className="service-detail-list source-case-project-list">
                  <li>Category: {item.label}</li>
                  <li>Case Number: {item.number}</li>
                  <li>Primary Focus: {primaryService}</li>
                  <li>Record Type: Clinical planning case</li>
                </ul>

                <h3>Challenge</h3><p>{item.challenge}</p>
                <h3>Approach</h3><p>{item.approach}</p>
                <div className="service-detail-image-box source-case-detail-image-box">
                  {item.detailImages.map((image, index) => <Image key={image} src={image} alt={`${item.title} detail ${index + 1}`} width={380} height={280} />)}
                </div>
                <h3>Outcome</h3><p>{item.outcome}</p>
                <h3>Results Patients Discuss</h3>
                <ul className="service-detail-list mb-0">{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <div className="source-case-detail-actions mt-[35px] flex flex-wrap gap-[15px]"><Link className="source-service-read source-case-back-link" href="/case-studies">Back To List</Link></div>
              </div>
            </article>
          </div>
        </div>

        <aside className="source-service-detail-sidebar source-case-detail-sidebar">
          <div className="source-detail-widget source-case-info-widget" data-reveal="up" style={{ transitionDelay: "0.4s" }}>
            <h3>Project Information</h3>
            <ul className="source-case-info-list m-0 grid list-none gap-[14px] p-[30px]">
              <li><span>Category</span><strong>{item.label}</strong></li>
              <li><span>Case No.</span><strong>{item.number}</strong></li>
              <li><span>Primary Service</span><strong>{primaryService}</strong></li>
              <li><span>Type</span><strong>Clinical Planning</strong></li>
            </ul>
          </div>

          <div className="source-detail-widget source-case-related-widget" data-reveal="up" style={{ transitionDelay: "0.45s" }}>
            <h3>Related Cases</h3>
            <nav className="source-detail-services-nav" aria-label="Related Case Study navigation">
              {relatedCases.map((caseStudy) => <Link key={caseStudy.slug} href={caseHref(caseStudy.slug)}><span aria-hidden="true">»</span>{caseStudy.title}</Link>)}
            </nav>
          </div>

          <div className="source-detail-widget source-detail-service-widget" data-reveal="up" style={{ transitionDelay: "0.5s" }}>
            <h3>Our Services</h3>
            <nav className="source-detail-services-nav" aria-label="Case Study service navigation">
              {relatedServices.map((service) => <Link key={service.slug} href={serviceHref(service.slug)}><span aria-hidden="true">»</span>{service.title}</Link>)}
            </nav>
          </div>

          <div className="source-detail-widget source-detail-newsletter" data-reveal="up" style={{ transitionDelay: "0.55s" }}>
            <h3>News Letter</h3>
            <p>Subscribe to email and get recent dental care updates.</p>
            <NewsletterForm inputId="case-detail-email" className="source-detail-newsletter-form" statusClassName="source-detail-newsletter-status" placeholder="Email Address..." />
          </div>
        </aside>
      </div>
    </div>
  </section>;
}
