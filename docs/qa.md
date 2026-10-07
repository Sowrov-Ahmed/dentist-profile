# QA Report

Date: 2026-10-03
Project root: `/home/user/active-site`

## Technical validation

| Check | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed, 44 routes generated/validated |
| Production server | Passed, running on `0.0.0.0:3000` |
| Runtime master filesystem references | Passed, no `/home/user/public` or `../public` runtime references |
| API architecture | Passed, pages use service/API layer and demo routes read JSON data |

## Route checks

All checked with HTTP requests against the production server.

| Route | Result |
|---|---:|
| `/` | 200 |
| `/about` | 200 |
| `/services` | 200 |
| `/services/root-canal-treatment` | 200 |
| `/case-studies` | 200 |
| `/case-studies/conservative-smile-planning` | 200 |
| `/blog` | 200 |
| `/blog/root-canal-treatment-myths` | 200 |
| `/contact` | 200 |
| `/sitemap.xml` | 200 |
| `/robots.txt` | 200 |

## API checks

| Endpoint | Result |
|---|---:|
| `GET /api/demo/site` | 200 |
| `GET /api/demo/navigation` | 200 |
| `GET /api/demo/doctor` | 200 |
| `GET /api/demo/services` | 200 |
| `GET /api/demo/services/root-canal-treatment` | 200 |
| `GET /api/demo/case-studies` | 200 |
| `GET /api/demo/blog` | 200 |
| `GET /api/demo/testimonials` | 200 |
| `GET /api/demo/faqs` | 200 |
| `POST /api/demo/contact` valid payload | 200 |

## Master fidelity verification

The implementation was repaired section-by-section against the master source files listed in `docs/master-fidelity-audit.md`.

| Page | Verification summary |
|---|---|
| Home | HTML contains Home-2 master section classes: `home2-hero`, `home2-about`, `home2-services`, `home2-video-count`, `home2-choose`, `home2-cases`, `home2-appointment`, `home2-testimonials`, `home2-blog`. |
| About | HTML contains master about/source classes: `about-source`, `home-service`, `about-videoCount`, `about-choose-source`, testimonial/blog sections. |
| Service | HTML contains `source-service-page`, `source-service-grid`, `source-service-appoint`, `service-doctors`, testimonial/blog sections. |
| Service Details | Dynamic route contains `source-service-detail-section`, `source-service-detail-card`, sidebar widgets, feature lists, and detail image pair. |
| Case Study | HTML contains `source-case-page`, `source-case-grid`, `source-case-card`, overlay label/title form pattern, and pagination. |
| Case Details | Dynamic route contains `source-case-detail-section`, `source-case-detail-card`, source sidebar widgets, and case detail image pair. |
| Blog Grid | HTML contains `source-blog-grid-page`, 8 article cards, source sidebar widgets, and pagination. |
| Blog Details | Dynamic route contains `source-blog-details-section`, detail image, metadata, content, video block, quote, tags/share, comments, reply form, and sidebar. |
| Contact | HTML contains `source-contact-section`, source contact cards, source contact form, and `source-contact-map`. |

## Responsive coverage

Master CSS responsive breakpoints were restored by copying the master global style system into `active-site/app/globals.css` and applying active-site overrides only where needed for data-driven links. The implementation includes desktop/tablet/mobile rules for:

- Home-2 hero/person positioning and stacked mobile layout.
- Source service grids and detail/sidebar layouts.
- Source case grids and card overlay sizing.
- Blog grid/sidebar collapse.
- Contact form and contact-card stacking.
- Header desktop nav and mobile drawer.

## Issue → Cause → Fix → Verification

| Issue | Cause | Fix | Verification |
|---|---|---|---|
| Home was using a generic hybrid layout rather than Home-2. | Initial active implementation used simplified custom sections. | Rebuilt Home with Home-2 class structure and data-driven content in `HomeTwoDental`. | Route `/` returns 200 and contains all Home-2 section classes. |
| Root content now lives in organized JSON files under `data/`. | Initial scaffold grouped some content as temporary demo files. | Removed stale duplicate demo content and updated demo repository imports to root JSON files. | API routes return data from root JSON and build passes. |
| Service/case/blog sections had too little visual density. | Earlier content had too few items for master grid density. | Added 6 services, 6 cases, 8 blog posts, 4 testimonials, FAQs, and contact content. | Listing pages render complete source grids and route checks pass. |
| Detail pages were visually simplified. | Active detail layouts did not match source detail card/sidebar structures. | Rebuilt service, case, and blog detail pages with master source detail class hierarchy. | Dynamic detail routes return 200 and contain expected source detail classes. |
| Master motion behavior was simplified. | Active `MotionProvider` only handled basic reveals. | Restored master reveal/title/parallax/mouse motion behavior with reduced-motion handling. | Build/lint/typecheck pass; sections use original `data-reveal`, `data-title-reveal`, and parallax attributes. |
| Runtime assets risked depending on the master. | Source classes reference `/assets/img/...`. | Copied master assets into `active-site/public/assets/img`. | Runtime grep confirms no `/home/user/public` filesystem references. |

## Screenshot note

The sandbox does not provide a browser screenshot binary such as Chromium, Firefox, Playwright, or wkhtmltoimage. Visual QA was therefore performed through direct source-to-source template inspection, restored master class/asset structures, runtime HTML verification, route checks, and production preview startup. The live preview remains available for human visual inspection on port `3000`.
