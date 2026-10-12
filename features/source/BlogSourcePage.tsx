import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Icon } from "@/components/ui/Icon";
import { BlogGridRevealGuard } from "@/features/source/BlogGridRevealGuard";
import { EmptyState } from "@/components/ui/DataState";
import { formatReadableDate } from "@/components/source/SourceHelpers";
import type { BlogPost, DentalService } from "@/types/content";

export type BlogPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
};

function AngleIcon() { return <span className="source-blog-angle" aria-hidden="true">»</span>; }

function pageHref(page: number, filters: { search?: string; tag?: string }) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (filters.search) params.set("search", filters.search);
  if (filters.tag) params.set("tag", filters.tag);
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function BlogSourcePage({ posts, services, latest, pagination, filters }: { posts: BlogPost[]; services: DentalService[]; latest: BlogPost[]; pagination: BlogPagination; filters: { search?: string; tag?: string } }) {
  const pages = Array.from({ length: pagination.totalPages }, (_, index) => index + 1);
  const previousPage = pagination.currentPage > 1 ? pagination.currentPage - 1 : pagination.currentPage;
  const nextPage = pagination.currentPage < pagination.totalPages ? pagination.currentPage + 1 : pagination.currentPage;
  const emptyMessage = filters.search || filters.tag ? "No article matched the selected dental education filters." : "Blog article records are not available from the API yet.";
  const revealKey = `${pagination.currentPage}:${pagination.totalItems}:${filters.search || ""}:${filters.tag || ""}:${posts.map((post) => post.slug).join("|")}`;

  return <section className="source-blog-section" data-reveal="up" data-blog-grid-scope>
    <BlogGridRevealGuard watchKey={revealKey} />
    <div className="source-blog-container">
      <div className="source-blog-layout">
        <div className="source-blog-main">
          {posts.length === 0 ? <EmptyState title="No blog posts available" message={emptyMessage} /> : <>
            <div className="grid grid-cols-2 items-stretch gap-[30px] max-[767px]:grid-cols-1">
              {posts.map((post, index) => <article className="source-blog-card source-blog-grid-card" data-reveal="up" style={{ transitionDelay: `${0.2 + (index % 3) * 0.1}s` }} key={post.slug}>
                <div className="source-blog-image"><Link href={`/blog/${post.slug}`} aria-label={post.title}><Image src={post.image} alt={post.title} width={420} height={260} loading={index < 2 ? "eager" : "lazy"} /></Link><p className="source-blog-date">{formatReadableDate(post.date)}</p></div>
                <div className="source-blog-content">
                  <div className="source-blog-meta"><Link href={`/blog/${post.slug}`}><Icon name="user" size={15} /> {post.author}</Link><Link href={`/blog/${post.slug}`}><Icon name="comments" size={15} /> ({String(post.comments).padStart(2, "0")}) comments</Link></div>
                  <div className="source-blog-text"><Link href={`/blog/${post.slug}`}><h2>{post.title}</h2></Link><div className="source-blog-actions"><Link className="source-blog-read" href={`/blog/${post.slug}`}>read more</Link><Link className="source-blog-share" href={`/blog/${post.slug}`} aria-label={`Share ${post.title}`}><Icon name="share" size={20} strokeWidth={2.6} /></Link></div></div>
                </div>
              </article>)}
            </div>
            {pagination.totalPages > 1 ? <nav className="source-blog-pagination" aria-label="Blog pagination"><Link href={pageHref(previousPage, filters)} className="source-blog-page-button" aria-label="Previous page" aria-disabled={pagination.currentPage === 1}>←</Link><ul>{pages.map((page) => <li key={page}><Link href={pageHref(page, filters)} className={page === pagination.currentPage ? "active" : undefined} aria-current={page === pagination.currentPage ? "page" : undefined}>{page}</Link></li>)}</ul><Link href={pageHref(nextPage, filters)} className="source-blog-page-button" aria-label="Next page" aria-disabled={pagination.currentPage === pagination.totalPages}>→</Link></nav> : null}
          </>}
        </div>
        <aside className="source-blog-sidebar" aria-label="Blog sidebar">
          <div className="source-blog-widget source-blog-search-widget"><h3>Search</h3><form action="/blog"><label className="sr-only" htmlFor="blog-grid-search">Search blog</label><input id="blog-grid-search" name="search" type="search" defaultValue={filters.search} placeholder="Search dental articles..." />{filters.tag ? <input type="hidden" name="tag" value={filters.tag} /> : null}<button type="submit">search</button></form></div>
          <div className="source-blog-widget source-blog-service-widget"><h3>Our Services</h3><nav className="source-blog-services-nav" aria-label="Our services">{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}><AngleIcon />{service.title}</Link>)}</nav></div>
          <div className="source-blog-widget source-blog-latest-widget"><h3>latest News</h3><div className="source-blog-latest-wrap">{latest.map((item) => <div className="source-blog-latest" key={item.slug}><div className="source-blog-latest-image"><Link href={`/blog/${item.slug}`}><Image src={item.image} alt={item.title} width={100} height={100} loading="lazy" /></Link></div><div className="source-blog-latest-body"><p className="source-blog-latest-meta"><Icon name="calendar" size={15} /> {formatReadableDate(item.date)}</p><h4><Link href={`/blog/${item.slug}`}>{item.title}</Link></h4></div></div>)}</div></div>
          <div className="source-blog-widget source-blog-newsletter-widget"><h3>News Letter</h3><p>Subscribe email and get recent dental care news and updates.</p><NewsletterForm inputId="blog-grid-email" className="source-blog-newsletter-form" statusClassName="source-blog-newsletter-status" placeholder="Email address..." /></div>
        </aside>
      </div>
    </div>
  </section>;
}
