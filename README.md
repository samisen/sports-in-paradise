# Sports in Paradise

The website for Sports in Paradise: small-group, hosted sports and wellness
tours in Bali. Built from the project brief for the website and social media
teams (version 1, November 2026).

> **Train. Play. Discover. Connect.**

| Tour | Days | Group | From, per person* |
| --- | --- | --- | --- |
| Padel in Paradise (flagship) | 10 | 8 to 12 | $2,200 |
| Golf in Paradise | 10 | 6 | $3,250 |
| Martial Arts in Paradise | 10 | up to 8 | $2,500 |
| Wellness in Paradise (signature wellness tour) | 10 | up to 10 | $2,750 |
| Hybrid in Paradise (HYROX-style) | 12 | 6 | $3,050 |

\* List prices in a shared (twin) room, excluding flights; final prices to confirm.

Angular 21 (standalone, zoneless, signals), ng-zorro-antd, two compiled Less
theme bundles for light and dark, and mobile-first CSS driven by design tokens.

## Pages

Phase 1 of the brief's sitemap, plus the parts of phase 2 that need no new
content from the company:

| Path | Page |
| --- | --- |
| `/` | Home: the promise, the five tours, signature elements, the threads, the Recovery Ritual, who it is for, organisers, the journey, seasons |
| `/tours`, `/tours/:id` | Overview and comparison; one page per tour with fact sheet, thread, day-by-day, inclusions, gallery, season, departures, FAQ and an enquiry form |
| `/wellness` | The Wellness in Paradise division: four dimensions, assessments, Recovery Ritual, companion programme |
| `/departures` | Filter by tour and month; waiting list until first-season dates are set |
| `/plan-your-group-trip` | The organiser form (group size, dates, sport, level, budget), benefits, sample itinerary |
| `/how-it-works` | The six-step journey, payments, inclusions, a typical day, companion programme, pre-trip forms |
| `/where-we-stay` | Accommodation types and the areas of Bali on a map |
| `/about`, `/partners`, `/faq`, `/contact`, `/journal` | As named |
| `/legal/:slug` | Terms, cancellation, privacy, cookies, safety and waiver (placeholders until legal counsel signs off) |

## Where things are

| Path | What it is |
| --- | --- |
| `src/app/core/content/tours.ts` | The five tours: facts, thread, day-by-day, FAQs, photos |
| `src/app/core/content/site.ts` | Everything shared: messaging, signature elements, Recovery Ritual, journey, inclusions, add-ons, personas, FAQ, team, partners, areas, departures, legal |
| `src/app/core/brand.ts` | Name, contact details, calls to action, how prices are written |
| `src/app/shared/enquiry-form.ts` | One form in four modes: general, tour, group, waiting list |
| `src/app/core/organiser.service.ts` | Organiser links: `?ref=CODE` is kept for the visit and added to every enquiry |
| `src/app/shared/tbc.ts` | The "To confirm" marker on anything the brief marks `[to confirm]` |

### Adding departures

`DEPARTURES` in `site.ts` is empty until dates are set. Add
`{ tour: 'padel', start: '2027-05-03', placesTotal: 12, placesLeft: 12 }` and
the departures page lists it with places left, filterable by tour and month.

## Still to come from the company

Logo, colours, domain and social handles; founder names, photographs and final
texts; final prices and upgrade tiers; cancellation policy, terms, waiver and
insurance rules; first-season departure dates; payment provider, booking and
CRM tools. Until then:

- **Forms do not reach an inbox.** On submit they show a summary and send it
  on WhatsApp or by email. Online deposit payments need a payment provider.
- **Photography is placeholder**, from Unsplash, credited on each image.
- **Legal pages are placeholders**, marked as such.
- **No analytics or ad pixels.** When added, they must load only after consent
  in the cookie notice (`shared/cookie-banner.ts`).
- **No CMS.** Content lives in the files above; the brief asks for one the team
  can edit without a developer.

## Running it

```bash
nvm use            # Node 24, see .nvmrc
npm ci
npm start          # http://localhost:4200
```

## Deploying

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`, at https://samisen.github.io/sports-in-paradise/. In the
repository settings, Pages → Source must be **GitHub Actions**.
