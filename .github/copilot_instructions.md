# Copilot Instructions for Samisk Samtale Bestilling

## Project Overview

A web application for ordering telephone consultations with Nav in Sami language. The application provides a form where users can request callbacks from Sami-speaking Nav advisors, choosing between morning or afternoon time slots. The application is bilingual, supporting both Northern Sami (se) and Norwegian Bokmål (nb).

**Owner**: Team Navno (#team-navno on Slack)

## Architecture

### Tech Stack

- **Server**: Hono on Node (`@hono/node-server`)
- **Templating**: `hono/jsx` - JSX-to-string on the server only; no client framework, no hydration, no bundler
- **Styling**: Aksel via version-pinned `ds-css` from NAV CDN (URL in `src/views/Layout.tsx`); views emit static `aksel-*` class markup
- **Client JS**: a single hand-written file, `static/enhance.js`, served as-is (progressive enhancement over a native `<form method="post">`)
- **Language**: TypeScript, built with `tsc`, run with plain `node`
- **Tests**: Vitest + html-validate (every rendered page state is validated against the HTML spec and a11y rules)

### Key Components

1. **src/app.ts**: `createApp(deps)` - all routes and middleware, testable without listening on a port
2. **src/views/**: JSX views (`Layout`, `OrderPage`, `OrderForm`, `Confirmation`, `aksel.tsx` helpers). Markup replicates what `@navikt/ds-react@8.16.1` rendered, verified against production SSR output. `icons.ts` is generated from that output - do not hand-edit SVG paths.
3. **src/submit/validate.ts**: server-side validation (the single source of truth for the rules; `enhance.js` mirrors them client-side)
4. **src/submit/submitOrder.ts** + **src/auth/azureToken.ts**: Azure AD client-credentials token + POST to tilbakemeldingsmottak-api
5. **src/decorator.ts** / **src/csp.ts**: NAV-dekoratøren via `fetchDecoratorHtml` fragments + `buildCspHeader`
6. **src/localization/**: flat string maps for `se`/`nb`; some values are trusted HTML rendered with `raw()`
7. **dev/**: local-development mock of the upstream services (Azure AD token, tilbakemeldingsmottak-api, kontaktinfo-api), started automatically by `pnpm dev`; never compiled or shipped

### Form Flow

- **No-JS baseline**: native form POST → validation errors re-render the page (400) with preserved values → success gives a 303 redirect to `?sendt=1` (Post/Redirect/Get) showing the confirmation.
- **Enhanced**: `enhance.js` posts the same form with `Accept: application/json`, shows a loader, swaps in the confirmation without a page load, and prefills the phone number from the kontaktinfo API.
- `POST api/proxy` is a temporary legacy alias for the old client contract - remove after one production release.

## Rules

- Always validate user input server-side (`src/submit/validate.ts`) - client-side validation is a convenience only.
- User-supplied values must go through JSX interpolation (auto-escaped). Only trusted, server-owned strings (localization, decorator fragments, generated icons) may pass through `raw()`.
- NAIS probe paths (`api/internal/isAlive`, `api/internal/isReady`) and the basepath `/person/bestilling-av-samisk-samtale` are load-bearing; never change them without updating `.nais/config.yaml`.
- Do not casually bump the Aksel CSS version in the CDN URL in `src/views/Layout.tsx`: class names can change between versions and the markup is hand-matched. Upgrades require visual re-verification against the design system. The CDN has no semver, so the URL is the only pin.
- New user-facing strings need Northern Sami translations from a human translator; Norwegian fallbacks must be marked with TODO in `src/localization/se.ts`.
- Run `pnpm test` before pushing - the html-validate suite is the regression net for markup and a11y.
