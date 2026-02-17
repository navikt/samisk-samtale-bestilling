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
