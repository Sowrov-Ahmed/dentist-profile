# Content and Data Guide

## Content principles

This website is for an individual dental specialist. Keep all content personal and professional:

- Use one verified doctor/specialist profile.
- Do not invent degrees, awards, licenses, certifications, hospital affiliations, or guaranteed outcomes.
- Replace placeholder phone, email, address, and images before public launch.
- Replace educational case-study examples with real, consented, de-identified clinical case content if needed.
- Keep blog content educational, not diagnostic.

## Data files

### `data/site.json`

Controls brand name, tagline, logo, navigation, social links, and default SEO settings.

Required navbar items:

```txt
Home | About | Service | Case Study | Blog | Contact
```

### `data/doctor.json`

Controls the individual dental specialist profile:

- name and title
- hero content
- phone, email, address
- office hours
- profile and about images
- about content
- highlights
- stats
- emergency note

Before production, update this file with verified credentials and local regulatory requirements.

### `data/home.json`

Controls home section content:

- service intro
- why-choose cards
- video/count section
- appointment section
- testimonials

Testimonials are generic patient-feedback placeholders. Replace them only with consented real testimonials if allowed in the deployment jurisdiction.

### `data/services.json`

Controls services. Every service requires:

- `id`
- `slug`
- `title`
- `tabTitle`
- `summary`
- `description`
- `icon`
- `image`
- `features[]`
- `detailSections[]`

The service slug creates the URL `/services/[slug]`.

### `data/case-studies.json`

Controls case studies. Every case requires:

- `id`
- `slug`
- `label`
- `title`
- `summary`
- `image`
- `detailImages[]`
- `challenge`
- `approach`
- `outcome`
- `points[]`

The case slug creates the URL `/case-studies/[slug]`.

### `data/blog-posts.json`

Controls blog posts. Every post requires:

- `id`
- `slug`
- `title`
- `excerpt`
- `category`
- `author`
- `date`
- `readTime`
- `image`
- `content[]`

The blog slug creates the URL `/blog/[slug]`.

## Asset paths

Runtime assets must use paths inside this project:

```txt
/public/assets/...
```

Do not reference the master template path at runtime. If another asset from the master is needed later, copy it into `active-site/public/assets` first and update data/components to use the active-site path.

## SEO fields

Page metadata is generated in `lib/seo/metadata.ts` and route files. Keep descriptions accurate, non-misleading, and specific to the page.

## Medical disclaimer approach

The site includes an emergency note and educational disclaimer language. For a real deployment, confirm required disclaimers, advertising rules, and testimonial/case-study rules with the responsible professional and local regulations.
