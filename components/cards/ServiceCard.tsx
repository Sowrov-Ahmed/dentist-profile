import Image from "next/image";
import Link from "next/link";
import type { DentalService } from "@/types/content";
import { ArrowIcon } from "@/components/ui/Icon";

export function ServiceCard({ service, index, variant = "source" }: { service: DentalService; index: number; variant?: "source" | "home" }) {
  if (variant === "home") {
    return (
      <article className="home-service-card" data-reveal>
        <div className="home-service-icon-row">
          <span className="home-service-icon" aria-hidden="true">
            <Image src={service.icon} alt="" width={70} height={70} />
          </span>
        </div>
        <span className="home-service-number">{String(index + 1).padStart(2, "0")}</span>
        <div className="home-service-text">
          <h3>{service.title}</h3>
          <p>{service.summary}</p>
        </div>
        <Link className="home-service-link" href={`/services/${service.slug}`}>
          Read More
        </Link>
      </article>
    );
  }

  return (
    <article className="source-service-card" data-reveal>
      <div className="source-service-icon-row">
        <span className="source-service-icon" aria-hidden="true">
          <Image src={service.icon} alt="" width={70} height={70} />
        </span>
      </div>
      <span className="source-service-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="source-service-text">
        <h2>{service.title}</h2>
        <p>{service.summary}</p>
      </div>
      <Link className="source-service-read" href={`/services/${service.slug}`}>
        Read More <ArrowIcon />
      </Link>
    </article>
  );
}
