# Breanzy Context

## Domain Terms

- **Brand Identity**: "Breanzy" and "Brean Julius Carbonilla" refer to the same real person — a Filipino full-stack software developer based in Melbourne, Australia. "Breanzy" is Brean + "zy", originally an in-game handle, now the canonical personal brand. Currently a soon-to-graduate student, available for roles, doing freelance software development for small-to-medium organizations and universities. Self-described jack-of-all-trades. Canonical identity page is `/about`; identity is confirmed to search engines via Person schema `sameAs` links to GitHub (`Breanzy`), LinkedIn (`juliuscarbonilla`), and X (`Breanzyy`). All location and job-title claims across the site must stay consistent with this (Melbourne, full-stack developer).
- **The Site**: The whole Next.js application — not just the blog. "Blog" refers specifically to the `/blog` section; "the Site" (or "Breanzy") is the umbrella covering `/blog`, `/projects` (portfolio), `/resume`, `/about`, `/search`, and newsletter/subscriber management. Prefer "the Site" over "the blog" when describing the project as a whole (e.g. in README.md, top-level docs) to avoid implying blog is the only feature.
- **Editorial Voice**: The blog's topical identity for SEO and content. Breanzy writes down-to-earth, casual takes on the tech industry through the lens of a working developer struggling to keep up with new trends — deliberately anti-corporate-speak, framed as relatable peer-to-peer talk with other devs. This niche is the topic cluster the blog targets for non-brand ("generic") discovery over time.
- **Access Policy**: The rules that decide whether a request belongs to a current user, a current admin, or no valid account.
- **Publishing Workflow**: The sequence for creating or updating public Posts and Projects, including validation, rich text sanitization, slugging, ownership, cache revalidation, and audit events.
- **Newsletter Delivery**: The process that sends post notifications to Subscribers and records delivery outcomes.
- **Media Lifecycle**: The browser-side flow for image selection, preview, upload, rollback, and replacement cleanup in Firebase Storage.
- **Dashboard Collection**: A paginated admin-facing list that supports loading more items and deleting one item from local state after the server accepts the mutation.
- **Editor Workflow**: The browser-side flow for editing rich content and persisting it with related media.
