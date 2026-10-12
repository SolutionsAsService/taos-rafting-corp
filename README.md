# Taos River Adventures — website

Family-run rafting on the Rio Grande near Taos, New Mexico. Live site: https://taos-rafting-corp.vercel.app

A small, dependency-free static site generator: one content file in, plain HTML/CSS/JS out.

## Editing content

**All text lives in [`content/site.json`](content/site.json).** Edit it on GitHub and commit to `main` —
Vercel rebuilds and publishes the site automatically within a minute or two.

- Any value starting with `TODO` is treated as *missing* and is hidden on the site.
  The open items are tracked in [CONTENT-TODO.md](CONTENT-TODO.md).
- Reviews only appear when real ones are added to `reviews`.
- The Policies page and phone/address/social links appear automatically once filled in.

## Local preview

Requires Node 18+ (no `npm install` needed).

```sh
npm run preview   # build into dist/ and serve at http://localhost:8080
npm run check     # build + verify every internal link, image and asset
```

## Structure

| Path | What |
| --- | --- |
| `content/site.json` | All site content (business info, trips, FAQ, safety, policies, reviews, photo credits) |
| `build.mjs` | Generates every page into `dist/` (incl. sitemap.xml, robots.txt, manifest, JSON-LD) |
| `src/assets/` | CSS, JS, self-hosted Poppins fonts, optimised images (`images.json` = sizes) |
| `src/static/` | Favicons and app icons copied to the site root |
| `photos/` | Original photos; `npm run images` (needs `sharp`) makes the web versions |
| `scripts/` | Link checker, preview server, image optimiser |
| `vercel.json` | Vercel build settings: `npm run build` → `dist/`, clean URLs (`/trips.html` → `/trips`) |

## Pages

Home · Trips (filter + comparison table) · one page per trip · Our Story · Safety & What to Bring · FAQ ·
Gallery (lightbox) · Location · Book & Contact (booking-request form that opens a pre-filled email) ·
Policies (auto, when filled in) · Photo credits · 404.

Old URLs from the first version (`/trips.html`, `/about.html`, `/contact.html`, `/index.html`) still work and
redirect to their clean equivalents.

## Deploy

Vercel's Git integration deploys every push to `main` (build settings come from `vercel.json`; `dist/` is not committed).
GitHub Actions (`.github/workflows/ci.yml`) builds the site and checks links on every push and pull request.
