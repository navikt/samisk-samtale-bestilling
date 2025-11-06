# Frontend for bestilling av samisk samtale på telefon

![Deploy-to-prod](https://github.com/navikt/samisk-samtale-bestilling/workflows/Deploy%20to%20prod/badge.svg) <br>
![Deploy-to-dev](https://github.com/navikt/samisk-samtale-bestilling/workflows/Deploy%20to%20dev/badge.svg) <br>

## Arkitektur

Applikasjonen er en full-stack Node.js-løsning med server-side rendering (SSR) og klient-side hydrering.

### Teknisk stack

- **Frontend**: Preact
- **Backend**: Express.js
- **Språk**: TypeScript
- **Byggverktøy**: Vite

### Struktur

Applikasjonen bruker en monorepo-struktur med npm workspaces:

- `src/` - Frontend-kode (Preact-komponenter, utilities, entry points)
- `server/` - Backend-kode (Express-server, API-ruter, SSR-logikk)
- `common/` - Delt kode mellom frontend og backend (lokalisering)

### Flyt

1. **Server-side rendering (SSR)**: Ved første sidehenting rendres Preact-applikasjonen på serveren
2. **Decorator-injeksjon**: NAV-dekoratøren (header/footer) injiseres i HTML-malen
3. **Klient-side hydrering**: Når siden lastes i nettleseren, tar Preact over for å gjøre siden interaktiv
4. **Form-innsending**: Skjemadata sendes via backend-proxy til tilbakemeldingsmottak-api med Azure AD-autentisering (Se API-endepunkter)

### Endepunkter

Applikasjonen eksponerer følgende endepunkter:

#### API-endepunkter

| Endepunkt               | Metode | Beskrivelse                                                     |
| ----------------------- | ------ | --------------------------------------------------------------- |
| `/api/internal/isAlive` | GET    | Health check-endepunkt for å verifisere at applikasjonen kjører |
| `/api/internal/isReady` | GET    | Readiness probe for Kubernetes - sjekker om appen er klar       |
| `/api/proxy`            | POST   | Proxy for skjemainnsending til tilbakemeldingsmottak-api        |

#### Side-endepunkter

| Endepunkt | Språk             | Beskrivelse                         |
| --------- | ----------------- | ----------------------------------- |
| `/`       | Nordsamisk (se)   | Hovedside for bestilling av samtale |
| `/nb`     | Norsk bokmål (nb) | Norsk versjon av bestillingssiden   |

Alle endepunkter serveres under basepath `/person/bestilling-av-samisk-samtale`.

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
