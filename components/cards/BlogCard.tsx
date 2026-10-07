import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/content";
import { formatPostDate } from "@/features/blog/blog.service";
import { ArrowIcon } from "@/components/ui/Icon";

export function BlogCard({ post, variant = "home" }: { post: BlogPost; variant?: "home" | "list" }) {
  if (variant === "list") {
    return (
      <article className="source-blog-card" data-reveal>
        <Link href={`/blog/${post.slug}`} className="source-blog-image">
          <Image src={post.image} alt={post.title} width={860} height={510} />
          <span className="source-blog-date">{formatPostDate(post.date)}</span>
        </Link>
        <div className="source-blog-content">
          <div className="source-blog-meta">
            <span>{post.category}</span>
            <span>{post.readTime}</span>
          </div>
          <div className="source-blog-text">
            <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
          </div>
          <p>{post.excerpt}</p>
          <div className="source-blog-actions">
            <Link className="source-blog-read" href={`/blog/${post.slug}`}>Read More</Link>
            <Link className="source-blog-share" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}><ArrowIcon /></Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="home-blog-card" data-reveal>
      <Link href={`/blog/${post.slug}`} className="home-blog-image">
        <Image src={post.image} alt={post.title} fill sizes="(max-width: 850px) 100vw, 33vw" />
        <p>{formatPostDate(post.date)}</p>
      </Link>
      <div className="home-blog-content">
        <div className="home-blog-meta">
          <span>{post.category}</span>
          <span>{post.readTime}</span>
        </div>
        <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <div className="home-blog-actions">
          <Link className="home-blog-read" href={`/blog/${post.slug}`}>Read More</Link>
          <Link className="home-blog-share" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}><ArrowIcon /></Link>
        </div>
      </div>
    </article>
  );
}
