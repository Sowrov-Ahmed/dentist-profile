import type { HomeContent } from "@/types/content";
import { PlayIcon } from "@/components/ui/Icon";

export function VideoCountSection({ content }: { content: HomeContent["videoCount"] }) {
  return (
    <section className="home-video-count" style={{ backgroundImage: "url('/assets/images/common/video-bg.png')" }}>
      <div className="home-video-overlay" />
      <div className="home-video-content" data-reveal>
        <a href="/about" className="video-play" aria-label="Learn about dental care approach">
          <PlayIcon />
        </a>
        <h2>{content.title}</h2>
        <p>{content.description}</p>
      </div>
    </section>
  );
}
