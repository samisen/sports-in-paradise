# Sports in Paradise

A demonstration site for a padel retreat operator in Bali: small coached weeks
that guests plan for themselves, priced live, and sent to the team rather than
booked.

Built to the same pattern as the Turta Escape site — Angular 21 (standalone,
zoneless, signals), ng-zorro-antd, two compiled Less theme bundles for light
and dark, and mobile-first CSS driven by design tokens.

## The idea

There is no availability search and nothing is held. A visitor builds the week
they want and sends it over; a coach replies with what can actually be booked.
Every price on the site says so.

## Where the interesting parts are

| Path | What it is |
| --- | --- |
| `src/app/core/retreat-config.ts` | The domain: choices, the day-by-day schedule they produce, and the price. No Angular, so the rules are readable on their own. |
| `src/app/pages/plan/` | The planner. Controls on the left, a live schedule on the right, animated as blocks are added, resized and removed. |
| `src/app/core/brand.ts` | Brand, contact details and the price qualifier. One file to swap the placeholder identity. |
| `src/app/shared/court-art.ts` | Card artwork: a padel court drawn from a seed, so each retreat looks like itself without stock photography. |

## Running it

```bash
nvm use            # Node 24, see .nvmrc
npm ci
npm start          # http://localhost:4200
npm run build
```

## Notes

- **Not a booking engine.** Prices are indicative and the forms do not send.
- **Brand is a placeholder.** "Sports in Paradise" is a working name; the
  footer says so until `BRAND.isPlaceholder` is set to false.
- **No photography yet.** Card and hero artwork is drawn rather than
  photographed, so nothing on the site pretends to be a real venue.
