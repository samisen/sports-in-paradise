# Sports in Paradise

A demonstration site for a sports-retreat operator in Bali: coached weeks in
five sports, each on its own subdomain, that guests plan for themselves,
priced live, and sent to the team rather than booked.

| Site | Address | Primary colour |
| --- | --- | --- |
| Hub — choose a sport | `sportsinparadise.com` | Hibiscus `#d4405f` |
| Padel | `padel.sportsinparadise.com` | Court blue `#1668c4` |
| Tennis | `tennis.sportsinparadise.com` | Violet `#6b3fd4` |
| Golf | `golf.sportsinparadise.com` | Fairway green `#1d7a4c` |
| Diving | `diving.sportsinparadise.com` | Lagoon teal `#00808f` |
| Hiking | `hiking.sportsinparadise.com` | Volcanic orange `#c2520f` |

Angular 21 (standalone, zoneless, signals), ng-zorro-antd, two compiled Less
theme bundles for light and dark, and mobile-first CSS driven by design tokens.

## One build, six sites

There is one codebase and one deploy. The site is chosen at runtime from the
hostname (`core/site/site.service.ts`): a first label that is a sport id picks
that sport, anything else is the hub. The same rule runs in an inline script in
`index.html`, so the right palette is painted before Angular starts.

- **Palette** — `[data-sport]` token sets in `styles.css`, light and dark. The
  attribute also works on any element, which is how the hub shows each sport's
  card in its own colours. Ant Design's compiled primary colour is re-pointed at
  `--brand` at the end of `styles.css`.
- **Content** — each sport is one `SportSite` object in `core/sports/<sport>.ts`
  (copy, Bali status with sources, bases, retreats, coaches, FAQs, journal, and
  the planner). Each is its own lazy chunk; the hub loads all five.
- **Routes** — the hub and the sports share paths; `canMatch` guards in
  `app.routes.ts` decide which page answers.
- **Links between sites** are absolute, built by `SiteService.url()`.

Adding a sixth sport is a content file, a palette, an icon and an id in
`core/site/sites.ts` — no new pages.

## Where the interesting parts are

| Path | What it is |
| --- | --- |
| `src/app/core/planner/engine.ts` | The planner, independent of sport: choices, days, price. No Angular. |
| `src/app/core/sports/*.ts` | Each sport's content and its `build()` — the rules for a good day in that sport (tee times and course rotation for golf, a surface day before flying for diving, sunrise starts and recovery after a summit for hiking). |
| `src/app/core/content/island.ts` | Facts about Bali that hold for every sport, with sources. |
| `src/app/core/media.ts` | Every photograph, with its photographer. |
| `src/app/pages/plan/` | The planner UI. Controls on the left, a live schedule on the right. |
| `src/app/pages/hub/` | The hub: sport picker, season table, every base on one map. |

## Images

Photography is from Unsplash (free licence only, no Unsplash+), served from the
Unsplash CDN through a custom `IMAGE_LOADER` and `NgOptimizedImage`: responsive
`srcset`, AVIF/WebP where accepted, `priority` only on the largest paint, lazy
everywhere else, space reserved so nothing shifts. Photographers are credited
on the image.

## Running it

```bash
nvm use            # Node 24, see .nvmrc
npm ci
npm start          # http://localhost:4200
```

Each site in development:

- hub: http://localhost:4200
- a sport: http://golf.localhost:4200 (any `<sport>.localhost` — browsers
  resolve `*.localhost` to your machine, no hosts file needed)
- anywhere subdomains are not available (an IP address, a preview deploy):
  add `?site=golf`; the choice is remembered for the tab, and `?site=hub`
  goes back.

## Notes

- **Not a booking engine.** Prices are indicative and the forms do not send.
- **Brand is a placeholder.** "Sports in Paradise" is a working name; the
  footer says so until `BRAND.isPlaceholder` is set to false.
- **Facts about Bali were checked in October 2026** and carry their sources on
  each sport's Why Bali page. Rules on the island change (mountain closures,
  levies, course openings) — re-check before relying on them.
- **Business details are fictional** — coaches, testimonials, retreat dates and
  prices exist to show the design.
