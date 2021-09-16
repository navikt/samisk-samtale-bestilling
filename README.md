# Frontend for bestilling av samisk samtale på telefon

![Deploy-to-prod](https://github.com/navikt/samisk-samtale-bestilling/workflows/Deploy-to-prod/badge.svg) <br>
![Deploy-to-dev](https://github.com/navikt/samisk-samtale-bestilling/workflows/Deploy-to-dev/badge.svg) <br>

## Lokal kjøring

Kjører lokalt på [http://localhost:3006](http://localhost:3006)

Dekoratøren kan startes lokalt med `docker-compose up`

#### Development mode:

Kjør `npm run dev`

#### Production mode:

Kopier først innhold fra .env.development til .env.local

Kjør så `npm run start-clean`

## Deploy til dev-miljø

[Actions](https://github.com/navikt/nav-office-search/actions) -> Velg workflow -> Run workflow -> Velg branch -> Run workflow

## Prodsetting

- Lag en PR til master, og merge inn etter godkjenning
- Lag en release på master med versjon-bump, beskrivende tittel og oppsummering av endringene dine
- Publiser release'en for å starte deploy til prod

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/personbruker

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-personbruker
