export type PageHeroProps = {
  /** Short section label. Rendered subordinate to the heading. */
  eyebrow: string;
  /** Page-specific headline. Rendered as the document's single `<h1>`. */
  title: string;
  /** One sentence explaining what the page offers. */
  description: string;
  /** Optional supplementary row (e.g. chamber counts, selected-chamber notice). */
  meta?: React.ReactNode;
  /** Stable id so the section can be labelled by its heading. */
  headingId?: string;
};

/**
 * The single hero used by every page route.
 *
 * Structure and styling are identical across About, Services, Service Detail, Case Study,
 * Case Study Detail, Blog, Blog Detail, Chambers, Contact, and Appointment so the pages read
 * as one system: eyebrow, headline, supporting paragraph, then an optional meta
 * row. Sizing lives here and nowhere else, so all ten routes stay in step — a per-page
 * override is what let these heroes drift into looking undersized next to the Home page.
 * Copy is supplied by the caller (page heroes from the `/page-heroes` endpoint,
 * detail-page heroes resolved from the record itself), so this component owns presentation only.
 *
 * Deliberately no breadcrumb trail: this is a page header, not a navigation element. The
 * surrounding header already carries site navigation, and repeating "Home / Page" here
 * duplicated that trail above every headline.
 */
export function PageHero({ eyebrow, title, description, meta, headingId = "page-hero-title" }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy" aria-labelledby={headingId}>
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[url('/assets/img/breadcrumb-bg.jpg')] bg-cover bg-center" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(14,29,76,.96),rgba(14,29,76,.88)_52%,rgba(21,154,175,.82))]" />

      {/* Vertical rhythm. The padding is deliberately asymmetric — slightly tighter at the top,
          roomier at the bottom — so the headline sits close to where the breadcrumb trail
          formerly began, while the hero still separates cleanly from the section that follows.
          The values are the responsive Tailwind spacing scale (not fixed heights), so the hero
          grows with its content instead of being pinned to a box: a long detail-page title
          simply wraps and the hero gets taller. */}
      <div className="mx-auto w-[min(100%-30px,1320px)] pb-14 pt-12 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
        {/* The eyebrow is the first flow child, so it carries no top margin: the container's
            `pt-*` blocks margin collapse, and any `mt-*` here would strand a blank band at the
            top of the hero where the accent rule used to sit. */}
        <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-teal sm:text-[12px]">{eyebrow}</p>

        {/* Wrapping: the heading is given the full width of the hero column so it sits on one
            line whenever it comfortably fits, and falls to a second line only when it cannot.
            An earlier `max-w-[44rem]` capped the measure at 704px, which forced nine of the ten
            page headings to break in the middle of a sentence. `text-balance` compounded it —
            it exists to even out line lengths, so it was splitting text that never needed to
            split. `text-pretty` is the right trade here: it still prevents a lone word being
            orphaned onto the last line, but leaves headings that fit alone on one line.
            `break-words` remains as a guard so an unusually long unbroken dynamic title can
            never push the hero into horizontal overflow. */}
        <h1
          id={headingId}
          className="mt-3 break-words text-pretty text-[30px] font-semibold leading-[1.18] text-white sm:text-[36px] lg:text-[44px]"
        >
          {title}
        </h1>

        <p className="mt-5 max-w-[42rem] text-[15px] leading-[1.7] text-white/80 sm:text-[16px] lg:text-[17px]">{description}</p>

        {meta ? <div className="mt-7">{meta}</div> : null}
      </div>
    </section>
  );
}