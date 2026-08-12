# Komme i gang

## Installere pnpm

Dette prosjektet bruker **pnpm** som package manager. Node.js kommer med Corepack som automatisk bruker riktig pnpm-versjon:

```bash
corepack enable
```

Corepack leser `packageManager`-feltet i `package.json` og installerer riktig versjon automatisk.

**Merk:** Når Corepack er aktivert, vil `npm`-kommandoer ikke fungere.

## Hent repoet fra github og start lokalt

```
git clone https://github.com/navikt/samisk-samtale-bestilling.git
```

Installer nødvendige pakker:

```
pnpm install
```

Start applikasjonen lokalt:

```
pnpm run dev
```

Dette kopierer `.env.development` til `.env` og starter to servere i én prosess med
`tsx watch` (restarter ved kodeendringer):

- **appen** på http://localhost:3006/person/bestilling-av-samisk-samtale (dekoratøren hentes fra
  dev-miljøet - ingen docker-compose nødvendig)
- **mock-upstream** på port 3999 ([dev/mock-upstream.ts](dev/mock-upstream.ts)) som svarer for
  Azure AD-token, tilbakemeldingsmottak-api og kontaktinfo-api

Hele flyten virker dermed lokalt: telefonfeltet forhåndsutfylles med mock-nummeret `99887766`,
og innsending lykkes - mottatte bestillinger logges i terminalen. `dev/` bygges og shippes aldri.

Endringer i `static/app.css` og `static/enhance.js` serveres direkte fra disk - bare last siden på
nytt (statiske filer har `no-store` i utviklingsmodus). Vil du se feilstien, stopp mock-serveren
eller send inn med ugyldige felter.

Mocken kan også kjøres alene (f.eks. sammen med `pnpm run start-local`):

```
pnpm run mock
```

## Tester

```
pnpm test
```

Kjører Vitest-suiten, inkludert HTML-validering: hver side-tilstand (begge språk, skjema,
valideringsfeil, innsendingsfeil, kvittering) rendres og valideres mot HTML-spesifikasjonen og
tilgjengelighetsregler med [html-validate](https://html-validate.org/). Reglene er konfigurert
i `.htmlvalidate.json`.

## Bygg

```
pnpm run build
```

Bygger TypeScript til `dist/` med `tsc`. Aksel-CSS bygges ikke - den lastes versjonspinnet
fra NAV-CDN (se `src/views/Layout.tsx`). Kjør produksjonsbygget lokalt med `pnpm run start-local`.

## Deploy

Vi deployer med Github Actions. Denne applikasjonen kan deployes til prod og dev som skal være identiske miljøer med hensyn til testing.

### Deploy til dev-miljø

I Github Actions-fanen -> "Deploy to dev" -> velg Run workflow -> Velg branchen du vil deploye -> Run workflow

Du finner workflow her for mer informasjon: [Deploy-to-dev](https://github.com/navikt/samisk-samtale-bestilling/actions/workflows/deploy.dev.yml)

## #Deploy til prod-miljø

1. Lag en PR til main
2. Be om godkjenning via teamets Slack-kanal
3. Husk å sjekke eventuelle byggfeil og varsler fra SonarCube.
4. Merge inn til main. Da vil applikasjonen bygge og deploye automatisk.
