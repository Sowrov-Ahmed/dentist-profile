import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/types/content";
import { ArrowIcon } from "@/components/ui/Icon";

export function CaseCard({ item, variant = "home" }: { item: CaseStudy; variant?: "home" | "grid" }) {
  if (variant === "grid") {
    return (
      <article className="case-card" data-reveal>
        <Link href={`/case-studies/${item.slug}`} className="case-image">
          <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 33vw" />
        </Link>
        <div className="case-info">
          <span className="case-category">{item.label}</span>
          <h2 className="card-title"><Link href={`/case-studies/${item.slug}`}>{item.title}</Link></h2>
          <p className="card-copy">{item.summary}</p>
          <Link className="card-link" href={`/case-studies/${item.slug}`}>View Case <ArrowIcon /></Link>
        </div>
      </article>
    );
  }

  return (
    <article className="home-case-card" data-reveal>
      <Link href={`/case-studies/${item.slug}`} className="home-case-image">
        <Image src={item.image} alt={item.title} fill sizes="(max-width: 991px) 100vw, 50vw" />
        <span>{item.label}</span>
      </Link>
      <div className="home-case-form" aria-hidden="true">
        <input readOnly value={item.title} tabIndex={-1} />
        <Link href={`/case-studies/${item.slug}`} aria-label={`View ${item.title}`}>
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}
