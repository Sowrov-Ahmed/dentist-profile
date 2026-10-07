# Personal Dental Specialist Website

A complete standalone Next.js/TypeScript/Tailwind project for an individual dental specialist/doctor website. The website is built inside this `active-site` directory only and is independent from the master template used as the visual reference.

## Design direction

- Visual authority: Kliniko Home-2 inspired visual system.
- Navigation: `Home | About | Service | Case Study | Blog | Contact`.
- Website type: personal professional website for one dental specialist, not a hospital, clinic portal, multi-doctor marketplace, admin dashboard, or generic dental business.
- Content policy: no lorem ipsum, no unverifiable credentials, and no deceptive patient claims. Replace all profile, chamber, and case content with verified real information before production launch.

## Tech stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS pipeline with source-aligned custom CSS
- Swiper for Home-2 style carousels
- JSON-backed demo API routes
- Centralized API client with typed response envelopes

## Project structure

```txt
active-site/
  app/                    Next.js pages, metadata, API routes, sitemap, robots
  components/             Shared layout, UI, form, and card components
  features/               Domain/service layer for dental, services, cases, blog, home
  lib/api/                Central API configuration, client, response helpers, demo repository
  lib/seo/                Metadata and structured-data helpers
  data/                  Root JSON data used by demo API routes
  public/assets/          Independent copied/renamed assets used at runtime
  types/                  Shared TypeScript content and API contracts
  docs/                   Architecture, API, content, and QA notes
```

## Local setup

```bash
cd /home/user/active-site
cp .env.example .env.local
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Open the local/preview URL shown by the dev server.

## Production validation

```bash
npm run typecheck
npm run lint
npm run build
```

At the time of creation, these commands complete successfully. `npm install` reports dependency audit warnings from the package ecosystem; no force upgrade was applied because that can introduce breaking changes.

## Environment variables

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=/api/demo
```

For a future Laravel migration, set `NEXT_PUBLIC_API_BASE_URL` to the external Laravel API base URL while preserving the same response envelope documented in `docs/api.md`.

## API architecture

The application follows the required frontend-first migration path:

```txt
UI → Feature/Domain Logic → API Client/Service → Demo API → JSON Data
```

Server Components use the same service layer. During static build, the API client resolves `/api/demo` data through the internal demo repository so the project does not require a running HTTP server. Browser/client submissions still call the demo API routes.

## Main routes

- `/` Home
- `/about` About
- `/services` Service listing
- `/services/[slug]` Dynamic service details
- `/case-studies` Case Study listing
- `/case-studies/[slug]` Dynamic case details
- `/blog` Blog listing
- `/blog/[slug]` Dynamic blog details
- `/contact` Contact and appointment request
- `/api/demo/...` JSON demo endpoints
- `/sitemap.xml`, `/robots.txt`

## Export/ZIP note

If you later request a ZIP, exclude generated folders and caches such as `node_modules`, `.next`, `.turbo`, `.cache`, coverage/build output, and master-template files. This active project is self-contained under `/home/user/active-site`.
