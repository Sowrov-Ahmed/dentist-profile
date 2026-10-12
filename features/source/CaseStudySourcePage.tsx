import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/ui/DataState";
import { Icon } from "@/components/ui/Icon";
import { CaseStudyGridRevealGuard } from "@/features/source/CaseStudyGridRevealGuard";
import type { CaseStudy } from "@/types/content";

export type CaseStudyPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  previousPage: number | null;
  nextPage: number | null;
};

function caseHref(slug: string) {
  return `/case-studies/${slug}`;
}

function pageHref(page: number) {
  return `/case-studies?page=${page}`;
}

export function CaseStudySourcePage({ cases, pagination }: { cases: CaseStudy[]; pagination: CaseStudyPagination }) {
  const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1);
  const showPagination = pagination.totalItems > pagination.pageSize;
  const previousPage = pagination.previousPage ?? pagination.currentPage;
  const nextPage = pagination.nextPage ?? pagination.currentPage;
  const revealKey = `${pagination.currentPage}:${pagination.totalItems}:${cases.map((item) => item.slug).join("|")}`;

  return <section className="source-case-page relative z-[1] bg-white py-[110px] max-[767px]:py-20" data-reveal="up" data-case-grid-scope>
    <CaseStudyGridRevealGuard watchKey={revealKey} />
    <h2 className="sr-only">Dental Case Studies</h2>
    <div className="source-page-container">
      {cases.length === 0 ? <EmptyState title="No case studies available" message="Case-study records are not available from the API yet." /> : <>
        <div className="grid grid-cols-2 gap-[30px] max-[767px]:grid-cols-1">
          {cases.map((item, index) => <article className="source-case-card" data-reveal="up" style={{ transitionDelay: `${0.2 + (index % 3) * 0.1}s` }} key={item.slug}>
            <div className="source-case-image">
              <Link href={caseHref(item.slug)} aria-label={`Open ${item.title} case details`}>
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 767px) calc(100vw - 30px), 645px" priority={pagination.currentPage === 1 && index < 2} />
              </Link>
              <span className="source-case-label">{item.label}</span>
            </div>
            <div className="source-case-text">
              <form action={caseHref(item.slug)}>
                <label className="sr-only" htmlFor={`case-title-${pagination.currentPage}-${index}`}>{item.title}</label>
                <input id={`case-title-${pagination.currentPage}-${index}`} type="text" placeholder={item.shortTitle} readOnly />
                <button type="submit" aria-label={`Open ${item.title} case details`}><Icon name="arrow" size={22} strokeWidth={2.5} /></button>
              </form>
            </div>
          </article>)}
        </div>

        {showPagination ? <nav className="source-case-pagination" aria-label="Case Study pagination">
          <Link href={pageHref(previousPage)} className="pagi-btn" aria-label="Previous page" aria-disabled={pagination.previousPage === null ? true : undefined} tabIndex={pagination.previousPage === null ? -1 : undefined}>←</Link>
          <ul>
            {pages.map((page) => <li key={page}><Link className={page === pagination.currentPage ? "active" : undefined} href={pageHref(page)} aria-current={page === pagination.currentPage ? "page" : undefined}>{page}</Link></li>)}
          </ul>
          <Link href={pageHref(nextPage)} className="pagi-btn" aria-label="Next page" aria-disabled={pagination.nextPage === null ? true : undefined} tabIndex={pagination.nextPage === null ? -1 : undefined}>→</Link>
        </nav> : null}
      </>}
    </div>
  </section>;
}
