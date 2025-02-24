# Frontend for bestilling av samisk samtale på telefon

![Deploy-to-prod](https://github.com/navikt/samisk-samtale-bestilling/workflows/Deploy%20to%20prod/badge.svg) <br>
![Deploy-to-dev](https://github.com/navikt/samisk-samtale-bestilling/workflows/Deploy%20to%20dev/badge.svg) <br>

## Lokal kjøring

Kjører lokalt på [http://localhost:3006](http://localhost:3006)

Dekoratøren kan startes lokalt med `npm run decorator-local`

#### Development mode:

Kjør `npm run dev`

#### Production mode:

Kjør `npm run build && npm run start-local`

## Deploy til dev-miljø

Med workflow_dispatch trigger: <br>
[Deploy to dev](https://github.com/navikt/samisk-samtale-bestilling/actions/workflows/deploy.dev.yml) -> Run workflow -> Velg branch -> Run workflow

## Prodsetting

Lag en PR til main, og merge inn etter godkjenning (En automatisk release vil oppstå ved deploy til main)

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/personbruker

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-personbruker
