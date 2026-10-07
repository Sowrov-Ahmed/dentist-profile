type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
  center?: boolean;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, light = false, center = false, className = "" }: SectionHeadingProps) {
  return (
    <div className={`source-title ${center ? "source-title-center" : ""} ${className}`} data-reveal>
      <span className={`source-eyebrow ${light ? "source-eyebrow-light" : ""} ${center ? "source-eyebrow-center" : ""}`}>
        <span className="source-title-icon" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className={`source-heading ${light ? "source-heading-light" : ""}`} data-title-reveal>
        {title}
      </h2>
      {description ? <p className={light ? "section-copy section-copy-light" : "section-copy"}>{description}</p> : null}
    </div>
  );
}
