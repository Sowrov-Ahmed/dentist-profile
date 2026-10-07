import type { ReactNode } from "react";

export function TitleIcon() {
  return <span className="source-title-icon" aria-hidden="true" />;
}

export function AnimatedChars({ text }: { text: string }) {
  let charIndex = 0;
  return <>{text.split(" ").map((word, wordIndex, words) => <span aria-hidden="true" className="title-word-source" key={`${word}-${wordIndex}`}>{Array.from(word).map((char) => {
    const delay = charIndex * 0.01;
    charIndex += 1;
    return <span className="title-char" key={`${char}-${charIndex}`} style={{ transitionDelay: `${delay}s` }}>{char}</span>;
  })}{wordIndex < words.length - 1 ? <span className="title-space"> </span> : null}</span>)}</>;
}

export function SourceTitle({ eyebrow, title, center = false, light = false, className = "" }: { eyebrow: string; title: string; center?: boolean; light?: boolean; className?: string }) {
  return <div className={`source-title animation-style2 ${center ? "source-title-center text-center" : ""} ${className}`.trim()}>
    <p className={`source-eyebrow ${center ? "source-eyebrow-center" : ""} ${light ? "source-eyebrow-light" : ""}`.trim()}>{center ? <><TitleIcon />{eyebrow}<TitleIcon /></> : <><TitleIcon />{eyebrow}</>}</p>
    <h2 className={`source-heading ${light ? "source-heading-light" : ""}`.trim()} data-title-reveal aria-label={title}><AnimatedChars text={title} /></h2>
  </div>;
}

export function Home2SectionTitle({ eyebrow, title, center = false, light = false, className = "" }: { eyebrow: string; title: string; center?: boolean; light?: boolean; className?: string }) {
  return <div className={`home2-title source-title animation-style2 ${center ? "text-center" : ""} ${className}`.trim()}>
    <p className={`source-eyebrow ${center ? "source-eyebrow-center" : ""} ${light ? "source-eyebrow-light" : ""}`.trim()}>{center ? <><TitleIcon />{eyebrow}<TitleIcon /></> : <><TitleIcon />{eyebrow}</>}</p>
    <h2 className={`source-heading ${light ? "source-heading-light" : ""}`.trim()} data-title-reveal aria-label={title}><AnimatedChars text={title} /></h2>
  </div>;
}

export function TitleDivider({ className = "service-detail-divider" }: { className?: string }) {
  return <svg aria-hidden="true" className={className} width="120" height="10" viewBox="0 0 120 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 2C0 0.89543 0.895431 0 2 0H59.1716C59.702 0 60.2107 0.210714 60.5858 0.585786L66.5858 6.58579C67.8457 7.84572 66.9534 10 65.1716 10H2C0.89543 10 0 9.10457 0 8V2Z" fill="#0E1D4C" />
    <path d="M73.4142 3.41421C72.1543 2.15428 73.0466 0 74.8284 0H109.172C109.702 0 110.211 0.210714 110.586 0.585786L116.586 6.58579C117.846 7.84572 116.953 10 115.172 10H80.8284C80.298 10 79.7893 9.78929 79.4142 9.41421L73.4142 3.41421Z" fill="#159AAF" />
  </svg>;
}

export function ScreenReaderOnly({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

export function formatReadableDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "2-digit", year: "numeric" }).format(new Date(date));
}
