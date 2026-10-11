# API Documentation

Base URL is controlled by:

```env
NEXT_PUBLIC_API_BASE_URL=/api
```

The API reads maintainable root JSON files in `data/` (`site.json`, `navigation.json`, `doctor.json`, `services.json`, `case-studies.json`, `blog-posts.json`, `testimonials.json`, `faqs.json`, and `contact.json`).

## Response envelope

All API responses use this structure:

```ts
type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  meta: {
    requestId: string;
    generatedAt: string;
    source: "bundled-content" | "remote-api";
    count?: number;
  };
};
```

## Endpoints

### `GET /api/site`

Returns site brand, navigation, social links, logo path, disclaimer, and SEO defaults.

### `GET /api/navigation`

Returns the required navigation items: Home, About, Service, Case Study, Blog, Contact.

### `GET /api/doctor`

Returns the individual specialist profile, hero copy, contact details, office hours, profile image, about images, highlights, stats, and emergency note.

### `GET /api/home`

Returns home-page section content:

- services intro
- why-choose section
- video/count copy
- appointment copy
- testimonials

### `GET /api/services`

Returns all dental services.

### `GET /api/services/[slug]`

Returns one dental service by slug.

Current slugs:

- `preventive-dentistry`
- `root-canal-treatment`
- `restorative-dentistry`
- `smile-design-consultation`
- `gum-care-guidance`

### `GET /api/case-studies`

Returns all case studies.

### `GET /api/case-studies/[slug]`

Returns one case study by slug.

Current slugs:

- `conservative-smile-planning`
- `tooth-preserving-endodontic-care`
- `functional-restoration-plan`

### `GET /api/blog`

Returns all blog posts.

### `GET /api/blog/[slug]`

Returns one blog post by slug.

Current slugs:

- `why-teeth-feel-sensitive`
- `root-canal-treatment-myths`
- `bleeding-gums-should-not-be-ignored`

### `POST /api/contact`

Receives appointment requests.

Request body:

```json
{
  "name": "Patient Name",
  "email": "patient@example.com",
  "phone": "+880...",
  "service": "Preventive Dentistry",
  "preferredDate": "2026-10-10",
  "message": "I would like to discuss tooth sensitivity."
}
```

Validation:

- `name`: required, at least 2 characters
- `email`: required, valid email format
- `message`: required, at least 10 characters

Success response data:

```ts
{
  id: string;
  status: "received";
  message: string;
  receivedAt: string;
}
```

### `POST /api/newsletter`

Receives newsletter signups.

Request body:

```json
{ "email": "patient@example.com" }
```

## Laravel migration contract

A future Laravel backend should either:

1. Return the same response envelope, or
2. Return its own format and update only `lib/api/client.ts` plus feature service mapping.

Recommended Laravel resources:

- `/api/site`
- `/api/doctor`
- `/api/home`
- `/api/services`
- `/api/services/{slug}`
- `/api/case-studies`
- `/api/case-studies/{slug}`
- `/api/blog`
- `/api/blog/{slug}`
- `/api/contact`
- `/api/newsletter`
