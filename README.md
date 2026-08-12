# Frontend for bestilling av samisk samtale på telefon

![Deploy-to-prod](https://github.com/navikt/samisk-samtale-bestilling/workflows/Deploy%20to%20prod/badge.svg) <br>
![Deploy-to-dev](https://github.com/navikt/samisk-samtale-bestilling/workflows/Deploy%20to%20dev/badge.svg) <br>

## Arkitektur

Applikasjonen er en liten server-rendret Node.js-app: HTML rendres på serveren, og et lite
vanilla JS-skript legger på progressiv forbedring. Ingen klient-rammeverk, ingen bundler,
ingen hydrering.

### Teknisk stack

- **Server**: [Hono](https://hono.dev/) på Node (`@hono/node-server`)
- **Templating**: `hono/jsx` (JSX-til-streng på serveren, ingen klient-runtime)
- **Styling**: [Aksel](https://aksel.nav.no/) via versjonspinnet `ds-css` fra NAV-CDN (ren CSS, statisk `aksel-*`-markup)
- **Klient-JS**: én håndskrevet fil, [static/enhance.js](static/enhance.js) (serveres som den er)
- **Validering av HTML**: [html-validate](https://html-validate.org/) i testene - hver
  side-tilstand valideres mot HTML-spesifikasjonen (innholdsmodell, nesting) pluss
  tilgjengelighetsregler (labels, headinger, ARIA, WCAG)
- **Test**: Vitest
- **Språk**: TypeScript (bygges med `tsc`, kjøres med vanilla `node`)

### Struktur

```
src/
├── server.ts       oppstart, graceful shutdown
├── app.ts          createApp(deps) - ruter og middleware, testbar uten listen()
├── config.ts       typet env-validering ved oppstart
├── decorator.ts    NAV-dekoratøren via fetchDecoratorHtml (fire HTML-fragmenter)
├── csp.ts          CSP-header via buildCspHeader (dekoratør-kompatibel)
├── auth/           Azure AD client credentials-token (m2m)
├── submit/         validering (server-side) + innsending til tilbakemeldingsmottak-api
├── localization/   tekster for se/nb
└── views/          JSX-views med statisk aksel-markup
static/             app.css + enhance.js (committes; Aksel-CSS lastes fra cdn.nav.no)
tests/              vitest + html-validate
dev/                lokal utvikling: mock av upstream-tjenestene (bygges/shippes aldri)
```

### Flyt

1. **GET**: Serveren henter dekoratør-fragmentene (cachet), rendrer hele siden med `hono/jsx`
   og returnerer ferdig HTML. Ingen hydrering.
2. **POST (uten JS)**: Vanlig skjema-POST. Ved valideringsfeil re-rendres siden med
   feilmeldinger og bevarte verdier (400). Ved suksess: 303-redirect til `?sendt=1`
   (Post/Redirect/Get) som viser kvitteringen.
3. **POST (med JS)**: `enhance.js` sender samme skjema med `Accept: application/json`,
   viser lasteindikator og bytter skjemaet mot kvitteringen uten sidelast.
4. **Innsending**: Serveren validerer (alle stier), henter Azure AD-token
   (client credentials, cachet) og poster til tilbakemeldingsmottak-api.

### Endepunkter

| Endepunkt               | Metode | Beskrivelse                                                  |
| ----------------------- | ------ | ------------------------------------------------------------ |
| `/`                     | GET    | Hovedside, nordsamisk (`?sendt=1` viser kvittering)          |
| `/nb`                   | GET    | Norsk bokmål                                                 |
| `/` og `/nb`            | POST   | Skjemainnsending (HTML eller JSON etter `Accept`-header)     |
| `/api/internal/isAlive` | GET    | Liveness-probe (referert i `.nais/config.yaml`)              |
| `/api/internal/isReady` | GET    | Readiness-probe (referert i `.nais/config.yaml`)             |
| `/api/proxy`            | POST   | Legacy-alias for gammel klient-JS - fjernes etter en release |
| `/static/*`             | GET    | Statiske filer (app.css, enhance.js)                         |

Alle endepunkter serveres under basepath `/person/bestilling-av-samisk-samtale`.

### Vedlikeholdsnotater

- **Aksel-CSS er pinnet eksakt i CDN-url-en** i [src/views/Layout.tsx](src/views/Layout.tsx)
  (`cdn.nav.no/aksel/@navikt/ds-css/<versjon>/index.min.css` - CDN-en har ikke semver).
  Markupen i `src/views/` gjenskaper det ds-react rendret (verifisert mot produksjonens
  SSR-output), så en oppgradering kan endre klassenavn/tokens: bytt versjon i url-en og
  re-verifiser visuelt. Dependabot ser ikke denne avhengigheten i det hele tatt.
- **`react` og `html-react-parser`** er kun installert fordi
  `@navikt/nav-dekoratoren-moduler/ssr` require-er dem ved lasting. Appen bruker dem ikke.
- **Nordsamiske tekster**: `kvitteringTekst` og `feilmeldingInnsending` i
  [src/localization/se.ts](src/localization/se.ts) har norsk fallback og trenger
  menneskelig oversettelse (markert med TODO).
- **Faro/RUM ble fjernet** i omskrivingen (krevde bundler eller tredjeparts-CDN).
  Server-observability går fortsatt via Nais autoInstrumentation. Trengs RUM igjen:
  én liten esbuild-kommando kan bygge `static/telemetry.js`.

## Ingress i dev

https://www.ansatt.dev.nav.no/person/bestilling-av-samisk-samtale

## Ingress i prod

https://www.nav.no/person/bestilling-av-samisk-samtale

# Kom i gang

Se [Contribute.md](CONTRIBUTE.md) for informasjon om hvordan du starter applikasjonen lokalt på egen maskin og hvordan du deployer til miljøer.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/navno

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-navno
