# Architecture

## Goal

This project is a standalone real-life personal website for one dental specialist. It intentionally does not copy the master template folder structure. The master template was used only as a read-only visual reference; runtime code, content, and assets live inside `active-site`.

## Layers

```txt
UI Components / App Pages
  ↓
Feature and Domain Services
  ↓
Central API Client
  ↓
API Routes
  ↓
JSON Content Data
```

## UI layer

- `app/*` contains route entry points, page metadata, dynamic route generation, `robots.ts`, and `sitemap.ts`.
- `components/layout` contains `Header` and `Footer`.
- `components/ui` contains reusable UI primitives such as buttons, breadcrumb, icons, motion provider, and back-to-top.
- `components/forms` contains client-side forms that submit to the API routes.
- `components/cards` contains reusable Service, Case, and Blog cards.
- `features/home/sections` contains source-inspired Home-2 sections.

Pages do not hardcode application data. They call feature services and pass typed data into components.

## Feature/domain service layer

- `features/dental/dental.service.ts`: site configuration, doctor profile, and home content.
- `features/services/service.service.ts`: services list, service details, featured/related service logic.
- `features/cases/case.service.ts`: case-study list, details, featured case logic.
- `features/blog/blog.service.ts`: blog list, details, latest-post and date-format logic.

These services are intentionally close to a future Laravel resource structure.

## API client layer

`lib/api/client.ts` exposes:

- `apiGet<T>()`
- `apiPost<TResponse, TBody>()`
- `unwrapApiData<T>()`

`lib/api/config.ts` centralizes:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- URL building
- local API detection

When `NEXT_PUBLIC_API_BASE_URL=/api` and code runs on the server, the client resolves data through `lib/api/content-source.ts` so static builds do not require a running web server. In the browser, forms and client interactions call `/api/...` normally.

## API layer

Routes under `app/api` return predictable typed envelopes:

```ts
{
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: {
    requestId: string;
    generatedAt: string;
    source: "bundled-content" | "remote-api";
    count?: number;
  };
}
```

## Data layer

JSON files live in root `data/`:

- `site.json`
- `doctor.json`
- `home.json`
- `services.json`
- `case-studies.json`
- `blog-posts.json`

Content is realistic but intentionally uses placeholder contact details and non-credentialed descriptions to avoid deceptive claims.

## Styling and interaction

- `app/globals.css` contains the source-inspired Home-2 visual rhythm, colors, spacing, cards, buttons, header, footer, forms, responsive behavior, and motion.
- `Swiper` is used for Home-2 style services, cases, and testimonials carousels.
- `MotionProvider` applies reveal animations with `IntersectionObserver` and respects `prefers-reduced-motion`.
- Forms include loading, success, and error states.

## Future Laravel migration

To migrate data handling later:

1. Build Laravel API endpoints matching `docs/api.md`.
2. Preserve the response envelope or adapt `lib/api/client.ts` in one place.
3. Set `NEXT_PUBLIC_API_BASE_URL` to the Laravel API base URL.
4. Keep UI components unchanged unless data fields change.
