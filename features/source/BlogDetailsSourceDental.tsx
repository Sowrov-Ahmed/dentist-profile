import Image from "next/image";
import Link from "next/link";
import { BlogCommentForm } from "@/components/forms/BlogCommentForm";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { BlogVideoModalTrigger } from "@/components/source/BlogVideoModalTrigger";
import { TitleDivider, formatReadableDate } from "@/components/source/SourceHelpers";
import { EmptyState } from "@/components/ui/DataState";
import { Icon } from "@/components/ui/Icon";
import type { BlogPost, DentalService } from "@/types/content";

function CheckMark() { return <span className="source-blog-check" aria-hidden="true">✓</span>; }
function AngleIcon() { return <span className="source-blog-angle" aria-hidden="true">»</span>; }
function EyeIcon() { return <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6zM12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" /></svg>; }

function tagHref(tag: string) {
  return `/blog?tag=${encodeURIComponent(tag)}`;
}

export function BlogDetailsSourceDental({ post, services, relatedPosts }: { post: BlogPost; services: DentalService[]; relatedPosts: BlogPost[] }) {
  const articlePath = `/blog/${post.slug}`;

  return <section className="source-blog-section source-blog-details-section" data-reveal="up">
    <div className="source-blog-container">
      <div className="source-blog-layout">
        <div className="source-blog-main">
          <div className="source-blog-details-page">
            <article className="source-blog-detail-card" data-reveal="up" style={{ transitionDelay: "0.2s" }}>
              <div className="source-blog-detail-image"><Image src={post.detailImage} alt={post.title} width={870} height={520} priority /></div>
              <div className="source-blog-detail-content">
                <div className="source-blog-detail-meta" data-reveal="up" style={{ transitionDelay: "0.2s" }}>
                  <Link href={articlePath}><Icon name="user" size={15} /> {post.author}</Link><Link href={articlePath}><Icon name="comments" size={15} /> ({String(post.comments).padStart(2, "0")}) comments</Link><Link href={articlePath}><EyeIcon /> ({post.views}) views</Link>
                </div>
                <div className="source-blog-detail-text" data-reveal="up" style={{ transitionDelay: "0.2s" }}>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  {post.content.slice(0, 2).map((block) => <section key={block.heading}><h3>{block.heading}</h3><p>{block.body}</p></section>)}
                  <ul>{post.checklist.slice(0, 5).map((item) => <li key={item}><CheckMark /> {item}</li>)}</ul>
                  <BlogVideoModalTrigger image={post.videoImage} title={`${post.title} video`} />
                  {post.content.slice(2).map((block) => <section key={block.heading}><h3>{block.heading}</h3><p>{block.body}</p></section>)}
                  <div className="source-blog-quote"><Image src="/assets/img/qoute.png" alt="quote" width={80} height={80} loading="lazy" /><p>“{post.quote.text}”</p><h3>{post.quote.name}</h3><span>{post.quote.role}</span></div>
                  <h3>Practical Takeaways</h3>
                  <ul className="source-blog-list-full">{post.checklist.map((item) => <li key={item}><CheckMark /> {item}</li>)}</ul>
                </div>
                <div className="source-blog-tag-share"><div className="source-blog-tags"><label>tags:</label>{post.tags.map((tag) => <Link key={tag} href={tagHref(tag)}>{tag}</Link>)}</div><ul className="source-blog-social" aria-label="Share article"><li><span>Share:</span></li><li><Link href={articlePath} aria-label={`Share ${post.title} on Instagram`}>◎</Link></li><li><Link href={articlePath} aria-label={`Share ${post.title} on Twitter`}>♥</Link></li><li><Link href={articlePath} aria-label={`Share ${post.title} on Facebook`}>f</Link></li></ul></div>
              </div>
            </article>
            <section className="source-blog-comments" data-reveal="up"><h2>Comments</h2><TitleDivider className="source-blog-title-divider" />{post.commentsList.length === 0 ? <EmptyState title="No comments yet" message="Comments will appear here after moderation." /> : <ul className="source-blog-comments-list">{post.commentsList.map((comment) => <li key={comment.id}><div className="source-blog-comment-item source-blog-comment-parent"><div className="source-blog-comment-wrap"><div className="source-blog-comment-image"><Image src={comment.image} alt={comment.name} width={130} height={130} loading="lazy" /></div><div className="source-blog-comment-text"><div className="source-blog-comment-head"><span><Icon name="calendar" size={15} /> {formatReadableDate(comment.date)}</span><button type="button">reply</button></div><h3>{comment.name}</h3><p>{comment.body}</p></div></div></div>{comment.replies?.length ? <ul className="source-blog-comment-replies">{comment.replies.map((reply) => <li className="source-blog-comment-item" key={reply.id}><div className="source-blog-comment-wrap"><div className="source-blog-comment-image"><Image src={reply.image} alt={reply.name} width={130} height={130} loading="lazy" /></div><div className="source-blog-comment-text"><div className="source-blog-comment-head"><span><Icon name="calendar" size={15} /> {formatReadableDate(reply.date)}</span><button type="button">reply</button></div><h3>{reply.name}</h3><p>{reply.body}</p></div></div></li>)}</ul> : null}</li>)}</ul>}</section>
            <section className="source-blog-reply" data-reveal="up"><h2>leave a comment</h2><TitleDivider className="source-blog-title-divider" /><BlogCommentForm postSlug={post.slug} /></section>
          </div>
        </div>
        <aside className="source-blog-sidebar" aria-label="Blog sidebar"><div className="source-blog-widget source-blog-search-widget"><h3>Search</h3><form action="/blog" data-reveal="up" style={{ transitionDelay: "0.2s" }}><label className="sr-only" htmlFor="blog-details-search">Search blog</label><input id="blog-details-search" name="search" type="search" placeholder="Search articles..." /><button type="submit">search</button></form></div><div className="source-blog-widget source-blog-service-widget"><h3>Our Services</h3><nav className="source-blog-services-nav" aria-label="Our services" data-reveal="up" style={{ transitionDelay: "0.2s" }}>{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`}><AngleIcon />{service.title}</Link>)}</nav></div><div className="source-blog-widget source-blog-latest-widget" aria-label="Related blog articles"><h3>latest News</h3><div className="source-blog-latest-wrap" data-reveal="up" style={{ transitionDelay: "0.2s" }}>{relatedPosts.map((item) => <div className="source-blog-latest" key={item.slug}><div className="source-blog-latest-image"><Link href={`/blog/${item.slug}`}><Image src={item.image} alt={item.title} width={100} height={100} loading="lazy" /></Link></div><div className="source-blog-latest-body"><p className="source-blog-latest-meta"><Icon name="calendar" size={15} /> {formatReadableDate(item.date)}</p><h4><Link href={`/blog/${item.slug}`}>{item.title}</Link></h4></div></div>)}</div></div><div className="source-blog-widget source-blog-newsletter-widget"><h3>News Letter</h3><p data-reveal="up" style={{ transitionDelay: "0.2s" }}>Subscribe email and get recent dental care updates.</p><NewsletterForm inputId="blog-details-email" className="source-blog-newsletter-form" statusClassName="source-blog-newsletter-status" placeholder="Email address..." /></div></aside>
      </div>
    </div>
  </section>;
}
